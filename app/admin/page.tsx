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

  // Fetch admin dashboard data
  const [
    restaurantsResult,
    leadsResult,
    pendingResult,
    statsResult,
  ] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, slug, owner_id, created_at, status")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, name, email, phone, restaurant_name, message, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("restaurants")
      .select("id, name, slug, owner_id, created_at, status")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("restaurants")
      .select("id, status, created_at"),
  ]);

  const restaurants = (restaurantsResult.data || []) as AdminRestaurant[];
  const leads = (leadsResult.data || []) as AdminLead[];
  const pendingRestaurants = (pendingResult.data || []) as PendingRestaurant[];
  const allRestaurants = statsResult.data || [];

  const stats: AdminStats = {
    totalRestaurants: allRestaurants.length,
    activeRestaurants: allRestaurants.filter((r) => r.status === "active").length,
    pendingRestaurants: allRestaurants.filter((r) => r.status === "pending").length,
    totalLeads: leads.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminDashboard
        restaurants={restaurants}
        leads={leads}
        stats={stats}
      />
      <PendingApprovalsPanel restaurants={pendingRestaurants} />
    </div>
  );
}
