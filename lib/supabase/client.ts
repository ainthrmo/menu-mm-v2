import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nkaunvzoebkuzktrmaft.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!envUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.warn("Supabase client created without NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY set.");
  }

  // Pass original envUrl to createBrowserClient so @supabase/ssr derives the EXACT same cookie key
  // as createServerClient (e.g. sb-nkaunvzoebkuzktrmaft-auth-token).
  // Use custom global.fetch to route HTTP requests through the local Next.js rewrite proxy (/supabase-proxy)
  // for Myanmar ISP compatibility.
  return createBrowserClient(envUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) => {
        if (typeof window !== "undefined") {
          let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
          if (url.includes("supabase.co")) {
            url = url.replace(/https:\/\/[^/]+\.supabase\.co/, `${window.location.origin}/supabase-proxy`);
            if (input instanceof Request) {
              return fetch(new Request(url, input), init);
            }
            return fetch(url, init);
          }
        }
        return fetch(input, init);
      },
    },
  });
}