/**
 * Centralized helper to convert image URLs (e.g. Supabase Storage URLs)
 * to our proxied domain route (/supabase-proxy/...) so that users without a VPN
 * can load images directly.
 *
 * Designed for easy future migration to Cloudflare R2 or another object storage solution.
 */
export function getImageUrl(url?: string | null): string {
  if (!url) return "";

  // Data URLs, Blob URLs, or local relative paths do not need transformation
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("/")) {
    return url;
  }

  // Supabase Storage URLs match: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
  // Convert to relative proxy route: /supabase-proxy/storage/v1/object/public/<bucket>/<path>
  if (url.includes(".supabase.co/storage/v1/object/public/")) {
    return url.replace(
      /https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//,
      "/supabase-proxy/storage/v1/object/public/"
    );
  }

  // Fallback for any other Supabase URLs
  if (url.includes(".supabase.co/")) {
    return url.replace(/https:\/\/[^/]+\.supabase\.co\//, "/supabase-proxy/");
  }

  return url;
}
