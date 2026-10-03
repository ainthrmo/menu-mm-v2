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
