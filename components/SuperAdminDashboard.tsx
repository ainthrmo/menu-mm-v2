"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Store,
  Crown,
  Users,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  Edit2,
  Trash2,
  Power,
  UserPlus,
  RefreshCw,
  QrCode,
  UtensilsCrossed,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export interface AdminRestaurant {
  id: string;
  name: string;
  owner_id?: string;
  owner_email?: string;
  status: "active" | "disabled";
  scan_count: number;
  created_at: string;
  plan_id: string;
  plan_name: string;
  dish_count: number;
  category_count: number;
  cover_url?: string;
}

export interface AdminLead {
  id: string;
  restaurant_name: string;
  contact_name: string;
  phone: string;
  city?: string;
  notes?: string;
  status: "pending" | "onboarded" | "rejected";
  onboarded_restaurant_id?: string;
  submitted_at: string;
}

export interface AdminStats {
  totalActiveRestaurants: number;
  proTierCount: number;
  pendingLeadsCount: number;
  totalScans: number;
}

interface SuperAdminDashboardProps {
  initialRestaurants: AdminRestaurant[];
  initialLeads: AdminLead[];
  initialStats: AdminStats;
  currentRole: string;
}

export default function SuperAdminDashboard({
  initialRestaurants,
  initialLeads,
  initialStats,
  currentRole,
}: SuperAdminDashboardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(initialRestaurants);
  const [leads, setLeads] = useState<AdminLead[]>(initialLeads);
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [activeTab, setActiveTab] = useState<"restaurants" | "leads">("restaurants");

  // Filtering & Search for Restaurants
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro" | "business">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

  // Filtering for Leads
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<"all" | "pending" | "onboarded" | "rejected">("all");

  // Action states
  const [editingPlanRestaurant, setEditingPlanRestaurant] = useState<AdminRestaurant | null>(null);
  const [newPlanSelection, setNewPlanSelection] = useState<string>("pro");
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Quick message auto-dismiss
  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setActionErrorMessage(msg);
      setTimeout(() => setActionErrorMessage(null), 4000);
    } else {
      setActionSuccessMessage(msg);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  // Re-fetch data on refresh
  const handleRefresh = async () => {
    setIsUpdating(true);
    try {
      router.refresh();
      showMessage("Dashboard data refreshed");
    } finally {
      setIsUpdating(false);
    }
  };

  /* ----------------------------------------------------------
     RESTAURANT ACTIONS
  ---------------------------------------------------------- */
  // 1. Toggle Active / Disabled Status
  const handleToggleStatus = async (restaurant: AdminRestaurant) => {
    const nextStatus = restaurant.status === "active" ? "disabled" : "active";
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("restaurants")
        .update({ status: nextStatus })
        .eq("id", restaurant.id);

      if (error) throw error;

      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurant.id ? { ...r, status: nextStatus } : r))
      );
      setStats((prev) => ({
        ...prev,
        totalActiveRestaurants:
          nextStatus === "active"
            ? prev.totalActiveRestaurants + 1
            : Math.max(0, prev.totalActiveRestaurants - 1),
      }));
      showMessage(`Restaurant ${restaurant.name} marked as ${nextStatus}`);
    } catch (err: any) {
      console.error("Error updating restaurant status:", err);
      showMessage(err.message || "Failed to update restaurant status", true);
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. Change Subscription Plan
  const handleSavePlan = async () => {
    if (!editingPlanRestaurant) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: editingPlanRestaurant.id,
          plan_id: newPlanSelection,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to update subscription plan");
      }

      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === editingPlanRestaurant.id
            ? {
                ...r,
                plan_id: newPlanSelection,
                plan_name: newPlanSelection.charAt(0).toUpperCase() + newPlanSelection.slice(1),
              }
            : r
        )
      );

      // Recalculate Pro count
      const wasPro = editingPlanRestaurant.plan_id === "pro" || editingPlanRestaurant.plan_id === "business";
      const isNowPro = newPlanSelection === "pro" || newPlanSelection === "business";
      if (!wasPro && isNowPro) {
        setStats((prev) => ({ ...prev, proTierCount: prev.proTierCount + 1 }));
      } else if (wasPro && !isNowPro) {
        setStats((prev) => ({ ...prev, proTierCount: Math.max(0, prev.proTierCount - 1) }));
      }

      showMessage(`Plan updated to ${newPlanSelection.toUpperCase()} for ${editingPlanRestaurant.name}`);
      setEditingPlanRestaurant(null);
    } catch (err: any) {
      console.error("Error updating subscription plan:", err);
      showMessage(err.message || "Failed to update subscription plan", true);
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. Delete Restaurant
  const handleDeleteRestaurant = async (restaurant: AdminRestaurant) => {
    const confirmName = window.prompt(
      `Are you sure you want to permanently delete "${restaurant.name}"? Type the restaurant name to confirm:`
    );
    if (confirmName !== restaurant.name) {
      if (confirmName !== null) alert("Restaurant name did not match. Deletion cancelled.");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurant.id);

      if (error) throw error;

      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      setStats((prev) => ({
        ...prev,
        totalActiveRestaurants:
          restaurant.status === "active"
            ? Math.max(0, prev.totalActiveRestaurants - 1)
            : prev.totalActiveRestaurants,
        proTierCount:
          restaurant.plan_id === "pro" || restaurant.plan_id === "business"
            ? Math.max(0, prev.proTierCount - 1)
            : prev.proTierCount,
      }));
      showMessage(`Restaurant ${restaurant.name} deleted permanently.`);
    } catch (err: any) {
      console.error("Error deleting restaurant:", err);
      showMessage(err.message || "Failed to delete restaurant", true);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ----------------------------------------------------------
     LEAD ACTIONS
  ---------------------------------------------------------- */
  // Onboard Lead (Create restaurant and convert lead)
  const handleOnboardLead = async (lead: AdminLead) => {
    setIsUpdating(true);
    try {
      // 1. Create a new restaurant record for the lead
      const { data: newRest, error: restError } = await supabase
        .from("restaurants")
        .insert({
          name: lead.restaurant_name,
          status: "active",
          scan_count: 0,
        })
        .select("id")
        .single();

      if (restError) throw restError;

      // 2. Set default subscription to Pro
      await supabase.from("subscriptions").insert({
        restaurant_id: newRest.id,
        plan_id: "pro",
        status: "active",
      });

      // 3. Set store profile phone and city from lead
      await supabase.from("store_profile").insert({
        restaurant_id: newRest.id,
        store_name: lead.restaurant_name,
        social_phone: lead.phone,
        city: lead.city || undefined,
      });

      // 4. Update lead status to 'onboarded'
      const { error: leadUpdateError } = await supabase
        .from("leads")
        .update({
          status: "onboarded",
          onboarded_restaurant_id: newRest.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lead.id);

      if (leadUpdateError) throw leadUpdateError;

      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? { ...l, status: "onboarded", onboarded_restaurant_id: newRest.id }
            : l
        )
      );

      // Add to restaurants state
      const newlyCreatedRestaurant: AdminRestaurant = {
        id: newRest.id,
        name: lead.restaurant_name,
        status: "active",
        scan_count: 0,
        created_at: new Date().toISOString(),
        plan_id: "pro",
        plan_name: "Pro",
        dish_count: 0,
        category_count: 0,
      };

      setRestaurants((prev) => [newlyCreatedRestaurant, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalActiveRestaurants: prev.totalActiveRestaurants + 1,
        proTierCount: prev.proTierCount + 1,
        pendingLeadsCount: Math.max(0, prev.pendingLeadsCount - 1),
      }));

      showMessage(`Lead "${lead.restaurant_name}" successfully onboarded as a new Pro Restaurant!`);
    } catch (err: any) {
      console.error("Error onboarding lead:", err);
      showMessage(err.message || "Failed to onboard lead", true);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ----------------------------------------------------------
     FILTERED DATA MEMOS
  ---------------------------------------------------------- */
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.owner_email && r.owner_email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlan =
        planFilter === "all" || r.plan_id.toLowerCase() === planFilter;

      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [restaurants, searchQuery, planFilter, statusFilter]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        leadSearchQuery === "" ||
        l.restaurant_name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
        l.contact_name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
        l.phone.includes(leadSearchQuery) ||
        (l.city && l.city.toLowerCase().includes(leadSearchQuery.toLowerCase()));

      const matchesStatus =
        leadStatusFilter === "all" || l.status === leadStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, leadSearchQuery, leadStatusFilter]);

  return (
    <div className="space-y-8">
      {/* Toast Notifications */}
      {actionSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/30 px-4 py-3 text-xs font-bold text-emerald-300 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {actionErrorMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-rose-950 border border-rose-500/30 px-4 py-3 text-xs font-bold text-rose-300 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="h-4 w-4 text-rose-400" />
          <span>{actionErrorMessage}</span>
        </div>
      )}

      {/* ====================================================
          1. HEADER & KPI STAT CARDS
      ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time multi-tenant monitoring, subscription control, and lead conversions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isUpdating}
          className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin text-[#CDF22B]" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Restaurants */}
        <div className="rounded-3xl bg-[#15151A] border border-white/10 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Active Restaurants
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tracking-tight">
              {stats.totalActiveRestaurants}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Live Tenants
            </span>
          </div>
        </div>

        {/* Card 2: Pro-Tier Count */}
        <div className="rounded-3xl bg-[#15151A] border border-white/10 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Pro & Business
            </span>
            <div className="h-9 w-9 rounded-2xl bg-[#CDF22B]/10 border border-[#CDF22B]/20 flex items-center justify-center text-[#CDF22B]">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#CDF22B] tracking-tight">
              {stats.proTierCount}
            </span>
            <span className="text-[11px] font-bold text-neutral-400">
              {stats.totalActiveRestaurants > 0
                ? `${Math.round((stats.proTierCount / stats.totalActiveRestaurants) * 100)}% conversion`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Card 3: Pending Leads */}
        <div className="rounded-3xl bg-[#15151A] border border-white/10 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Pending Leads
            </span>
            <div className="h-9 w-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400 tracking-tight">
              {stats.pendingLeadsCount}
            </span>
            <span className="text-[11px] font-semibold text-neutral-400">
              Awaiting Onboarding
            </span>
          </div>
        </div>

        {/* Card 4: Total Scans This Period */}
        <div className="rounded-3xl bg-[#15151A] border border-white/10 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Total Menu Scans
            </span>
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tracking-tight">
              {stats.totalScans.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
              <QrCode className="h-3 w-3" />
              Customer Views
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================
          2. NAVIGATION TABS (Restaurants vs Leads)
      ==================================================== */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("restaurants")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all ${
            activeTab === "restaurants"
              ? "bg-[#CDF22B] text-black shadow-md"
              : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Store className="h-4 w-4" />
          <span>Restaurants ({restaurants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all ${
            activeTab === "leads"
              ? "bg-[#CDF22B] text-black shadow-md"
              : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Pending Leads ({leads.filter((l) => l.status === "pending").length})</span>
        </button>
      </div>

      {/* ====================================================
          3. RESTAURANTS VIEW
      ==================================================== */}
      {activeTab === "restaurants" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant by name, ID, or owner email..."
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#15151A] pl-10 pr-4 text-xs font-medium text-white placeholder:text-neutral-500 outline-none focus:border-[#CDF22B] transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Plan Filter */}
              <select
                value={planFilter}
                onChange={(e: any) => setPlanFilter(e.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-[#15151A] px-3.5 text-xs font-bold text-neutral-300 outline-none focus:border-[#CDF22B]"
              >
                <option value="all">All Plans</option>
                <option value="free">Free Plan</option>
                <option value="pro">Pro Plan</option>
                <option value="business">Business Plan</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-[#15151A] px-3.5 text-xs font-bold text-neutral-300 outline-none focus:border-[#CDF22B]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>
          </div>

          {/* Restaurants Table */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#15151A] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px] font-black">
                  <tr>
                    <th className="py-4 px-5">Restaurant Name</th>
                    <th className="py-4 px-4">Plan</th>
                    <th className="py-4 px-4">Dishes</th>
                    <th className="py-4 px-4">QR Scans</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Created</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRestaurants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500 font-medium">
                        No restaurants matched your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRestaurants.map((restaurant) => {
                      const isPro = restaurant.plan_id === "pro" || restaurant.plan_id === "business";
                      const isActive = restaurant.status === "active";

                      return (
                        <tr
                          key={restaurant.id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Name & ID */}
                          <td className="py-4 px-5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {restaurant.name}
                                </span>
                                <Link
                                  href={`/menu?restaurantId=${restaurant.id}`}
                                  target="_blank"
                                  className="text-neutral-500 hover:text-[#CDF22B] transition-colors"
                                  title="View Customer Menu"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </div>
                              <span className="text-[10px] font-mono text-neutral-500 block truncate max-w-[200px]">
                                {restaurant.id}
                              </span>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isPro
                                  ? "bg-[#CDF22B]/10 text-[#CDF22B] border border-[#CDF22B]/30"
                                  : "bg-white/5 text-neutral-400 border border-white/10"
                              }`}
                            >
                              {isPro && <Crown className="h-2.5 w-2.5" />}
                              {restaurant.plan_name}
                            </span>
                          </td>

                          {/* Dishes count */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                              <UtensilsCrossed className="h-3.5 w-3.5 text-neutral-500" />
                              <span>{restaurant.dish_count}</span>
                            </div>
                          </td>

                          {/* Scans count */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                              <Eye className="h-3.5 w-3.5 text-blue-400" />
                              <span>{restaurant.scan_count.toLocaleString()}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                                }`}
                              />
                              {restaurant.status}
                            </span>
                          </td>

                          {/* Created date */}
                          <td className="py-4 px-4 text-neutral-400 text-[11px] font-medium">
                            {new Date(restaurant.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>

                          {/* Row Actions */}
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Plan */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPlanRestaurant(restaurant);
                                  setNewPlanSelection(restaurant.plan_id);
                                }}
                                className="flex h-8 items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-2.5 text-[11px] font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
                                title="Change subscription tier"
                              >
                                <Edit2 className="h-3 w-3 text-[#CDF22B]" />
                                <span className="hidden sm:inline">Plan</span>
                              </button>

                              {/* Toggle Active/Disable */}
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(restaurant)}
                                className={`flex h-8 items-center gap-1 rounded-xl border px-2.5 text-[11px] font-bold transition-all ${
                                  isActive
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20"
                                }`}
                                title={isActive ? "Disable Restaurant" : "Enable Restaurant"}
                              >
                                <Power className="h-3 w-3" />
                                <span className="hidden sm:inline">
                                  {isActive ? "Disable" : "Enable"}
                                </span>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteRestaurant(restaurant)}
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-500 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
                                title="Delete restaurant"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          4. LEADS VIEW
      ==================================================== */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="search"
                value={leadSearchQuery}
                onChange={(e) => setLeadSearchQuery(e.target.value)}
                placeholder="Search leads by restaurant name, contact, phone, or city..."
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#15151A] pl-10 pr-4 text-xs font-medium text-white placeholder:text-neutral-500 outline-none focus:border-[#CDF22B] transition-all"
              />
            </div>

            <select
              value={leadStatusFilter}
              onChange={(e: any) => setLeadStatusFilter(e.target.value)}
              className="h-11 rounded-2xl border border-white/10 bg-[#15151A] px-3.5 text-xs font-bold text-neutral-300 outline-none focus:border-[#CDF22B]"
            >
              <option value="all">All Lead Statuses</option>
              <option value="pending">Pending</option>
              <option value="onboarded">Onboarded</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Leads Grid/List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl bg-[#15151A] border border-white/10 text-neutral-500 font-medium">
                No leads matched your criteria.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isPending = lead.status === "pending";
                const isOnboarded = lead.status === "onboarded";

                return (
                  <div
                    key={lead.id}
                    className="rounded-3xl bg-[#15151A] border border-white/10 p-5 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-black text-white leading-tight">
                            {lead.restaurant_name}
                          </h3>
                          <span className="text-xs font-bold text-neutral-400 block mt-0.5">
                            Contact: {lead.contact_name}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isPending
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : isOnboarded
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-white/5 text-neutral-500 border border-white/10"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-neutral-300">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-[#CDF22B]" />
                          <a
                            href={`tel:${lead.phone}`}
                            className="hover:underline font-semibold"
                          >
                            {lead.phone}
                          </a>
                        </div>

                        {lead.city && (
                          <div className="flex items-center gap-2 text-neutral-400">
                            <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{lead.city}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Submitted: {new Date(lead.submitted_at).toLocaleDateString()}
                          </span>
                        </div>

                        {lead.notes && (
                          <p className="mt-2 text-xs text-neutral-400 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            &quot;{lead.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lead Action Card Footer */}
                    <div className="pt-3 border-t border-white/5">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleOnboardLead(lead)}
                          disabled={isUpdating}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#CDF22B] py-3 text-xs font-black text-black hover:bg-[#bce022] active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>Onboard as Pro Restaurant</span>
                        </button>
                      ) : isOnboarded ? (
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Converted & Active</span>
                          </span>
                          {lead.onboarded_restaurant_id && (
                            <Link
                              href={`/menu?restaurantId=${lead.onboarded_restaurant_id}`}
                              target="_blank"
                              className="hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <span>View</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-500 font-medium">No actions available</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          5. EDIT PLAN MODAL
      ==================================================== */}
      {editingPlanRestaurant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setEditingPlanRestaurant(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#18181D] border border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#CDF22B]">
                  Manage Subscription
                </span>
                <h3 className="text-lg font-black text-white">
                  {editingPlanRestaurant.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlanRestaurant(null)}
                className="p-1 text-neutral-500 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-300">
                Select Subscription Tier:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: "free",
                    name: "Free Tier",
                    desc: "Up to 20 menu items, basic QR menu",
                    price: "0 MMK",
                  },
                  {
                    id: "pro",
                    name: "Pro Tier (Recommended)",
                    desc: "Unlimited items, dish photos, custom themes, cart",
                    price: "65,000 MMK/mo",
                  },
                  {
                    id: "business",
                    name: "Business Tier",
                    desc: "Multi-branch, advanced analytics & dedicated support",
                    price: "165,000 MMK/mo",
                  },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setNewPlanSelection(plan.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      newPlanSelection === plan.id
                        ? "bg-[#CDF22B]/10 border-[#CDF22B] text-white shadow-sm"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">
                          {plan.name}
                        </span>
                        {plan.id === "pro" && (
                          <span className="rounded bg-[#CDF22B] px-1.5 py-0.2 text-[8px] font-black uppercase text-black">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{plan.desc}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#CDF22B] block">
                        {plan.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingPlanRestaurant(null)}
                className="flex-1 rounded-2xl border border-white/10 py-3 text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                disabled={isUpdating}
                className="flex-1 rounded-2xl bg-[#CDF22B] py-3 text-xs font-black text-black hover:bg-[#bce022] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
