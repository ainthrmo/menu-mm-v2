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

export const dynamic = "force-dynamic";
export const instant = false;

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || "owner";

  if (role !== "admin" && role !== "staff") {
    redirect("/protected");
  }

  const [
    restaurantsResult,
    subscriptionsResult,
    menuItemsResult,
    categoriesResult,
    leadsResult,
  ] = await Promise.all([
    supabase.from("restaurants").select("*").order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("*"),
    supabase.from("menu_items").select("id, restaurant_id"),
    supabase.from("categories").select("id, restaurant_id"),
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
  ]);

  const rawRestaurants = restaurantsResult.data || [];
  const subscriptions = subscriptionsResult.data || [];
  const menuItems = menuItemsResult.data || [];
  const categories = categoriesResult.data || [];
  const leadsData = leadsResult.data || [];

  const pendingRestaurants: PendingRestaurant[] = rawRestaurants
    .filter((r: any) => r.status === "pending")
    .map((r: any) => ({
      id: r.id,
      name: r.name || "Untitled Restaurant",
      created_at: r.created_at || new Date().toISOString(),
    }));

  const adminRestaurants: AdminRestaurant[] = rawRestaurants
    .filter((r: any) => r.status !== "pending")
    .map((r: any) => {
      const sub = subscriptions.find((s: any) => s.restaurant_id === r.id);
      const planId = sub?.plan_id || "free";
      const dishesForRest = menuItems.filter((m: any) => m.restaurant_id === r.id);
      const catsForRest = categories.filter((c: any) => c.restaurant_id === r.id);

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
        status: r.status as "active" | "disabled",
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
    status: l.status,
    submitted_at: l.submitted_at,
    created_at: l.created_at,
  }));

  const initialStats: AdminStats = {
    totalRestaurants: rawRestaurants.length,
    activeRestaurants: rawRestaurants.filter((r: any) => r.status === "active").length,
    pendingRestaurants: rawRestaurants.filter((r: any) => r.status === "pending").length,
    disabledRestaurants: rawRestaurants.filter((r: any) => r.status === "disabled").length,
    totalScans: rawRestaurants.reduce(
      (sum: number, r: any) => sum + Number(r.scan_count || 0),
      0,
    ),
  };

  return (
    <div className="space-y-6">
      <PendingApprovalsPanel initialRestaurants={pendingRestaurants} />
      <SuperAdminDashboard
        initialRestaurants={adminRestaurants}
        initialLeads={adminLeads}
        initialStats={initialStats}
        currentRole={role}
      />
    </div>
  );
}
