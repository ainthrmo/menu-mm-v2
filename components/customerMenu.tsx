"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  Search,
  UtensilsCrossed,
  ArrowLeft,
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

interface StoreProfile {
  [key: string]: string | null | undefined;
}

export default function CustomerMenu() {
  const supabase = createClient();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [storeProfile, setStoreProfile] =
    useState<StoreProfile | null>(null);

  const [loading, setLoading] = useState(true);

  // null = category selection screen
  // category name = menu items for that category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

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
        setMenuItems(
          data.filter((item) => item.is_available !== false)
        );
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const isSearching = searchQuery.trim().length > 0;

  /*
   * Build category sections.
   *
   * Category order comes from the categories table.
   * If no categories exist, we fall back to the category
   * names stored directly on menu items.
   */
  const groupedSections = useMemo(() => {
    const categoryNames = categories.map((category) => category.name);

    const orderedNames =
      categoryNames.length > 0
        ? categoryNames
        : [...new Set(menuItems.map((item) => item.category))];

    return orderedNames
      .map((name) => {
        const items = menuItems.filter(
          (item) => item.category === name
        );

        /*
         * Automatically use the first menu item that
         * actually has an image as the category image.
         */
        const coverItem = items.find(
          (item) => item.image && item.image.trim().length > 0
        );

        return {
          name,
          items,
          coverImage: coverItem?.image ?? null,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [categories, menuItems]);

  /*
   * Search results.
   *
   * Search stays available from the category screen.
   * When searching, categories are not needed.
   */
  const searchResults = useMemo(() => {
    if (!isSearching) return [];

    const q = searchQuery.toLowerCase();

    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description &&
          item.description.toLowerCase().includes(q))
    );
  }, [menuItems, searchQuery, isSearching]);

  const selectedSection = useMemo(() => {
    if (!selectedCategory) return null;

    return (
      groupedSections.find(
        (section) => section.name === selectedCategory
      ) ?? null
    );
  }, [groupedSections, selectedCategory]);

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery("");
    setSelectedCategory(categoryName);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    setSelectedCategory(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const restaurantName =
    storeProfile?.store_name || "Our Menu";

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717] font-sans">
      {/* =====================================================
          RESTAURANT HEADER
      ====================================================== */}

      <header className="relative">
        {/* Cover */}
        <div className="relative h-44 w-full overflow-hidden bg-[#E7E3DB] sm:h-56">
          {storeProfile?.cover_url || storeProfile?.image ? (
            <img
              src={
                storeProfile.cover_url ||
                storeProfile.image ||
                ""
              }
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#E9E5DD] to-[#D8D2C7]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Restaurant profile */}
        <div className="relative mx-auto -mt-12 w-full max-w-xl px-4">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-4">
              {/* Logo */}
              {storeProfile?.logo_url ? (
                <div className="-mt-10 h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md sm:h-[72px] sm:w-[72px]">
                  <img
                    src={storeProfile.logo_url}
                    alt={`${restaurantName} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="-mt-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#0B7A5F] text-xl font-bold text-white shadow-md sm:h-[72px] sm:w-[72px]">
                  {restaurantName.charAt(0)}
                </div>
              )}

              <div className="min-w-0 flex-1 pt-0.5">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-[#171717] sm:text-2xl">
                  {restaurantName}
                </h1>

                {storeProfile?.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#737373] sm:text-sm">
                    {storeProfile.description}
                  </p>
                )}
              </div>
            </div>

            {/* Social / contact */}
            {(storeProfile?.social_phone ||
              storeProfile?.social_facebook ||
              storeProfile?.social_instagram ||
              storeProfile?.social_tiktok ||
              storeProfile?.social_messenger) && (
              <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-[#EEEEEE] pt-4">
                {storeProfile.social_phone && (
                  <a
                    href={`tel:${storeProfile.social_phone}`}
                    aria-label="Call restaurant"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#525252] transition-all hover:-translate-y-0.5 hover:border-[#0B7A5F] hover:text-[#0B7A5F]"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}

                {storeProfile.social_facebook && (
                  <a
                    href={storeProfile.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#525252] transition-all hover:-translate-y-0.5 hover:border-[#0B7A5F] hover:text-[#0B7A5F]"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}

                {storeProfile.social_instagram && (
                  <a
                    href={storeProfile.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#525252] transition-all hover:-translate-y-0.5 hover:border-[#0B7A5F] hover:text-[#0B7A5F]"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}

                {storeProfile.social_tiktok && (
                  <a
                    href={storeProfile.social_tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#525252] transition-all hover:-translate-y-0.5 hover:border-[#0B7A5F] hover:text-[#0B7A5F]"
                  >
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.6a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.06z" />
                    </svg>
                  </a>
                )}

                {storeProfile.social_messenger && (
                  <a
                    href={storeProfile.social_messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Messenger"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#525252] transition-all hover:-translate-y-0.5 hover:border-[#0B7A5F] hover:text-[#0B7A5F]"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto w-full max-w-xl px-4 pb-20 pt-8">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#0B7A5F]" />
          </div>
        ) : (
          <>
            {/* =================================================
                SEARCH
            ================================================== */}

            <div className="relative mb-8">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3]"
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search menu..."
                aria-label="Search menu"
                className="h-12 w-full rounded-2xl border border-[#E5E5E5] bg-white pl-11 pr-4 text-sm text-[#171717] outline-none transition-all placeholder:text-[#A3A3A3] focus:border-[#0B7A5F] focus:ring-4 focus:ring-[#0B7A5F]/10"
              />
            </div>

            {/* =================================================
                SEARCH RESULTS
            ================================================== */}

            {isSearching ? (
              <section aria-label="Search results">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0B7A5F]">
                    Search results
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#171717]">
                    {searchResults.length}{" "}
                    {searchResults.length === 1
                      ? "item"
                      : "items"}
                  </h2>
                </div>

                {searchResults.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#D9D9D9] bg-white px-6 py-12 text-center">
                    <p className="text-sm font-medium text-[#525252]">
                      No menu items found
                    </p>

                    <p className="mt-1 text-xs text-[#A3A3A3]">
                      Try searching for another dish.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : selectedCategory === null ? (
              /* =================================================
                 CATEGORY SELECTION
              ================================================== */

              <section aria-labelledby="menu-heading">
                <div className="mb-7 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B7A5F]">
                    Explore
                  </p>

                  <h2
                    id="menu-heading"
                    className="mt-2 text-3xl font-bold tracking-tight text-[#171717]"
                  >
                    Our Menu
                  </h2>

                  <p className="mt-2 text-sm text-[#737373]">
                    Choose a category to explore
                  </p>
                </div>

                <div className="space-y-4">
                  {groupedSections.map((section, index) => (
                    <button
                      key={section.name}
                      type="button"
                      onClick={() =>
                        handleCategoryClick(section.name)
                      }
                      className="group relative block aspect-[1.45/1] w-full overflow-hidden rounded-[28px] bg-[#D9D5CC] text-left shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-[0.985] sm:hover:-translate-y-1 sm:hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      {section.coverImage ? (
                        <img
                          src={section.coverImage}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E5E1D8] to-[#CBC5B9]">
                          <UtensilsCrossed className="h-10 w-10 text-[#AAA398]" />
                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />

                      {/* Category content */}
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                          {section.items.length}{" "}
                          {section.items.length === 1
                            ? "item"
                            : "items"}
                        </p>

                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                          {section.name}
                        </h3>

                        <div className="mt-3 flex items-center text-xs font-semibold text-white/80 transition-transform duration-300 group-hover:translate-x-1">
                          View menu
                          <span
                            className="ml-1.5"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {groupedSections.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-[#D9D9D9] bg-white px-6 py-12 text-center">
                    <UtensilsCrossed className="mx-auto h-8 w-8 text-[#B5B0A7]" />

                    <p className="mt-4 text-sm font-medium text-[#525252]">
                      Menu coming soon
                    </p>
                  </div>
                )}
              </section>
            ) : (
              /* =================================================
                 SELECTED CATEGORY
              ================================================== */

              <section
                aria-labelledby="category-heading"
                className="animate-[fadeIn_250ms_ease-out]"
              >
                {/* Back */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-7 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#525252] shadow-sm transition-all hover:border-[#0B7A5F] hover:text-[#0B7A5F] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7A5F]"
                >
                  <ArrowLeft
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  All categories
                </button>

                {/* Category heading */}
                <div className="mb-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0B7A5F]">
                    Menu
                  </p>

                  <h2
                    id="category-heading"
                    className="mt-2 text-3xl font-bold tracking-tight text-[#171717]"
                  >
                    {selectedSection?.name}
                  </h2>

                  <p className="mt-2 text-sm text-[#737373]">
                    {selectedSection?.items.length ?? 0}{" "}
                    {selectedSection?.items.length === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                {/* Menu items */}
                {selectedSection &&
                selectedSection.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSection.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#D9D9D9] bg-white px-6 py-12 text-center">
                    <p className="text-sm text-[#737373]">
                      No items available in this category.
                    </p>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="mx-auto max-w-xl border-t border-[#E8E6E1] px-4 pb-8 pt-6 text-center">
        <p className="text-[10px] font-medium tracking-wide text-[#A3A3A3]">
          POWERED BY{" "}
          <span className="text-[#0B7A5F]">MEE NHUU</span>
        </p>
      </footer>

      {/* Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ===========================================================
   MENU ITEM CARD
=========================================================== */

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#E8E6E1] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="flex min-h-[112px]">
        {/* Image */}
        <div className="relative w-[112px] shrink-0 overflow-hidden bg-[#E9E5DD] sm:w-32">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full min-h-[112px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full min-h-[112px] items-center justify-center"
              aria-hidden="true"
            >
              <UtensilsCrossed className="h-6 w-6 text-[#B0AAA0]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
          <h3 className="text-sm font-bold leading-snug text-[#171717] sm:text-base">
            {item.name}
          </h3>

          {item.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#737373]">
              {item.description}
            </p>
          )}

          <p className="mt-2 text-sm font-bold text-[#0B7A5F]">
            {formatMMK(item.price)}
          </p>
        </div>
      </div>
    </article>
  );
}