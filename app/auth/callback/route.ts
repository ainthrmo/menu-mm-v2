import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/protected";
  // Enforce relative path to prevent open redirect vulnerabilities
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/\\")
    ? rawNext
    : "/protected";

  const supabase = await createClient();

  // Exchange PKCE auth code for a session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv || !forwardedHost) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
    }
    console.error("[auth:callback] exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent("Authentication link is invalid or has expired.")}`
    );
  }

  // Fallback for OTP / token_hash verification
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv || !forwardedHost) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
    }
    console.error("[auth:callback] verifyOtp failed:", error.message);
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent("Authentication link is invalid or has expired.")}`
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("Invalid or expired auth link.")}`
  );
}
