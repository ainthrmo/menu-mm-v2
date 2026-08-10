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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMMK } from "@/lib/utils";
import { STORE_PROFILE_ID } from "@/lib/store";
 import { useRouter } from "next/navigation";
 import { QRCodeCanvas } from "qrcode.react";

// TypeScript interfaces for menu items and categories
export interface AdminMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  is_available: boolean;
  image: string;
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

  // Store Profile State
  const [storeName, setStoreName] = useState("My Restaurant");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [storeProfile, setStoreProfile] = useState<any>(null);

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
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = React.useRef<HTMLCanvasElement | null>(null);
  
  // Dish Form State
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch Initial Data (Store Profile, Categories, Menu Items) from Supabase
  const fetchData = async () => {
    setLoading(true);
    setProfileError(false);

    // 1. Fetch Store Profile & Social Links
    const { data: profileData, error: profileFetchError } = await supabase
      .from("store_profile")
      .select("*")
      .eq("id", STORE_PROFILE_ID)
      .single();

    if (profileFetchError || !profileData) {
      setProfileError(true);
    } else {
      setStoreName(profileData.store_name || "My Restaurant");
      setLogoUrl(profileData.logo_url || null);
      setStoreProfile(profileData);
      
      // Populate social links states
      setSocialFacebook(profileData.social_facebook || "");
      setSocialInstagram(profileData.social_instagram || "");
      setSocialTiktok(profileData.social_tiktok || "");
      setSocialMessenger(profileData.social_messenger || "");
      setSocialPhone(profileData.social_phone || "");
    }

    // 2. Fetch Categories
    const { data: catData } = await supabase.from("categories").select("*").order("name");
    if (catData && catData.length > 0) {
      setCategories(catData);
      setNewItemCategory(catData[0].name);
    }

    // 3. Fetch Menu Items
    const { data: menuData } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (menuData) setMenuItems(menuData);

    setLoading(false);
  };
  const menuUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/menu`
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
  
    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      0,
      0,
      exportCanvas.width,
      exportCanvas.height
    );
  
    // Draw QR code
    ctx.drawImage(
      qrCanvas,
      padding,
      padding
    );
  
    // Draw logo if available
    if (logoUrl) {
      const logo = new Image();
  
      logo.onload = () => {
        const logoX =
          (exportCanvas.width - logoSize) / 2;
  
        const logoY =
          padding +
          (qrCanvas.height - logoSize) / 2;
  
        // White logo background
        ctx.fillStyle = "#FFFFFF";
  
        ctx.beginPath();
        ctx.roundRect(
          logoX - 10,
          logoY - 10,
          logoSize + 20,
          logoSize + 20,
          18
        );
        ctx.fill();
  
        // Logo
        ctx.save();
  
        ctx.beginPath();
        ctx.roundRect(
          logoX,
          logoY,
          logoSize,
          logoSize,
          14
        );
        ctx.clip();
  
        ctx.drawImage(
          logo,
          logoX,
          logoY,
          logoSize,
          logoSize
        );
  
        ctx.restore();
  
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
  
    function drawExportText() {
      const centerX = exportCanvas.width / 2;
  
      ctx.textAlign = "center";
  
      // Restaurant name
      ctx.fillStyle = "#111111";
      ctx.font = "bold 32px Arial";
  
      ctx.fillText(
        storeName,
        centerX,
        qrCanvas.height + padding + 55
      );
  
      // Subtitle
      ctx.fillStyle = "#666666";
      ctx.font = "20px Arial";
  
      ctx.fillText(
        "Scan to view menu",
        centerX,
        qrCanvas.height + padding + 88
      );
  
      // Download
      const url = exportCanvas.toDataURL("image/png");
  
      const link = document.createElement("a");
  
      link.download = `${storeName
        .replace(/\s+/g, "-")
        .toLowerCase()}-qr-code.png`;
  
      link.href = url;
      link.click();
    }
  };
  const availableCount = menuItems.filter((i) => i.is_available).length;
  const handleOpenAddDishModal = () => {
    setEditingItem(null);
    setNewItemName("");
    if (categories.length > 0) setNewItemCategory(categories[0].name);
    setNewItemPrice("");
    setImageFile(null);
    setImagePreview(null);
    setIsDishModalOpen(true);
  };

  

  // Open Edit Dish Modal
  const handleOpenEditDishModal = (item: AdminMenuItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemCategory(item.category);
    setNewItemPrice(item.price.toString());
    setImageFile(null);
    setImagePreview(item.image);
    setIsDishModalOpen(true);
  };

  // Handle saving store profile and social links to Supabase
  const handleSaveStoreProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let updatedLogo = logoUrl;

    // Upload new logo if provided
    if (logoFile) {
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, logoFile, { cacheControl: "3600", upsert: true });

      if (uploadError) {
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

    // Update store profile record including social links
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
      .eq("id", STORE_PROFILE_ID);

    if (error) {
      alert("Failed to update store settings: " + error.message);
    } else {
      setLogoUrl(updatedLogo);
      setIsSettingsOpen(false);
      alert("Store Profile and Social Links updated successfully!");
    }
    setSubmitting(false);
  };

  // Handle adding a new menu category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategoryName.trim() }])
      .select();

    if (error) {
      alert("Failed to add category: " + error.message);
    } else if (data) {
      setCategories([...categories, data[0]]);
      setNewCategoryName("");
    }
    setSubmitting(false);
  };

  // Handle deleting a menu category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete category: " + error.message);
    }
  };

  // Handle saving or updating a dish item
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    setSubmitting(true);
    let imageUrl = editingItem ? editingItem.image : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

    // Upload new image file if provided
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        alert(`Image upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) imageUrl = publicUrlData.publicUrl;
    }

    if (editingItem) {
      const { data, error } = await supabase
        .from("menu_items")
        .update({
          name: newItemName,
          category: newItemCategory,
          price: parseFloat(newItemPrice),
          image: imageUrl,
        })
        .eq("id", editingItem.id)
        .select();

      if (!error && data) {
        setMenuItems(menuItems.map((i) => (i.id === editingItem.id ? data[0] : i)));
        setIsDishModalOpen(false);
      }
    } else {
      const { data, error } = await supabase
        .from("menu_items")
        .insert([
          {
            name: newItemName,
            category: newItemCategory,
            price: parseFloat(newItemPrice),
            is_available: true,
            image: imageUrl,
          },
        ])
        .select();

      if (!error && data) {
        setMenuItems([data[0], ...menuItems]);
        setIsDishModalOpen(false);
      }
    }

    setSubmitting(false);
  };

  // Toggle dish availability status
  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !currentStatus })
      .eq("id", id);

    if (!error) {
      setMenuItems(menuItems.map((item) => item.id === id ? { ...item, is_available: !currentStatus } : item));
    }
  };

  // Delete dish item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (!error) setMenuItems(menuItems.filter((i) => i.id !== id));
  };

  // Filter menu items by search query and category filter selection
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "All" || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col md:flex-row">
      
      {/* Sidebar navigation for desktop and mobile header wrapper */}
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
                <p className="text-[11px] text-[#666666] font-medium">Menuu-QR Admin</p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="md:hidden p-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-[#111111]"
              title="Store Settings"
            >
              <Settings className="w-4 h-4" />
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
            <div className="text-[11px] text-[#666666] mb-2 font-medium">Quick Status</div>
            <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
              <span>Active Items</span>
              <span className="bg-[#CDF22B] text-[#111111] px-2 py-0.5 rounded-md font-bold">{availableCount} / {menuItems.length}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main dashboard body content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-28 md:pb-8">

        {activeSection === "menu" ? (
          <>
        {/* Header title banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-6 rounded-3xl shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CDF22B] text-[#111111] border border-[#CDF22B]">
                <CheckCircle2 className="w-3 h-3 text-[#111111]" /> Published Menu
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#111111] tracking-tight">Menu Dashboard</h2>
            <p className="text-xs text-[#666666] mt-0.5">Manage your restaurant menu items, pricing, and availability in real time.</p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href="/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#E5E5E5] text-[#111111] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F5F5F5] hover:text-[#1E45FB] shadow-xs min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
            >
              <ExternalLink className="w-4 h-4" /> Preview
            </a>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="md:hidden bg-white border border-[#E5E5E5] text-[#111111] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F5F5F5] shadow-xs min-h-[40px]"
            >
              <FolderPlus className="w-4 h-4" /> Categories
            </button>
            <button
              onClick={handleOpenAddDishModal}
              className="bg-[#1E45FB] text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-[#1737C9] transition-all shadow-xs cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] focus-visible:ring-offset-2"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>
        </div>

        {/* Quick stat counters */}
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

        {/* Search and category filtering tools */}
        <div className="bg-white border border-[#E5E5E5] p-4 rounded-3xl space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                placeholder="Search dishes or drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#1E45FB] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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
          </div>
        </div>

        {/* Menu items listing grid */}
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
                className="inline-flex items-center gap-2 bg-[#1E45FB] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1737C9] transition-all mt-2 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] focus-visible:ring-offset-2"
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
                      <span className="text-[10px] font-bold text-[#1E45FB] tracking-wider uppercase">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#111111] truncate mt-0.5">{item.name}</h3>
                      <p className="text-sm font-bold text-[#1E45FB] mt-1">
                        {formatMMK(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-[#F5F5F5]">
                      <button
                        onClick={() => handleOpenEditDishModal(item)}
                        className="p-2 rounded-lg text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleAvailability(item.id, item.is_available)}
                        className={`p-2 rounded-lg text-xs border transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] ${
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
                        className="p-2 rounded-lg text-[#666666] hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
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
          /* QR Code Section */
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
     {/* Branded QR Display */}
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

          {/* Restaurant Logo */}
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

          <p className="text-sm font-bold text-[#111111]">
            {storeName}
          </p>

          <p className="text-[11px] text-[#666666] mt-1">
            Scan to view menu
          </p>
        </div>

        </div>

              {/* Actions */}
              <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 space-y-5 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">Menu Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={menuUrl}
                      className="flex-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#666666] focus:outline-none"
                      aria-label="Menu URL"
                    />
                    <button
                      onClick={handleCopyMenuUrl}
                      className="shrink-0 bg-white border border-[#E5E5E5] text-[#111111] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F5F5F5] transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
                      aria-label="Copy menu link"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href="/menu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1E45FB] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#1737C9] transition-all shadow-xs min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] focus-visible:ring-offset-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Preview Live Menu
                  </a>
                  <button
                    onClick={handleDownloadQr}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F5F5] hover:text-[#1E45FB] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
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

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E5E5E5] safe-area-pb"
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => setActiveSection("menu")}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] ${
              activeSection === "menu" ? "text-[#1E45FB]" : "text-[#666666]"
            }`}
            aria-current={activeSection === "menu" ? "page" : undefined}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
          <button
            onClick={() => setActiveSection("qr")}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] ${
              activeSection === "qr" ? "text-[#1E45FB]" : "text-[#666666]"
            }`}
            aria-current={activeSection === "qr" ? "page" : undefined}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[10px] font-semibold">QR Code</span>
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] text-[#666666] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
          >
            <FolderPlus className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Categories</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-[72px] min-h-[52px] text-[#666666] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </button>
        </div>
      </nav>

      {/* Store Settings Modal (Includes Restaurant Name, Logo, and Social & Contact Links) */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="presentation"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className="bg-white w-full max-w-lg rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h2 id="settings-title" className="text-base font-bold text-[#111111]">Store Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
                aria-label="Close settings"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Logo upload section */}
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

              {/* Restaurant name input */}
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

              {/* Social & Contact Links Configuration Section */}
              <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-0.5">Social & Contact Links</label>
                  <p className="text-[11px] text-[#666666]">Help customers find you online (optional)</p>
                </div>

                <div>
                  <label htmlFor="social-facebook" className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <Facebook className="w-3.5 h-3.5 text-[#1877F2]" aria-hidden="true" /> Facebook
                  </label>
                  <input
                    id="social-facebook"
                    type="url"
                    placeholder="https://facebook.com/yourrestaurant"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB] focus:ring-1 focus:ring-[#1E45FB]"
                  />
                </div>

                <div>
                  <label htmlFor="social-instagram" className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <Instagram className="w-3.5 h-3.5 text-[#E4405F]" aria-hidden="true" /> Instagram
                  </label>
                  <input
                    id="social-instagram"
                    type="url"
                    placeholder="https://instagram.com/yourrestaurant"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB] focus:ring-1 focus:ring-[#1E45FB]"
                  />
                </div>

                <div>
                  <label htmlFor="social-tiktok" className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <svg className="w-3.5 h-3.5 text-[#111111]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.6a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.06z"/>
                    </svg>
                    TikTok
                  </label>
                  <input
                    id="social-tiktok"
                    type="url"
                    placeholder="https://tiktok.com/@yourrestaurant"
                    value={socialTiktok}
                    onChange={(e) => setSocialTiktok(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB] focus:ring-1 focus:ring-[#1E45FB]"
                  />
                </div>

                <div>
                  <label htmlFor="social-messenger" className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#0084FF]" aria-hidden="true" /> Messenger
                  </label>
                  <input
                    id="social-messenger"
                    type="url"
                    placeholder="https://m.me/yourrestaurant"
                    value={socialMessenger}
                    onChange={(e) => setSocialMessenger(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB] focus:ring-1 focus:ring-[#1E45FB]"
                  />
                </div>

                <div>
                  <label htmlFor="social-phone" className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#1E45FB]" aria-hidden="true" /> Phone Number
                  </label>
                  <input
                    id="social-phone"
                    type="tel"
                    placeholder="+959xxxxxxxx"
                    value={socialPhone}
                    onChange={(e) => setSocialPhone(e.target.value)}
                    className="w-full bg-white border border-[#E5E5E5] text-[#111111] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E45FB] focus:ring-1 focus:ring-[#1E45FB]"
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
          role="presentation"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="categories-title"
            className="bg-white w-full max-w-md rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h2 id="categories-title" className="text-base font-bold text-[#111111]">Manage Categories</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
                aria-label="Close categories"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          onClick={() => setIsDishModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-modal-title"
            className="bg-white w-full max-w-lg rounded-3xl border border-[#E5E5E5] p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h2 id="dish-modal-title" className="text-base font-bold text-[#111111]">
                {editingItem ? "Edit Dish" : "Add New Dish"}
              </h2>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB]"
                aria-label="Close dish form"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>

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

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1E45FB] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#1737C9] disabled:opacity-50 transition-all shadow-xs"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingItem ? "Update Changes" : "Save to Supabase"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;