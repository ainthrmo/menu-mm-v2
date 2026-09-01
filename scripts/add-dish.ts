import { Command } from "commander";
import * as p from "@clack/prompts";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables (.env.local, .env)
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://nkaunvzoebkuzktrmaft.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface CategoryRecord {
  id: string;
  name: string;
  name_mm?: string | null;
}

interface DishData {
  photo?: string;
  nameMm: string;
  nameEn?: string;
  category: string;
  price: number;
  descMm: string;
  descEn?: string;
  isPopular: boolean;
}

const program = new Command();

program
  .name("dish-add")
  .description("Add a new dish to the restaurant menu")
  .option("--photo <path>", "File path to dish photo")
  .option("--name-mm <name>", "Dish name in Burmese (required)")
  .option("--name-en <name>", "Dish name in English (optional)")
  .option("--category <name>", "Category name (Burmese or English)")
  .option("--price <number>", "Price in MMK (required, positive number)")
  .option("--desc-mm <text>", "Description in Burmese (required)")
  .option("--desc-en <text>", "Description in English (optional)")
  .option("--popular", "Feature as popular dish")
  .option("-y, --yes", "Skip interactive confirmation and save immediately")
  .action(async (flags) => {
    try {
      await runAddDish(flags);
    } catch (err: any) {
      p.cancel(`Error: ${err.message || err}`);
      process.exit(1);
    }
  });

