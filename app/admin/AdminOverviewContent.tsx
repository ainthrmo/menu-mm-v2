import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SuperAdminDashboard, {
  AdminRestaurant,
  AdminLead,
  AdminStats,
} from "@/components/SuperAdminDashboard";
import PendingApprovalsPanel, {
  PendingRestaurant,
} from "@/components/PendingApprovalsPanel";

type RestaurantRow = {
  id: string;
  name: string;
  owner_id: string | null;
  status: "pending" | "active" | "disabled";
  scan_count: number | null;
  created_at: string;
};

type SubscriptionRow = {
  restaurant_id: string;
  plan_id: string | null;
};

type PlanRow = {
  id: string;
  name: string;
};

type StoreProfileRow = {
  restaurant_id: string | null;
  cover_url: string | null;
};

type CountRow = {
  restaurant_id: string | null;
};

export default async function AdminOverviewContent() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Failed to load admin profile: ${profileError.message}`);
  }

  const role = profile?.role || "owner";

  if (role !== "admin" && role !== "staff") {
    redirect("/protected");
  }

  const [
    restaurantsResult,
    leadsResult,
    pendingResult,
    subscriptionsResult,
    plansResult,
    storeProfilesResult,
    menuItemsResult,
    categoriesResult,
  ] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, owner_id, status, scan_count, created_at")
      .order("created_at", { ascending: false }),

    supabase
      .from("leads")
      .select(
        "id, restaurant_name, contact_name, phone, city, notes, status, onboarded_restaurant_id, submitted_at"
      )
      .order("submitted_at", { ascending: false }),

    supabase
      .from("restaurants")
      .select("id, name, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),

    supabase
      .from("subscriptions")
      .select("restaurant_id, plan_id"),

    supabase
      .from("plans")
      .select("id, name"),

    supabase
      .from("store_profile")
      .select("restaurant_id, cover_url"),

    supabase
      .from("menu_items")
      .select("restaurant_id"),

    supabase
      .from("categories")
      .select("restaurant_id"),
  ]);

  const errors = [
    ["restaurants", restaurantsResult.error],
    ["leads", leadsResult.error],
    ["pending restaurants", pendingResult.error],
    ["subscriptions", subscriptionsResult.error],
    ["plans", plansResult.error],
    ["store profiles", storeProfilesResult.error],
    ["menu items", menuItemsResult.error],
    ["categories", categoriesResult.error],
  ].filter(([, error]) => error);

  if (errors.length > 0) {
    const message = errors
      .map(
        ([source, error]) =>
          `${source}: ${(error as { message: string }).message}`
      )
      .join(" | ");

    console.error("Admin dashboard data loading failed:", message);
    throw new Error(`Failed to load admin dashboard: ${message}`);
  }

  const restaurantRows =
    (restaurantsResult.data || []) as RestaurantRow[];

  const leads =
    (leadsResult.data || []) as AdminLead[];

  const pendingRestaurants =
    (pendingResult.data || []) as PendingRestaurant[];

  const subscriptions =
    (subscriptionsResult.data || []) as SubscriptionRow[];

  const plans =
    (plansResult.data || []) as PlanRow[];

  const storeProfiles =
    (storeProfilesResult.data || []) as StoreProfileRow[];

  const menuItems =
    (menuItemsResult.data || []) as CountRow[];

  const categories =
    (categoriesResult.data || []) as CountRow[];

  const subscriptionByRestaurant = new Map(
    subscriptions.map((subscription) => [
      subscription.restaurant_id,
      subscription,
    ])
  );

  const planById = new Map(
    plans.map((plan) => [plan.id, plan])
  );

  const coverByRestaurant = new Map(
    storeProfiles
      .filter(
        (
          profile
        ): profile is StoreProfileRow & { restaurant_id: string } =>
          Boolean(profile.restaurant_id)
      )
      .map((profile) => [
        profile.restaurant_id,
        profile.cover_url || undefined,
      ])
  );

  const dishCountByRestaurant = new Map<string, number>();

  for (const item of menuItems) {
    if (!item.restaurant_id) continue;

    dishCountByRestaurant.set(
      item.restaurant_id,
      (dishCountByRestaurant.get(item.restaurant_id) || 0) + 1
    );
  }

  const categoryCountByRestaurant = new Map<string, number>();

  for (const category of categories) {
    if (!category.restaurant_id) continue;

    categoryCountByRestaurant.set(
      category.restaurant_id,
      (categoryCountByRestaurant.get(category.restaurant_id) || 0) + 1
    );
  }

  const restaurants: AdminRestaurant[] = restaurantRows.map(
    (restaurant) => {
      const subscription =
        subscriptionByRestaurant.get(restaurant.id);

      const planId =
        subscription?.plan_id || "starter";

      const plan =
        planById.get(planId);

      return {
        id: restaurant.id,
        name: restaurant.name,
        owner_id: restaurant.owner_id || undefined,
        status: restaurant.status,
        scan_count: restaurant.scan_count || 0,
        created_at: restaurant.created_at,
        plan_id: planId,
        plan_name:
          plan?.name ||
          planId.charAt(0).toUpperCase() + planId.slice(1),
        dish_count:
          dishCountByRestaurant.get(restaurant.id) || 0,
        category_count:
          categoryCountByRestaurant.get(restaurant.id) || 0,
        cover_url:
          coverByRestaurant.get(restaurant.id),
      };
    }
  );

  const activeRestaurants = restaurants.filter(
    (restaurant) => restaurant.status === "active"
  );

  const proRestaurants = restaurants.filter(
    (restaurant) => restaurant.plan_id === "pro"
  );

  const pendingLeads = leads.filter(
    (lead) => lead.status === "pending"
  );

  const totalScans = restaurants.reduce(
    (sum, restaurant) =>
      sum + (restaurant.scan_count || 0),
    0
  );

  const stats: AdminStats = {
    totalActiveRestaurants: activeRestaurants.length,
    proTierCount: proRestaurants.length,
    pendingLeadsCount: pendingLeads.length,
    totalScans,
  };

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminDashboard
        initialRestaurants={restaurants}
        initialLeads={leads}
        initialStats={stats}
        currentRole={role}
      />

      <PendingApprovalsPanel
        initialRestaurants={pendingRestaurants}
      />
    </div>
  );
}
