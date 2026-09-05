import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/AdminDashboard";

export const instant = false;

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, status")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!restaurant) {
    redirect("/protected/onboarding");
  }

  if (restaurant.status === "pending") {
    redirect("/protected/pending");
  }

  if (restaurant.status === "disabled") {
    redirect("/protected/disabled");
  }

  return <AdminDashboard />;
}
