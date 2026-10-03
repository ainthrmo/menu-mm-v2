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
  available?: boolean;
};

export type LegacyMenuItem = {
  id: string;
  restaurant_id: string | null;
  category: string;
  name: string;
  price: number;
  description: string | null;
  is_available: boolean | null;
  created_at: string;
  image: string | null;
  is_popular: boolean;
  name_mm: string | null;
  description_mm: string | null;
};

type VenueMenuContext = {
  venueId: string;
  menuId: string;
  currency: string;
};

function toMinorUnits(displayPrice: number, currency: string) {
  if (!Number.isFinite(displayPrice) || displayPrice < 0) {
    throw new Error("Invalid dish price.");
  }
  return currency.toUpperCase() === "MMK"
    ? Math.round(displayPrice)
    : Math.round(displayPrice * 100);
}

function fromMinorUnits(price: number | null, currency: string) {
  if (price === null) return 0;
  return currency.toUpperCase() === "MMK" ? price : price / 100;
}

async function getVenueMenuContext(
  supabase: SupabaseClient,
  restaurantId: string,
): Promise<VenueMenuContext> {
  const { data: venue, error: venueError } = await supabase
    .from("venues")
    .select("id, currency")
    .eq("legacy_restaurant_id", restaurantId)
    .maybeSingle();

  if (venueError) throw venueError;
  if (!venue) {
    throw new Error(
      "This restaurant has not been linked to the new venue structure yet.",
    );
  }

  const { data: menu, error: menuError } = await supabase
    .from("menus")
    .select("id")
    .eq("venue_id", venue.id)
    .eq("is_default", true)
    .maybeSingle();

  if (menuError) throw menuError;
  if (!menu) {
    throw new Error("No default menu exists for this venue.");
  }

  return {
    venueId: venue.id,
    menuId: menu.id,
    currency: venue.currency,
  };
}

async function ensureCategoryTranslation(
  supabase: SupabaseClient,
  categoryId: string,
  nameEn: string,
  nameMm: string,
) {
  const rows = [
    ...(nameMm.trim()
      ? [{ category_id: categoryId, lang_code: "my", name: nameMm.trim() }]
      : []),
    ...(nameEn.trim()
      ? [{ category_id: categoryId, lang_code: "en", name: nameEn.trim() }]
      : []),
  ];

  if (!rows.length) return;

  const { error } = await supabase
    .from("category_translations")
    .upsert(rows, { onConflict: "category_id,lang_code" });

  if (error) throw error;
}

async function upsertDishTranslations(
  supabase: SupabaseClient,
  dishId: string,
  input: DishWriteInput,
) {
  const rows = [
    ...(input.nameMm.trim()
      ? [
          {
            dish_id: dishId,
            lang_code: "my",
            name: input.nameMm.trim(),
            description: input.descriptionMm?.trim() || null,
          },
        ]
      : []),
    ...(input.nameEn.trim()
      ? [
          {
            dish_id: dishId,
            lang_code: "en",
            name: input.nameEn.trim(),
            description: input.descriptionEn?.trim() || null,
          },
        ]
      : []),
  ];

  if (!rows.length) {
    throw new Error("At least one dish name is required.");
  }

  const { error } = await supabase
    .from("dish_translations")
    .upsert(rows, { onConflict: "dish_id,lang_code" });

  if (error) throw error;
}

export async function createDishWithLegacyBridge(
  supabase: SupabaseClient,
  input: DishWriteInput,
): Promise<LegacyMenuItem> {
  const ctx = await getVenueMenuContext(supabase, input.restaurantId);
  const minorPrice = toMinorUnits(input.price, ctx.currency);

  await ensureCategoryTranslation(
    supabase,
    input.categoryId,
    input.nameEn ? input.categoryName : "",
    input.categoryName,
  );

  const { data: legacy, error: legacyError } = await supabase
    .from("menu_items")
    .insert({
      restaurant_id: input.restaurantId,
      category: input.categoryName,
      name: input.nameEn.trim() || input.nameMm.trim(),
      name_mm: input.nameMm.trim() || null,
      price: input.price,
      description: input.descriptionEn?.trim() || input.descriptionMm?.trim() || null,
      description_mm: input.descriptionMm?.trim() || null,
      image: input.imageUrl || null,
      is_available: input.available ?? true,
      is_popular: input.isPopular ?? false,
    })
    .select("*")
    .single();

  if (legacyError || !legacy) {
    throw legacyError || new Error("Failed to create legacy menu item.");
  }

  const { data: dish, error: dishError } = await supabase
    .from("dishes")
    .insert({
      menu_id: ctx.menuId,
      category_id: input.categoryId,
      price: minorPrice,
      visible: true,
      available: input.available ?? true,
      image_url: input.imageUrl || null,
      is_popular: input.isPopular ?? false,
      legacy_menu_item_id: legacy.id,
    })
    .select("id")
    .single();

  if (dishError || !dish) {
    await supabase.from("menu_items").delete().eq("id", legacy.id);
    throw dishError || new Error("Failed to create new-schema dish.");
  }

  try {
    await upsertDishTranslations(supabase, dish.id, input);
  } catch (error) {
    await supabase.from("dishes").delete().eq("id", dish.id);
    await supabase.from("menu_items").delete().eq("id", legacy.id);
    throw error;
  }

  return legacy as LegacyMenuItem;
}

