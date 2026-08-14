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
  features: ["Basic QR Menu", "Table Management", "Up to 20 Menu Items", "Standard Support"],
};

export const DEFAULT_PRO_PLAN: Plan = {
  id: "pro",
  name: "Pro",
  price_usd: 19,
  price_mmk: 65000,
  billing_interval: "monthly",
  max_menu_items: 100,
  features: ["Advanced QR Menu", "Table Management", "Up to 100 Menu Items", "Custom Branding", "Priority Support"],
};

export const DEFAULT_BUSINESS_PLAN: Plan = {
  id: "business",
  name: "Business",
  price_usd: 49,
  price_mmk: 165000,
  billing_interval: "monthly",
  max_menu_items: 2147483647,
  features: ["Unlimited Menu Items", "Multi-location Support", "Advanced Analytics", "Dedicated Support", "Custom Domain Support"],
};

/**
 * Fetches the subscription & plan details for a specific restaurant ID.
 * Multi-tenant safe: strictly queried by restaurant_id.
 */
export async function getRestaurantSubscription(
  supabase: SupabaseClient,
  restaurantId: string
): Promise<{ subscription: Subscription | null; plan: Plan }> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, plans(*)")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error || !data) {
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
    }

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

    return {
      subscription: data as Subscription,
      plan,
    };
  } catch (err) {
    console.warn("Failed to fetch restaurant subscription, using default free plan:", err);
    return {
      subscription: null,
      plan: DEFAULT_FREE_PLAN,
    };
  }
}
