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

export default async function AdminOverviewContent() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = profile?.role || "owner";

  if (role !== "admin" && role !== "staff") {
    redirect("/protected");
  }

  const [
    restaurantsResult,
    leadsResult,
    pendingResult,
  ] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, owner_id, status, scan_count, created_at, plan_id, plan_name, dish_count, category_count, cover_url")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, restaurant_name, contact_name, phone, city, notes, status, onboarded_restaurant_id, submitted_at")
      .order("submitted_at", { ascending: false }),
    supabase
      .from("restaurants")
      .select("id, name, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
  ]);

  const restaurants = (restaurantsResult.data || []) as unknown as AdminRestaurant[];
  const leads = (leadsResult.data || []) as unknown as AdminLead[];
  const pendingRestaurants = (pendingResult.data || []) as unknown as PendingRestaurant[];

  const activeRestaurants = restaurants.filter((r) => r.status === "active");
  const proRestaurants = restaurants.filter(
    (r) => r.plan_id === "pro" || r.plan_id === "business"
  );
  const pendingLeads = leads.filter((l) => l.status === "pending");
  const totalScans = restaurants.reduce((sum, r) => sum + (r.scan_count || 0), 0);

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
      <PendingApprovalsPanel initialRestaurants={pendingRestaurants} />
    </div>
  );
}
