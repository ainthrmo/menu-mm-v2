"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Loader2,
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  Search,
  UtensilsCrossed,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMMK } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  is_available?: boolean;
}

function categorySlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function CustomerMenu() {
  const supabase = createClient();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [storeProfile, setStoreProfile] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("store_profile")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();

      if (profileData) {
        setStoreProfile(profileData);
      }

      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (catData) {
        setCategories(catData);
      }

      const { data } = await supabase.from("menu_items").select("*");
      if (data) {
        setMenuItems(data.filter((item) => item.is_available !== false));
      }

      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const isSearching = searchQuery.trim().length > 0;

  const filteredItems = useMemo(() => {
    if (!isSearching) return menuItems;
    const q = searchQuery.toLowerCase();
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [menuItems, searchQuery, isSearching]);

  const groupedSections = useMemo(() => {
    const categoryNames = categories.map((c) => c.name);
    const orderedNames =
      categoryNames.length > 0
        ? categoryNames
        : [...new Set(menuItems.map((i) => i.category))];

    return orderedNames
      .map((name) => ({
        name,
        items: menuItems.filter((item) => item.category === name),
      }))
      .filter((section) => section.items.length > 0);
  }, [categories, menuItems]);

  const visibleSections = useMemo(() => {
    if (!isSearching) return groupedSections;
    const q = searchQuery.toLowerCase();
    return groupedSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q))
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [groupedSections, isSearching, searchQuery]);

  useEffect(() => {
    if (visibleSections.length > 0 && !activeCategory) {
      setActiveCategory(visibleSections[0].name);
    }
  }, [visibleSections, activeCategory]);

  useEffect(() => {
    if (isSearching || visibleSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-category");
          if (id) setActiveCategory(id);
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );

    visibleSections.forEach((section) => {
      const el = sectionRefs.current[section.name];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleSections, isSearching]);

  const scrollToCategory = useCallback((name: string) => {
    const el = sectionRefs.current[name];
    if (!el) return;

    setActiveCategory(name);
    isScrollingRef.current = true;

    const navHeight = navRef.current?.offsetHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-[#E5E5E5] font-sans selection:bg-[#0B7A5F] selection:text-white pb-24">
      {/* Cover */}
      <div className="relative w-full h-44 sm:h-56 bg-[#262626] overflow-hidden">
        {storeProfile?.cover_url || storeProfile?.image ? (
          <img
            src={storeProfile.cover_url || storeProfile.image}
            alt=""
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-black/30" />
      </div>

      {/* Restaurant header */}
      <div className="max-w-xl mx-auto px-4 relative -mt-10 mb-6">
        <div className="bg-[#1C1C1C] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl">
          <div className="flex items-start gap-4">
            {storeProfile?.logo_url ? (
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl border-2 border-[#2a2a2a] bg-[#222] overflow-hidden shrink-0 shadow-lg -mt-10">
                <img
                  src={storeProfile.logo_url}
                  alt={`${storeProfile.store_name || "Restaurant"} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl border-2 border-[#2a2a2a] bg-[#0B7A5F] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg -mt-10">
                {(storeProfile?.store_name || "R").charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {storeProfile?.store_name || "Our Menu"}
              </h1>
              {storeProfile?.description && (
                <p className="text-xs text-[#A3A3A3] leading-relaxed mt-1 line-clamp-2">
                  {storeProfile.description}
                </p>
              )}
            </div>
          </div>

          {/* Social links */}
          {(storeProfile?.social_phone ||
            storeProfile?.social_facebook ||
            storeProfile?.social_instagram ||
            storeProfile?.social_tiktok ||
            storeProfile?.social_messenger) && (
            <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-4 border-t border-[#2a2a2a]">
              {storeProfile?.social_phone && (
                <a
                  href={`tel:${storeProfile.social_phone}`}
                  className="flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white transition-colors bg-[#252525] px-3 py-2 rounded-full border border-[#333] min-h-[36px]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0B7A5F]" aria-hidden="true" />
                  <span>{storeProfile.social_phone}</span>
                </a>
              )}

              {storeProfile?.social_facebook && (
                <a
                  href={storeProfile.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#252525] border border-[#333] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#0B7A5F] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {storeProfile?.social_instagram && (
                <a
                  href={storeProfile.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#252525] border border-[#333] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#0B7A5F] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {storeProfile?.social_tiktok && (
                <a
                  href={storeProfile.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#252525] border border-[#333] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#0B7A5F] transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.6a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.06z" />
                  </svg>
                </a>
              )}

              {storeProfile?.social_messenger && (
                <a
                  href={storeProfile.social_messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#252525] border border-[#333] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#0B7A5F] transition-colors"
                  aria-label="Messenger"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky category navigation */}
      {!loading && visibleSections.length > 1 && !isSearching && (
        <div
          ref={navRef}
          className="sticky top-0 z-20 bg-[#141414]/95 backdrop-blur-md border-b border-[#262626]"
        >
          <div
            className="max-w-xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="Menu categories"
          >
            {visibleSections.map((section) => (
              <button
                key={section.name}
                role="tab"
                aria-selected={activeCategory === section.name}
                onClick={() => scrollToCategory(section.name)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] ${
                  activeCategory === section.name
                    ? "bg-[#0B7A5F] text-white shadow-sm"
                    : "bg-[#252525] text-[#A3A3A3] hover:text-white border border-[#333]"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-xl mx-auto px-4 py-4">
        <label htmlFor="menu-search" className="sr-only">
          Search menu
        </label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]"
            aria-hidden="true"
          />
          <input
            id="menu-search"
            type="search"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#212121] border border-[#333333] rounded-full py-3 pl-11 pr-4 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#0B7A5F] focus:ring-1 focus:ring-[#0B7A5F] transition-colors min-h-[44px]"
          />
        </div>
      </div>

      {/* Menu content */}
      <main className="max-w-xl mx-auto px-4">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-sm text-[#737373]">
            <Loader2 className="w-6 h-6 animate-spin text-[#0B7A5F]" aria-hidden="true" />
            <span>Loading menu...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <UtensilsCrossed className="w-10 h-10 mx-auto text-[#404040]" aria-hidden="true" />
            <p className="text-sm font-medium text-[#A3A3A3]">
              {isSearching ? "No dishes match your search" : "No menu items available"}
            </p>
            {isSearching && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#0B7A5F] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F] rounded"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {visibleSections.map((section) => (
              <section
                key={section.name}
                ref={(el) => {
                  sectionRefs.current[section.name] = el;
                }}
                data-category={section.name}
                aria-labelledby={`heading-${categorySlug(section.name)}`}
              >
                <h2
                  id={`heading-${categorySlug(section.name)}`}
                  className="text-sm font-bold uppercase tracking-wider text-[#737373] mb-3 px-0.5"
                >
                  {section.name}
                  <span className="ml-2 text-[#525252] font-normal normal-case tracking-normal">
                    {section.items.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="bg-[#1C1C1C] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#404040] transition-colors"
                    >
                      <div className="flex items-stretch">
                        {item.image ? (
                          <div className="w-[88px] sm:w-24 shrink-0 bg-[#2A2A2A]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full min-h-[88px] object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-[88px] sm:w-24 shrink-0 min-h-[88px] bg-[#2A2A2A] flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <UtensilsCrossed className="w-5 h-5 text-[#525252]" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-center">
                          <h3 className="font-semibold text-sm sm:text-base text-white leading-snug">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-[#A3A3A3] line-clamp-2 mt-0.5 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm font-bold text-[#0B7A5F] mt-2">
                            {formatMMK(item.price)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-xl mx-auto px-4 mt-12 text-center border-t border-[#262626] pt-6 pb-4">
        <p className="text-[10px] text-[#525252]">Powered by Mee Nhuu</p>
      </footer>
    </div>
  );
}
