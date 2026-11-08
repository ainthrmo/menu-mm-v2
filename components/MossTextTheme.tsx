"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Globe,
  Wifi,
  Phone,
  MapPin,
  ChevronUp,
  X,
  Compass,
  Sparkles,
} from "lucide-react";
import { formatMMK } from "@/lib/utils";

/* ===========================================================
   TYPES
=========================================================== */

export interface TextThemeCategory {
  id: string;
  name: string;
  name_mm?: string | null;
  sort_order?: number;
}

export interface TextThemeMenuItem {
  id: string;
  name: string;
  name_mm?: string | null;
  category: string;
  price: number;
  description?: string | null;
  description_mm?: string | null;
  is_available?: boolean | null;
  is_popular?: boolean;
  is_spicy?: boolean;
}

export interface TextThemeStoreProfile {
  store_name?: string | null;
  logo_url?: string | null;
  description?: string | null;
  address?: string | null;
  location?: string | null;
  city?: string | null;
  social_phone?: string | null;
  social_facebook?: string | null;
  social_instagram?: string | null;
  wifi_name?: string | null;
  wifi_password?: string | null;
  show_wifi?: boolean | null;
  [key: string]: any;
}

export type TextThemeLanguageMode = "all" | "en" | "mm";

interface MossTextThemeProps {
  categories: TextThemeCategory[];
  menuItems: TextThemeMenuItem[];
  storeProfile: TextThemeStoreProfile | null;
  restaurantName: string;
  activeLanguage?: TextThemeLanguageMode;
  onLanguageChange?: (lang: TextThemeLanguageMode) => void;
}

/* ===========================================================
   HELPER: Bilingual Text Splitting
=========================================================== */
function parseBilingual(
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
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return { primary: parts[0], secondary: parts[1] };
    }
  }

  const parenMatch = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch && parenMatch[1] && parenMatch[2]) {
    return { primary: parenMatch[1].trim(), secondary: parenMatch[2].trim() };
  }

  return { primary: raw };
}

