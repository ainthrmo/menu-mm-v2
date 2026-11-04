import type { SupabaseClient } from "@supabase/supabase-js";

export type DishWriteInput = {
  restaurantId: string;
  categoryId: string;
  categoryName: string;
  nameEn: string;
  nameMm: string;
  descriptionEn?: string | null;
  descriptionMm?: string | null;
  price: number;
  imageUrl?: string | null;
  isPopular?: boolean;
};

export async function createDishWithLegacyBridge(
  supabase: SupabaseClient,
  input: DishWriteInput,
) {
  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Invalid dish price.");
  }

  const { data, error } = await supabase.rpc("create_dish_legacy_bridge", {
    p_restaurant_id: input.restaurantId,
    p_category_id: input.categoryId || null,
    p_category_name: input.categoryName,
    p_name_en: input.nameEn,
    p_name_mm: input.nameMm,
    p_description_en: input.descriptionEn || null,
    p_description_mm: input.descriptionMm || null,
    p_price: input.price,
    p_image_url: input.imageUrl || null,
    p_is_popular: Boolean(input.isPopular),
  });

  if (error) throw error;

  const { data: item, error: fetchError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", data)
    .single();

  if (fetchError || !item) throw fetchError || new Error("Created dish could not be loaded.");
  return item;
}

export async function updateDishWithLegacyBridge(
  supabase: SupabaseClient,
  legacyMenuItemId: string,
  input: DishWriteInput,
) {
  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Invalid dish price.");
  }

  const { error } = await supabase.rpc("update_dish_legacy_bridge", {
    p_legacy_menu_item_id: legacyMenuItemId,
    p_restaurant_id: input.restaurantId,
    p_category_id: input.categoryId || null,
    p_category_name: input.categoryName,
    p_name_en: input.nameEn,
    p_name_mm: input.nameMm,
    p_description_en: input.descriptionEn || null,
    p_description_mm: input.descriptionMm || null,
    p_price: input.price,
    p_image_url: input.imageUrl || null,
    p_is_popular: Boolean(input.isPopular),
  });

  if (error) throw error;

  const { data, error: fetchError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", legacyMenuItemId)
    .single();

  if (fetchError || !data) throw fetchError || new Error("Updated dish could not be loaded.");
  return data;
}

export async function toggleDishAvailabilityWithLegacyBridge(
  supabase: SupabaseClient,
  legacyMenuItemId: string,
  restaurantId: string,
  available: boolean,
) {
  const { data: dish, error: lookupError } = await supabase
    .from("dishes")
    .select("id")
    .eq("legacy_menu_item_id", legacyMenuItemId)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (!dish) throw new Error("New-schema dish mapping not found.");

  const { error: rpcError } = await supabase.rpc(
    "staff_toggle_dish_availability",
    { p_dish_id: dish.id, p_available: available },
  );
  if (rpcError) throw rpcError;

  const { error: legacyError } = await supabase
    .from("menu_items")
    .update({ is_available: available })
    .eq("id", legacyMenuItemId)
    .eq("restaurant_id", restaurantId);

  if (legacyError) {
    await supabase.rpc("staff_toggle_dish_availability", {
      p_dish_id: dish.id,
      p_available: !available,
    });
    throw legacyError;
  }
}

export async function deleteDishWithLegacyBridge(
  supabase: SupabaseClient,
  legacyMenuItemId: string,
  restaurantId: string,
) {
  const { error } = await supabase.rpc("delete_dish_legacy_bridge", {
    p_legacy_menu_item_id: legacyMenuItemId,
    p_restaurant_id: restaurantId,
  });
  if (error) throw error;
}

export async function syncCategoryTranslation(
  supabase: SupabaseClient,
  categoryId: string,
  englishName: string,
  burmeseName: string,
) {
  const rows = [
    ...(burmeseName.trim()
      ? [{ category_id: categoryId, lang_code: "my", name: burmeseName.trim() }]
      : []),
    ...(englishName.trim()
      ? [{ category_id: categoryId, lang_code: "en", name: englishName.trim() }]
      : []),
  ];

  if (!rows.length) return;

  const { error } = await supabase
    .from("category_translations")
    .upsert(rows, { onConflict: "category_id,lang_code" });

  if (error) throw error;
}

export const MENU_IMAGES_BUCKET = "menu-images";

/**
 * Extracts the storage object path inside the `menu-images` bucket.
 * Returns null if the URL is external, a blob/data URL, empty, or does not belong to `menu-images`.
 */
export function extractMenuImageStoragePath(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;

  const trimmed = imageUrl.trim();
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.length === 0
  ) {
    return null;
  }

  // Handle standard Supabase public storage URLs:
  // e.g. https://<ref>.supabase.co/storage/v1/object/public/menu-images/<path>
  const standardPattern = /\/storage\/v1\/object\/public\/menu-images\/(.+)$/;
  const standardMatch = trimmed.match(standardPattern);
  if (standardMatch && standardMatch[1]) {
    try {
      const decoded = decodeURIComponent(standardMatch[1].split("?")[0]);
      return decoded.replace(/^\/+/, "");
    } catch {
      return standardMatch[1].split("?")[0].replace(/^\/+/, "");
    }
  }

  // Handle proxied storage URLs:
  // e.g. /supabase-proxy/storage/v1/object/public/menu-images/<path>
  // or https://<domain>/supabase-proxy/storage/v1/object/public/menu-images/<path>
  const proxyPattern = /\/supabase-proxy\/storage\/v1\/object\/public\/menu-images\/(.+)$/;
  const proxyMatch = trimmed.match(proxyPattern);
  if (proxyMatch && proxyMatch[1]) {
    try {
      const decoded = decodeURIComponent(proxyMatch[1].split("?")[0]);
      return decoded.replace(/^\/+/, "");
    } catch {
      return proxyMatch[1].split("?")[0].replace(/^\/+/, "");
    }
  }

  return null;
}

