"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Loader2,
  UtensilsCrossed,
  ArrowLeft,
  Grid2X2,
  List,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMMK } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-url";
import { getRestaurantSubscription, DEFAULT_FREE_PLAN, Plan } from "@/lib/subscription";
import { categoryMatchesSlug, buildCategoryMenuUrl, buildMainMenuUrl } from "@/lib/slug";
import {
  DEMO_STORE_PROFILE,
  DEMO_CATEGORIES,
  DEMO_MENU_ITEMS,
} from "@/lib/demo-menu-data";

/* ===========================================================
   TYPES & INTERFACES
=========================================================== */

interface Category {
  id: string;
  name: string;
  name_mm?: string;
  sort_order?: number;
}

interface MenuItem {
  id: string;
  name: string;
  name_mm?: string;
  category: string;
  price: number;
  description?: string | null;
  description_mm?: string | null;
  image?: string;
  is_available?: boolean;
  is_popular?: boolean;
  is_spicy?: boolean;
}

interface StoreProfile {
  store_name?: string;
  logo_url?: string;
  cover_url?: string;
  image?: string;
  location?: string;
  address?: string;
  city?: string;
  social_phone?: string;
  wifi_password?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_tiktok?: string;
  social_messenger?: string;
}

interface CartItem {
  id: string;
  name: string;
  name_mm?: string;
  price: number;
  quantity: number;
  image?: string;
}

type ViewLayout = "list" | "grid";
type LanguageMode = "all" | "en" | "mm";

/* ===========================================================
   HELPER: bilingual text parsing
=========================================================== */

function parseBilingualText(
  text?: string | null,
  customMmText?: string | null
): { primary: string; secondary?: string } {
  if (!text && !customMmText) return { primary: "" };
  if (customMmText && text) {
    if (text.trim() === customMmText.trim()) return { primary: text.trim() };
    return { primary: text.trim(), secondary: customMmText.trim() };
  }

  const raw = (text || customMmText || "").trim();
  if (!raw) return { primary: "" };

  if (raw.includes("/")) {
    const parts = raw.split("/").map((p) => p.trim());
    if (parts.length >= 2 && parts[0] && parts[1])
      return { primary: parts[0], secondary: parts[1] };
  }

  const parenMatch = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch && parenMatch[1] && parenMatch[2])
    return { primary: parenMatch[1].trim(), secondary: parenMatch[2].trim() };

  return { primary: raw };
}

/* ===========================================================
   MAIN COMPONENT: CategoryMenuView
=========================================================== */

