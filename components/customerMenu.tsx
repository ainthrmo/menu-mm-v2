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
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
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

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function CustomerMenu() {
  const supabase = createClient();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [storeProfile, setStoreProfile] =
    useState<StoreProfile | null>(null);

  const [loading, setLoading] = useState(true);

  // Cart state
  const [cart, setCart] = useState<{ [id: string]: CartItem }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  // null = category selection screen
  // category name = menu items for that category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let targetRestaurantId: string | null = null;

      // 1. Check URL query string for restaurantId
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        targetRestaurantId = urlParams.get("restaurantId");
      }

      // 2. If no restaurantId in URL, check if an authenticated user is logged in
      if (!targetRestaurantId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: userRest } = await supabase
            .from("restaurants")
            .select("id")
            .eq("owner_id", user.id)
            .maybeSingle();

          if (userRest) {
            targetRestaurantId = userRest.id;
          }
        }
      }

      // 3. Fallback: If still no restaurantId, query the first restaurant dynamically from DB
      if (!targetRestaurantId) {
        const { data: firstRest } = await supabase
          .from("restaurants")
          .select("id")
          .limit(1)
          .maybeSingle();

        if (firstRest) {
          targetRestaurantId = firstRest.id;
        }
      }

      if (targetRestaurantId) {
        setCurrentRestaurantId(targetRestaurantId);
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

        const { data: profileData } = await supabase
          .from("store_profile")
          .select("*")
          .eq("restaurant_id", targetRestaurantId)
          .maybeSingle();

        if (profileData) {
          setStoreProfile(profileData);
        } else {
          const { data: restInfo } = await supabase
            .from("restaurants")
            .select("name")
            .eq("id", targetRestaurantId)
            .maybeSingle();

          if (restInfo) {
            setStoreProfile({ store_name: restInfo.name });
          }
        }

        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", targetRestaurantId)
          .order("name");

        if (catData) {
          setCategories(catData);
        }

        const { data: menuData } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", targetRestaurantId);

        if (menuData) {
          setMenuItems(
            menuData.filter((item) => item.is_available !== false)
          );
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const updateCart = (newCart: { [id: string]: CartItem }) => {
    setCart(newCart);
    if (currentRestaurantId && typeof window !== "undefined") {
      sessionStorage.setItem(`menu_cart_${currentRestaurantId}`, JSON.stringify(newCart));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const existing = cart[item.id];
    const newQty = existing ? existing.quantity + 1 : 1;
    const newCart = {
      ...cart,
      [item.id]: { item, quantity: newQty },
    };
    updateCart(newCart);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const existing = cart[itemId];
    if (!existing) return;

    const newQty = existing.quantity + delta;
    const newCart = { ...cart };

    if (newQty <= 0) {
      delete newCart[itemId];
    } else {
      newCart[itemId] = { ...existing, quantity: newQty };
    }

    updateCart(newCart);
  };

  const handleRemoveFromCart = (itemId: string) => {
    const newCart = { ...cart };
    delete newCart[itemId];
    updateCart(newCart);
  };

  const cartList = useMemo(() => Object.values(cart), [cart]);

  const totalCartItems = useMemo(
    () => cartList.reduce((sum, ci) => sum + ci.quantity, 0),
    [cartList]
  );

  const totalCartPrice = useMemo(
    () => cartList.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    [cartList]
  );

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

      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-8">
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
                        cartQuantity={cart[item.id]?.quantity || 0}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
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
                        cartQuantity={cart[item.id]?.quantity || 0}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
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

      {/* Floating Order Cart Bar */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 max-w-xl mx-auto">
          <div className="bg-[#171717] text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative bg-[#0B7A5F] p-2.5 rounded-xl text-white">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#CDF22B] text-[#171717] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#171717]">
                  {totalCartItems}
                </span>
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Your Order</p>
                <p className="text-sm font-bold text-white">{formatMMK(totalCartPrice)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-[#0B7A5F] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#09634d] transition-colors flex items-center gap-1.5"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Cart Sheet / Modal */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E5E5E5] p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0B7A5F]" />
                <h2 className="text-lg font-bold text-[#171717]">Your Order</h2>
                <span className="text-xs font-semibold text-[#737373] bg-[#F5F5F5] px-2 py-0.5 rounded-full">
                  {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5] text-[#737373] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {cartList.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 bg-[#F8F7F4] border border-[#E8E6E1] rounded-2xl"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#171717] truncate">{item.name}</h4>
                    <p className="text-xs text-[#737373] mt-0.5">
                      {formatMMK(item.price)} x {quantity} = <span className="font-bold text-[#0B7A5F]">{formatMMK(item.price * quantity)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-white border border-[#E5E5E5] rounded-xl px-2 py-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center text-[#171717]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#171717] min-w-[14px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded-lg bg-[#0B7A5F] text-white flex items-center justify-center hover:bg-[#09634d]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1.5 text-[#A3A3A3] hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-[#E5E5E5] pt-4 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#171717]">Total Price</span>
                <span className="text-lg font-bold text-[#0B7A5F]">{formatMMK(totalCartPrice)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#171717] text-[#FFFFFF] font-bold py-3 rounded-xl text-xs hover:bg-black transition-colors"
              >
                Close Cart
              </button>
            </div>
          </div>
        </div>
      )}

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

function MenuItemCard({
  item,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}: {
  item: MenuItem;
  cartQuantity: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}) {
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
        <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-sm font-bold leading-snug text-[#171717] sm:text-base">
              {item.name}
            </h3>

            {item.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#737373]">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F5F5F5]">
            <p className="text-sm font-bold text-[#0B7A5F]">
              {formatMMK(item.price)}
            </p>

            {cartQuantity > 0 ? (
              <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-full px-2 py-1 border border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#171717] hover:bg-[#E5E5E5] transition-colors shadow-2xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-[#171717] min-w-[16px] text-center">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded-full bg-[#0B7A5F] text-white flex items-center justify-center hover:bg-[#09634d] transition-colors shadow-2xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAddToCart(item)}
                className="inline-flex items-center gap-1.5 bg-[#0B7A5F] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#09634d] transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}