/**
 * Checks whether an image is still referenced by any other menu item or dish in the database.
 * Matches by canonical Storage object path rather than just exact URL string, ensuring that
 * direct Supabase URLs, proxied URLs, and URL-encoded variants of the same Storage object
 * are safely recognized.
 *
 * If excludedLegacyId is provided, that item's reference is ignored (used when replacing/deleting that item).
 */
export async function isImageReferencedElsewhere(
  supabase: SupabaseClient,
  imageUrl: string,
  excludedLegacyId?: string | null,
): Promise<boolean> {
  if (!imageUrl) return false;

  const targetPath = extractMenuImageStoragePath(imageUrl);
  // If not a recognized menu-images storage object, fallback to exact string matching
  if (!targetPath) {
    return false;
  }

  // Filename or last path segment for coarse search query
  const fileNamePart = targetPath.split("/").pop() || targetPath;
  const encodedFileNamePart = encodeURIComponent(fileNamePart);

  try {
    // 1. Check legacy menu_items table
    // Coarse filter by filename / URL fragment, excluding current item if provided
    let menuItemQuery = supabase
      .from("menu_items")
      .select("id, image");

    if (excludedLegacyId) {
      menuItemQuery = menuItemQuery.neq("id", excludedLegacyId);
    }

    if (fileNamePart !== encodedFileNamePart) {
      menuItemQuery = menuItemQuery.or(
        `image.ilike.%${fileNamePart}%,image.ilike.%${encodedFileNamePart}%`,
      );
    } else {
      menuItemQuery = menuItemQuery.ilike("image", `%${fileNamePart}%`);
    }

    const { data: menuCandidates, error: menuItemError } = await menuItemQuery;
    if (menuItemError) {
      console.warn("Could not verify menu_items image references:", menuItemError.message);
      // Safer to assume referenced on query error to avoid accidental deletion
      return true;
    }

    if (menuCandidates && menuCandidates.length > 0) {
      // Confirm candidate by canonical storage path
      const hasMatch = menuCandidates.some((item) => {
        const candidatePath = extractMenuImageStoragePath(item.image);
        return candidatePath === targetPath;
      });
      if (hasMatch) return true;
    }

    // 2. Check dishes table in the normalized schema
    let dishesQuery = supabase
      .from("dishes")
      .select("id, image_url, legacy_menu_item_id");

    if (excludedLegacyId) {
      dishesQuery = dishesQuery.neq("legacy_menu_item_id", excludedLegacyId);
    }

    if (fileNamePart !== encodedFileNamePart) {
      dishesQuery = dishesQuery.or(
        `image_url.ilike.%${fileNamePart}%,image_url.ilike.%${encodedFileNamePart}%`,
      );
    } else {
      dishesQuery = dishesQuery.ilike("image_url", `%${fileNamePart}%`);
    }

    const { data: dishCandidates, error: dishesError } = await dishesQuery;
    if (dishesError) {
      console.warn("Could not verify dishes image references:", dishesError.message);
      return true;
    }

    if (dishCandidates && dishCandidates.length > 0) {
      // Confirm candidate by canonical storage path
      const hasMatch = dishCandidates.some((item) => {
        const candidatePath = extractMenuImageStoragePath(item.image_url);
        return candidatePath === targetPath;
      });
      if (hasMatch) return true;
    }

    return false;
  } catch (err: unknown) {
    console.warn("Unexpected error checking image references:", err);
    // Fail-safe: assume referenced to protect the image
    return true;
  }
}

/**
 * Safely removes a storage object from the `menu-images` bucket.
 * - Skips external, blob, or data URLs.
 * - Checks if the image is still referenced by other dishes before deletion.
 * - Deletion failures are caught and logged; they do NOT throw or disrupt caller flow.
 */
export async function safeDeleteMenuImage(
  supabase: SupabaseClient,
  imageUrl?: string | null,
  options?: {
    excludedLegacyId?: string | null;
    skipReferenceCheck?: boolean;
  },
): Promise<boolean> {
  if (!imageUrl) return false;

  const storagePath = extractMenuImageStoragePath(imageUrl);
  if (!storagePath) {
    // External URL or invalid path, safe to skip
    return false;
  }

  try {
    if (!options?.skipReferenceCheck) {
      const isReferenced = await isImageReferencedElsewhere(
        supabase,
        imageUrl,
        options?.excludedLegacyId,
      );
      if (isReferenced) {
        console.info(
          `[safeDeleteMenuImage] Skipped deletion; image is still referenced by other items: ${storagePath}`,
        );
        return false;
      }
    }

    const { error } = await supabase.storage
      .from(MENU_IMAGES_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.warn(
        `[safeDeleteMenuImage] Failed to delete storage object "${storagePath}":`,
        error.message,
      );
      return false;
    }

    console.info(`[safeDeleteMenuImage] Successfully deleted storage object: ${storagePath}`);
    return true;
  } catch (err: unknown) {
    console.warn(
      `[safeDeleteMenuImage] Unexpected error while deleting storage object "${storagePath}":`,
      err instanceof Error ? err.message : err,
    );
    return false;
  }
}
