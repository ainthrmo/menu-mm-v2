import { SupabaseClient } from "@supabase/supabase-js";

export interface Plan {
  id: string;
  name: string;
  price_usd: number;
  price_mmk: number;
  billing_interval: string;
  max_menu_items: number;
  features: string[];
}

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plans?: Plan | null;
}

export const DEFAULT_FREE_PLAN: Plan = {
  id: "free",
  name: "Free",
  price_usd: 0,
  price_mmk: 0,
  billing_interval: "forever",
  max_menu_items: 20,
  features: ["Up to 20 Menu Items", "QR Code Generation", "Category Management", "Basic Customization", "Mobile Menu"],
};

export const DEFAULT_PRO_PLAN: Plan = {
  id: "pro",
  name: "Pro",
  price_usd: 0,
  price_mmk: 5000,
  billing_interval: "monthly",
  max_menu_items: 2147483647, // unlimited — matches dashboard's >= 2000000000 "Unlimited" display check
  features: ["Unlimited Menu Items", "Food Photos", "Full Customization", "Custom Theme Color", "Bilingual Menu", "Social Links", "Cart", "Mark Popular Items"],
};

export const DEFAULT_BUSINESS_PLAN: Plan = {
  id: "business",
  name: "Business",
  price_usd: 0,
  price_mmk: 0,
  billing_interval: "monthly",
  max_menu_items: 2147483647,
  features: ["Coming Soon"],
};

/**
 * Fetches the subscription & plan details for a specific restaurant ID.
 * Multi-tenant safe: strictly queried by restaurant_id.
 *
 * Two-path resolution:
 *  1. Authenticated path — direct table query returns full subscription row
 *     (billing dates, Stripe IDs, etc.). Used by admin dashboard.
 *  2. Anonymous path — RLS blocks the table query for unauthenticated
 *     customer QR-scan views. Falls back to the `get_restaurant_plan_id`
 *     SECURITY DEFINER RPC which returns only the plan_id TEXT value,
 *     exposing nothing else from the subscriptions row.
 */
export async function getRestaurantSubscription(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<{ subscription: Subscription | null; plan: Plan }> {
  try {
    // ── Path 1: authenticated (admin dashboard, logged-in owner) ──────────
    // Returns the full subscription row including billing fields.
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, plans(*)")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (!error && data) {
      const rawPlan = data.plans;
      const plan: Plan = rawPlan
        ? {
            id: rawPlan.id,
            name: rawPlan.name,
            price_usd: Number(rawPlan.price_usd || 0),
            price_mmk: Number(rawPlan.price_mmk || 0),
            billing_interval: rawPlan.billing_interval || "monthly",
            max_menu_items: Number(rawPlan.max_menu_items ?? 20),
            features: Array.isArray(rawPlan.features) ? rawPlan.features : [],
          }
        : data.plan_id === "pro"
        ? DEFAULT_PRO_PLAN
        : data.plan_id === "business"
        ? DEFAULT_BUSINESS_PLAN
        : DEFAULT_FREE_PLAN;

      return { subscription: data as Subscription, plan };
    }

    // ── Path 2: anonymous (customer QR scan) ──────────────────────────────
    // RLS on subscriptions blocks unauthenticated reads. Call the
    // SECURITY DEFINER RPC which returns only plan_id — no subscription
    // row data is exposed. Existing RLS policies are not changed.
    const { data: planId, error: rpcError } = await supabase
      .rpc("get_restaurant_plan_id", { p_restaurant_id: restaurantId });

    if (!rpcError && planId) {
      const plan: Plan =
        planId === "pro"
          ? DEFAULT_PRO_PLAN
          : planId === "business"
          ? DEFAULT_BUSINESS_PLAN
          : DEFAULT_FREE_PLAN;

      return {
        subscription: {
          id: `rpc-${restaurantId}`,
          restaurant_id: restaurantId,
          plan_id: planId as string,
          status: "active",
        },
        plan,
      };
    }

    // ── Fallback: no subscription row found → free plan ───────────────────
    return {
      subscription: {
        id: `temp-${restaurantId}`,
        restaurant_id: restaurantId,
        plan_id: "free",
        status: "active",
        plans: DEFAULT_FREE_PLAN,
      },
      plan: DEFAULT_FREE_PLAN,
    };
  } catch (err) {
    console.warn("Failed to fetch restaurant subscription, using default free plan:", err);
    return {
      subscription: null,
      plan: DEFAULT_FREE_PLAN,
    };
  }
}
