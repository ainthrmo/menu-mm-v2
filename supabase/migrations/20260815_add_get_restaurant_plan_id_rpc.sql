-- =============================================================================
-- RPC: get_restaurant_plan_id
-- =============================================================================
-- Purpose: Allow anonymous (unauthenticated) customer menu views to resolve
--          a restaurant's current plan tier without exposing the full
--          subscriptions row.
--
-- Security model:
--   - SECURITY DEFINER: executes as the function owner (bypasses RLS on
--     the subscriptions table, which is intentionally restricted to
--     authenticated owners only).
--   - Returns ONLY a single TEXT value (plan_id). No billing fields,
--     no Stripe IDs, no period dates are exposed.
--   - SET search_path = public: prevents search_path injection attacks.
--   - STABLE: read-only within a transaction; eligible for query-plan caching.
--   - GRANT to anon + authenticated: covers both QR-scan (anon) and
--     admin (authenticated) callers.
--
-- Existing RLS policies on public.subscriptions are NOT changed.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_restaurant_plan_id(p_restaurant_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT plan_id
  FROM   public.subscriptions
  WHERE  restaurant_id = p_restaurant_id
  LIMIT  1;
$$;

-- Grant execute to both roles so the Supabase JS client can call it
-- whether the visitor is a logged-in owner or an anonymous customer.
GRANT EXECUTE ON FUNCTION public.get_restaurant_plan_id(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_restaurant_plan_id(UUID) TO authenticated;
