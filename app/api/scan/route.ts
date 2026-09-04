import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const restaurantId = typeof body?.restaurantId === "string" ? body.restaurantId.trim() : null;

    if (!restaurantId || restaurantId === "demo") {
      return NextResponse.json({ success: true, skipped: true });
    }

    const supabase = await createClient();

    // Call record_restaurant_scan RPC function or direct increment
    const { error: rpcError } = await supabase.rpc("record_restaurant_scan", {
      p_restaurant_id: restaurantId,
      p_user_agent: req.headers.get("user-agent") || undefined,
    });

    if (rpcError) {
      // Fallback: direct insert to scan_events if RPC isn't initialized yet
      await supabase.from("scan_events").insert({
        restaurant_id: restaurantId,
        user_agent: req.headers.get("user-agent") || undefined,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[api:scan] Error logging scan event:", err);
    return NextResponse.json({ success: false }, { status: 200 }); // Do not break client page load on telemetry failure
  }
}
