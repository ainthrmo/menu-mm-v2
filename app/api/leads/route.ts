import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { restaurant_name, contact_name, phone, city, notes } = await req.json();

    if (!restaurant_name || !contact_name || !phone) {
      return NextResponse.json(
        { error: "Restaurant name, contact name, and phone number are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        restaurant_name,
        contact_name,
        phone,
        city: city || null,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting lead:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data }, { status: 201 });
  } catch (err: any) {
    console.error("Error processing lead submission:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
