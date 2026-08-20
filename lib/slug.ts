/**
 * Multi-tenant safe slug helper for categories and restaurant query routing.
 */

export function slugify(text: string): string {
  if (!text) return "";
  return encodeURIComponent(
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s/]+/g, "-")
      .replace(/[^\w\u1000-\u109F\-]/g, "") // Preserve English alphanumeric, Burmese Unicode block, and hyphens
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "") || text.trim().toLowerCase()
  );
}

export function categoryMatchesSlug(
  cat: { name: string; name_mm?: string; id?: string },
  slug: string
): boolean {
  if (!slug) return false;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  
  if (cat.id && cat.id.toLowerCase() === decoded) return true;
  
  const nameMatch = cat.name.trim().toLowerCase();
  if (nameMatch === decoded) return true;
  if (slugify(cat.name).toLowerCase() === decoded || slugify(cat.name) === slug) return true;
  if (cat.name.toLowerCase().replace(/[\s/]+/g, "-") === decoded) return true;

  if (cat.name_mm) {
    const mmMatch = cat.name_mm.trim().toLowerCase();
    if (mmMatch === decoded) return true;
    if (slugify(cat.name_mm).toLowerCase() === decoded || slugify(cat.name_mm) === slug) return true;
    if (cat.name_mm.toLowerCase().replace(/[\s/]+/g, "-") === decoded) return true;
  }

  return false;
}

export function buildCategoryMenuUrl(
  categoryNameOrId: string,
  restaurantId?: string | null
): string {
  const catSlug = slugify(categoryNameOrId);
  if (restaurantId) {
    return `/category/${catSlug}?restaurantId=${encodeURIComponent(restaurantId)}`;
  }
  return `/category/${catSlug}`;
}

export function buildMainMenuUrl(
  restaurantId?: string | null
): string {
  if (restaurantId) {
    return `/menu?restaurantId=${encodeURIComponent(restaurantId)}`;
  }
  return `/menu`;
}
