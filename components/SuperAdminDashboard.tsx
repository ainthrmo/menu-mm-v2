"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Store, Crown, Users, Eye, Search, Filter, CheckCircle2, XCircle, Clock,
  ArrowUpRight, TrendingUp, MoreVertical, Edit2, Trash2, Power, UserPlus,
  RefreshCw, QrCode, UtensilsCrossed, Sparkles, Phone, MapPin, Calendar,
  AlertCircle, ExternalLink, ChevronDown,
} from "lucide-react";

export interface AdminRestaurant {
  id: string;
  name: string;
  owner_id?: string;
  owner_email?: string;
  status: "pending" | "active" | "disabled";
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

export default function SuperAdminDashboard({ initialRestaurants, initialLeads, initialStats, currentRole }: SuperAdminDashboardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(initialRestaurants);
  const [leads, setLeads] = useState<AdminLead[]>(initialLeads);
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [activeTab, setActiveTab] = useState<"restaurants" | "leads">("restaurants");
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro" | "business">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "disabled">("all");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<"all" | "pending" | "onboarded" | "rejected">("all");
  const [editingPlanRestaurant, setEditingPlanRestaurant] = useState<AdminRestaurant | null>(null);
  const [newPlanSelection, setNewPlanSelection] = useState<string>("starter");
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setActionErrorMessage(msg);
      setTimeout(() => setActionErrorMessage(null), 4000);
    } else {
      setActionSuccessMessage(msg);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  const handleRefresh = async () => {
    setIsUpdating(true);
    try {
      router.refresh();
      showMessage("Dashboard data refreshed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (restaurant: AdminRestaurant) => {
    const nextStatus = restaurant.status === "active" ? "disabled" : "active";
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("restaurants").update({ status: nextStatus }).eq("id", restaurant.id);
      if (error) throw error;
      setRestaurants((prev) => prev.map((r) => (r.id === restaurant.id ? { ...r, status: nextStatus } : r)));
      setStats((prev) => ({ ...prev, totalActiveRestaurants: nextStatus === "active" ? prev.totalActiveRestaurants + 1 : Math.max(0, prev.totalActiveRestaurants - 1) }));
      showMessage(`Restaurant ${restaurant.name} marked as ${nextStatus}`);
    } catch (err: any) {
      console.error("Error updating restaurant status:", err);
      showMessage(err.message || "Failed to update restaurant status", true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlanRestaurant) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: editingPlanRestaurant.id, plan_id: newPlanSelection }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed to update subscription plan");
      setRestaurants((prev) => prev.map((r) => r.id === editingPlanRestaurant.id ? { ...r, plan_id: newPlanSelection, plan_name: newPlanSelection.charAt(0).toUpperCase() + newPlanSelection.slice(1) } : r));
      const wasPro = editingPlanRestaurant.plan_id === "pro" || editingPlanRestaurant.plan_id === "business";
      const isNowPro = newPlanSelection === "pro" || newPlanSelection === "business";
      if (!wasPro && isNowPro) setStats((prev) => ({ ...prev, proTierCount: prev.proTierCount + 1 }));
      else if (wasPro && !isNowPro) setStats((prev) => ({ ...prev, proTierCount: Math.max(0, prev.proTierCount - 1) }));
      showMessage(`Plan updated to ${newPlanSelection.toUpperCase()} for ${editingPlanRestaurant.name}`);
      setEditingPlanRestaurant(null);
    } catch (err: any) {
      console.error("Error updating subscription plan:", err);
      showMessage(err.message || "Failed to update subscription plan", true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRestaurant = async (restaurant: AdminRestaurant) => {
    const confirmName = window.prompt(`Are you sure you want to permanently delete "${restaurant.name}"? Type the restaurant name to confirm:`);
    if (confirmName !== restaurant.name) {
      if (confirmName !== null) alert("Restaurant name did not match. Deletion cancelled.");
      return;
    }
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("restaurants").delete().eq("id", restaurant.id);
      if (error) throw error;
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      setStats((prev) => ({ ...prev, totalActiveRestaurants: restaurant.status === "active" ? Math.max(0, prev.totalActiveRestaurants - 1) : prev.totalActiveRestaurants, proTierCount: restaurant.plan_id === "pro" || restaurant.plan_id === "business" ? Math.max(0, prev.proTierCount - 1) : prev.proTierCount }));
      showMessage(`Restaurant ${restaurant.name} deleted permanently.`);
    } catch (err: any) {
      console.error("Error deleting restaurant:", err);
      showMessage(err.message || "Failed to delete restaurant", true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOnboardLead = async (lead: AdminLead) => {
    setIsUpdating(true);
    try {
      const { data: newRest, error: restError } = await supabase.from("restaurants").insert({ name: lead.restaurant_name, status: "active", scan_count: 0 }).select("id").single();
      if (restError) throw restError;
      await supabase.from("subscriptions").insert({ restaurant_id: newRest.id, plan_id: "pro", status: "active" });
      await supabase.from("store_profile").insert({ restaurant_id: newRest.id, store_name: lead.restaurant_name, social_phone: lead.phone });
      const { error: leadUpdateError } = await supabase.from("leads").update({ status: "onboarded", onboarded_restaurant_id: newRest.id, updated_at: new Date().toISOString() }).eq("id", lead.id);
      if (leadUpdateError) throw leadUpdateError;
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status: "onboarded", onboarded_restaurant_id: newRest.id } : l));
      const newlyCreatedRestaurant: AdminRestaurant = { id: newRest.id, name: lead.restaurant_name, status: "active", scan_count: 0, created_at: new Date().toISOString(), plan_id: "pro", plan_name: "Pro", dish_count: 0, category_count: 0 };
      setRestaurants((prev) => [newlyCreatedRestaurant, ...prev]);
      setStats((prev) => ({ ...prev, totalActiveRestaurants: prev.totalActiveRestaurants + 1, proTierCount: prev.proTierCount + 1, pendingLeadsCount: Math.max(0, prev.pendingLeadsCount - 1) }));
      showMessage(`Lead "${lead.restaurant_name}" successfully onboarded as a new Pro Restaurant!`);
    } catch (err: any) {
      console.error("Error onboarding lead:", err);
      showMessage(err.message || "Failed to onboard lead", true);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredRestaurants = useMemo(() => restaurants.filter((r) => {
    const matchesSearch = searchQuery === "" || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || (r.owner_email && r.owner_email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlan = planFilter === "all" || r.plan_id.toLowerCase() === planFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  }), [restaurants, searchQuery, planFilter, statusFilter]);

  const filteredLeads = useMemo(() => leads.filter((l) => {
    const matchesSearch = leadSearchQuery === "" || l.restaurant_name.toLowerCase().includes(leadSearchQuery.toLowerCase()) || l.contact_name.toLowerCase().includes(leadSearchQuery.toLowerCase()) || l.phone.includes(leadSearchQuery) || (l.city && l.city.toLowerCase().includes(leadSearchQuery.toLowerCase()));
    const matchesStatus = leadStatusFilter === "all" || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  }), [leads, leadSearchQuery, leadStatusFilter]);

  return (
    <div className="space-y-8">
      {actionSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-[#142318] border border-emerald-500/30 px-4 py-3 text-xs font-bold text-emerald-300 shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}
      {actionErrorMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-rose-950/90 border border-rose-500/30 px-4 py-3 text-xs font-bold text-rose-300 shadow-2xl">
          <AlertCircle className="h-4 w-4 text-rose-400" />
          <span>{actionErrorMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F6F1] tracking-tight">Platform Overview</h1>
          <p className="text-xs text-[#8C988E] mt-1">Real-time multi-tenant monitoring, subscription control, and lead conversions.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isUpdating}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#141C16] border border-[#2A362D] px-4 py-2.5 text-xs font-bold text-[#C5CEC7] hover:bg-[#1C261F] hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin text-[#C8F55A]" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-[#141C16] border border-[#2A362D] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C988E]">Active Restaurants</span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#F4F6F1] tracking-tight">{stats.totalActiveRestaurants}</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />Live Tenants
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-[#141C16] border border-[#2A362D] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C988E]">Pro & Business</span>
            <div className="h-9 w-9 rounded-2xl bg-[#C8F55A]/10 border border-[#C8F55A]/25 flex items-center justify-center text-[#C8F55A]">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#C8F55A] tracking-tight">{stats.proTierCount}</span>
            <span className="text-[11px] font-bold text-[#8C988E]">
              {stats.totalActiveRestaurants > 0 ? `${Math.round((stats.proTierCount / stats.totalActiveRestaurants) * 100)}% conversion` : "0%"}
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-[#141C16] border border-[#2A362D] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C988E]">Pending Leads</span>
            <div className="h-9 w-9 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400 tracking-tight">{stats.pendingLeadsCount}</span>
            <span className="text-[11px] font-semibold text-[#8C988E]">Awaiting Onboarding</span>
          </div>
        </div>

        <div className="rounded-3xl bg-[#141C16] border border-[#2A362D] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C988E]">Total Menu Scans</span>
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#F4F6F1] tracking-tight">{stats.totalScans.toLocaleString()}</span>
            <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
              <QrCode className="h-3 w-3" />Customer Views
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#2A362D] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("restaurants")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all ${
            activeTab === "restaurants"
              ? "bg-[#C8F55A] text-[#0F1410] shadow-md"
              : "bg-[#141C16] text-[#8C988E] hover:text-[#F4F6F1] hover:bg-[#1C261F] border border-[#2A362D]"
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
              ? "bg-[#C8F55A] text-[#0F1410] shadow-md"
              : "bg-[#141C16] text-[#8C988E] hover:text-[#F4F6F1] hover:bg-[#1C261F] border border-[#2A362D]"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Pending Leads ({leads.filter((l) => l.status === "pending").length})</span>
        </button>
      </div>

      {/* Tab 1: Restaurants Table */}
      {activeTab === "restaurants" && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6458]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants by name or ID..."
                className="h-11 w-full rounded-2xl border border-[#2A362D] bg-[#141C16] pl-10 pr-4 text-xs font-medium text-[#F4F6F1] placeholder:text-[#5A6458] outline-none focus:border-[#C8F55A] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={planFilter}
                onChange={(e: any) => setPlanFilter(e.target.value)}
                className="h-11 rounded-2xl border border-[#2A362D] bg-[#141C16] px-3.5 text-xs font-bold text-[#C5CEC7] outline-none focus:border-[#C8F55A]"
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="business">Business</option>
                <option value="free">Free</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="h-11 rounded-2xl border border-[#2A362D] bg-[#141C16] px-3.5 text-xs font-bold text-[#C5CEC7] outline-none focus:border-[#C8F55A]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#2A362D] bg-[#141C16]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#2A362D] bg-white/[0.02]">
                  <tr>
                    <th className="py-3.5 px-5 text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Restaurant</th>
                    <th className="py-3.5 px-4 text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Plan</th>
                    <th className="py-3.5 px-4 text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Dishes</th>
                    <th className="py-3.5 px-4 text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Scans</th>
                    <th className="py-3.5 px-4 text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Status</th>
                    <th className="py-3.5 px-4 text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Created</th>
                    <th className="py-3.5 px-5 text-right text-[10px] font-black uppercase tracking-wider text-[#8C988E]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A362D]/60">
                  {filteredRestaurants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-[#8C988E] text-sm font-medium">
                        No restaurants matched your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRestaurants.map((restaurant) => {
                      const isActive = restaurant.status === "active";
                      const isPending = restaurant.status === "pending";
                      const isPro = restaurant.plan_id === "pro" || restaurant.plan_id === "business";

                      return (
                        <tr key={restaurant.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#F4F6F1] text-sm">{restaurant.name}</span>
                                <Link
                                  href={`/menu?restaurantId=${restaurant.id}`}
                                  target="_blank"
                                  className="text-[#8C988E] hover:text-[#C8F55A] transition-colors"
                                  title="View Customer Menu"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </div>
                              <span className="text-[10px] font-mono text-[#5A6458] block truncate max-w-[200px]">
                                {restaurant.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isPro
                                  ? "bg-[#C8F55A]/10 text-[#C8F55A] border border-[#C8F55A]/30"
                                  : "bg-[#1C261F] text-[#8C988E] border border-[#2A362D]"
                              }`}
                            >
                              {isPro && <Crown className="h-2.5 w-2.5" />}
                              {restaurant.plan_name}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-[#C5CEC7]">
                              <UtensilsCrossed className="h-3.5 w-3.5 text-[#5A6458]" />
                              <span>{restaurant.dish_count}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-[#C5CEC7]">
                              <Eye className="h-3.5 w-3.5 text-blue-400" />
                              <span>{restaurant.scan_count.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : isPending
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isActive ? "bg-emerald-400 animate-pulse" : isPending ? "bg-amber-400" : "bg-rose-400"
                                }`}
                              />
                              {restaurant.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-[#8C988E] text-[11px] font-medium">
                            {new Date(restaurant.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isPending && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPlanRestaurant(restaurant);
                                    setNewPlanSelection(restaurant.plan_id);
                                  }}
                                  className="flex h-8 items-center gap-1 rounded-xl bg-[#1C261F] border border-[#2A362D] px-2.5 text-[11px] font-bold text-[#C5CEC7] hover:bg-[#253229] hover:text-white transition-all"
                                  title="Change subscription tier"
                                >
                                  <Edit2 className="h-3 w-3 text-[#C8F55A]" />
                                  <span className="hidden sm:inline">Plan</span>
                                </button>
                              )}
                              {isPending ? (
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[11px] font-bold text-amber-300">
                                  <Clock className="h-3 w-3" />Awaiting approval
                                </span>
                              ) : (
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
                                  <span className="hidden sm:inline">{isActive ? "Disable" : "Enable"}</span>
                                </button>
                              )}
                              {!isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRestaurant(restaurant)}
                                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C261F] border border-[#2A362D] text-[#8C988E] hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all"
                                  title="Delete restaurant"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
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

      {/* Tab 2: Leads Management */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6458]" />
              <input
                type="search"
                value={leadSearchQuery}
                onChange={(e) => setLeadSearchQuery(e.target.value)}
                placeholder="Search leads by restaurant name, contact, phone, or city..."
                className="h-11 w-full rounded-2xl border border-[#2A362D] bg-[#141C16] pl-10 pr-4 text-xs font-medium text-[#F4F6F1] placeholder:text-[#5A6458] outline-none focus:border-[#C8F55A] transition-all"
              />
            </div>
            <select
              value={leadStatusFilter}
              onChange={(e: any) => setLeadStatusFilter(e.target.value)}
              className="h-11 rounded-2xl border border-[#2A362D] bg-[#141C16] px-3.5 text-xs font-bold text-[#C5CEC7] outline-none focus:border-[#C8F55A]"
            >
              <option value="all">All Lead Statuses</option>
              <option value="pending">Pending</option>
              <option value="onboarded">Onboarded</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-3xl bg-[#141C16] border border-[#2A362D] text-[#8C988E] font-medium">
                No leads matched your criteria.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isPending = lead.status === "pending";
                const isOnboarded = lead.status === "onboarded";

                return (
                  <div
                    key={lead.id}
                    className="rounded-3xl bg-[#141C16] border border-[#2A362D] p-5 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-black text-[#F4F6F1] leading-tight">{lead.restaurant_name}</h3>
                          <span className="text-xs font-bold text-[#8C988E] block mt-0.5">Contact: {lead.contact_name}</span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isPending
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : isOnboarded
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-[#1C261F] text-[#8C988E] border border-[#2A362D]"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-[#2A362D]/60 text-xs text-[#C5CEC7]">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-[#C8F55A]" />
                          <a href={`tel:${lead.phone}`} className="hover:underline font-semibold">
                            {lead.phone}
                          </a>
                        </div>
                        {lead.city && (
                          <div className="flex items-center gap-2 text-[#8C988E]">
                            <MapPin className="h-3.5 w-3.5 text-[#5A6458]" />
                            <span>{lead.city}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[#5A6458] text-[11px]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Submitted: {new Date(lead.submitted_at).toLocaleDateString()}</span>
                        </div>
                        {lead.notes && (
                          <p className="mt-2 text-xs text-[#8C988E] italic bg-white/[0.02] p-2.5 rounded-xl border border-[#2A362D]/60">
                            &quot;{lead.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#2A362D]/60">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleOnboardLead(lead)}
                          disabled={isUpdating}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#C8F55A] py-3 text-xs font-black text-[#0F1410] hover:bg-[#b5e048] active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
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
                        <span className="text-xs text-[#5A6458] font-medium">No actions available</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Plan Edit Modal */}
      {editingPlanRestaurant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setEditingPlanRestaurant(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#141C16] border border-[#2A362D] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C8F55A]">
                  Manage Subscription
                </span>
                <h3 className="text-lg font-black text-[#F4F6F1]">{editingPlanRestaurant.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlanRestaurant(null)}
                className="p-1 text-[#8C988E] hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-[#C5CEC7]">Select Subscription Tier:</label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: "starter", name: "Starter", desc: "Up to 50 dishes", price: "69,000 MMK/year" },
                  { id: "pro", name: "Pro", desc: "Up to 100 dishes", price: "125,000 MMK/year" },
                  { id: "business", name: "Business", desc: "Unlimited dishes", price: "165,000 MMK/month" },
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setNewPlanSelection(plan.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      newPlanSelection === plan.id
                        ? "bg-[#C8F55A]/10 border-[#C8F55A] text-white shadow-sm"
                        : "bg-[#1C261F] border-[#2A362D] text-[#8C988E] hover:border-[#3D4C40] hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#F4F6F1]">{plan.name}</span>
                        {plan.id === "pro" && (
                          <span className="rounded bg-[#C8F55A] px-1.5 py-0.2 text-[8px] font-black uppercase text-[#0F1410]">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C988E] mt-0.5">{plan.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#C8F55A] block">{plan.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#2A362D]">
              <button
                type="button"
                onClick={() => setEditingPlanRestaurant(null)}
                className="flex-1 rounded-2xl border border-[#2A362D] py-3 text-xs font-bold text-[#8C988E] hover:bg-[#1C261F] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                disabled={isUpdating}
                className="flex-1 rounded-2xl bg-[#C8F55A] py-3 text-xs font-black text-[#0F1410] hover:bg-[#b5e048] active:scale-[0.98] transition-all disabled:opacity-50"
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
