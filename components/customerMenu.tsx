"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Loader2,
  Phone,
  Search,
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Globe,
  Grid2X2,
  List,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Wifi,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMMK } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-url";
import { getRestaurantSubscription, DEFAULT_FREE_PLAN, Plan } from "@/lib/subscription";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buildCategoryMenuUrl, buildMainMenuUrl } from "@/lib/slug";

/* ===========================================================
   TYPES & INTERFACES
=========================================================== */

interface Category {
  id: string;
  name: string;
  name_mm?: string;
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
  store_name?: string | null;
  cover_url?: string | null;
  logo_url?: string | null;
  image?: string | null;
  description?: string | null;
  address?: string | null;
  location?: string | null;
  city?: string | null;
  social_phone?: string | null;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_tiktok?: string | null;
  social_messenger?: string | null;
  wifi_password?: string | null;
  show_wifi?: boolean | null;
  wifi_name?: string | null;
  theme_color?: string | null;
  [key: string]: any;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

type ViewLayout = "grid" | "list";
type LanguageMode = "all" | "en" | "mm";

/* ===========================================================
   HELPER: bilingual text parsing (PRO & Standard fallback)
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
   MAIN COMPONENT
=========================================================== */

export default function CustomerMenu({
  restaurantSlug,
}: {
  restaurantSlug?: string;
} = {}) {
  const router = useRouter();
  const supabase = createClient();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [plan, setPlan] = useState<Plan>(DEFAULT_FREE_PLAN);
  const [loading, setLoading] = useState(true);

  // Cart
  const [cart, setCart] = useState<{ [id: string]: CartItem }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  // Navigation & layout
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("list");
  const [langMode, setLangMode] = useState<LanguageMode>("all");
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  // Refs for scroll-spy
  const sectionRefs = useRef<{ [name: string]: HTMLElement | null }>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const isPro =
    plan.id.toLowerCase() === "pro" || plan.id.toLowerCase() === "business";

  /* ----------------------------------------------------------
     DATA FETCHING & MULTI-TENANT RESOLUTION (STRICTLY SCOPED)
  ---------------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let targetRestaurantId: string | null = null;

        if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        targetRestaurantId = urlParams.get("restaurantId");
      }

      if (!targetRestaurantId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userRest } = await supabase
            .from("restaurants").select("id").eq("owner_id", user.id).maybeSingle();
          if (userRest) targetRestaurantId = userRest.id;
        }
      }

      if (!targetRestaurantId) {
        setLoading(false);
        return;
      }

      setCurrentRestaurantId(targetRestaurantId);

        if (typeof window !== "undefined") {
          const savedCart = sessionStorage.getItem(`menu_cart_${targetRestaurantId}`);
          if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch { setCart({}); }
          } else {
            setCart({});
          }
        }

        const [
          { plan: currentPlan },
          { data: profileData },
          { data: catData },
          { data: menuData },
        ] = await Promise.all([
          getRestaurantSubscription(supabase, targetRestaurantId),
          supabase.from("store_profile").select("*").eq("restaurant_id", targetRestaurantId).maybeSingle(),
          supabase.from("categories").select("*").eq("restaurant_id", targetRestaurantId).order("sort_order", { ascending: true, nullsFirst: false }).order("name"),
          supabase.from("menu_items").select("*").eq("restaurant_id", targetRestaurantId),
        ]);

        setPlan(currentPlan);

        if (profileData) {
          setStoreProfile(profileData);
        } else {
          const { data: restInfo } = await supabase
            .from("restaurants").select("name").eq("id", targetRestaurantId).maybeSingle();
          if (restInfo) setStoreProfile({ store_name: restInfo.name });
        }

        if (catData) setCategories(catData);
        if (menuData)
          setMenuItems(menuData.filter((item) => item.is_available !== false));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  /* ----------------------------------------------------------
     CART HANDLERS
  ---------------------------------------------------------- */
  const persistCart = useCallback(
    (newCart: { [id: string]: CartItem }) => {
      if (currentRestaurantId && typeof window !== "undefined")
        sessionStorage.setItem(`menu_cart_${currentRestaurantId}`, JSON.stringify(newCart));
    },
    [currentRestaurantId]
  );

  const handleAddToCart = useCallback(
    (item: MenuItem, quantity = 1) => {
      setCart((prev) => {
        const existing = prev[item.id];
        const newCart = {
          ...prev,
          [item.id]: { item, quantity: (existing?.quantity ?? 0) + quantity },
        };
        persistCart(newCart);
        return newCart;
      });
    },
    [persistCart]
  );

  const handleUpdateQuantity = useCallback(
    (itemId: string, delta: number) => {
      setCart((prev) => {
        const existing = prev[itemId];
        if (!existing) return prev;
        const newQty = existing.quantity + delta;
        const newCart = { ...prev };
        if (newQty <= 0) delete newCart[itemId];
        else newCart[itemId] = { ...existing, quantity: newQty };
        persistCart(newCart);
        return newCart;
      });
    },
    [persistCart]
  );

  const handleRemoveFromCart = useCallback(
    (itemId: string) => {
      setCart((prev) => {
        const newCart = { ...prev };
        delete newCart[itemId];
        persistCart(newCart);
        return newCart;
      });
    },
    [persistCart]
  );

  const cartList = useMemo(() => Object.values(cart), [cart]);
  const totalCartItems = useMemo(
    () => cartList.reduce((s, ci) => s + ci.quantity, 0), [cartList]
  );
  const totalCartPrice = useMemo(
    () => cartList.reduce((s, ci) => s + ci.item.price * ci.quantity, 0), [cartList]
  );

  const isSearching = searchQuery.trim().length > 0;

  /* ----------------------------------------------------------
     GROUPING & CATEGORY COVER LOGIC
  ---------------------------------------------------------- */
  const groupedSections = useMemo(() => {
    const categoryNames = categories.map((c) => c.name);
    const orderedNames =
      categoryNames.length > 0
        ? categoryNames
        : [...new Set(menuItems.map((i) => i.category))];

    return orderedNames
      .map((name) => {
        const items = menuItems.filter((i) => i.category === name);
        const coverItem = items.find((i) => i.image?.trim());
        return { name, items, coverImage: coverItem?.image ?? null };
      })
      .filter((s) => s.items.length > 0);
  }, [categories, menuItems]);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase();
    return menuItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.name_mm && i.name_mm.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.description_mm && i.description_mm.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
    );
  }, [menuItems, searchQuery, isSearching]);

  const getCategoryLabel = useCallback(
    (catName: string) => {
      const catObj = categories.find((c) => c.name === catName);
      if (!catObj) return catName;
      if (langMode === "mm") return catObj.name_mm || catObj.name;
      if (langMode === "en") return catObj.name || catObj.name_mm;
      if (catObj.name_mm && catObj.name && catObj.name !== catObj.name_mm) {
        return `${catObj.name} (${catObj.name_mm})`;
      }
      return catObj.name_mm || catObj.name;
    },
    [categories, langMode]
  );

  /* ----------------------------------------------------------
     SCROLL-SPY
  ---------------------------------------------------------- */
  useEffect(() => {
    if (isSearching || groupedSections.length === 0) return;

    const OFFSET = 140;

    const onScroll = () => {
      if (isScrollingProgrammatically.current) return;
      let current: string | null = null;
      for (const sec of groupedSections) {
        const el = sectionRefs.current[sec.name];
        if (el && el.getBoundingClientRect().top <= OFFSET) {
          current = sec.name;
        }
      }
      if (current) {
        setActiveCategory(current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groupedSections, isSearching]);

  /* ----------------------------------------------------------
     SCROLL-TO-SECTION
  ---------------------------------------------------------- */
  const scrollToSection = useCallback(
    (name: string) => {
      setSearchQuery("");
      setActiveCategory(name);

      const el = sectionRefs.current[name];
      if (!el) return;

      isScrollingProgrammatically.current = true;
      const OFFSET = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => { isScrollingProgrammatically.current = false; }, 900);

      const pill = tabsRef.current?.querySelector(`[data-cat="${name}"]`) as HTMLElement | null;
      pill?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    },
    []
  );

  const restaurantName = storeProfile?.store_name || "Our Menu";
  const heroCoverImage =
    storeProfile?.cover_url ||
    storeProfile?.image ||
    groupedSections[0]?.coverImage ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  // Location / Address formatting
  const locationText =
    storeProfile?.location ||
    storeProfile?.address ||
    storeProfile?.city ||
    null;

  const showWifi = Boolean(
    storeProfile?.wifi_password?.trim() && storeProfile?.show_wifi !== false
  );

  const hasAnyInfo = Boolean(locationText || storeProfile?.social_phone || showWifi);

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  if (!loading && !currentRestaurantId) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm rounded-3xl bg-white border border-[#E5E5E5] p-8 shadow-sm space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-[#888888] mx-auto" />
          <h2 className="text-base font-bold text-[#111111]">Menu Not Found</h2>
          <p className="text-xs text-[#666666] leading-relaxed">
            This digital menu link is missing a valid restaurant ID. Please re-scan the restaurant&apos;s QR code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] font-sans antialiased selection:bg-[#CDF22B] selection:text-[#111111]">
      {/* ====================================================
          1. HERO SECTION (Full-Bleed Cover Photo + Pill Language Switcher)
      ==================================================== */}
      <section className="relative w-full h-52 sm:h-64 md:h-72 bg-neutral-900 overflow-hidden">
        {/* Full-Bleed Restaurant Photo */}
        <img
          src={getImageUrl(heroCoverImage)}
          alt={`${restaurantName} banner`}
          className="h-full w-full object-cover object-center"
        />

        {/* Subtle Top-to-Bottom Shading */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Language Switcher Button (Top-Right, Overlapping Hero, Neutral Background, NO Lime) */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20">
          <button
            type="button"
            onClick={() =>
              setLangMode((p) => (p === "all" ? "en" : p === "en" ? "mm" : "all"))
            }
            className="flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white border border-white/20 shadow-md hover:bg-black/80 active:scale-95 transition-all"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-neutral-300" />
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {langMode === "all" ? "Dual (EN/MM)" : langMode === "en" ? "English" : "မြန်မာ"}
            </span>
          </button>
        </div>
      </section>

      {/* ====================================================
          2. RESTAURANT INFO CARD (Overlapping Bottom Edge of Hero)
      ==================================================== */}
      <section className="relative -mt-12 sm:-mt-16 mx-auto max-w-xl px-4 sm:px-5 z-20">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE8E3] shadow-lg">
          <div className="flex items-center gap-3.5">
            {/* Logo if available */}
            {storeProfile?.logo_url ? (
              <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-0.5 shadow-sm">
                <img
                  src={getImageUrl(storeProfile.logo_url)}
                  alt={`${restaurantName} logo`}
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-lg font-black text-white shadow-sm">
                {restaurantName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight truncate leading-tight">
                  {restaurantName}
                </h1>
                {isPro && (
                  <span className="shrink-0 rounded bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-neutral-700">
                    PRO
                  </span>
                )}
              </div>

              {storeProfile?.description ? (
                <p className="mt-0.5 text-xs text-[#737373] line-clamp-1 leading-normal font-medium">
                  {storeProfile.description}
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-[#737373] font-medium">
                  Digital Menu
                </p>
              )}
            </div>
          </div>

          {/* Compact Info Line: Only Show Actually Filled Fields (Location, Phone, Wifi) */}
          {hasAnyInfo && (
            <div className="mt-3.5 pt-3 border-t border-[#F0EEEA] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#525252] font-medium">
              {locationText && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#888888] shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{locationText}</span>
                </div>
              )}

              {storeProfile?.social_phone && (
                <a
                  href={`tel:${storeProfile.social_phone}`}
                  className="flex items-center gap-1.5 hover:text-[#111111] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#888888] shrink-0" />
                  <span>{storeProfile.social_phone}</span>
                </a>
              )}

              {showWifi && (
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-[#888888] shrink-0" />
                  <span>
                    WiFi: <strong className="text-[#111111] font-bold">{storeProfile?.wifi_password}</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          3. CATEGORY NAVIGATION (Horizontally scrollable pill-shaped chips)
          Active chip: Lime (#CDF22B) background, dark text
          Inactive chips: Neutral outline/ghost style
      ==================================================== */}
      {!loading && groupedSections.length > 0 && (
        <nav
          aria-label="Menu categories"
          className="sticky top-0 z-30 bg-[#F8F7F4]/95 backdrop-blur-md pt-4 pb-2 border-b border-[#EAE8E3]"
        >
          <div
            ref={tabsRef}
            className="scrollbar-hide mx-auto flex max-w-xl gap-2 overflow-x-auto px-4 sm:px-5"
          >
            {groupedSections.map((sec) => {
              const catUrl = buildCategoryMenuUrl(sec.name, currentRestaurantId);
              return (
                <Link
                  key={`chip-${sec.name}`}
                  data-cat={sec.name}
                  href={catUrl}
                  className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all min-h-[34px] flex items-center gap-1.5 bg-white border border-[#E5E5E5] text-[#525252] hover:text-[#111111] hover:border-[#CCCCCC] active:scale-95 shadow-2xs"
                >
                  <span>{getCategoryLabel(sec.name)}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-500 font-semibold">
                    {sec.items.length}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* ====================================================
          4. SEARCH BAR (Positioned directly below category chips)
          Rounded input, neutral gray icon (no lime)
      ==================================================== */}
      <div className="mx-auto max-w-xl px-4 pt-4 pb-2 sm:px-5">
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
              placeholder="Search dishes, drinks, ingredients..."
              aria-label="Search menu"
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

          {/* Layout switcher for search results */}
          {isSearching && (
            <button
              type="button"
              onClick={() => setViewLayout((p) => (p === "list" ? "grid" : "list"))}
              title="Switch Layout"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white text-[#525252] hover:text-[#111111] shadow-sm active:scale-95 transition-all"
            >
              {viewLayout === "list" ? (
                <Grid2X2 className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ====================================================
          5. CATEGORY BANNER CARDS ONLY (NO DISH LIST ON MAIN PAGE)
      ==================================================== */}
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-2 sm:px-5">
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-[#111111]" />
            <p className="text-xs font-medium text-[#737373]">Loading menu…</p>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------
                SEARCH RESULTS VIEW (If user types a query)
            ------------------------------------------------ */}
            {isSearching ? (
              <section aria-label="Search results" className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-2.5">
                  <h2 className="text-sm font-bold text-[#111111]">
                    Results ({searchResults.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#737373] underline hover:text-[#111111]"
                  >
                    Clear
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <EmptyState message="No dishes found" sub="Try searching for something else." />
                ) : (
                  <div className={viewLayout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2.5"}>
                    {searchResults.map((item) => (
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
              </section>
            ) : (
              /* ------------------------------------------------
                 CATEGORY BANNER CARDS OVERVIEW (Navigates to Category Page)
              ------------------------------------------------ */
              <div className="space-y-4 pt-2">
                {groupedSections.length === 0 ? (
                  <EmptyState message="Menu is empty" sub="Categories will appear once dishes are added." />
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {groupedSections.map((section) => {
                      const catUrl = buildCategoryMenuUrl(section.name, currentRestaurantId);

                      return (
                        <Link
                          key={section.name}
                          href={catUrl}
                          className="group relative block cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EAE8E3] bg-neutral-900 shadow-sm aspect-[16/6] sm:aspect-[16/5] transition-all active:scale-[0.99] hover:shadow-md"
                        >
                          {section.coverImage ? (
                            <img
                              src={getImageUrl(section.coverImage)}
                              alt={section.name}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                              <UtensilsCrossed className="h-8 w-8 text-neutral-500" />
                            </div>
                          )}

                          {/* Neutral Legibility Scrim (No color tint, natural photography) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                          {/* Overlaid Category Information */}
                          <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 flex items-end justify-between">
                            <div>
                              <h2
                                id={`cat-${section.name}`}
                                className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm group-hover:text-[#CDF22B] transition-colors"
                              >
                                {getCategoryLabel(section.name)}
                              </h2>
                              <p className="text-xs text-white/80 font-medium mt-0.5">
                                {section.items.length} {section.items.length === 1 ? "dish" : "dishes"}
                              </p>
                            </div>

                            <span className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-[#CDF22B] group-hover:text-[#111111] transition-all shadow-xs">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
          )}
        </>
      )}
    </main>

      {/* ====================================================
          6. FLOATING ORDER BAR
          Lime (#CDF22B) active order badge
      ==================================================== */}
      {totalCartItems > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg">
          <div className="flex items-center justify-between rounded-2xl border border-[#333333] bg-[#111111]/95 p-3 shadow-2xl backdrop-blur-md text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative rounded-xl p-2 bg-[#222222] text-white">
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#111111] bg-[#CDF22B] text-[9px] font-black text-[#111111]">
                  {totalCartItems}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-medium text-white/60">Your Order</p>
                <p className="text-sm font-bold text-white">{formatMMK(totalCartPrice)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#CDF22B] text-[#111111] px-4 py-2 text-xs font-black shadow-sm active:scale-95 transition-all min-h-[36px]"
            >
              <span>View Cart</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          7. DISH DETAIL MODAL
      ==================================================== */}
      {activeModalItem && (
        <DishDetailModal
          item={activeModalItem}
          langMode={langMode}
          cartQuantity={cart[activeModalItem.id]?.quantity || 0}
          onClose={() => setActiveModalItem(null)}
          onAddToCart={(qty) => handleAddToCart(activeModalItem, qty)}
          onUpdateQuantity={(d) => handleUpdateQuantity(activeModalItem.id, d)}
        />
      )}

      {/* ====================================================
          8. CART SHEET (Neutral with Lime Accent)
      ==================================================== */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl border border-[#E5E5E5] bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAE8E3] p-4 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#111111]" />
                <h2 className="text-sm font-bold text-[#111111]">Order Summary</h2>
                <span className="rounded-full bg-[#F5F4F0] px-2 py-0.5 text-[10px] font-bold text-[#737373]">
                  {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-1.5 text-[#737373] hover:bg-[#F5F5F5] hover:text-[#111111]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto space-y-2 p-4 pr-3">
              {cartList.map(({ item, quantity }) => (
                <div
                  key={`cart-${item.id}`}
                  className="flex items-center justify-between gap-2.5 rounded-xl border border-[#EAE8E3] bg-[#FAF9F6] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-[13px] font-bold text-[#111111]">{item.name}</h4>
                    <p className="mt-0.5 text-xs text-[#737373]">
                      {formatMMK(item.price)} × {quantity} ={" "}
                      <span className="font-bold text-[#111111]">
                        {formatMMK(item.price * quantity)}
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white px-1.5 py-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-[#111111] hover:bg-[#F5F5F5] active:scale-90"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[16px] text-center text-xs font-bold text-[#111111]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded bg-[#111111] text-white active:scale-90"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1.5 text-[#A3A3A3] hover:text-rose-600 active:scale-90"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[#EAE8E3] p-4 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#525252]">Total</span>
                <span className="text-lg font-black text-[#111111]">
                  {formatMMK(totalCartPrice)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full rounded-xl bg-[#111111] py-3 text-sm font-bold text-white hover:bg-black transition-all min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          9. FOOTER
      ==================================================== */}
      <footer className="mx-auto max-w-xl border-t border-[#E8E6E1] px-4 pb-8 pt-5 text-center">
        <p className="text-[10px] font-semibold tracking-wider text-[#A3A3A3]">
          POWERED BY <span className="text-[#111111] font-bold">MENUU</span>
        </p>
      </footer>
    </div>
  );
}

/* ===========================================================
   EMPTY STATE HELPER
=========================================================== */

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D9D9D9] bg-white p-10 text-center">
      <UtensilsCrossed className="mx-auto h-7 w-7 text-[#A8A29E]" />
      <p className="mt-2.5 text-sm font-semibold text-[#111111]">{message}</p>
      <p className="mt-1 text-xs text-[#737373]">{sub}</p>
    </div>
  );
}

/* ===========================================================
   MENU ITEM CARD (Free & Pro Adaptive, Neutral + Lime Accent)
=========================================================== */

function MenuItemCard({
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
  onOpenDetail?: () => void;
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
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm transition-all active:scale-[0.98] cursor-pointer"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#ECE8E1]">
          {item.image ? (
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-[#B5B0A7]" />
            </div>
          )}
          {item.is_popular && (
            <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[8px] font-black text-[#111111] bg-[#CDF22B] shadow-xs uppercase tracking-wider">
              POPULAR
            </span>
          )}
        </div>

        <div className="p-3 space-y-0.5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-[#111111] line-clamp-1 leading-snug">
              {displayName}
            </h3>
            {subName && <p className="text-[10px] text-[#737373] line-clamp-1">{subName}</p>}
            {displayDesc && (
              <p className="mt-1 line-clamp-2 text-[11px] text-[#666666] leading-relaxed font-medium">
                {displayDesc}
              </p>
            )}
          </div>

          <div className="border-t border-[#F5F4F0] pt-2.5 mt-2 flex items-center justify-between">
            <p className="text-sm font-black text-[#111111]">
              {formatMMK(item.price)}
            </p>

            {cartQuantity > 0 ? (
              <div
                className="flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-[#F5F4F0] px-1 py-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(-1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#111111] active:scale-90"
                  aria-label="Decrease"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-[16px] text-center text-xs font-bold text-[#111111]">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-white active:scale-90"
                  aria-label="Increase"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold bg-[#111111] text-white hover:bg-black active:scale-95 min-h-[28px]"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* --- LIST Layout (Default, Mobile-First) --- */
  return (
    <article
      onClick={onOpenDetail}
      className="group relative flex overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm transition-all active:scale-[0.99] cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-[88px] w-[88px] sm:h-24 sm:w-24 shrink-0 overflow-hidden bg-[#ECE8E1]">
        {item.image ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-[#B5B0A7]" />
          </div>
        )}
        {item.is_popular && (
          <span className="absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[8px] font-black text-[#111111] bg-[#CDF22B] leading-none uppercase tracking-tight shadow-xs">
            POPULAR
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <h3 className="text-[13px] font-bold leading-snug text-[#111111]">{displayName}</h3>
          {subName && <p className="text-[10px] text-[#737373] mt-px">{subName}</p>}
          {displayDesc && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#666666] font-medium">
              {displayDesc}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-[#F5F4F0] pt-2">
          <p className="text-sm font-black text-[#111111]">
            {formatMMK(item.price)}
          </p>

          {cartQuantity > 0 ? (
            <div
              className="flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-[#F5F4F0] px-1 py-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onUpdateQuantity(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#111111] active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-[16px] text-center text-xs font-bold text-[#111111]">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111111] text-white active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold bg-[#111111] text-white hover:bg-black active:scale-95 min-h-[32px]"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ===========================================================
   DISH DETAIL MODAL (Neutral + Lime Accent)
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
        {/* Image */}
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

        {/* Body */}
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

        {/* Footer */}
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
                  <span className="min-w-[18px] text-center text-sm font-bold text-[#111111]">
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
                className="rounded-xl bg-[#111111] px-5 py-2.5 text-sm font-bold text-white hover:bg-black min-h-[40px]"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-[#E5E5E5] bg-[#F5F4F0] p-0.5">
                <button
                  type="button"
                  onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#111111] active:scale-90"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[24px] text-center text-sm font-bold text-[#111111]">
                  {modalQty}
                </span>
                <button
                  type="button"
                  onClick={() => setModalQty((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#111111] active:scale-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => { onAddToCart(modalQty); onClose(); }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold bg-[#111111] text-white hover:bg-black transition-all min-h-[44px]"
              >
                <Plus className="h-4 w-4" />
                <span>Add {formatMMK(item.price * modalQty)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

