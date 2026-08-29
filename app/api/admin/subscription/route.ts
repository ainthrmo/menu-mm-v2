import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { isAdminOrStaff, email } = await getCurrentUserRole(supabase);

    if (!isAdminOrStaff) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required." },
        { status: 403 }
      );
    }

    const { restaurant_id, plan_id } = await req.json();

    if (!restaurant_id || !plan_id) {
      return NextResponse.json(
        { error: "Missing restaurant_id or plan_id" },
        { status: 400 }
      );
    }

    // Upsert subscription directly from authenticated server client
    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          restaurant_id,
          plan_id,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "restaurant_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Admin subscription update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, subscription: data });
  } catch (err: any) {
    console.error("Error in admin subscription route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
