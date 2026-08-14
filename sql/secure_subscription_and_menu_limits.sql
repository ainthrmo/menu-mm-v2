-- ==============================================================================
-- MENU-QR SECURITY & RUNTIME AUDIT FIXES MIGRATION
-- ==============================================================================

-- 1. FIX 5: Subscription Status CHECK Constraint
ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'paused'));

-- 2. FIX 1: Revoke Client Write Access on Subscriptions
-- Remove INSERT/UPDATE/DELETE policies for public.subscriptions
DROP POLICY IF EXISTS "Allow owners to insert a subscription for their restaurant" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow owners to update their restaurant subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow owners to delete their restaurant subscription" ON public.subscriptions;

-- Ensure SELECT policy remains active so owners can view subscription status
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

-- 3. FIX 3: Server/Database-Level Menu Item Limit Enforcement
CREATE OR REPLACE FUNCTION public.enforce_menu_item_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_max_items INTEGER;
  v_current_count INTEGER;
  v_plan_name TEXT;
BEGIN
  -- Lock subscription row FOR UPDATE to prevent race conditions during concurrent inserts
  SELECT COALESCE(p.max_menu_items, 20), COALESCE(p.name, 'Free')
  INTO v_max_items, v_plan_name
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  WHERE s.restaurant_id = NEW.restaurant_id
  FOR UPDATE OF s;

  -- Default to 20 items (Free plan) if no subscription row exists
  IF v_max_items IS NULL THEN
    v_max_items := 20;
    v_plan_name := 'Free';
  END IF;

  -- Count existing menu items for this restaurant
  SELECT COUNT(*) INTO v_current_count
  FROM public.menu_items
  WHERE restaurant_id = NEW.restaurant_id;

  -- Enforce limit constraint
  IF v_current_count >= v_max_items THEN
    RAISE EXCEPTION 'Menu item limit of % reached for % plan. Cannot add more items.', 
      v_max_items, v_plan_name;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_menu_item_limit ON public.menu_items;
CREATE TRIGGER trg_enforce_menu_item_limit
  BEFORE INSERT ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_menu_item_limit();
