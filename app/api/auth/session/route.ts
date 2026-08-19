import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null, authenticated: false });
    }

    return NextResponse.json({ user, authenticated: true });
  } catch (err) {
    return NextResponse.json(
      { user: null, authenticated: false, error: err instanceof Error ? err.message : "Error fetching session" },
      { status: 500 }
    );
  }
}
