-- ==============================================================================
-- MENU-QR MULTI-TENANT SUBSCRIPTION ARCHITECTURE MIGRATION
-- ==============================================================================
-- Phase 1 & 3: Tenant model is `restaurants`.
-- conceptual model: restaurants -> subscriptions -> plans
--
-- Security Path: auth.uid() -> restaurants.owner_id -> restaurant.id -> subscriptions.restaurant_id
-- ==============================================================================

-- 1. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY, -- 'free', 'pro', 'business'
    name TEXT NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_mmk NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    billing_interval TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly', 'forever'
    max_menu_items INTEGER NOT NULL DEFAULT 20, -- -1 or 2147483647 for unlimited
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Default Plans (matching landing page pricing)
INSERT INTO public.plans (id, name, price_usd, price_mmk, billing_interval, max_menu_items, features)
VALUES 
  (
    'free', 
    'Free', 
    0.00, 
    0.00, 
    'forever', 
    20, 
    '["Basic QR Menu", "Table Management", "Up to 20 Menu Items", "Standard Support"]'::jsonb
  ),
  (
    'pro', 
    'Pro', 
    19.00, 
    65000.00, 
    'monthly', 
    100, 
    '["Advanced QR Menu", "Table Management", "Up to 100 Menu Items", "Custom Branding", "Priority Support"]'::jsonb
  ),
  (
    'business', 
    'Business', 
    49.00, 
    165000.00, 
    'monthly', 
    2147483647, 
    '["Unlimited Menu Items", "Multi-location Support", "Advanced Analytics", "Dedicated Support", "Custom Domain Support"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_usd = EXCLUDED.price_usd,
  price_mmk = EXCLUDED.price_mmk,
  billing_interval = EXCLUDED.billing_interval,
  max_menu_items = EXCLUDED.max_menu_items,
  features = EXCLUDED.features;

-- 2. Create Subscriptions Table (Belongs to Restaurant / Tenant)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.plans(id) ON UPDATE CASCADE,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'trialing', 'canceled', 'past_due'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    stripe_customer_id TEXT, -- Reserved for future payment provider integration
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_restaurant_subscription UNIQUE (restaurant_id)
);

-- Index for fast lookup by restaurant_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_restaurant_id ON public.subscriptions(restaurant_id);

-- 3. Row Level Security (RLS)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans Policies: Allow public read access (for landing page pricing & plan selection)
DROP POLICY IF EXISTS "Allow public read access to plans" ON public.plans;
CREATE POLICY "Allow public read access to plans"
  ON public.plans FOR SELECT
  USING (true);

-- Subscriptions Policies:
-- Allow owners to SELECT their restaurant's subscription
DROP POLICY IF EXISTS "Allow owners to view their restaurant subscription" ON public.subscriptions;
CREATE POLICY "Allow owners to view their restaurant subscription"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE public.restaurants.id = public.subscriptions.restaurant_id
        AND public.restaurants.owner_id = auth.uid()
    )
  );

-- Allow owners to INSERT a subscription for their restaurant
DROP POLICY IF EXISTS "Allow owners to insert a subscription for their restaurant" ON public.subscriptions;
CREATE POLICY "Allow owners to insert a subscription for their restaurant"
  ON public.subscriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE public.restaurants.id = public.subscriptions.restaurant_id
        AND public.restaurants.owner_id = auth.uid()
    )
  );

-- Allow owners to UPDATE their restaurant's subscription
DROP POLICY IF EXISTS "Allow owners to update their restaurant subscription" ON public.subscriptions;
CREATE POLICY "Allow owners to update their restaurant subscription"
  ON public.subscriptions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE public.restaurants.id = public.subscriptions.restaurant_id
        AND public.restaurants.owner_id = auth.uid()
    )
  );

-- 4. Automatic Subscription Creation Trigger for New Restaurants
CREATE OR REPLACE FUNCTION public.handle_new_restaurant_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (restaurant_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (restaurant_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_restaurant_created_subscription ON public.restaurants;
CREATE TRIGGER on_restaurant_created_subscription
  AFTER INSERT ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_restaurant_subscription();

-- 5. Backfill Subscriptions for Pre-existing Restaurants
INSERT INTO public.subscriptions (restaurant_id, plan_id, status)
SELECT id, 'free', 'active'
FROM public.restaurants
ON CONFLICT (restaurant_id) DO NOTHING;