/* ===========================================================
   MAIN COMPONENT: MOSS Text Theme — Botanical Archive
=========================================================== */
export default function MossTextTheme({
  categories,
  menuItems,
  storeProfile,
  restaurantName,
  activeLanguage: externalLang,
  onLanguageChange,
}: MossTextThemeProps) {
  const [internalLang, setInternalLang] = useState<TextThemeLanguageMode>("all");
  const langMode = externalLang ?? internalLang;

  const handleLangToggle = () => {
    const next: TextThemeLanguageMode =
      langMode === "all" ? "en" : langMode === "en" ? "mm" : "all";
    if (onLanguageChange) {
      onLanguageChange(next);
    } else {
      setInternalLang(next);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const dockRef = useRef<HTMLDivElement>(null);

  // Group items by category order
  const groupedSections = useMemo(() => {
    const catMap = new Map<string, TextThemeCategory>();
    categories.forEach((c) => catMap.set(c.name.trim().toLowerCase(), c));

    // Sort categories
    const sortedCategories = [...categories].sort((a, b) => {
      const orderA = a.sort_order ?? 9999;
      const orderB = b.sort_order ?? 9999;
      return orderA - orderB;
    });

    const categoryNamesOrder = sortedCategories.map((c) => c.name);

    // Group items
    const groups: { [key: string]: TextThemeMenuItem[] } = {};
    menuItems.forEach((item) => {
      const cat = item.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    const result: {
      category: string;
      categoryObj?: TextThemeCategory;
      items: TextThemeMenuItem[];
    }[] = [];

    // Add in sorted order
    categoryNamesOrder.forEach((name) => {
      if (groups[name] && groups[name].length > 0) {
        result.push({
          category: name,
          categoryObj: catMap.get(name.trim().toLowerCase()),
          items: groups[name],
        });
        delete groups[name];
      }
    });

    // Add remaining groups
    Object.keys(groups).forEach((name) => {
      if (groups[name].length > 0) {
        result.push({
          category: name,
          categoryObj: catMap.get(name.trim().toLowerCase()),
          items: groups[name],
        });
      }
    });

    return result;
  }, [categories, menuItems]);

  // Set initial active category
  useEffect(() => {
    if (groupedSections.length > 0 && !activeCategory) {
      setActiveCategory(groupedSections[0].category);
    }
  }, [groupedSections, activeCategory]);

  // Handle scroll spy and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 180;
      for (let i = groupedSections.length - 1; i >= 0; i--) {
        const cat = groupedSections[i].category;
        const el = sectionRefs.current[cat];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveCategory(cat);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [groupedSections]);

  const scrollToCategory = (catName: string) => {
    setActiveCategory(catName);
    const target = sectionRefs.current[catName];
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter items for search
  const isSearching = searchQuery.trim().length > 0;
  const filteredItems = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase().trim();
    return menuItems.filter((i) => {
      const matchName = i.name.toLowerCase().includes(q);
      const matchNameMm = i.name_mm?.toLowerCase().includes(q);
      const matchDesc = i.description?.toLowerCase().includes(q);
      const matchDescMm = i.description_mm?.toLowerCase().includes(q);
      const matchCat = i.category.toLowerCase().includes(q);
      return matchName || matchNameMm || matchDesc || matchDescMm || matchCat;
    });
  }, [menuItems, searchQuery, isSearching]);

  // Local helper for category label
  const getCategoryLabel = useCallback(
    (catName: string, catObj?: TextThemeCategory) => {
      const found = catObj || categories.find((c) => c.name === catName);
      if (!found) return { primary: catName };
      if (langMode === "mm") return { primary: found.name_mm || found.name };
      if (langMode === "en") return { primary: found.name || found.name_mm || "" };
      return {
        primary: found.name,
        secondary: found.name_mm && found.name_mm !== found.name ? found.name_mm : undefined,
      };
    },
    [categories, langMode]
  );

  const locationText =
    storeProfile?.location ||
    storeProfile?.address ||
    storeProfile?.city ||
    null;

  const showWifi = Boolean(
    (storeProfile?.wifi_password?.trim() || storeProfile?.wifi_name?.trim()) &&
      storeProfile?.show_wifi !== false
  );

  return (
    <div className="min-h-screen bg-[#F5F7F4] text-[#1A2E26] font-serif selection:bg-[#E2E7DF] selection:text-[#1A2E26] antialiased">
      {/* ── TOP UTILITY STRIP ── */}
      <div className="sticky top-0 z-30 bg-[#F5F7F4]/90 backdrop-blur-md border-b border-[#E2E7DF]/70 px-4 py-2.5 transition-all">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Subtle Monogram / Brand mark */}
          <div className="flex items-center gap-2">
            <span className="text-[#8C7A4B] text-xs select-none">✦</span>
            <span className="text-[12px] uppercase tracking-[0.2em] font-sans font-semibold text-[#4A5D54]">
              MOSS Menu Studio
            </span>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLangToggle}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D5DDD2] bg-white/70 text-[#1A2E26] text-xs font-sans font-medium hover:bg-white hover:border-[#8C7A4B] transition-all shadow-xs"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#8C7A4B]" />
              <span>
                {langMode === "all" ? "EN / မြန်မာ" : langMode === "en" ? "EN Only" : "မြန်မာ"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── HEADER / ARCHIVE EMBLEM ── */}
      <header className="px-6 pt-10 pb-8 text-center max-w-2xl mx-auto">
        {/* Optional Logo */}
        {storeProfile?.logo_url && (
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D5DDD2] p-1 bg-white shadow-xs">
              <img
                src={storeProfile.logo_url}
                alt={restaurantName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}

        {/* Botanical Top Ornament */}
        <div className="flex items-center justify-center gap-3 text-[#8C7A4B] mb-2 select-none">
          <span className="h-px w-8 bg-[#8C7A4B]/40" />
          <span className="text-sm">✤</span>
          <span className="h-px w-8 bg-[#8C7A4B]/40" />
        </div>

        {/* Restaurant Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-[#1A2E26] leading-tight">
          {restaurantName}
        </h1>

        {/* Tagline / Description */}
        {storeProfile?.description ? (
          <p className="mt-2.5 text-xs sm:text-sm text-[#4A5D54] italic font-sans max-w-md mx-auto leading-relaxed">
            {storeProfile.description}
          </p>
        ) : (
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#4A5D54]/80 font-sans">
            Seasonal Gastronomy & Refreshments
          </p>
        )}

        {/* Metadata badges (WiFi, Phone, Location) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-sans text-xs text-[#4A5D54]">
          {locationText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-[#E2E7DF]">
              <MapPin className="w-3 h-3 text-[#8C7A4B]" />
              <span className="truncate max-w-[200px]">{locationText}</span>
            </span>
          )}

          {storeProfile?.social_phone && (
            <a
              href={`tel:${storeProfile.social_phone}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-[#E2E7DF] hover:border-[#8C7A4B] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#8C7A4B]" />
              <span>{storeProfile.social_phone}</span>
            </a>
          )}

          {showWifi && (
            <button
              type="button"
              onClick={() => setShowWifiModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-[#E2E7DF] hover:border-[#8C7A4B] transition-colors"
            >
              <Wifi className="w-3 h-3 text-[#8C7A4B]" />
              <span>Guest Wi-Fi</span>
            </button>
          )}
        </div>

        {/* Hairline Divider with Center Flourish */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[#8C7A4B]/60 select-none">
          <span className="h-px flex-1 bg-[#E2E7DF]" />
          <span className="text-xs">✦ ✤ ✦</span>
          <span className="h-px flex-1 bg-[#E2E7DF]" />
        </div>
      </header>

      {/* ── SEARCH INPUT ── */}
      <div className="px-4 mb-6 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5D54]/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or ingredients (e.g. Shan noodles, chicken)…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/70 border border-[#D5DDD2] text-sm font-sans text-[#1A2E26] placeholder-[#4A5D54]/60 focus:outline-none focus:ring-2 focus:ring-[#8C7A4B]/30 focus:border-[#8C7A4B] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#4A5D54] hover:text-[#1A2E26]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── SEARCH RESULTS (IF ACTIVE) ── */}
      {isSearching ? (
        <main className="px-4 pb-28 max-w-2xl mx-auto">
          <div className="mb-6 pb-2 border-b border-[#E2E7DF] flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-widest font-sans font-semibold text-[#4A5D54]">
              Search Results ({filteredItems.length})
            </h2>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-sans text-[#8C7A4B] hover:underline"
            >
              Clear search
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-[#4A5D54] font-sans">
              <Compass className="w-8 h-8 text-[#8C7A4B]/60 mx-auto mb-2" />
              <p className="text-sm">No dishes matched &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-[#4A5D54]/70 mt-1">Try another keyword or dish name.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredItems.map((item) => (
                <DishRow key={item.id} item={item} langMode={langMode} />
              ))}
            </div>
          )}
        </main>
      ) : (
        /* ── REGULAR CATEGORIZED MENU ── */
        <main className="px-4 pb-28 max-w-2xl mx-auto space-y-12">
          {groupedSections.map((section) => {
            const label = getCategoryLabel(section.category, section.categoryObj);
            return (
              <section
                key={section.category}
                ref={(el) => {
                  sectionRefs.current[section.category] = el;
                }}
                className="scroll-mt-20"
              >
                {/* Category Header with Editorial Flourish */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center gap-3">
                    <span className="text-[#8C7A4B] text-xs">✦</span>
                    <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-[#1A2E26]">
                      {label.primary}
                    </h2>
                    <span className="text-[#8C7A4B] text-xs">✦</span>
                  </div>

                  {label.secondary && (
                    <p className="text-xs text-[#4A5D54] font-sans mt-0.5">
                      {label.secondary}
                    </p>
                  )}
                  <div className="mt-2 w-12 h-px bg-[#8C7A4B]/50 mx-auto" />
                </div>

                {/* Items in this category */}
                <div className="divide-y divide-[#E2E7DF]/70">
                  {section.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <DishRow item={item} langMode={langMode} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      )}

      {/* ── FLOATING CATEGORY DOCK (Thumb Reachable) ── */}
      {!isSearching && groupedSections.length > 1 && (
        <aside
          ref={dockRef}
          aria-label="Category navigation"
          className="fixed bottom-4 inset-x-0 z-20 flex justify-center px-3 pointer-events-none"
        >
          <div className="pointer-events-auto bg-[#1A2E26]/95 backdrop-blur-md text-white rounded-full p-1.5 shadow-lg border border-[#2E4239] flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none">
            {groupedSections.map((sec) => {
              const label = getCategoryLabel(sec.category, sec.categoryObj);
              const isActive = activeCategory === sec.category;
              return (
                <button
                  key={sec.category}
                  type="button"
                  onClick={() => scrollToCategory(sec.category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#8C7A4B] text-white font-semibold shadow-xs"
                      : "text-[#D5DDD2] hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label.primary}
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* ── SCROLL TO TOP FLOATING BUTTON ── */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-20 p-2.5 rounded-full bg-white/90 border border-[#D5DDD2] text-[#1A2E26] shadow-md hover:bg-white transition-all active:scale-95"
          title="Scroll to top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#E2E7DF] py-10 px-4 text-center font-sans text-xs text-[#4A5D54] space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#8C7A4B] select-none">
          <span>✤</span>
        </div>
        <p className="font-serif italic text-sm text-[#1A2E26]">
          {restaurantName}
        </p>
        <p className="text-[11px] text-[#4A5D54]/70">
          Crafted with MOSS Text Theme • Editorial Digital Menu
        </p>
      </footer>

      {/* ── WI-FI MODAL ── */}
      {showWifiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-[#F5F7F4] border border-[#D5DDD2] rounded-2xl max-w-xs w-full p-6 shadow-xl relative text-center">
            <button
              onClick={() => setShowWifiModal(false)}
              className="absolute top-3.5 right-3.5 text-[#4A5D54] hover:text-[#1A2E26]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#E2E7DF] flex items-center justify-center mx-auto mb-3 text-[#8C7A4B]">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#1A2E26]">Guest Wi-Fi</h3>
            <div className="mt-4 bg-white/80 rounded-xl p-3 border border-[#E2E7DF] text-left text-xs space-y-2">
              <div>
                <span className="text-[#4A5D54] text-[10px] uppercase tracking-wider block">Network</span>
                <span className="font-semibold text-[#1A2E26]">{storeProfile?.wifi_name || "Available"}</span>
              </div>
              {storeProfile?.wifi_password && (
                <div>
                  <span className="text-[#4A5D54] text-[10px] uppercase tracking-wider block">Password</span>
                  <span className="font-mono font-semibold text-[#1A2E26] selection:bg-[#8C7A4B]/20">
                    {storeProfile.wifi_password}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowWifiModal(false)}
              className="mt-5 w-full py-2 rounded-xl bg-[#1A2E26] text-white text-xs font-semibold hover:bg-[#2E4239] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   SUB-COMPONENT: Dish Row with Dot Leaders & Editorial Flow
=========================================================== */
interface DishRowProps {
  item: TextThemeMenuItem;
  langMode: TextThemeLanguageMode;
}

function DishRow({ item, langMode }: DishRowProps) {
  const isAvailable = item.is_available !== false;

  // Name parsing
  const nameParsed = parseBilingual(item.name, item.name_mm);
  let primaryName = nameParsed.primary;
  let secondaryName = nameParsed.secondary;

  if (langMode === "mm") {
    primaryName = item.name_mm || item.name;
    secondaryName = undefined;
  } else if (langMode === "en") {
    primaryName = item.name;
    secondaryName = undefined;
  }

  // Description parsing
  const descParsed = parseBilingual(item.description, item.description_mm);
  let primaryDesc = descParsed.primary;
  let secondaryDesc = descParsed.secondary;

  if (langMode === "mm") {
    primaryDesc = item.description_mm || item.description || "";
    secondaryDesc = undefined;
  } else if (langMode === "en") {
    primaryDesc = item.description || "";
    secondaryDesc = undefined;
  }

  const isSoldOut = !isAvailable;

  return (
    <div
      className={`group transition-opacity duration-200 ${
        isSoldOut ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Top Line: Name + Dot Leader + Price */}
      <div className="flex items-baseline justify-between gap-2">
        {/* Dish Name */}
        <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
          <h3
            className={`text-[16px] sm:text-[17px] font-medium leading-snug tracking-tight text-[#1A2E26] ${
              isSoldOut ? "line-through decoration-[#4A5D54]/50" : ""
            }`}
          >
            {primaryName}
          </h3>

          {/* Micro badges for popular / spicy */}
          {item.is_popular && (
            <span
              className="inline-flex items-center text-[10px] text-[#8C7A4B] font-sans font-semibold tracking-wide uppercase"
              title="Chef Recommended"
            >
              ✦
            </span>
          )}
          {item.is_spicy && (
            <span className="text-[12px] select-none" title="Spicy">
              🌶️
            </span>
          )}
        </div>

        {/* Subtle Dotted Leader Line (hidden on very small screens, visible on tablet+) */}
        <div className="hidden sm:block flex-1 border-b border-dotted border-[#D5DDD2] mb-1.5 mx-2 select-none" />

        {/* Price or Sold Out */}
        <div className="shrink-0 text-right">
          {isSoldOut ? (
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#4A5D54] font-medium px-2 py-0.5 rounded-sm bg-[#E2E7DF]">
              Sold out
            </span>
          ) : (
            <span className="font-mono text-[14px] sm:text-[15px] font-semibold text-[#8C7A4B] tracking-tight whitespace-nowrap">
              {formatMMK(item.price)}
            </span>
          )}
        </div>
      </div>

      {/* Secondary Burmese Name (if bilingual mode) */}
      {secondaryName && secondaryName !== primaryName && (
        <p className="mt-0.5 text-xs text-[#4A5D54] font-sans leading-tight">
          {secondaryName}
        </p>
      )}

      {/* Dish Description & Ingredients */}
      {primaryDesc && (
        <p className="mt-1 text-[13px] text-[#4A5D54] font-sans italic leading-relaxed">
          {primaryDesc}
        </p>
      )}

      {/* Secondary Burmese Description */}
      {secondaryDesc && secondaryDesc !== primaryDesc && (
        <p className="mt-0.5 text-[12px] text-[#4A5D54]/80 font-sans leading-relaxed">
          {secondaryDesc}
        </p>
      )}
    </div>
  );
}
