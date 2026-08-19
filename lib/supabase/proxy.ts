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

  // Use getSession() instead of getUser() in the proxy/middleware context.
  //
  // Reason: getUser() makes a live server-to-server network call to Supabase's
  // auth endpoint to re-validate the JWT. In the proxy context this call does
  // NOT go through the /supabase-proxy browser rewrite (that rewrite only
  // applies to client-side fetch). When this network call stalls, times out,
  // or is affected by connectivity issues, getUser() can return a stale or
  // incorrect result — causing an unauthenticated visitor to be wrongly
  // redirected to /protected.
  //
  // getSession() reads the session directly from the request cookies with zero
  // network round-trips. autoRefreshToken is explicitly set to false above so
  // getSession() will NEVER trigger server-to-server token refresh network requests.
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  // Define public routes that do NOT require authentication
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/menu") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/supabase-proxy");

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