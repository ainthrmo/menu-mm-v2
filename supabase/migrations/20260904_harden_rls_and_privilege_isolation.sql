-- ==============================================================================
-- MOSSQR SECURITY HARDENING MIGRATION: RLS, DATA ISOLATION & PRIVILEGE ENFORCEMENT
-- ==============================================================================

-- 1. FIX PRIVILEGE ESCALATION ON USER CREATION
-- Never allow client-supplied user metadata to determine user roles.
-- All new user signups are strictly given 'owner' role.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'owner'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- 2. HARDEN PROFILES RLS
-- Prevent users from modifying their own role column to escalate to admin.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin_or_staff());

-- 3. ENSURE STRICT MULTI-TENANT RLS POLICIES

-- RESTAURANTS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view restaurants" ON public.restaurants;
CREATE POLICY "Public can view restaurants"
  ON public.restaurants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert own restaurant" ON public.restaurants;
CREATE POLICY "Owners can insert own restaurant"
  ON public.restaurants FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Owners can update own restaurant" ON public.restaurants;
CREATE POLICY "Owners can update own restaurant"
  ON public.restaurants FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_admin_or_staff())
  WITH CHECK (owner_id = auth.uid() OR public.is_admin_or_staff());

DROP POLICY IF EXISTS "Owners can delete own restaurant" ON public.restaurants;
CREATE POLICY "Owners can delete own restaurant"
  ON public.restaurants FOR DELETE
  USING (owner_id = auth.uid() OR public.is_admin_or_staff());

-- CATEGORIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert categories for own restaurant" ON public.categories;
CREATE POLICY "Owners can insert categories for own restaurant"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = categories.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Owners can update categories for own restaurant" ON public.categories;
CREATE POLICY "Owners can update categories for own restaurant"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = categories.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = categories.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Owners can delete categories for own restaurant" ON public.categories;
CREATE POLICY "Owners can delete categories for own restaurant"
  ON public.categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = categories.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

-- MENU ITEMS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
CREATE POLICY "Public can view menu items"
  ON public.menu_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert menu items for own restaurant" ON public.menu_items;
CREATE POLICY "Owners can insert menu items for own restaurant"
  ON public.menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_items.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Owners can update menu items for own restaurant" ON public.menu_items;
CREATE POLICY "Owners can update menu items for own restaurant"
  ON public.menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_items.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_items.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Owners can delete menu items for own restaurant" ON public.menu_items;
CREATE POLICY "Owners can delete menu items for own restaurant"
  ON public.menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_items.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

-- STORE PROFILE
ALTER TABLE public.store_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view store profile" ON public.store_profile;
CREATE POLICY "Public can view store profile"
  ON public.store_profile FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert store profile for own restaurant" ON public.store_profile;
CREATE POLICY "Owners can insert store profile for own restaurant"
  ON public.store_profile FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = store_profile.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

DROP POLICY IF EXISTS "Owners can update store profile for own restaurant" ON public.store_profile;
CREATE POLICY "Owners can update store profile for own restaurant"
  ON public.store_profile FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = store_profile.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = store_profile.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

-- SUBSCRIPTIONS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow owners to view their restaurant subscription" ON public.subscriptions;
CREATE POLICY "Allow owners to view their restaurant subscription"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = subscriptions.restaurant_id
        AND r.owner_id = auth.uid()
    ) OR public.is_admin_or_staff()
  );

-- Revoke direct client write operations on subscriptions; only server-side admin or DB triggers can modify
DROP POLICY IF EXISTS "Allow owners to insert a subscription for their restaurant" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow owners to update their restaurant subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow owners to delete their restaurant subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Admin full access to subscriptions" ON public.subscriptions;
CREATE POLICY "Admin full access to subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

-- 4. UPDATE PLANS SEED (Match 50,000 MMK Pro pricing)
UPDATE public.plans
SET price_mmk = 50000.00, billing_interval = 'yearly'
WHERE id = 'pro';
