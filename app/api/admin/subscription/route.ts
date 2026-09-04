import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/admin-auth";

const ALLOWED_PLANS = ["free", "pro", "business"] as const;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { isAdminOrStaff } = await getCurrentUserRole(supabase);

    if (!isAdminOrStaff) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const restaurant_id = body?.restaurant_id;
    const plan_id = body?.plan_id?.toLowerCase();

    if (!restaurant_id || typeof restaurant_id !== "string") {
      return NextResponse.json(
        { error: "A valid restaurant_id is required." },
        { status: 400 }
      );
    }

    if (!plan_id || !ALLOWED_PLANS.includes(plan_id as any)) {
      return NextResponse.json(
        { error: `Invalid plan_id. Allowed plans: ${ALLOWED_PLANS.join(", ")}` },
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
      .select("id, restaurant_id, plan_id, status, updated_at")
      .single();

    if (error) {
      console.error("[api:admin:subscription] Update error:", error);
      return NextResponse.json({ error: "Failed to update restaurant subscription." }, { status: 500 });
    }

    return NextResponse.json({ success: true, subscription: data });
  } catch (err: unknown) {
    console.error("[api:admin:subscription] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