async function runAddDish(flags: any) {
  // 1. Fetch current restaurant context
  const { data: restaurants, error: restError } = await supabase
    .from("restaurants")
    .select("id, name")
    .limit(1);

  if (restError || !restaurants || restaurants.length === 0) {
    p.cancel("Failed to load restaurant profile. Please verify database connection and credentials.");
    process.exit(1);
  }

  const restaurant = restaurants[0];
  const restaurantId = restaurant.id;

  // 2. Fetch subscription tier to check Pro status
  const { data: subData } = await supabase
    .from("subscriptions")
    .select("plan_id, status")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  const isPro = subData?.plan_id === "pro" || subData?.plan_id === "business";

  // 3. Fetch existing categories
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, name_mm")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });

  const categories: CategoryRecord[] = categoriesData || [];

  const isFullyFlagged =
    Boolean(flags.nameMm) &&
    Boolean(flags.descMm) &&
    flags.price !== undefined &&
    Boolean(flags.category);

  if (!isFullyFlagged || !flags.yes) {
    p.intro(`Add dish · ${restaurant.name || "Restaurant Menu"}`);
  }

  const data: Partial<DishData> = {};

  // --- Step 1: Dish photo ---
  if (flags.photo !== undefined) {
    const photoPath = String(flags.photo).trim();
    if (photoPath && !fs.existsSync(photoPath)) {
      p.log.warn(`Photo file not found at ${photoPath}, skipped photo.`);
      data.photo = undefined;
    } else {
      data.photo = photoPath || undefined;
    }
  } else if (!flags.yes) {
    const photoInput = await p.text({
      message: "Dish photo path (leave blank to skip)",
      validate: (val) => {
        if (val && val.trim() && !fs.existsSync(val.trim())) {
          return "File does not exist at specified path";
        }
      },
    });
    if (p.isCancel(photoInput)) return onCancel();
    data.photo = photoInput?.trim() ? photoInput.trim() : undefined;
  }

  // --- Step 2: Dish name (Burmese) ---
  if (flags.nameMm) {
    data.nameMm = String(flags.nameMm).trim();
  } else {
    const nameMm = await p.text({
      message: "Dish name (Burmese)",
      validate: (val) => {
        if (!val || !val.trim()) return "Burmese dish name is required";
      },
    });
    if (p.isCancel(nameMm)) return onCancel();
    data.nameMm = nameMm.trim();
  }

  // --- Step 3: Dish name (English) ---
  if (flags.nameEn !== undefined) {
    data.nameEn = String(flags.nameEn).trim() || undefined;
  } else if (!flags.yes) {
    const nameEn = await p.text({
      message: "Dish name (English) (optional)",
    });
    if (p.isCancel(nameEn)) return onCancel();
    data.nameEn = nameEn?.trim() ? nameEn.trim() : undefined;
  }

  // --- Step 4: Category ---
  if (flags.category) {
    const catInput = String(flags.category).trim();
    const matched = categories.find(
      (c) =>
        c.name.toLowerCase() === catInput.toLowerCase() ||
        (c.name_mm && c.name_mm.toLowerCase() === catInput.toLowerCase())
    );
    if (matched) {
      data.category = matched.name;
    } else {
      // Create new category from flag
      const newCatPayload = {
        name: catInput,
        name_mm: catInput,
        restaurant_id: restaurantId,
        sort_order: categories.length,
      };
      const { data: newCat } = await supabase
        .from("categories")
        .insert([newCatPayload])
        .select()
        .single();
      data.category = newCat ? newCat.name : catInput;
    }
  } else {
    const categoryOptions = categories.map((c) => ({
      value: c.name,
      label: c.name_mm && c.name_mm !== c.name ? `${c.name_mm} (${c.name})` : c.name_mm || c.name,
    }));
    categoryOptions.push({
      value: "__NEW__",
      label: "+ Add new category",
    });

    const selected = await p.select({
      message: "Category",
      options: categoryOptions,
    });
    if (p.isCancel(selected)) return onCancel();

    if (selected === "__NEW__") {
      const catNameMm = await p.text({
        message: "Category name (Burmese)",
        validate: (val) => {
          if (!val || !val.trim()) return "Burmese category name is required";
        },
      });
      if (p.isCancel(catNameMm)) return onCancel();

      const catNameEn = await p.text({
        message: "Category name (English) (optional)",
      });
      if (p.isCancel(catNameEn)) return onCancel();

      const resolvedCatName = catNameEn?.trim() || catNameMm.trim();
      const newCatPayload = {
        name: resolvedCatName,
        name_mm: catNameMm.trim(),
        restaurant_id: restaurantId,
        sort_order: categories.length,
      };

      const { data: newCat, error: createCatErr } = await supabase
        .from("categories")
        .insert([newCatPayload])
        .select()
        .single();

      if (createCatErr) {
        p.log.error(`Failed to create category: ${createCatErr.message}`);
        process.exit(1);
      }

      data.category = newCat.name;
      p.log.step(`Category saved: ${newCat.name_mm || newCat.name}`);
    } else {
      data.category = String(selected);
    }
  }

  // --- Step 5: Price (MMK) ---
  if (flags.price !== undefined) {
    const num = Number(flags.price);
    if (isNaN(num) || num <= 0) {
      p.log.error("Price must be a positive number");
      process.exit(1);
    }
    data.price = num;
  } else {
    const priceInput = await p.text({
      message: "Price (MMK)",
      validate: (val) => {
        const num = Number(val);
        if (isNaN(num) || num <= 0) return "Price must be a positive number";
      },
    });
    if (p.isCancel(priceInput)) return onCancel();
    data.price = Number(priceInput);
  }

  // --- Step 6: Description (Burmese) ---
  if (flags.descMm) {
    data.descMm = String(flags.descMm).trim();
  } else {
    const descMm = await p.text({
      message: "Description (Burmese)",
      validate: (val) => {
        if (!val || !val.trim()) return "Burmese description is required";
      },
    });
    if (p.isCancel(descMm)) return onCancel();
    data.descMm = descMm.trim();
  }

  // --- Step 7: Description (English) ---
  if (flags.descEn !== undefined) {
    data.descEn = String(flags.descEn).trim() || undefined;
  } else if (!flags.yes) {
    const descEn = await p.text({
      message: "Description (English) (optional)",
    });
    if (p.isCancel(descEn)) return onCancel();
    data.descEn = descEn?.trim() ? descEn.trim() : undefined;
  }

  // --- Step 8: Feature as popular dish ---
  if (flags.popular !== undefined) {
    data.isPopular = isPro ? Boolean(flags.popular) : false;
  } else if (!isPro) {
    p.log.info("Feature as popular dish (Pro only)");
    data.isPopular = false;
  } else {
    const popularChoice = await p.confirm({
      message: "Feature as popular dish?",
      initialValue: false,
    });
    if (p.isCancel(popularChoice)) return onCancel();
    data.isPopular = Boolean(popularChoice);
  }

  // --- Step 9: Summary & Confirmation Screen ---
  if (!flags.yes) {
    let done = false;
    while (!done) {
      const summaryText = [
        `Photo:           ${data.photo || "(none)"}`,
        `Name (Burmese):  ${data.nameMm}`,
        `Name (English):  ${data.nameEn || "(none)"}`,
        `Category:        ${data.category}`,
        `Price:           ${Number(data.price).toLocaleString()} MMK`,
        `Desc (Burmese):  ${data.descMm}`,
        `Desc (English):  ${data.descEn || "(none)"}`,
        `Popular:         ${data.isPopular ? "Yes" : "No"}`,
      ].join("\n");

      p.note(summaryText, "Summary");

      const action = await p.select({
        message: "Action",
        options: [
          { value: "confirm", label: "Confirm and save" },
          { value: "edit", label: "Edit a field" },
          { value: "cancel", label: "Cancel" },
        ],
      });

      if (p.isCancel(action) || action === "cancel") return onCancel();

      if (action === "confirm") {
        done = true;
      } else if (action === "edit") {
        await editField(data, categories, restaurantId, isPro);
      }
    }
  }

  // --- Step 10: Saving to Database ---
  const s = p.spinner();
  s.start("Saving dish...");

  let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

  if (data.photo && fs.existsSync(data.photo)) {
    try {
      const fileBuffer = fs.readFileSync(data.photo);
      const ext = path.extname(data.photo).replace(".", "") || "jpg";
      const fileName = `cli-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, fileBuffer, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          upsert: false,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("menu-images")
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      // fallback to default image if upload fails
    }
  }

  const insertPayload = {
    restaurant_id: restaurantId,
    name: data.nameEn || data.nameMm,
    name_mm: data.nameMm,
    category: data.category,
    price: data.price,
    description: data.descEn || data.descMm,
    description_mm: data.descMm,
    image: imageUrl,
    is_popular: data.isPopular || false,
    is_available: true,
  };

  const { data: savedDish, error: insertError } = await supabase
    .from("menu_items")
    .insert([insertPayload])
    .select()
    .single();

  if (insertError) {
    s.stop("Failed to save dish");
    p.log.error(`Database error: ${insertError.message}`);
    process.exit(1);
  }

  s.stop("Dish saved successfully");
  p.outro(`Dish added: ${data.nameMm} · ${data.category} · ${Number(data.price).toLocaleString()} MMK`);
}

async function editField(
  data: Partial<DishData>,
  categories: CategoryRecord[],
  restaurantId: string,
  isPro: boolean
) {
  const field = await p.select({
    message: "Select field to edit",
    options: [
      { value: "photo", label: "Dish photo" },
      { value: "nameMm", label: "Dish name (Burmese)" },
      { value: "nameEn", label: "Dish name (English)" },
      { value: "category", label: "Category" },
      { value: "price", label: "Price (MMK)" },
      { value: "descMm", label: "Description (Burmese)" },
      { value: "descEn", label: "Description (English)" },
      { value: "isPopular", label: "Popular flag" },
    ],
  });

  if (p.isCancel(field)) return;

  switch (field) {
    case "photo": {
      const res = await p.text({
        message: "Dish photo path (leave blank to clear)",
        validate: (val) => {
          if (val && val.trim() && !fs.existsSync(val.trim())) return "File does not exist";
        },
      });
      if (!p.isCancel(res)) data.photo = res?.trim() || undefined;
      break;
    }
    case "nameMm": {
      const res = await p.text({
        message: "Dish name (Burmese)",
        initialValue: data.nameMm,
        validate: (val) => (!val || !val.trim() ? "Burmese dish name is required" : undefined),
      });
      if (!p.isCancel(res)) data.nameMm = res.trim();
      break;
    }
    case "nameEn": {
      const res = await p.text({
        message: "Dish name (English) (optional)",
        initialValue: data.nameEn || "",
      });
      if (!p.isCancel(res)) data.nameEn = res?.trim() || undefined;
      break;
    }
    case "category": {
      const categoryOptions = categories.map((c) => ({
        value: c.name,
        label: c.name_mm && c.name_mm !== c.name ? `${c.name_mm} (${c.name})` : c.name_mm || c.name,
      }));
      categoryOptions.push({ value: "__NEW__", label: "+ Add new category" });

      const selected = await p.select({
        message: "Category",
        options: categoryOptions,
      });
      if (!p.isCancel(selected)) {
        if (selected === "__NEW__") {
          const catMm = await p.text({
            message: "Category name (Burmese)",
            validate: (val) => (!val || !val.trim() ? "Burmese category name is required" : undefined),
          });
          if (p.isCancel(catMm)) break;
          const catEn = await p.text({ message: "Category name (English) (optional)" });
          if (p.isCancel(catEn)) break;

          const createdCatName = catEn?.trim() || catMm.trim();
          const { data: newCat } = await supabase
            .from("categories")
            .insert([{ name: createdCatName, name_mm: catMm.trim(), restaurant_id: restaurantId }])
            .select()
            .single();

          if (newCat) data.category = newCat.name;
        } else {
          data.category = String(selected);
        }
      }
      break;
    }
    case "price": {
      const res = await p.text({
        message: "Price (MMK)",
        initialValue: data.price ? String(data.price) : "",
        validate: (val) => {
          const num = Number(val);
          if (isNaN(num) || num <= 0) return "Price must be a positive number";
        },
      });
      if (!p.isCancel(res)) data.price = Number(res);
      break;
    }
    case "descMm": {
      const res = await p.text({
        message: "Description (Burmese)",
        initialValue: data.descMm,
        validate: (val) => (!val || !val.trim() ? "Burmese description is required" : undefined),
      });
      if (!p.isCancel(res)) data.descMm = res.trim();
      break;
    }
    case "descEn": {
      const res = await p.text({
        message: "Description (English) (optional)",
        initialValue: data.descEn || "",
      });
      if (!p.isCancel(res)) data.descEn = res?.trim() || undefined;
      break;
    }
    case "isPopular": {
      if (!isPro) {
        p.log.info("Feature as popular dish (Pro only)");
      } else {
        const res = await p.confirm({
          message: "Feature as popular dish?",
          initialValue: data.isPopular,
        });
        if (!p.isCancel(res)) data.isPopular = Boolean(res);
      }
      break;
    }
  }
}

function onCancel() {
  p.cancel("Operation cancelled.");
  process.exit(0);
}

program.parse(process.argv);
