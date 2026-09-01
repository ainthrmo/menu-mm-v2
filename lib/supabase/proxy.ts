import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "@/lib/utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const pathname = request.nextUrl.pathname;

  // Never process or redirect /supabase-proxy requests in middleware
  if (pathname.startsWith("/supabase-proxy")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nkaunvzoebkuzktrmaft.supabase.co",
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Verify user server-side with Supabase Auth
  const { data: { user } } = await supabase.auth.getUser();

  // Define public routes that do NOT require authentication
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/menu") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/leads") ||
    pathname.startsWith("/api/scan") ||
    pathname.startsWith("/supabase-proxy") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith(".html") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".xml");

  // If the user is NOT logged in and trying to access a protected route,
  // redirect to login. This does NOT apply to /auth/* routes — unauthenticated
  // visitors must be allowed to reach /auth/login and /auth/sign-up freely.
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If the user IS already logged in and navigates to login or sign-up,
  // skip the form and send them straight to the dashboard.
  if (user && (pathname === "/auth/login" || pathname === "/auth/sign-up")) {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    url.pathname = restaurant ? "/protected" : "/protected/onboarding";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}