"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Loader2,
  Facebook,
  Phone,
  Search,
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Sparkles,
  Globe,
  Grid2X2,
  List,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMMK } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-url";
import { getRestaurantSubscription, DEFAULT_FREE_PLAN, Plan } from "@/lib/subscription";

/* ===========================================================
   TYPES & INTERFACES
=========================================================== */

interface Category {
  id: string;
  name: string;
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
  social_phone?: string | null;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_tiktok?: string | null;
  social_messenger?: string | null;
  theme_color?: string | null;
  [key: string]: string | null | undefined;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

type ViewLayout = "grid" | "list";
type LanguageMode = "all" | "en" | "mm";

/* ===========================================================
   HELPER: build CSS custom-property vars from theme_color
   Descendants can use var(--theme) / var(--theme-light)
=========================================================== */

function buildThemeVars(themeColor?: string | null): React.CSSProperties {
  const color = themeColor?.trim() || "#0B7A5F";
  return {
    "--theme": color,
    "--theme-light": color + "1A",   // ~10 % opacity
  } as React.CSSProperties;
}

/* ===========================================================
   HELPER: bilingual text parsing  (PRO ONLY)
=========================================================== */

function parseBilingualText(
  text?: string | null,
  customMmText?: string | null
): { primary: string; secondary?: string } {
  if (!text && !customMmText) return { primary: "" };
  if (customMmText && text) return { primary: text, secondary: customMmText };

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

export default function CustomerMenu() {
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
     DATA FETCHING & MULTI-TENANT RESOLUTION  (unchanged logic)
  ---------------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        const { data: firstRest } = await supabase
          .from("restaurants").select("id").limit(1).maybeSingle();
        if (firstRest) targetRestaurantId = firstRest.id;
      }

      if (targetRestaurantId) {
        setCurrentRestaurantId(targetRestaurantId);

        if (typeof window !== "undefined") {
          const savedCart = sessionStorage.getItem(`menu_cart_${targetRestaurantId}`);
          if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch { setCart({}); }
          } else {
            setCart({});
          }
        }

        // Fire all 4 independent data fetches in parallel — each is
        // isolated by restaurant_id and does not depend on the others.
        const [
          { plan: currentPlan },
          { data: profileData },
          { data: catData },
          { data: menuData },
        ] = await Promise.all([
          getRestaurantSubscription(supabase, targetRestaurantId),
          supabase.from("store_profile").select("*").eq("restaurant_id", targetRestaurantId).maybeSingle(),
          supabase.from("categories").select("*").eq("restaurant_id", targetRestaurantId).order("name"),
          supabase.from("menu_items").select("*").eq("restaurant_id", targetRestaurantId),
        ]);

        setPlan(currentPlan);

        if (profileData) {
          setStoreProfile(profileData);
        } else {
          // Fallback: fetch restaurant name only if no store_profile row exists.
          const { data: restInfo } = await supabase
            .from("restaurants").select("name").eq("id", targetRestaurantId).maybeSingle();
          if (restInfo) setStoreProfile({ store_name: restInfo.name });
        }

        if (catData) setCategories(catData);
        if (menuData)
          setMenuItems(menuData.filter((item) => item.is_available !== false));
      }

      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  /* ----------------------------------------------------------
     CART HANDLERS  (unchanged logic, just memoised)
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
     GROUPING  (unchanged logic)
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

  // PRO ONLY
  const spotlightItems = useMemo(
    () => (isPro ? menuItems.filter((i) => Boolean(i.is_popular)) : []),
    [isPro, menuItems]
  );

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase();
    return menuItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.name_mm && i.name_mm.toLowerCase().includes(q)) ||
        (isPro && i.description && i.description.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
    );
  }, [isPro, menuItems, searchQuery, isSearching]);

  /* ----------------------------------------------------------
     SCROLL-SPY  — updates activeCategory while user scrolls
  ---------------------------------------------------------- */
  useEffect(() => {
    if (isSearching || groupedSections.length === 0) return;

    if (!activeCategory && groupedSections.length > 0)
      setActiveCategory(groupedSections[0].name);

    const OFFSET = 112; // header (~52) + tabs (~48) + gap (12)

    const onScroll = () => {
      if (isScrollingProgrammatically.current) return;
      let current = groupedSections[0]?.name ?? null;
      for (const sec of groupedSections) {
        const el = sectionRefs.current[sec.name];
        if (el && el.getBoundingClientRect().top <= OFFSET) current = sec.name;
      }
      setActiveCategory(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groupedSections, isSearching, activeCategory]);

  /* ----------------------------------------------------------
     SCROLL-TO-SECTION  — called from tab clicks
  ---------------------------------------------------------- */
  const scrollToSection = useCallback(
    (name: string) => {
      setSearchQuery("");
      setActiveCategory(name);

      const el = sectionRefs.current[name];
      if (!el) return;

      isScrollingProgrammatically.current = true;
      const OFFSET = 112;
      const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => { isScrollingProgrammatically.current = false; }, 900);

      // scroll the tab pill into view inside the tabs bar
      const pill = tabsRef.current?.querySelector(`[data-cat="${name}"]`) as HTMLElement | null;
      pill?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    },
    []
  );

  const restaurantName = storeProfile?.store_name || "Our Menu";
  const themeVars = buildThemeVars(storeProfile?.theme_color);

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  return (
    <div
      className="min-h-screen bg-[#F8F7F4] text-[#171717] font-sans antialiased"
      style={themeVars}
    >
      {/* ====================================================
          HEADER — compact, sticky
      ==================================================== */}
      <header className="sticky top-0 z-40 border-b border-[#EAE8E3] bg-white/97 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          {/* Logo + name */}
          <div className="flex items-center gap-2.5 min-w-0">
            {storeProfile?.logo_url ? (
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-0.5 shadow-sm">
                <img
                  src={getImageUrl(storeProfile.logo_url)}
                  alt={`${restaurantName} logo`}
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: "var(--theme)" }}
              >
                {restaurantName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-[15px] font-bold leading-tight text-[#171717]">
                  {restaurantName}
                </h1>
                {isPro && (
                  <span
                    className="shrink-0 rounded px-1 py-px text-[8px] font-black uppercase tracking-wide"
                    style={{ backgroundColor: "var(--theme-light)", color: "var(--theme)" }}
                  >
                    Pro
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] leading-tight text-[#737373]">
                {storeProfile?.description || "Digital Menu"}
              </p>
            </div>
          </div>

          {/* Quick contact */}
          {storeProfile?.social_phone ? (
            <a
              href={`tel:${storeProfile.social_phone}`}
              aria-label="Call restaurant"
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-3 text-xs font-semibold text-[#525252] active:scale-95"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Call</span>
            </a>
          ) : storeProfile?.social_facebook ? (
            <a
              href={storeProfile.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook page"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F5F5F5] text-[#525252]"
            >
              <Facebook className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </header>

      {/* ====================================================
          SEARCH + PRO CONTROLS  (not sticky; scrolls away)
      ==================================================== */}
      <div className="mx-auto max-w-xl px-4 pt-3 pb-1 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              aria-label="Search menu"
              className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pl-10 pr-8 text-sm font-medium text-[#171717] outline-none placeholder:text-[#999] shadow-sm transition-colors focus:border-[var(--theme)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#999] hover:text-[#171717]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* PRO ONLY: lang toggle + layout switcher */}
          {isPro && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setLangMode((p) => (p === "all" ? "en" : p === "en" ? "mm" : "all"))
                }
                title="Toggle Language"
                className="flex h-10 items-center gap-1 rounded-xl border border-[#E5E5E5] bg-white px-2.5 text-xs font-bold text-[#525252] shadow-sm active:scale-95"
              >
                <Globe className="h-3.5 w-3.5" style={{ color: "var(--theme)" }} />
                <span className="text-[10px] uppercase">
                  {langMode === "all" ? "Dual" : langMode === "en" ? "EN" : "MM"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout((p) => (p === "list" ? "grid" : "list"))}
                title="Switch Layout"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#525252] shadow-sm active:scale-95"
              >
                {viewLayout === "list" ? (
                  <Grid2X2 className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================
          STICKY CATEGORY TABS  (hidden while searching)
      ==================================================== */}
      {!isSearching && !loading && groupedSections.length > 1 && !isPro && (
        <div className="sticky top-[52px] z-30 border-b border-[#EAE8E3] bg-white/97 backdrop-blur-md">
          <div
            ref={tabsRef}
            className="scrollbar-hide mx-auto flex max-w-xl gap-1 overflow-x-auto px-4 py-2 sm:px-5"
          >
            {groupedSections.map((sec) => {
              const isActive = sec.name === activeCategory;
              return (
                <button
                  key={`tab-${sec.name}`}
                  data-cat={sec.name}
                  type="button"
                  onClick={() => scrollToSection(sec.name)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all min-h-[32px] ${
                    isActive
                      ? "text-white shadow-sm"
                      : "border border-[#E8E6E1] bg-transparent text-[#525252]"
                  }`}
                  style={isActive ? { backgroundColor: "var(--theme)" } : undefined}
                >
                  {sec.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-3 sm:px-5">
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--theme)" }} />
            <p className="text-xs font-medium text-[#737373]">Loading menu…</p>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------
                SEARCH RESULTS
            ------------------------------------------------ */}
            {isSearching ? (
              <section aria-label="Search results" className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-2.5">
                  <h2 className="text-sm font-bold text-[#171717]">
                    Results ({searchResults.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#737373] underline"
                  >
                    Clear
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <EmptyState message="No dishes found" sub="Try a different keyword." />
                ) : (
                  <div className={isPro && viewLayout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2.5"}>
                    {searchResults.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        isPro={isPro}
                        layout={isPro ? viewLayout : "list"}
                        langMode={langMode}
                        cartQuantity={cart[item.id]?.quantity || 0}
                        onAddToCart={() => handleAddToCart(item)}
                        onUpdateQuantity={(d) => handleUpdateQuantity(item.id, d)}
                        onOpenDetail={isPro ? () => setActiveModalItem(item) : undefined}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              /* ------------------------------------------------
                 SINGLE-PAGE SCROLLABLE MENU
              ------------------------------------------------ */
              <div className="space-y-7 pt-1">
                {/* PRO ONLY: spotlight carousel */}
                {isPro && !selectedCategory && spotlightItems.length > 0 && (
                  <section aria-label="Popular dishes">
                    <div className="mb-3 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" style={{ color: "var(--theme)" }} />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                        Popular & Featured
                      </h2>
                      <span
                        className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: "var(--theme-light)", color: "var(--theme)" }}
                      >
                        Recommended
                      </span>
                    </div>

                    <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1 min-h-[260px]">
                      {spotlightItems.map((item) => {
                        const parsed = parseBilingualText(item.name, item.name_mm);
                        return (
                          <div
                            key={`spotlight-${item.id}`}
                            onClick={() => setActiveModalItem(item)}
                            className="group relative flex w-44 shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm transition-all active:scale-[0.98]"
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
                                  <UtensilsCrossed className="h-6 w-6 text-[#A8A29E]" />
                                </div>
                              )}
                              <span
                                className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[8px] font-black text-white"
                                style={{ backgroundColor: "var(--theme)" }}
                              >
                                POPULAR
                              </span>
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-2.5">
                              <div>
                                <h3 className="line-clamp-1 text-[13px] font-bold text-[#171717]">
                                  {langMode === "mm" && parsed.secondary
                                    ? parsed.secondary
                                    : parsed.primary}
                                </h3>
                                {langMode === "all" && parsed.secondary && (
                                  <p className="line-clamp-1 text-[10px] text-[#737373]">
                                    {parsed.secondary}
                                  </p>
                                )}
                              </div>

                              <div className="mt-2 flex items-center justify-between border-t border-[#F5F4F0] pt-2">
                                <span className="text-sm font-black" style={{ color: "var(--theme)" }}>
                                  {formatMMK(item.price)}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(item);
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-full text-white active:scale-90"
                                  style={{ backgroundColor: "var(--theme)" }}
                                  aria-label="Add to cart"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* All category sections */}
                {groupedSections.length === 0 ? (
                  <EmptyState message="Menu is empty" sub="Items will appear once added." />
                ) : isPro ? (
                  selectedCategory ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-1.5 text-sm font-bold text-[#525252] hover:text-[#171717] transition-colors mb-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        All Categories
                      </button>
                      {groupedSections
                        .filter((s) => s.name === selectedCategory)
                        .map((section) => (
                          <section
                            key={section.name}
                            aria-labelledby={`cat-${section.name}`}
                          >
                            <div className="mb-3 flex items-baseline justify-between">
                              <h2
                                id={`cat-${section.name}`}
                                className="text-[15px] font-bold tracking-tight text-[#171717]"
                              >
                                {section.name}
                              </h2>
                              <span className="text-[11px] font-medium text-[#A3A3A3]">
                                {section.items.length} {section.items.length === 1 ? "item" : "items"}
                              </span>
                            </div>

                            <div className={viewLayout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2.5"}>
                              {section.items.map((item) => (
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
                          </section>
                        ))}
                    </div>
                  ) : (
                    <section aria-label="Menu Categories">
                      <h2 className="text-[15px] font-bold tracking-tight text-[#171717] mb-3">Categories</h2>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {groupedSections.map((section) => (
                          <div
                            key={section.name}
                            onClick={() => setSelectedCategory(section.name)}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col"
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                              {section.coverImage ? (
                                <img
                                  src={getImageUrl(section.coverImage)}
                                  alt={section.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <UtensilsCrossed className="h-6 w-6 text-[#A8A29E]" />
                                </div>
                              )}
                            </div>
                            <div className="p-3 text-center border-t border-[#F5F4F0] flex flex-col flex-1 justify-center">
                              <h3 className="text-[13px] font-bold text-[#171717] line-clamp-1">{section.name}</h3>
                              <p className="text-[10px] font-medium text-[#737373] mt-0.5">{section.items.length} items</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                ) : (
                  groupedSections.map((section) => (
                    <section
                      key={section.name}
                      aria-labelledby={`cat-${section.name}`}
                      ref={(el) => { sectionRefs.current[section.name] = el; }}
                    >
                      <div className="mb-3 flex items-baseline justify-between">
                        <h2
                          id={`cat-${section.name}`}
                          className="text-[15px] font-bold tracking-tight text-[#171717]"
                        >
                          {section.name}
                        </h2>
                        <span className="text-[11px] font-medium text-[#A3A3A3]">
                          {section.items.length} {section.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {section.items.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            isPro={isPro}
                            layout="list"
                            langMode={langMode}
                            cartQuantity={cart[item.id]?.quantity || 0}
                            onAddToCart={() => handleAddToCart(item)}
                            onUpdateQuantity={(d) => handleUpdateQuantity(item.id, d)}
                          />
                        ))}
                      </div>
                    </section>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ====================================================
          FLOATING ORDER BAR
      ==================================================== */}
      {totalCartItems > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#171717]/95 p-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="relative rounded-xl p-2 text-white" style={{ backgroundColor: "var(--theme)" }}>
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#171717] bg-[#CDF22B] text-[9px] font-black text-[#171717]">
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
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white active:scale-95 min-h-[36px]"
              style={{ backgroundColor: "var(--theme)" }}
            >
              <span>View Cart</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          PRO ONLY: DISH DETAIL MODAL
      ==================================================== */}
      {isPro && activeModalItem && (
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
          CART SHEET
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
                <ShoppingBag className="h-4 w-4" style={{ color: "var(--theme)" }} />
                <h2 className="text-sm font-bold text-[#171717]">Order Summary</h2>
                <span className="rounded-full bg-[#F5F4F0] px-2 py-0.5 text-[10px] font-bold text-[#737373]">
                  {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-1.5 text-[#737373] hover:bg-[#F5F5F5]"
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
                    <h4 className="truncate text-[13px] font-bold text-[#171717]">{item.name}</h4>
                    <p className="mt-0.5 text-xs text-[#737373]">
                      {formatMMK(item.price)} × {quantity} ={" "}
                      <span className="font-bold" style={{ color: "var(--theme)" }}>
                        {formatMMK(item.price * quantity)}
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] bg-white px-1.5 py-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-[#171717] hover:bg-[#F5F5F5] active:scale-90"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[16px] text-center text-xs font-bold text-[#171717]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-white active:scale-90"
                        style={{ backgroundColor: "var(--theme)" }}
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
                <span className="text-lg font-black" style={{ color: "var(--theme)" }}>
                  {formatMMK(totalCartPrice)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full rounded-xl bg-[#171717] py-3 text-sm font-bold text-white hover:bg-black transition-all min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          FOOTER
      ==================================================== */}
      <footer className="mx-auto max-w-xl border-t border-[#E8E6E1] px-4 pb-8 pt-5 text-center">
        <p className="text-[10px] font-semibold tracking-wider text-[#A3A3A3]">
          POWERED BY{" "}
          <span style={{ color: "var(--theme)" }}>MEE NHUU</span>
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
      <p className="mt-2.5 text-sm font-semibold text-[#171717]">{message}</p>
      <p className="mt-1 text-xs text-[#737373]">{sub}</p>
    </div>
  );
}

/* ===========================================================
   MENU ITEM CARD  (Free & Pro adaptive)
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
  const parsedName = isPro
    ? parseBilingualText(item.name, item.name_mm)
    : { primary: item.name };

  const displayName =
    isPro && langMode === "mm" && parsedName.secondary
      ? parsedName.secondary
      : parsedName.primary;
  const subName = isPro && langMode === "all" ? parsedName.secondary : null;
  const displayDesc = isPro && item.description ? item.description.trim() : null;

  /* --- GRID card (PRO only) --- */
  if (isPro && layout === "grid") {
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
            <span
              className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[8px] font-black text-white"
              style={{ backgroundColor: "var(--theme)" }}
            >
              POPULAR
            </span>
          )}
        </div>

        <div className="p-3 space-y-0.5">
          <h3 className="text-[13px] font-bold text-[#171717] line-clamp-1 leading-snug">
            {displayName}
          </h3>
          {subName && <p className="text-[10px] text-[#737373] line-clamp-1">{subName}</p>}
          {displayDesc && (
            <p className="mt-1 line-clamp-2 text-[11px] text-[#666] leading-relaxed">
              {displayDesc}
            </p>
          )}
        </div>

        <div className="px-3 pb-3">
          <div className="flex items-center justify-between border-t border-[#F5F4F0] pt-2.5">
            <p className="text-sm font-black" style={{ color: "var(--theme)" }}>
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
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#171717] active:scale-90"
                  aria-label="Decrease"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-[16px] text-center text-xs font-bold text-[#171717]">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white active:scale-90"
                  style={{ backgroundColor: "var(--theme)" }}
                  aria-label="Increase"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white active:scale-95 min-h-[28px]"
                style={{ backgroundColor: "var(--theme)" }}
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

  /* --- LIST card (default, mobile-first) --- */
  return (
    <article
      onClick={onOpenDetail}
      className={`group relative flex overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white shadow-sm transition-all active:scale-[0.99] ${isPro ? "cursor-pointer" : ""}`}
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
        {isPro && item.is_popular && (
          <span
            className="absolute left-1.5 top-1.5 rounded px-1 py-0.5 text-[7px] font-black text-white leading-none"
            style={{ backgroundColor: "var(--theme)" }}
          >
            POP
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <h3 className="text-[13px] font-bold leading-snug text-[#171717]">{displayName}</h3>
          {subName && <p className="text-[10px] text-[#737373] mt-px">{subName}</p>}
          {displayDesc && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#666]">
              {displayDesc}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-[#F5F4F0] pt-2">
          <p className="text-sm font-black" style={{ color: "var(--theme)" }}>
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
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#171717] active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-[16px] text-center text-xs font-bold text-[#171717]">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white active:scale-90"
                style={{ backgroundColor: "var(--theme)" }}
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white active:scale-95 min-h-[32px]"
              style={{ backgroundColor: "var(--theme)" }}
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
   PRO ONLY: DISH DETAIL MODAL
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
            className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </button>
          {item.is_popular && (
            <span
              className="absolute bottom-2.5 left-3 rounded px-2 py-0.5 text-[9px] font-black text-white"
              style={{ backgroundColor: "var(--theme)" }}
            >
              POPULAR
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#171717] leading-tight">
                {parsedName.primary}
              </h2>
              {parsedName.secondary && (
                <p className="text-xs text-[#737373] mt-0.5">{parsedName.secondary}</p>
              )}
            </div>
            <span className="text-base font-black shrink-0" style={{ color: "var(--theme)" }}>
              {formatMMK(item.price)}
            </span>
          </div>

          <div
            className="inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold text-[#525252]"
            style={{ backgroundColor: "var(--theme-light)" }}
          >
            {item.category}
          </div>

          {item.description && (
            <div className="rounded-xl border border-[#F0EEEA] bg-[#FAF9F6] p-3 text-sm text-[#525252] leading-relaxed">
              {item.description}
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
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#171717] active:scale-90"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[18px] text-center text-sm font-bold text-[#171717]">
                    {cartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white active:scale-90"
                    style={{ backgroundColor: "var(--theme)" }}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#171717] px-5 py-2.5 text-sm font-bold text-white hover:bg-black min-h-[40px]"
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#171717] active:scale-90"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[24px] text-center text-sm font-bold text-[#171717]">
                  {modalQty}
                </span>
                <button
                  type="button"
                  onClick={() => setModalQty((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#171717] active:scale-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => { onAddToCart(modalQty); onClose(); }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white transition-all min-h-[44px]"
                style={{ backgroundColor: "var(--theme)" }}
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
