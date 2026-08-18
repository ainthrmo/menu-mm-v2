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

  // If in browser and pointing to default .supabase.co (blocked by Myanmar ISPs),
  // route through local Next.js rewrite proxy (/supabase-proxy)
  let supabaseUrl = envUrl;
  if (typeof window !== "undefined" && envUrl.includes("supabase.co")) {
    supabaseUrl = `${window.location.origin}/supabase-proxy`;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}