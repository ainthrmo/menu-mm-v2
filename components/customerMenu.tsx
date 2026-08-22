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

  // Navigation & language
  const [langMode, setLangMode] = useState<LanguageMode>("all");
  const tabsRef = useRef<HTMLDivElement>(null);

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
        let isDemoMode = false;

        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          targetRestaurantId = urlParams.get("restaurantId");
          isDemoMode = urlParams.get("demo") === "true" || targetRestaurantId === "demo";
        }

        if (!targetRestaurantId && !isDemoMode) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: userRest } = await supabase
              .from("restaurants").select("id").eq("owner_id", user.id).maybeSingle();
            if (userRest) targetRestaurantId = userRest.id;
          }
        }

        // If explicitly demo mode, or if no restaurant ID is found at all, load Live Demo Menu
        if (isDemoMode || !targetRestaurantId) {
          // Check if any restaurant exists in database first if not explicit demo
          if (!isDemoMode) {
            const { data: publicRest } = await supabase
              .from("restaurants")
              .select("id")
              .limit(1)
              .maybeSingle();

            if (publicRest) {
              targetRestaurantId = publicRest.id;
            }
          }

          if (!targetRestaurantId || isDemoMode) {
            setCurrentRestaurantId("demo");
            setStoreProfile(DEMO_STORE_PROFILE);
            setCategories(DEMO_CATEGORIES);
            setMenuItems(DEMO_MENU_ITEMS);
            if (typeof window !== "undefined") {
              const savedCart = sessionStorage.getItem("menu_cart_demo");
              if (savedCart) {
                try { setCart(JSON.parse(savedCart)); } catch { setCart({}); }
              } else {
                setCart({});
              }
            }
            setLoading(false);
            return;
          }
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

        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(DEMO_CATEGORIES);
        }

        if (menuData && menuData.length > 0) {
          setMenuItems(menuData.filter((item) => item.is_available !== false));
        } else {
          setMenuItems(DEMO_MENU_ITEMS);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        // Resilient fallback to demo menu on error
        setCurrentRestaurantId("demo");
        setStoreProfile(DEMO_STORE_PROFILE);
        setCategories(DEMO_CATEGORIES);
        setMenuItems(DEMO_MENU_ITEMS);
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
          Filters category cards
      ==================================================== */}
      <div className="mx-auto max-w-xl px-4 pt-4 pb-2 sm:px-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories or dishes..."
            aria-label="Search categories"
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
      </div>

      {/* ====================================================
          5. CATEGORY CARDS ONLY (NO DISH LISTS ON MAIN PAGE)
      ==================================================== */}
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-2 sm:px-5">
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-[#111111]" />
            <p className="text-xs font-medium text-[#737373]">Loading menu…</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {groupedSections.length === 0 ? (
              <EmptyState
                message="Menu is empty"
                sub="Categories will appear once dishes are added."
              />
            ) : (() => {
              const q = searchQuery.toLowerCase().trim();
              const displayed = q
                ? groupedSections.filter((section) => {
                    const catMatches =
                      section.name.toLowerCase().includes(q) ||
                      (getCategoryLabel(section.name) || "").toLowerCase().includes(q);
                    const dishMatches = section.items.some(
                      (item) =>
                        item.name.toLowerCase().includes(q) ||
                        (item.name_mm && item.name_mm.toLowerCase().includes(q))
                    );
                    return catMatches || dishMatches;
                  })
                : groupedSections;

              if (displayed.length === 0) {
                return (
                  <EmptyState
                    message="No matching categories"
                    sub="Try searching for another category or dish."
                  />
                );
              }

              return (
                <div className="grid grid-cols-1 gap-3.5">
                  {displayed.map((section) => {
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

                        {/* Neutral Legibility Scrim */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                        {/* Overlaid Category Information */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 flex items-end justify-between">
                          <div>
                            <h2
                              id={`cat-${section.name}`}
                              className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm group-hover:text-[#CDF22B] transition-colors burmese-title"
                            >
                              {getCategoryLabel(section.name)}
                            </h2>
                            <p className="text-xs text-white/80 font-medium mt-1">
                              {section.items.length} {section.items.length === 1 ? "dish" : "dishes"}
                            </p>
                          </div>

                          <span className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-[#CDF22B] group-hover:text-slate-950 transition-all shadow-sm">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* ====================================================
          6. FLOATING ORDER BAR
          Lime (#CDF22B) active order badge + safe area
      ==================================================== */}
      {totalCartItems > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg pb-safe">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md text-white">
            <div className="flex items-center gap-3">
              <div className="relative rounded-xl p-2.5 bg-slate-800 text-white">
                <ShoppingBag className="h-4.5 w-4.5" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-[#CDF22B] text-[10px] font-black text-slate-950">
                  {totalCartItems}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Your Order</p>
                <p className="text-sm font-bold text-white">{formatMMK(totalCartPrice)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#CDF22B] text-slate-950 px-4.5 py-2.5 text-xs font-black shadow-sm active:scale-95 transition-all min-h-[42px]"
            >
              <span>View Cart</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          7. CART SHEET (Neutral with Lime Accent)
      ==================================================== */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-900">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {totalCartItems} {totalCartItems === 1 ? "item" : "items"} selected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-4 pr-3.5">
              {cartList.map(({ item, quantity }) => (
                <div
                  key={`cart-${item.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-slate-900 burmese-title">{item.name}</h4>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      {formatMMK(item.price)} × {quantity} ={" "}
                      <span className="font-bold text-slate-900">
                        {formatMMK(item.price * quantity)}
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 active:scale-90 transition-transform"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[18px] text-center text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white active:scale-90 transition-transform"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors active:scale-90"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4.5 shrink-0 space-y-3.5 pb-safe">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Total Amount</span>
                <span className="text-xl font-black text-slate-950">
                  {formatMMK(totalCartPrice)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full rounded-2xl bg-slate-950 py-3.5 text-sm font-bold text-white hover:bg-black transition-all min-h-[46px] shadow-sm active:scale-[0.99]"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          9. FOOTER
      ==================================================== */}
      <footer className="mx-auto max-w-xl border-t border-slate-200/80 px-4 pb-12 pt-6 text-center">
        <p className="text-[11px] font-semibold tracking-wider text-slate-400">
          POWERED BY <span className="text-slate-900 font-bold">MOSS QR</span>
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
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2.5">
      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <UtensilsCrossed className="h-6 w-6" />
      </div>
      <p className="text-sm font-bold text-slate-900">{message}</p>
      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{sub}</p>
    </div>
  );
}

