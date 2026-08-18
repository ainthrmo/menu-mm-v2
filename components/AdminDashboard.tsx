"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Trash2,
  Upload,
  X,
  Loader2,
  Edit3,
  FolderPlus,
  Settings,
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  CheckCircle2,
  QrCode,
  ExternalLink,
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  Copy,
  Download,
  LogOut,
  Lock,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMMK } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { getRestaurantSubscription, DEFAULT_FREE_PLAN, Plan, Subscription } from "@/lib/subscription";

const MENUU_VIBER_URL =
  process.env.NEXT_PUBLIC_MENUU_VIBER_URL || "https://viber.click/placeholder-menuu-qr";
const MENUU_FB_PAGE_URL =
  process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL || "https://facebook.com/placeholder-menuu-qr";


export interface AdminMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  is_available: boolean;
  image: string;
  description?: string;
  is_popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

type DashboardSection = "menu" | "qr";

export const AdminDashboard: React.FC = () => {
  const supabase = createClient();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<DashboardSection>("menu");
  const [profileError, setProfileError] = useState(false);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Store Profile & Plan State
  const [storeName, setStoreName] = useState("My Restaurant");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [storeProfile, setStoreProfile] = useState<any>(null);
  const [storePlan, setStorePlan] = useState<string>("Free");
  const [plan, setPlan] = useState<Plan>(DEFAULT_FREE_PLAN);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Social & Contact State
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialMessenger, setSocialMessenger] = useState("");
  const [socialPhone, setSocialPhone] = useState("");

  // Modals state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = React.useRef<HTMLCanvasElement | null>(null);

  const isFreePlan = storePlan.toLowerCase() === "free" || (plan?.id ? plan.id.toLowerCase() === "free" : false);
  
  // Restaurant Ownership & Error State
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Dish Form State
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemIsPopular, setNewItemIsPopular] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setProfileError(false);

    let activeRestaurantId = "";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Session expired or auth failed on the client — redirect to login
      router.push("/auth/login");
      return;
    }

    // 1. Find restaurant owned by current authenticated user
    const { data: userRest } = await supabase
      .from("restaurants")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (userRest) {
      activeRestaurantId = userRest.id;
      setStoreName(userRest.name || "My Restaurant");
    } else {
      // Redirect user to onboarding flow if no restaurant owned yet
      router.push("/protected/onboarding");
      return;
    }

    setRestaurantId(activeRestaurantId);

    // Fetch multi-tenant subscription for the active restaurant
    const { subscription: sub, plan: currentPlan } = await getRestaurantSubscription(
      supabase,
      activeRestaurantId
    );
    setSubscription(sub);
    setPlan(currentPlan);
    setStorePlan(currentPlan.name);

    const { data: profileData, error: profileFetchError } = await supabase
      .from("store_profile")
      .select("*")
      .eq("restaurant_id", activeRestaurantId)
      .maybeSingle();

    if (profileFetchError || !profileData) {
      setProfileError(true);
    } else {
      if (profileData.store_name) {
        setStoreName(profileData.store_name);
      }
      setLogoUrl(profileData.logo_url || null);
      setStoreProfile(profileData);
      if (!sub) {
        setStorePlan(profileData.subscription_plan || "Free");
      }
      
      setSocialFacebook(profileData.social_facebook || "");
      setSocialInstagram(profileData.social_instagram || "");
      setSocialTiktok(profileData.social_tiktok || "");
      setSocialMessenger(profileData.social_messenger || "");
      setSocialPhone(profileData.social_phone || "");
    }

    const { data: catData, error: catFetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", activeRestaurantId)
      .order("name");

    if (catFetchError) {
      console.error("CATEGORIES FETCH ERROR:", {
        message: catFetchError.message,
        details: catFetchError.details,
        hint: catFetchError.hint,
        code: catFetchError.code,
      });
    } else if (catData) {
      setCategories(catData);
      if (catData.length > 0) {
        setNewItemCategory(catData[0].name);
      }
    }

    const { data: menuData, error: menuFetchError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", activeRestaurantId)
      .order("created_at", { ascending: false });

    if (menuFetchError) {
      console.error("MENU FETCH ERROR:", {
        message: menuFetchError.message,
        details: menuFetchError.details,
        hint: menuFetchError.hint,
        code: menuFetchError.code,
      });
    } else if (menuData) {
      setMenuItems(menuData);
    }

    setLoading(false);
  };

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu${restaurantId ? `?restaurantId=${restaurantId}` : ""}`
      : "";

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleCopyMenuUrl = async () => {
    if (!menuUrl) return;
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy menu URL:", error);
    }
  };

  const handleDownloadQr = () => {
    const qrCanvas = qrRef.current;
    if (!qrCanvas) return;
  
    const padding = 80;
    const logoSize = 110;
    const textArea = 110;
    const exportCanvas = document.createElement("canvas");
  
    exportCanvas.width = qrCanvas.width + padding * 2;
    exportCanvas.height = qrCanvas.height + padding * 2 + textArea;
  
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
  
    const currentCtx = ctx;
    const currentQrCanvas = qrCanvas;

    currentCtx.fillStyle = "#FFFFFF";
    currentCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    currentCtx.drawImage(currentQrCanvas, padding, padding);

    function drawExportText() {
      const centerX = exportCanvas.width / 2;
      currentCtx.textAlign = "center";
      currentCtx.fillStyle = "#111111";
      currentCtx.font = "bold 32px Arial";
      currentCtx.fillText(storeName, centerX, currentQrCanvas.height + padding + 55);

      currentCtx.fillStyle = "#666666";
      currentCtx.font = "20px Arial";
      currentCtx.fillText("Scan to view menu", centerX, currentQrCanvas.height + padding + 88);

      const url = exportCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${storeName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`;
      link.href = url;
      link.click();
    }

    if (logoUrl) {
      const logo = new Image();
      logo.onload = () => {
        const logoX = (exportCanvas.width - logoSize) / 2;
        const logoY = padding + (currentQrCanvas.height - logoSize) / 2;
        
        currentCtx.fillStyle = "#FFFFFF";
        currentCtx.beginPath();
        currentCtx.roundRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20, 18);
        currentCtx.fill();

        currentCtx.save();
        currentCtx.beginPath();
        currentCtx.roundRect(logoX, logoY, logoSize, logoSize, 14);
        currentCtx.clip();
        currentCtx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        currentCtx.restore();

        drawExportText();
      };
      logo.onerror = () => {
        drawExportText();
      };
      logo.crossOrigin = "anonymous";
      logo.src = logoUrl;
    } else {
      drawExportText();
    }
  };

  const availableCount = menuItems.filter((i) => i.is_available).length;

  const handleOpenAddDishModal = () => {
    setEditingItem(null);
    setNewItemName("");
    if (categories.length > 0) setNewItemCategory(categories[0].name);
    setNewItemPrice("");
    setNewItemDescription("");
    setNewItemIsPopular(false);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setIsDishModalOpen(true);
  };

  const handleOpenEditDishModal = (item: AdminMenuItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemCategory(item.category);
    setNewItemPrice(item.price.toString());
    setNewItemDescription(item.description || "");
    setNewItemIsPopular(Boolean(item.is_popular));
    setImageFile(null);
    setImagePreview(item.image);
    setFormError(null);
    setIsDishModalOpen(true);
  };

  const handleSaveStoreProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let updatedLogo = logoUrl;

    if (logoFile) {
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, logoFile, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("STORE LOGO UPLOAD ERROR:", {
          message: uploadError?.message,
          details: (uploadError as any)?.details,
          hint: (uploadError as any)?.hint,
          code: (uploadError as any)?.code,
        });
        alert("Logo upload failed: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        updatedLogo = publicUrlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("store_profile")
      .update({
        store_name: storeName,
        logo_url: updatedLogo,
        social_facebook: socialFacebook.trim() || null,
        social_instagram: socialInstagram.trim() || null,
        social_tiktok: socialTiktok.trim() || null,
        social_messenger: socialMessenger.trim() || null,
        social_phone: socialPhone.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("restaurant_id", restaurantId);

    if (restaurantId) {
      await supabase
        .from("restaurants")
        .update({ name: storeName })
        .eq("id", restaurantId);
    }

    if (error) {
      console.error("STORE PROFILE UPDATE ERROR:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      alert("Failed to update store settings: " + error.message);
    } else {
      setLogoUrl(updatedLogo);
      setIsSettingsOpen(false);
      alert("Store Profile and Social Links updated successfully!");
    }
    setSubmitting(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSubmitting(true);
    setCategoryError(null);

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: newCategoryName.trim(),
          restaurant_id: restaurantId,
        },
      ])
      .select();

    if (error) {
      console.error("CATEGORY INSERT ERROR:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      setCategoryError(error.message || "Failed to add category.");
    } else if (data && data.length > 0) {
      setCategories([...categories, data[0]]);
      setNewCategoryName("");
    }
    setSubmitting(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      console.error("CATEGORY DELETE ERROR:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      alert("Failed to delete category: " + error.message);
    }
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    setFormError(null);

    // Subscription Limit Check for new menu items
    if (!editingItem) {
      try {
        const { plan: currentPlan } = await getRestaurantSubscription(supabase, restaurantId);
        const activePlan = currentPlan || plan;
        const allowedLimit = activePlan?.max_menu_items ?? 20;

        const { count, error: countError } = await supabase
          .from("menu_items")
          .select("*", { count: "exact", head: true })
          .eq("restaurant_id", restaurantId);

        const currentItemCount = countError || count === null ? menuItems.length : count;

        if (currentItemCount >= allowedLimit) {
          setIsDishModalOpen(false);
          const isFree =
            activePlan?.id?.toLowerCase() === "free" ||
            activePlan?.name?.toLowerCase() === "free" ||
            isFreePlan;

          if (isFree) {
            setShowUpgradeModal(true);
          }
          return;
        }
      } catch (err) {
        console.warn("Failed to verify menu item limit:", err);
        const allowedLimit = plan?.max_menu_items ?? 20;
        if (menuItems.length >= allowedLimit) {
          setIsDishModalOpen(false);
          if (isFreePlan) {
            setShowUpgradeModal(true);
          }
          return;
        }
      }
    }

    setSubmitting(true);
    let imageUrl = editingItem ? editingItem.image : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("DISH IMAGE UPLOAD ERROR:", {
          message: uploadError?.message,
          details: (uploadError as any)?.details,
          hint: (uploadError as any)?.hint,
          code: (uploadError as any)?.code,
        });
        setFormError(`Image upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) imageUrl = publicUrlData.publicUrl;
    }

    const dishPayload = {
      name: newItemName,
      category: newItemCategory,
      price: parseFloat(newItemPrice),
      image: imageUrl,
      description: isFreePlan ? null : (newItemDescription.trim() || null),
      is_popular: isFreePlan ? false : newItemIsPopular,
    };

    if (editingItem) {
      const { data, error } = await supabase
        .from("menu_items")
        .update(dishPayload)
        .eq("id", editingItem.id)
        .select();

      if (error) {
        console.error("MENU UPDATE ERROR:", {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
        });
        setFormError(error.message || "Failed to update menu item.");
      } else if (data && data.length > 0) {
        setMenuItems(menuItems.map((i) => (i.id === editingItem.id ? data[0] : i)));
        setIsDishModalOpen(false);
      }
    } else {
      const { data, error } = await supabase
        .from("menu_items")
        .insert([
          {
            ...dishPayload,
            is_available: true,
            restaurant_id: restaurantId,
          },
        ])
        .select();

      if (error) {
        console.error("MENU INSERT ERROR:", {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
        });
        setFormError(error.message || "Failed to insert menu item into database.");
      } else if (data && data.length > 0) {
        setMenuItems([data[0], ...menuItems]);
        setIsDishModalOpen(false);
      }
    }

    setSubmitting(false);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("MENU AVAILABILITY TOGGLE ERROR:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      alert("Failed to toggle availability: " + error.message);
    } else {
      setMenuItems(menuItems.map((item) => item.id === id ? { ...item, is_available: !currentStatus } : item));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      console.error("MENU DELETE ERROR:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      alert("Failed to delete dish: " + error.message);
    } else {
      setMenuItems(menuItems.filter((i) => i.id !== id));
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 sticky top-0 md:h-screen z-30">
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-2xl object-cover border border-[#E5E5E5] shadow-xs" />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-[#1E45FB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {storeName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold text-[#111111] tracking-tight">{storeName}</h1>
                <p className="text-[11px] text-[#666666] font-medium">Menuu Admin</p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="md:hidden p-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-[#111111]"
              title="Edit Restaurant"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <nav className="hidden md:flex flex-col space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-[#888888]">Overview</div>
            <button
              onClick={() => setActiveSection("menu")}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left w-full ${
                activeSection === "menu"
                  ? "bg-[#1E45FB]/10 text-[#1E45FB]"
                  : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Menu Dashboard
            </button>
            <button
              onClick={() => setActiveSection("qr")}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left w-full ${
                activeSection === "qr"
                  ? "bg-[#1E45FB]/10 text-[#1E45FB] font-semibold"
                  : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
            >
              <QrCode className="w-4 h-4" /> QR Code
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors text-left w-full"
            >
              <FolderPlus className="w-4 h-4" /> Manage Categories
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors text-left w-full"
            >
              <Store className="w-4 h-4" /> Store Settings
            </button>
          </nav>
        </div>

        <div className="hidden md:block p-5 border-t border-[#E5E5E5] bg-[#F5F5F5]/60 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#666666] font-medium">Subscription</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1E45FB]/10 text-[#1E45FB] uppercase">
                {storePlan} Plan
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#111111] mt-2">
              <span>Menu Items</span>
              <span className="bg-[#CDF22B] text-[#111111] px-2 py-0.5 rounded-md font-bold">
                {menuItems.length} / {plan.max_menu_items >= 2000000000 ? 'Unlimited' : plan.max_menu_items}
              </span>
            </div>
          </div>
          {isFreePlan && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full bg-[#1E45FB] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-[#1737C9] transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Upgrade to Pro
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-28 md:pb-8">
        {activeSection === "menu" ? (
          <>
                <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CDF22B] text-[#111111] border border-[#CDF22B]">
          <CheckCircle2 className="w-3 h-3 text-[#111111]" /> Published Menu
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1E45FB]/10 text-[#1E45FB] uppercase">
          {storePlan} Plan
        </span>
      </div>
          
      {/* Total Menu Items, Active Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div className="bg-white border border-[#E5E5E5] p-4 rounded-2xl shadow-xs">
                <p className="text-[11px] font-medium text-[#666666]">Total Menu Items</p>
                <p className="text-xl font-bold text-[#111111] mt-1">{menuItems.length}</p>
              </div>
              <div className="bg-white border border-[#E5E5E5] p-4 rounded-2xl shadow-xs">
                <p className="text-[11px] font-medium text-[#666666]">Active Categories</p>
                <p className="text-xl font-bold text-[#111111] mt-1">{categories.length}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white border border-[#E5E5E5] p-4 rounded-2xl shadow-xs">
                <p className="text-[11px] font-medium text-[#666666]">Visible on Menu</p>
                <p className="text-xl font-bold text-[#1E45FB] mt-1">{availableCount} <span className="text-xs font-normal text-[#666666]">items</span></p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-4 rounded-2xl shadow-xs">
             <p className="text-[11px] font-medium text-[#666666]">Current Subscription</p>
            <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#1E45FB] uppercase">{storePlan}</p>
            <span className="text-xs text-[#666666]">
            {menuItems.length} / {plan.max_menu_items >= 2000000000 ? 'Unlimited' : plan.max_menu_items} items
            </span>
          </div>
          </div>
            <div className="bg-white border border-[#E5E5E5] p-4 rounded-3xl space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56 md:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <input
                      type="text"
                      placeholder="Search dishes or drinks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#1E45FB]"
                    />
                  </div>
                  <button
                    onClick={handleOpenAddDishModal}
                    className="sm:hidden inline-flex items-center justify-center gap-1.5 bg-[#1E45FB] text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#1737C9] transition-all shrink-0 shadow-xs min-h-[40px]"
                  >
                    <Plus className="w-4 h-4" /> Add Dish
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedCategoryFilter("All")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === "All"
                        ? "bg-[#111111] text-white"
                        : "bg-[#F5F5F5] text-[#666666] hover:text-[#111111]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.name)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategoryFilter === cat.name
                          ? "bg-[#111111] text-white"
                          : "bg-[#F5F5F5] text-[#666666] hover:text-[#111111]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleOpenAddDishModal}
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 bg-[#1E45FB] text-white px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#1737C9] transition-all shrink-0 shadow-xs min-h-[40px]"
                >
                  <Plus className="w-4 h-4" /> Add Dish
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-[#666666] flex items-center justify-center gap-2 bg-white border border-[#E5E5E5] rounded-3xl">
                <Loader2 className="w-5 h-5 animate-spin text-[#1E45FB]" /> Loading menu items...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-white border border-[#E5E5E5] rounded-3xl space-y-3 px-6">
                <UtensilsCrossed className="w-8 h-8 mx-auto text-[#888888]" aria-hidden="true" />
                <p className="text-xs font-semibold text-[#111111]">
                  {menuItems.length === 0 ? "Your menu is empty" : "No menu items found"}
                </p>
                <p className="text-[11px] text-[#666666]">
                  {menuItems.length === 0
                    ? "Add your first dish to get started."
                    : "Try adjusting your search or category filter."}
                </p>
                {menuItems.length === 0 && (
                  <button
                    onClick={handleOpenAddDishModal}
                    className="inline-flex items-center gap-2 bg-[#1E45FB] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1737C9] transition-all mt-2 min-h-[40px]"
                  >
                    <Plus className="w-4 h-4" /> Add your first item
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs hover:border-[#1E45FB]/30 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-stretch">
                      <div className="relative w-24 sm:w-28 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full min-h-[96px] object-cover bg-[#F5F5F5]"
                        />
                        {!item.is_available && (
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wide bg-rose-500 text-white px-1.5 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-[#1E45FB] tracking-wider uppercase">
                              {item.category}
                            </span>
                            {item.is_popular && (
                              <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-[#111111] truncate mt-0.5">{item.name}</h3>
                          {item.description && (
                            <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">{item.description}</p>
                          )}
                          <p className="text-sm font-bold text-[#1E45FB] mt-1">
                            {formatMMK(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-[#F5F5F5]">
                          <button
                            onClick={() => handleOpenEditDishModal(item)}
                            className="p-2 rounded-lg text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleAvailability(item.id, item.is_available)}
                            className={`p-2 rounded-lg text-xs border transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                              item.is_available
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                            }`}
                            aria-label={item.is_available ? `Hide ${item.name} from menu` : `Show ${item.name} on menu`}
                          >
                            {item.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-lg text-[#666666] hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 rounded-3xl shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-5 h-5 text-[#1E45FB]" />
                <h2 className="text-xl md:text-2xl font-bold text-[#111111] tracking-tight">Your QR Code</h2>
              </div>
              <p className="text-xs text-[#666666] mt-1">
                Customers scan this code to open your digital menu for <span className="font-semibold text-[#111111]">{storeName}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-xs">
                <div className="relative bg-white p-5 rounded-3xl border border-[#E5E5E5] shadow-sm">
                  {menuUrl && (
                    <QRCodeCanvas
                      ref={qrRef}
                      value={menuUrl}
                      size={220}
                      level="H"
                      includeMargin
                      bgColor="#FFFFFF"
                      fgColor="#111111"
                    />
                  )}
                  {logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md border border-[#E5E5E5]">
                        <img
                          src={logoUrl}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mt-5">
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover mx-auto mb-2 border border-[#E5E5E5]"
                    />
                  )}
                  <p className="text-sm font-bold text-[#111111]">{storeName}</p>
                  <p className="text-[11px] text-[#666666] mt-1">Scan to view menu</p>
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 space-y-5 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">Menu Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={menuUrl}
                      className="flex-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#666666] focus:outline-none"
                    />
                    <button
                      onClick={handleCopyMenuUrl}
                      className="shrink-0 bg-white border border-[#E5E5E5] text-[#111111] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F5F5F5] transition-colors min-h-[40px]"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={menuUrl || "/menu"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1E45FB] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#1737C9] transition-all shadow-xs min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4" /> Preview Live Menu
                  </a>
                  <button
                    onClick={handleDownloadQr}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F5F5] hover:text-[#1E45FB] transition-all min-h-[44px]"
                  >
                    <Download className="w-4 h-4" /> Download QR Code
                  </button>
                </div>

                <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-4">
                  <p className="text-[11px] font-bold text-[#111111] mb-1">How to use</p>
                  <ol className="text-[11px] text-[#666666] space-y-1 list-decimal list-inside">
                    <li>Download or print your QR code</li>
                    <li>Place it on tables, counters, or entrances</li>
                    <li>Customers scan with their phone camera</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E5E5E5] safe-area-pb"
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => setActiveSection("menu")}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] transition-colors ${
              activeSection === "menu" ? "text-[#1E45FB]" : "text-[#666666]"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
          <button
            onClick={() => setActiveSection("qr")}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] transition-colors ${
              activeSection === "qr" ? "text-[#1E45FB]" : "text-[#666666]"
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[10px] font-semibold">QR Code</span>
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] text-[#666666] transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Categories</span>
          </button>
          <button
            onClick={() => setIsMobileSettingsOpen(true)}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] transition-colors ${
              isMobileSettingsOpen ? "text-[#1E45FB]" : "text-[#666666]"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </button>
        </div>
      </nav>

      {/* Mobile Settings Modal / Page */}
      {isMobileSettingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setIsMobileSettingsOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl my-0 sm:my-8 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#1E45FB]" />
                <h2 className="text-base font-bold text-[#111111]">Account & Settings</h2>
              </div>
              <button
                onClick={() => setIsMobileSettingsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5]"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

            {/* Store Account Summary */}
            <div className="flex items-center gap-3 p-3.5 bg-[#F5F5F5] rounded-2xl border border-[#E5E5E5]">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-2xl object-cover border border-[#E5E5E5]" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#1E45FB] text-white flex items-center justify-center font-bold text-base">
                  {storeName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#111111] truncate">{storeName}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1E45FB]/10 text-[#1E45FB] uppercase">
                    {storePlan} Plan
                  </span>
                  <span className="text-[11px] text-[#666666]">
                    {menuItems.length} / {plan.max_menu_items >= 2000000000 ? 'Unlimited' : plan.max_menu_items} items
                  </span>
                </div>
              </div>
            </div>

            {/* Upgrade to Pro option ONLY for FREE PLAN accounts */}
            {isFreePlan && (
              <div className="bg-gradient-to-br from-[#1E45FB]/10 via-[#1E45FB]/5 to-transparent border border-[#1E45FB]/20 p-4 rounded-2xl space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E45FB]">
                    <Sparkles className="w-4 h-4" />
                    <span>Upgrade to Pro Plan</span>
                  </div>
                  <p className="text-xs text-[#666666] mt-1">
                    Unlock up to 100 menu items, custom branding, and priority support.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileSettingsOpen(false);
                    setShowUpgradeModal(true);
                  }}
                  className="w-full bg-[#1E45FB] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#1737C9] transition-all shadow-xs"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade to Pro
                </button>
              </div>
            )}

            {/* Account Options */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#888888] px-1 mb-1">Account Options</p>
              
              <button
                onClick={() => {
                  setIsMobileSettingsOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-[#666666]" />
                  <div>
                    <p className="text-xs font-bold text-[#111111]">Edit Restaurant Profile</p>
                    <p className="text-[11px] text-[#666666]">Logo, store name, social & contact links</p>
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-[#888888]" />
              </button>

              <button
                onClick={() => {
                  setIsMobileSettingsOpen(false);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderPlus className="w-4 h-4 text-[#666666]" />
                  <div>
                    <p className="text-xs font-bold text-[#111111]">Manage Categories</p>
                    <p className="text-[11px] text-[#666666]">Add or remove menu categories</p>
                  </div>
                </div>
              </button>

              {menuUrl && (
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-[#666666]" />
                    <div>
                      <p className="text-xs font-bold text-[#111111]">Preview Live Menu</p>
                      <p className="text-[11px] text-[#666666]">Open customer menu view</p>
                    </div>
                  </div>
                </a>
              )}
            </div>

            {/* Sign Out */}
            <div className="pt-3 border-t border-[#E5E5E5]">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Settings Modal */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h2 className="text-base font-bold text-[#111111]">Store Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5]"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1.5">Store Logo</label>
                <div className="relative border-2 border-dashed border-[#E5E5E5] rounded-2xl p-4 text-center bg-white cursor-pointer hover:border-[#1E45FB] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLogoFile(file);
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {logoPreview || logoUrl ? (
                    <img
                      src={logoPreview || logoUrl!}
                      alt="Logo Preview"
                      className="w-20 h-20 mx-auto rounded-full object-cover border border-[#E5E5E5]"
                    />
                  ) : (
                    <div className="space-y-1.5 py-2 text-xs text-[#666666]">
                      <Upload className="w-5 h-5 mx-auto text-[#1E45FB]" />
                      <p className="font-medium">Upload Store Logo</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1.5">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-0.5">Social & Contact Links</label>
                  <p className="text-[11px] text-[#666666]">Help customers find you online (optional)</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> Facebook
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourrestaurant"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <Instagram className="w-3.5 h-3.5 text-[#E4405F]" /> Instagram
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourrestaurant"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <svg className="w-3.5 h-3.5 text-[#111111]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.6a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.06z"/>
                    </svg>
                    TikTok
                  </label>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@yourrestaurant"
                    value={socialTiktok}
                    onChange={(e) => setSocialTiktok(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#0084FF]" /> Messenger
                  </label>
                  <input
                    type="url"
                    placeholder="https://m.me/yourrestaurant"
                    value={socialMessenger}
                    onChange={(e) => setSocialMessenger(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#1E45FB]" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+959xxxxxxxx"
                    value={socialPhone}
                    onChange={(e) => setSocialPhone(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1E45FB] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#1737C9] disabled:opacity-50 transition-all shadow-xs mt-4"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Categories Management Modal */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h2 className="text-base font-bold text-[#111111]">Manage Categories</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5]"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

            {categoryError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
                {categoryError}
              </div>
            )}

            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#1E45FB]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1E45FB] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1737C9] transition-all shadow-xs"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categories.length === 0 ? (
                <p className="text-xs text-[#666666] text-center py-4">No categories yet. Add your first one above.</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between bg-white border border-[#E5E5E5] px-3.5 py-2.5 rounded-xl text-xs shadow-2xs">
                    <span className="font-semibold text-[#111111]">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1 text-[#666666] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dish Add/Edit Modal */}
      {isDishModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setIsDishModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 sticky top-0 bg-white z-10 -mt-6 -mx-6 px-6 pt-6">
              <h2 className="text-base font-bold text-[#111111]">
                {editingItem ? "Edit Dish" : "Add New Dish"}
              </h2>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5]"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1.5">Dish Image</label>
                <div className="relative border-2 border-dashed border-[#E5E5E5] rounded-2xl p-4 text-center bg-white cursor-pointer hover:border-[#1E45FB] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-[#E5E5E5]" />
                  ) : (
                    <div className="space-y-1.5 py-2 text-xs text-[#666666]">
                      <Upload className="w-5 h-5 mx-auto text-[#1E45FB]" />
                      <p className="font-medium">Upload Dish Photo</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1.5">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Shan Kaut Swe"
                  className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">Price (MMK)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB]"
                  />
                </div>
              </div>

              {/* Dish Description (Pro Feature) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#111111]">
                    Dish Description
                  </label>
                  {isFreePlan ? (
                    <span className="text-[10px] font-bold text-[#1E45FB] bg-[#1E45FB]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Pro Feature
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#666666]">Optional</span>
                  )}
                </div>
                {isFreePlan ? (
                  <div className="relative">
                    <textarea
                      disabled
                      rows={2}
                      placeholder="Upgrade to Pro to add dish descriptions for customers..."
                      className="w-full bg-[#F5F5F5] border border-[#E5E5E5] text-[#888888] rounded-xl px-3.5 py-2.5 text-xs resize-none cursor-not-allowed"
                    />
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="e.g. Traditional fish broth with rice noodles, lemongrass, and fresh herbs."
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB] resize-none"
                  />
                )}
              </div>

              {/* Popular / Featured Item Toggle (Pro Feature) */}
              <div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <label htmlFor="dish-popular-toggle" className="text-xs font-bold text-[#111111] cursor-pointer">
                        Feature as Popular Dish
                      </label>
                      {isFreePlan && (
                        <span className="text-[10px] font-bold text-[#1E45FB] bg-[#1E45FB]/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Pro
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666666]">
                      Showcase this dish in the Popular & Spotlight section of your menu.
                    </p>
                  </div>

                  {isFreePlan ? (
                    <input
                      type="checkbox"
                      disabled
                      checked={false}
                      className="w-4 h-4 rounded text-[#1E45FB] border-[#E5E5E5] cursor-not-allowed opacity-50 shrink-0"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="dish-popular-toggle"
                      checked={newItemIsPopular}
                      onChange={(e) => setNewItemIsPopular(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1E45FB] border-[#E5E5E5] focus:ring-[#1E45FB] cursor-pointer accent-[#1E45FB] shrink-0"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1E45FB] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#1737C9] disabled:opacity-50 transition-all shadow-xs min-h-[44px]"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingItem ? "Update Changes" : "Save to Supabase"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && isFreePlan && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 space-y-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Icon Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-[#888888] hover:text-[#111111] hover:bg-[#F5F5F5] rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Description */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-[#1E45FB]/10 text-[#1E45FB] rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-[#111111]">Upgrade to Pro</h2>
              <p className="text-sm text-[#666666] leading-relaxed">
                Contact Menuu to upgrade your plan and unlock up to 100 menu items, custom branding, and priority support for <span className="font-bold text-[#111111]">{storeName}</span>.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">
                Contact Us to Upgrade
              </p>

              {/* Viber Contact Link */}
              <a
                href={MENUU_VIBER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E5E5E5] hover:border-[#7360F2] bg-[#FAFAFA] hover:bg-[#7360F2]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7360F2] text-white flex items-center justify-center shadow-xs">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.782 16.71c-.569-.356-1.157-.73-1.745-1.087-.665-.412-1.433-.217-1.84.444l-.444.664a.434.434 0 0 1-.518.17c-1.385-.45-2.73-1.258-3.79-2.317-1.06-1.06-1.868-2.405-2.317-3.79a.43.43 0 0 1 .17-.518l.664-.444c.66-.407.856-1.175.444-1.84-.356-.588-.73-1.176-1.087-1.745-.487-.79-1.572-.997-2.308-.444l-.791.593c-.852.639-1.246 1.743-1.002 2.766.726 3.048 2.502 6.002 4.957 8.457 2.455 2.455 5.409 4.231 8.457 4.957 1.023.244 2.127-.15 2.766-1.002l.593-.791c.553-.736.346-1.821-.444-2.308z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 2.22.724 4.27 1.95 5.937L2.5 21.5l3.563-1.45A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.954 7.954 0 0 1-4.223-1.2l-.302-.186-2.122.864.864-2.122-.186-.302A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#111111] group-hover:text-[#7360F2] transition-colors">
                      Viber
                    </div>
                    <div className="text-xs text-[#666666]">Contact Menuu on Viber</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#888888] group-hover:text-[#7360F2] transition-colors" />
              </a>

              {/* Facebook Page Contact Link */}
              <a
                href={MENUU_FB_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E5E5E5] hover:border-[#1877F2] bg-[#FAFAFA] hover:bg-[#1877F2]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                    <Facebook className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#111111] group-hover:text-[#1877F2] transition-colors">
                      Facebook Page
                    </div>
                    <div className="text-xs text-[#666666]">Message our Facebook Page</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#888888] group-hover:text-[#1877F2] transition-colors" />
              </a>
            </div>

            {/* Close / Cancel Action */}
            <div className="pt-2 border-t border-[#E5E5E5]">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full bg-white border border-[#E5E5E5] text-[#111111] font-bold py-3 rounded-xl text-sm hover:bg-[#F5F5F5] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 