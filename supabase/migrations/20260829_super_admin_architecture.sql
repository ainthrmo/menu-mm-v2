-- ==============================================================================
-- SUPER-ADMIN DASHBOARD MIGRATION: Roles, Restaurant Status, Leads, Scans, RLS
-- ==============================================================================

-- 1. PROFILES / USER ROLES TABLE
-- Roles: 'owner' | 'admin' | 'staff'
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically sync new auth.users into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role'), 'owner')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Backfill existing auth.users into public.profiles if any
INSERT INTO public.profiles (id, email, role)
SELECT id, email, COALESCE((raw_user_meta_data->>'role'), 'owner')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. HELPER FUNCTION TO CHECK IF AUTH USER IS ADMIN OR STAFF
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. RESTAURANTS: ADD STATUS & SCAN COUNT
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled'));

ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS scan_count BIGINT NOT NULL DEFAULT 0;

-- 4. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'onboarded', 'rejected')),
    onboarded_restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON public.leads(submitted_at DESC);

-- 5. SCAN_EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.scan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_scan_events_restaurant_id ON public.scan_events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_scanned_at ON public.scan_events(scanned_at DESC);

-- RPC for incrementing restaurant scan count & logging scan event atomically
CREATE OR REPLACE FUNCTION public.record_restaurant_scan(
    p_restaurant_id UUID,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_hash TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Update restaurant counter
    UPDATE public.restaurants
    SET scan_count = COALESCE(scan_count, 0) + 1
    WHERE id = p_restaurant_id;

    -- Insert into scan_events table
    INSERT INTO public.scan_events (restaurant_id, scanned_at, user_agent, ip_hash)
    VALUES (p_restaurant_id, NOW(), p_user_agent, p_ip_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_admin_or_staff());

-- Leads RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins/staff can view leads" ON public.leads;
CREATE POLICY "Admins/staff can view leads"
  ON public.leads FOR SELECT
  USING (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Admins/staff can update leads" ON public.leads;
CREATE POLICY "Admins/staff can update leads"
  ON public.leads FOR UPDATE
  USING (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  USING (public.is_admin_or_staff());

-- Scan Events RLS
ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow scan event logging" ON public.scan_events;
CREATE POLICY "Allow scan event logging"
  ON public.scan_events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins/staff can view scan events" ON public.scan_events;
CREATE POLICY "Admins/staff can view scan events"
  ON public.scan_events FOR SELECT
  USING (public.is_admin_or_staff());

-- Restaurants cross-tenant admin RLS updates
DROP POLICY IF EXISTS "Admin full access to restaurants" ON public.restaurants;
CREATE POLICY "Admin full access to restaurants"
  ON public.restaurants FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

-- Subscriptions cross-tenant admin RLS updates
DROP POLICY IF EXISTS "Admin full access to subscriptions" ON public.subscriptions;
CREATE POLICY "Admin full access to subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

-- Menu items cross-tenant admin RLS updates
DROP POLICY IF EXISTS "Admin full access to menu_items" ON public.menu_items;
CREATE POLICY "Admin full access to menu_items"
  ON public.menu_items FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

-- Categories cross-tenant admin RLS updates
DROP POLICY IF EXISTS "Admin full access to categories" ON public.categories;
CREATE POLICY "Admin full access to categories"
  ON public.categories FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

-- Store profile cross-tenant admin RLS updates
DROP POLICY IF EXISTS "Admin full access to store_profile" ON public.store_profile;
CREATE POLICY "Admin full access to store_profile"
  ON public.store_profile FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());
