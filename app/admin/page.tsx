import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/admin-auth";
import SuperAdminDashboard, {
  AdminRestaurant,
  AdminLead,
  AdminStats,
} from "@/components/SuperAdminDashboard";
import { DEFAULT_PRO_PLAN, DEFAULT_FREE_PLAN, DEFAULT_BUSINESS_PLAN } from "@/lib/subscription";

export const instant = false;

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const { role } = await getCurrentUserRole(supabase);

  // 1. Fetch Restaurants with Subscriptions, Dish Counts, and Category Counts
  const [
    { data: rawRestaurants, error: restError },
    { data: subscriptions },
    { data: menuItems },
    { data: categories },
    { data: leadsData },
  ] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, owner_id, status, scan_count, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("restaurant_id, plan_id, status"),
    supabase.from("menu_items").select("id, restaurant_id"),
    supabase.from("categories").select("id, restaurant_id"),
    supabase
      .from("leads")
      .select("*")
      .order("submitted_at", { ascending: false }),
  ]);

  // Fallback demo dataset if database has zero restaurants yet
  const restaurantsList = rawRestaurants || [];

  const adminRestaurants: AdminRestaurant[] = restaurantsList.map((r: any) => {
    const sub = subscriptions?.find((s: any) => s.restaurant_id === r.id);
    const planId = sub?.plan_id || "free";
    const dishesForRest = menuItems?.filter((m: any) => m.restaurant_id === r.id) || [];
    const catsForRest = categories?.filter((c: any) => c.restaurant_id === r.id) || [];

    const planName =
      planId === "pro"
        ? "Pro"
        : planId === "business"
        ? "Business"
        : "Free";

    return {
      id: r.id,
      name: r.name || "Untitled Restaurant",
      owner_id: r.owner_id,
      status: (r.status as "active" | "disabled") || "active",
      scan_count: Number(r.scan_count || 0),
      created_at: r.created_at || new Date().toISOString(),
      plan_id: planId,
      plan_name: planName,
      dish_count: dishesForRest.length,
      category_count: catsForRest.length,
    };
  });

  const adminLeads: AdminLead[] = (leadsData || []).map((l: any) => ({
    id: l.id,
    restaurant_name: l.restaurant_name,
    contact_name: l.contact_name,
    phone: l.phone,
    city: l.city,
    notes: l.notes,
    status: l.status || "pending",
    onboarded_restaurant_id: l.onboarded_restaurant_id,
    submitted_at: l.submitted_at || l.created_at || new Date().toISOString(),
  }));

  // Aggregate Real Stats
  const totalActiveRestaurants = adminRestaurants.filter((r) => r.status === "active").length;
  const proTierCount = adminRestaurants.filter(
    (r) => r.plan_id === "pro" || r.plan_id === "business"
  ).length;
  const pendingLeadsCount = adminLeads.filter((l) => l.status === "pending").length;
  const totalScans = adminRestaurants.reduce((sum, r) => sum + r.scan_count, 0);

  const initialStats: AdminStats = {
    totalActiveRestaurants,
    proTierCount,
    pendingLeadsCount,
    totalScans,
  };

  return (
    <SuperAdminDashboard
      initialRestaurants={adminRestaurants}
      initialLeads={adminLeads}
      initialStats={initialStats}
      currentRole={role}
    />
  );
}
