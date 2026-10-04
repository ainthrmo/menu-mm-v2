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
  cat: { name: string; name_mm?: string | null; id?: string | null },
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
  restaurantId?: string | null,
  tableToken?: string | null
): string {
  const catSlug = slugify(categoryNameOrId);
  const params = new URLSearchParams();

  if (restaurantId && restaurantId !== "demo") {
    params.set("restaurantId", restaurantId);
  } else if (restaurantId === "demo") {
    params.set("demo", "true");
  }

  if (tableToken && restaurantId !== "demo") {
    params.set("table", tableToken);
  }

  const qs = params.toString();
  return qs ? `/category/${catSlug}?${qs}` : `/category/${catSlug}`;
}

export function buildMainMenuUrl(
  restaurantId?: string | null,
  tableToken?: string | null
): string {
  const params = new URLSearchParams();

  if (restaurantId && restaurantId !== "demo") {
    params.set("restaurantId", restaurantId);
  } else if (restaurantId === "demo") {
    params.set("demo", "true");
  }

  if (tableToken && restaurantId !== "demo") {
    params.set("table", tableToken);
  }

  const qs = params.toString();
  return qs ? `/menu?${qs}` : `/menu`;
}
