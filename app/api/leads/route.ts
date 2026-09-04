import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const restaurant_name = typeof body.restaurant_name === "string" ? body.restaurant_name.trim().slice(0, 200) : "";
    const contact_name = typeof body.contact_name === "string" ? body.contact_name.trim().slice(0, 100) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : "";
    const city = typeof body.city === "string" ? body.city.trim().slice(0, 100) : null;
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : null;

    if (!restaurant_name || !contact_name || !phone) {
      return NextResponse.json(
        { error: "Restaurant name, contact name, and phone number are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("leads")
      .insert({
        restaurant_name,
        contact_name,
        phone,
        city: city || null,
        notes: notes || null,
        status: "pending",
      });

    if (error) {
      console.error("[api:leads] Database insert error:", error);
      return NextResponse.json({ error: "Failed to submit request. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("[api:leads] Unexpected submission error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
