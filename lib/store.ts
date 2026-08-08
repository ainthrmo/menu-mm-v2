/** Default store profile ID used by the authenticated dashboard (single-tenant MVP). */
export const STORE_PROFILE_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Returns the public customer menu URL.
 * The live route is `/menu` — store data is resolved inside the customer menu page.
 */
export function getPublicMenuUrl(origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : "");
  if (!base) return "/menu";
  return `${base.replace(/\/$/, "")}/menu`;
}