export default function CategoryMenuView({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  // Local active category state for instant 0ms switching
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string>(categorySlug);

  // Sync if URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setCurrentCategorySlug(categorySlug);
  }, [categorySlug]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [plan, setPlan] = useState<Plan>(DEFAULT_FREE_PLAN);
  const [loading, setLoading] = useState(true);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<{ [id: string]: CartItem }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Layout & language
  const [searchQuery, setSearchQuery] = useState("");
  const [viewLayout, setViewLayout] = useState<ViewLayout>("list");
  const [langMode, setLangMode] = useState<LanguageMode>("all");
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  const isPro =
    plan.id.toLowerCase() === "pro" || plan.id.toLowerCase() === "business";

  /* ----------------------------------------------------------
     DATA FETCHING & MULTI-TENANT RESOLUTION (STRICTLY SCOPED)
     Fetched ONCE per restaurant; category switching is 100% client-side
  ---------------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let targetRestaurantId: string | null = null;

        // Resolve from query param (?restaurantId=... or ?demo=true)
        let isDemoMode = false;
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          targetRestaurantId = urlParams.get("restaurantId");
          isDemoMode = urlParams.get("demo") === "true" || targetRestaurantId === "demo";
        }

        // Fallback only to auth user's restaurant in dashboard preview
        if (!targetRestaurantId && !isDemoMode) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data: userRest } = await supabase
              .from("restaurants")
              .select("id")
              .eq("owner_id", user.id)
              .maybeSingle();
            if (userRest) targetRestaurantId = userRest.id;
          }
        }

        // If explicitly demo mode, or if no restaurant ID is found at all, load Live Demo Menu
        if (isDemoMode || !targetRestaurantId) {
          setCurrentRestaurantId("demo");
          setStoreProfile(DEMO_STORE_PROFILE);
          setCategories(DEMO_CATEGORIES);
          setAllMenuItems(DEMO_MENU_ITEMS);
          if (typeof window !== "undefined") {
            const savedCart = sessionStorage.getItem("menu_cart_demo");
            if (savedCart) {
              try {
                setCart(JSON.parse(savedCart));
              } catch {
                setCart({});
              }
            } else {
              setCart({});
            }
          }
          setLoading(false);
          return;
        }

        setCurrentRestaurantId(targetRestaurantId);

        // Load cart for this specific tenant from sessionStorage
        if (typeof window !== "undefined") {
          const savedCart = sessionStorage.getItem(`menu_cart_${targetRestaurantId}`);
          if (savedCart) {
            try {
              setCart(JSON.parse(savedCart));
            } catch {
              setCart({});
            }
          } else {
            setCart({});
          }
        }

        // STRICTLY QUERY WITH RESTAURANT_ID FILTER
        const [
          { plan: currentPlan },
          { data: profileData },
          { data: catData },
          { data: menuData },
        ] = await Promise.all([
          getRestaurantSubscription(supabase, targetRestaurantId),
          supabase
            .from("store_profile")
            .select("*")
            .eq("restaurant_id", targetRestaurantId)
            .maybeSingle(),
          supabase
            .from("categories")
            .select("*")
            .eq("restaurant_id", targetRestaurantId)
            .order("sort_order", { ascending: true, nullsFirst: false })
            .order("name"),
          supabase
            .from("menu_items")
            .select("*")
            .eq("restaurant_id", targetRestaurantId),
        ]);

        setPlan(currentPlan);

        if (profileData) {
          setStoreProfile(profileData);
        } else {
          const { data: restInfo } = await supabase
            .from("restaurants")
            .select("name")
            .eq("id", targetRestaurantId)
            .maybeSingle();
          if (restInfo) setStoreProfile({ store_name: restInfo.name });
        }

        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(DEMO_CATEGORIES);
        }

        if (menuData && menuData.length > 0) {
          setAllMenuItems(menuData);
        } else {
          setAllMenuItems(DEMO_MENU_ITEMS);
        }

        // Record scan event asynchronously (non-blocking)
        if (targetRestaurantId && targetRestaurantId !== "demo") {
          fetch("/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ restaurantId: targetRestaurantId }),
          }).catch(() => {});
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching category menu data:", err);
        // Resilient fallback to demo menu on error
        setCurrentRestaurantId("demo");
        setStoreProfile(DEMO_STORE_PROFILE);
        setCategories(DEMO_CATEGORIES);
        setAllMenuItems(DEMO_MENU_ITEMS);
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Persist cart per restaurant tenant
  useEffect(() => {
    if (typeof window !== "undefined" && currentRestaurantId) {
      sessionStorage.setItem(`menu_cart_${currentRestaurantId}`, JSON.stringify(cart));
    }
  }, [cart, currentRestaurantId]);

  /* ----------------------------------------------------------
     RESOLVE ACTIVE CATEGORY
  ---------------------------------------------------------- */
  const activeCategory = useMemo(() => {
    if (categories.length === 0) return null;
    return categories.find((c) => categoryMatchesSlug(c, currentCategorySlug)) || null;
  }, [categories, currentCategorySlug]);

  const activeCategoryName = activeCategory?.name || decodeURIComponent(currentCategorySlug);

  // Dishes strictly belonging to this category and restaurant
  const categoryDishes = useMemo(() => {
    if (!activeCategory) {
      return allMenuItems.filter(
        (i) => i.category.trim().toLowerCase() === activeCategoryName.trim().toLowerCase()
      );
    }
    return allMenuItems.filter(
      (i) =>
        i.category.trim().toLowerCase() === activeCategory.name.trim().toLowerCase() ||
        (activeCategory.name_mm &&
          i.category.trim().toLowerCase() === activeCategory.name_mm.trim().toLowerCase())
    );
  }, [allMenuItems, activeCategory, activeCategoryName]);

  // Filtered by in-page search query
  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return categoryDishes;
    const q = searchQuery.toLowerCase();
    return categoryDishes.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.name_mm && i.name_mm.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.description_mm && i.description_mm.toLowerCase().includes(q))
    );
  }, [categoryDishes, searchQuery]);

  // Category cover image
  const categoryCoverImage = useMemo(() => {
    const dishWithImage = categoryDishes.find((d) => Boolean(d.image));
    return dishWithImage?.image || null;
  }, [categoryDishes]);

  // Category label helper
  const getCategoryLabel = useCallback(
    (cat: Category | null, fallbackName: string) => {
      if (!cat) return fallbackName;
      if (langMode === "mm") return cat.name_mm || cat.name;
      if (langMode === "en") return cat.name || cat.name_mm;
      if (cat.name_mm && cat.name && cat.name !== cat.name_mm) {
        return `${cat.name} (${cat.name_mm})`;
      }
      return cat.name_mm || cat.name;
    },
    [langMode]
  );

  /* ----------------------------------------------------------
     CART ACTIONS
  ---------------------------------------------------------- */
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item.id];
      const newQty = (existing?.quantity || 0) + 1;
      return {
        ...prev,
        [item.id]: {
          id: item.id,
          name: item.name,
          name_mm: item.name_mm,
          price: item.price,
          quantity: newQty,
          image: item.image,
        },
      };
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...existing, quantity: newQty },
      };
    });
  };

  const cartItems = Object.values(cart);
  const cartTotalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const mainPageUrl = buildMainMenuUrl(currentRestaurantId);

  if (!loading && !currentRestaurantId) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm rounded-3xl bg-white border border-[#E5E5E5] p-8 shadow-sm space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-[#888888] mx-auto" />
          <h2 className="text-base font-bold text-[#111111]">Menu Not Found</h2>
          <p className="text-xs text-[#666666] leading-relaxed">
            This category link is missing a valid restaurant ID. Please re-scan the restaurant&apos;s QR code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] font-sans antialiased selection:bg-[#CDF22B] selection:text-black">
      {/* ====================================================
          TOP NAVBAR: Back button, Mini restaurant name, Language switcher
      ==================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE8E3] px-4 py-3">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <Link
            href={mainPageUrl}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-bold text-[#111111] hover:bg-[#F5F5F5] transition-all active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Menu</span>
          </Link>

          <div className="text-center min-w-0 flex-1 px-2">
            <h1 className="text-xs font-black text-[#111111] truncate">
              {storeProfile?.store_name || "Restaurant Menu"}
            </h1>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center rounded-full border border-[#E5E5E5] bg-[#F5F4F0] p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLangMode("all")}
              className={`rounded-full px-2 py-1 transition-all ${
                langMode === "all" ? "bg-black text-white shadow-xs" : "text-[#737373] hover:text-[#111111]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setLangMode("mm")}
              className={`rounded-full px-2 py-1 transition-all ${
                langMode === "mm" ? "bg-black text-white shadow-xs" : "text-[#737373] hover:text-[#111111]"
              }`}
            >
              MM
            </button>
            <button
              type="button"
              onClick={() => setLangMode("en")}
              className={`rounded-full px-2 py-1 transition-all ${
                langMode === "en" ? "bg-black text-white shadow-xs" : "text-[#737373] hover:text-[#111111]"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================
          CATEGORY BANNER HERO (Image + Category Name + Dish count)
      ==================================================== */}
      <div className="mx-auto max-w-xl px-4 pt-4 sm:px-5">
        <div className="relative overflow-hidden rounded-3xl border border-[#EAE8E3] bg-neutral-900 shadow-sm aspect-[16/7] sm:aspect-[16/6] flex items-end">
          {categoryCoverImage ? (
            <img
              src={getImageUrl(categoryCoverImage)}
              alt={activeCategoryName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <UtensilsCrossed className="h-10 w-10 text-neutral-500" />
            </div>
          )}

          {/* Scrim for high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          <div className="relative z-10 p-5 w-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CDF22B] mb-1 inline-block">
              Category
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
              {getCategoryLabel(activeCategory, activeCategoryName)}
            </h2>
            <p className="text-xs text-white/80 font-medium mt-0.5">
              {categoryDishes.length} {categoryDishes.length === 1 ? "dish available" : "dishes available"}
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================
          CATEGORY PILLS (Switch between other categories)
      ==================================================== */}
      {categories.length > 0 && (
        <nav
          aria-label="Menu categories"
          className="sticky top-[53px] z-30 bg-[#F8F7F4]/95 backdrop-blur-md pt-3 pb-2 border-b border-[#EAE8E3]"
        >
          <div className="scrollbar-hide mx-auto flex max-w-xl gap-2 overflow-x-auto px-4 sm:px-5">
            {categories.map((cat) => {
              const isSelected = activeCategory?.id === cat.id || cat.name === activeCategoryName;
              const catUrl = buildCategoryMenuUrl(cat.name, currentRestaurantId);

              return (
                <Link
                  key={cat.id}
                  href={catUrl}
                  onClick={(e) => {
                    // Instant 0ms client-side category switch
                    if (currentCategorySlug !== cat.name && !e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      setCurrentCategorySlug(cat.name);
                      setSearchQuery("");
                      if (typeof window !== "undefined") {
                        window.history.pushState({}, "", catUrl);
                      }
                    }
                  }}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all min-h-[34px] flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#CDF22B] text-[#111111] shadow-sm border border-[#CDF22B]"
                      : "bg-white border border-[#E5E5E5] text-[#525252] hover:text-[#111111] hover:border-[#CCCCCC]"
                  }`}
                >
                  <span>{cat.name_mm || cat.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* ====================================================
          SEARCH & VIEW LAYOUT BAR
      ==================================================== */}
      <div className="mx-auto max-w-xl px-4 pt-3 pb-2 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeCategory?.name_mm || activeCategoryName}...`}
              aria-label="Search dishes"
              className="h-11 w-full rounded-2xl border border-[#E5E5E5] bg-white pl-10 pr-9 text-sm font-medium text-[#111111] outline-none placeholder:text-[#888888] shadow-sm transition-all focus:border-[#111111]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#888888] hover:text-[#111111]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setViewLayout((p) => (p === "list" ? "grid" : "list"))}
            title="Switch Layout"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white text-[#525252] hover:text-[#111111] shadow-sm active:scale-95 transition-all"
          >
            {viewLayout === "list" ? <Grid2X2 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ====================================================
          DISH LIST FOR THIS CATEGORY ONLY
      ==================================================== */}
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-2 sm:px-5">
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-[#111111]" />
            <p className="text-xs font-medium text-[#737373]">Loading dishes…</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="rounded-3xl border border-[#EAE8E3] bg-white p-8 text-center space-y-3 mt-4">
            <UtensilsCrossed className="mx-auto h-8 w-8 text-[#A8A29E]" />
            <p className="text-sm font-bold text-[#111111]">
              {searchQuery ? "No matching dishes" : "No dishes in this category yet"}
            </p>
            <p className="text-xs text-[#737373]">
              {searchQuery
                ? "Try clearing your search query."
                : "Dishes will appear here once added by the restaurant."}
            </p>
            <Link
              href={mainPageUrl}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Menu</span>
            </Link>
          </div>
        ) : (
          <div className={viewLayout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2.5"}>
            {filteredDishes.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isPro={isPro}
                layout={viewLayout}
                langMode={langMode}
                cartQuantity={cart[item.id]?.quantity || 0}
                onAddToCart={() => handleAddToCart(item)}
                onUpdateQuantity={(d) => handleUpdateQuantity(item.id, d)}
                onOpenDetail={() => setActiveModalItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ====================================================
          FLOATING BOTTOM CART DRAWER
      ==================================================== */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-xl">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-[#111111] px-5 py-3.5 text-white shadow-2xl transition-all hover:bg-black active:scale-[0.99] border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CDF22B] text-xs font-black text-[#111111]">
                {cartTotalItems}
              </span>
              <span className="text-xs font-bold tracking-wide">View Order</span>
            </div>
            <span className="text-sm font-black text-[#CDF22B]">
              {formatMMK(cartTotalPrice)}
            </span>
          </button>
        </div>
      )}

      {/* ====================================================
          DISH DETAIL MODAL
      ==================================================== */}
      {activeModalItem && (
        <DishDetailModal
          item={activeModalItem}
          langMode={langMode}
          cartQuantity={cart[activeModalItem.id]?.quantity || 0}
          onClose={() => setActiveModalItem(null)}
          onAddToCart={(qty) => {
            for (let i = 0; i < qty; i++) handleAddToCart(activeModalItem);
            setActiveModalItem(null);
          }}
          onUpdateQuantity={(delta) => handleUpdateQuantity(activeModalItem.id, delta)}
        />
      )}

      {/* ====================================================
          CART SHEET / MODAL
      ==================================================== */}
      {isCartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={() => setCart({})}
        />
      )}
    </div>
  );
}

/* ===========================================================
   ITEM CARD COMPONENT
=========================================================== */function MenuItemCard({
  item,
  isPro,
  layout,
  langMode,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetail,
}: {
  item: MenuItem;
  isPro: boolean;
  layout: ViewLayout;
  langMode: LanguageMode;
  cartQuantity: number;
  onAddToCart: () => void;
  onUpdateQuantity: (delta: number) => void;
  onOpenDetail: () => void;
}) {
  const parsedName = parseBilingualText(item.name, item.name_mm);

  const displayName =
    langMode === "mm" && parsedName.secondary
      ? parsedName.secondary
      : parsedName.primary;
  const subName =
    langMode === "all" && parsedName.secondary && parsedName.primary !== parsedName.secondary
      ? parsedName.secondary
      : null;

  const parsedDesc = parseBilingualText(item.description, item.description_mm);
  const displayDesc =
    langMode === "mm" && parsedDesc.secondary
      ? parsedDesc.secondary
      : (parsedDesc.primary || parsedDesc.secondary || null);

  /* --- GRID Layout --- */
  if (layout === "grid") {
    return (
      <article
        onClick={onOpenDetail}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          {item.image ? (
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed className="h-7 w-7 text-slate-400" />
            </div>
          )}
          {item.is_popular && (
            <span className="absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[10px] font-black text-slate-900 bg-[#CDF22B] shadow-xs uppercase tracking-wider">
              POPULAR
            </span>
          )}
        </div>

        <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 burmese-title">
              {displayName}
            </h3>
            {subName && <p className="text-xs text-slate-500 line-clamp-1 font-medium">{subName}</p>}
            {displayDesc && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-600 burmese-body">
                {displayDesc}
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
            <p className="text-sm font-black text-slate-900">
              {formatMMK(item.price)}
            </p>

            {cartQuantity > 0 ? (
              <div
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-2xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(-1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900 border border-slate-200 active:scale-90 transition-transform"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[18px] text-center text-xs font-bold text-slate-900">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white active:scale-90 transition-transform"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-black active:scale-95 min-h-[34px] shadow-2xs transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* --- LIST Layout (Default) --- */
  return (
    <article
      onClick={onOpenDetail}
      className="group relative flex overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.99] cursor-pointer"
    >
      <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden bg-slate-100">
        {item.image ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-slate-400" />
          </div>
        )}
        {item.is_popular && (
          <span className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-black text-slate-900 bg-[#CDF22B] uppercase tracking-wider shadow-xs">
            POPULAR
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 burmese-title">{displayName}</h3>
          {subName && <p className="text-xs text-slate-500 font-medium mt-0.5">{subName}</p>}
          {displayDesc && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-600 burmese-body">
              {displayDesc}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
          <p className="text-sm font-black text-slate-900">
            {formatMMK(item.price)}
          </p>

          {cartQuantity > 0 ? (
            <div
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-2xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onUpdateQuantity(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900 border border-slate-200 active:scale-90 transition-transform"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[18px] text-center text-xs font-bold text-slate-900">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white active:scale-90 transition-transform"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-black active:scale-95 min-h-[34px] shadow-2xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ===========================================================
   DISH DETAIL MODAL
=========================================================== */

function DishDetailModal({
  item,
  langMode,
  cartQuantity,
  onClose,
  onAddToCart,
  onUpdateQuantity,
}: {
  item: MenuItem;
  langMode: LanguageMode;
  cartQuantity: number;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  onUpdateQuantity: (delta: number) => void;
}) {
  const [modalQty, setModalQty] = useState(1);
  const parsedName = parseBilingualText(item.name, item.name_mm);
  const displayName =
    langMode === "mm" && parsedName.secondary
      ? parsedName.secondary
      : parsedName.primary;
  const subName =
    langMode === "all" && parsedName.secondary && parsedName.primary !== parsedName.secondary
      ? parsedName.secondary
      : null;

  const parsedDesc = parseBilingualText(item.description, item.description_mm);
  const displayDesc =
    langMode === "mm" && parsedDesc.secondary
      ? parsedDesc.secondary
      : (parsedDesc.primary || parsedDesc.secondary || null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-[#E5E5E5] bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1] shrink-0">
          {item.image ? (
            <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed className="h-10 w-10 text-[#A8A29E]" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
          {item.is_popular && (
            <span className="absolute bottom-2.5 left-3 rounded px-2 py-0.5 text-[9px] font-black text-[#111111] bg-[#CDF22B] uppercase tracking-wider">
              POPULAR
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#111111] leading-tight">
                {displayName}
              </h2>
              {subName && (
                <p className="text-xs text-[#737373] mt-0.5">{subName}</p>
              )}
            </div>
            <span className="text-base font-black shrink-0 text-[#111111]">
              {formatMMK(item.price)}
            </span>
          </div>

          <div className="inline-block rounded-md bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[11px] font-bold text-[#525252]">
            {item.category}
          </div>

          {displayDesc && (
            <div className="rounded-xl border border-[#F0EEEA] bg-[#FAF9F6] p-3 text-sm text-[#525252] leading-relaxed">
              {displayDesc}
            </div>
          )}
        </div>

        <div className="border-t border-[#EAE8E3] bg-white p-4 shrink-0">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#737373]">In cart:</span>
                <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F5F4F0] px-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(-1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#111111] active:scale-90"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[20px] text-center text-sm font-bold text-[#111111]">
                    {cartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#111111] text-white active:scale-90"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-bold text-white hover:bg-black"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F5F4F0] p-1">
                <button
                  type="button"
                  onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111111] active:scale-90"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[24px] text-center text-sm font-bold text-[#111111]">
                  {modalQty}
                </span>
                <button
                  type="button"
                  onClick={() => setModalQty((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111111] active:scale-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(modalQty)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-xs font-bold text-white hover:bg-black active:scale-[0.98] shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add {modalQty} to Order • {formatMMK(item.price * modalQty)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   CART MODAL / DRAWER
=========================================================== */

function CartModal({
  cart,
  onClose,
  onUpdateQuantity,
  onClearCart,
}: {
  cart: { [id: string]: CartItem };
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}) {
  const items = Object.values(cart);
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#E5E5E5] bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EAE8E3] p-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#111111]" />
            <h2 className="text-base font-bold text-[#111111]">Your Order</h2>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold text-[#525252]">
              {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#737373] hover:bg-[#F5F4F0] hover:text-[#111111]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#737373]">
              Your order is currently empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#EAE8E3] bg-[#FAF9F6] p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#111111] truncate">{item.name_mm || item.name}</p>
                  <p className="text-[11px] font-semibold text-[#737373]">
                    {formatMMK(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#111111] active:scale-90"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[18px] text-center text-xs font-bold text-[#111111]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#111111] text-white active:scale-90"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="min-w-[65px] text-right text-xs font-black text-[#111111]">
                    {formatMMK(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#EAE8E3] bg-white p-4 space-y-3">
            <div className="flex items-center justify-between text-sm font-black text-[#111111]">
              <span>Total Amount:</span>
              <span className="text-base text-[#111111]">{formatMMK(total)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClearCart}
                className="rounded-xl border border-[#E5E5E5] px-3.5 py-2.5 text-xs font-bold text-[#737373] hover:bg-[#F5F4F0]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#111111] py-3 text-xs font-bold text-white hover:bg-black active:scale-[0.98]"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