export async function updateDishWithLegacyBridge(
  supabase: SupabaseClient,
  dishId: string,
  input: DishWriteInput,
): Promise<LegacyMenuItem> {
  const ctx = await getVenueMenuContext(supabase, input.restaurantId);
  const minorPrice = toMinorUnits(input.price, ctx.currency);

  const { data: dish, error: dishLookupError } = await supabase
    .from("dishes")
    .select("id, legacy_menu_item_id")
    .eq("id", dishId)
    .eq("legacy_menu_item_id", dishId)
    .maybeSingle();

  // The normal bridge uses the legacy menu item UUID as the UI ID, so resolve
  // the new dish through its legacy_menu_item_id when the caller has that ID.
  let resolvedDishId = dish?.id || null;
  if (!resolvedDishId) {
    const { data: byLegacy, error: byLegacyError } = await supabase
      .from("dishes")
      .select("id, legacy_menu_item_id")
      .eq("legacy_menu_item_id", dishId)
      .maybeSingle();
    if (byLegacyError) throw byLegacyError;
    resolvedDishId = byLegacy?.id || null;
  }
  if (!resolvedDishId) {
    throw dishLookupError || new Error("New-schema dish mapping not found.");
  }

  const { data: previousLegacy, error: previousError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", dishId)
    .eq("restaurant_id", input.restaurantId)
    .single();

  if (previousError || !previousLegacy) {
    throw previousError || new Error("Legacy menu item not found.");
  }

  const legacyPayload = {
    category: input.categoryName,
    name: input.nameEn.trim() || input.nameMm.trim(),
    name_mm: input.nameMm.trim() || null,
    price: input.price,
    description: input.descriptionEn?.trim() || input.descriptionMm?.trim() || null,
    description_mm: input.descriptionMm?.trim() || null,
    image: input.imageUrl || null,
    is_popular: input.isPopular ?? false,
  };

  const { data: updatedLegacy, error: legacyError } = await supabase
    .from("menu_items")
    .update(legacyPayload)
    .eq("id", dishId)
    .eq("restaurant_id", input.restaurantId)
    .select("*")
    .single();

  if (legacyError || !updatedLegacy) {
    throw legacyError || new Error("Failed to update legacy menu item.");
  }

  const { error: newSchemaError } = await supabase
    .from("dishes")
    .update({
      menu_id: ctx.menuId,
      category_id: input.categoryId,
      price: minorPrice,
      image_url: input.imageUrl || null,
      is_popular: input.isPopular ?? false,
      available: input.available ?? true,
    })
    .eq("id", resolvedDishId);

  if (newSchemaError) {
    await supabase
      .from("menu_items")
      .update(previousLegacy)
      .eq("id", dishId);
    throw newSchemaError;
  }

  try {
    await upsertDishTranslations(supabase, resolvedDishId, input);
  } catch (error) {
    await supabase.from("dishes").update({
      category_id: null,
      price: previousLegacy.price,
      image_url: previousLegacy.image,
      is_popular: previousLegacy.is_popular,
      available: previousLegacy.is_available ?? true,
    }).eq("id", resolvedDishId);

    await supabase.from("menu_items").update(previousLegacy).eq("id", dishId);
    throw error;
  }

  return updatedLegacy as LegacyMenuItem;
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

  const { error: newError } = await supabase.rpc(
    "staff_toggle_dish_availability",
    { p_dish_id: dish.id, p_available: available },
  );

  if (newError) throw newError;

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
  const { data: legacy, error: legacyLookupError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", legacyMenuItemId)
    .eq("restaurant_id", restaurantId)
    .single();

  if (legacyLookupError || !legacy) {
    throw legacyLookupError || new Error("Legacy menu item not found.");
  }

  const { data: dish, error: dishLookupError } = await supabase
    .from("dishes")
    .select("id")
    .eq("legacy_menu_item_id", legacyMenuItemId)
    .maybeSingle();

  if (dishLookupError) throw dishLookupError;

  const { error: legacyDeleteError } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", legacyMenuItemId)
    .eq("restaurant_id", restaurantId);

  if (legacyDeleteError) throw legacyDeleteError;

  if (dish) {
    const { error: translationError } = await supabase
      .from("dish_translations")
      .delete()
      .eq("dish_id", dish.id);

    if (translationError) {
      await supabase.from("menu_items").insert(legacy);
      throw translationError;
    }

    const { error: dishDeleteError } = await supabase
      .from("dishes")
      .delete()
      .eq("id", dish.id);

    if (dishDeleteError) {
      await supabase.from("menu_items").insert(legacy);
      throw dishDeleteError;
    }
  }
}

export async function syncCategoryTranslation(
  supabase: SupabaseClient,
  categoryId: string,
  englishName: string,
  burmeseName: string,
) {
  await ensureCategoryTranslation(
    supabase,
    categoryId,
    englishName.trim(),
    burmeseName.trim(),
  );
}

export { fromMinorUnits };
