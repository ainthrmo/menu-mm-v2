"use client";

import React, { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import {
  listRestaurantTables,
  createRestaurantTable,
  updateRestaurantTable,
  toggleTableStatus,
  type RestaurantTable,
} from "@/lib/services/table-service";
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Hash,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";

interface TableManagementSectionProps {
  supabase: SupabaseClient<Database>;
  restaurantId: string;
  storeName: string;
}

export const TableManagementSection: React.FC<TableManagementSectionProps> = ({
  supabase,
  restaurantId,
  storeName,
}) => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [tableLabel, setTableLabel] = useState("");
  const [tableIsActive, setTableIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchTables = async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const data = await listRestaurantTables(supabase, restaurantId);
      setTables(data);
    } catch (err: any) {
      console.error("Failed to load tables:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [restaurantId]);

  const handleOpenAddModal = () => {
    setEditingTable(null);
    setTableNumber("");
    setTableLabel("");
    setTableIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: RestaurantTable) => {
    setEditingTable(t);
    setTableNumber(t.table_number);
    setTableLabel(t.label || "");
    setTableIsActive(t.is_active);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setErrorMessage("Table number is required.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      if (editingTable) {
        // Edit
        await updateRestaurantTable(supabase, editingTable.id, restaurantId, {
          tableNumber: tableNumber.trim(),
          label: tableLabel.trim() || null,
          isActive: tableIsActive,
        });
      } else {
        // Create
        await createRestaurantTable(supabase, {
          restaurantId,
          tableNumber: tableNumber.trim(),
          label: tableLabel.trim() || null,
          isActive: tableIsActive,
        });
      }

      setIsModalOpen(false);
      await fetchTables();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save table.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (table: RestaurantTable) => {
    try {
      setTogglingId(table.id);
      const nextStatus = !table.is_active;
      await toggleTableStatus(supabase, table.id, restaurantId, nextStatus);
      setTables((prev) =>
        prev.map((t) => (t.id === table.id ? { ...t, is_active: nextStatus } : t))
      );
    } catch (err: any) {
      console.error("Failed to toggle table status:", err);
      alert(err.message || "Failed to update table status.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredTables = tables.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.table_number.toLowerCase().includes(q) ||
      (t.label && t.label.toLowerCase().includes(q));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && t.is_active) ||
      (filterStatus === "inactive" && !t.is_active);

    return matchesSearch && matchesStatus;
  });

  const activeCount = tables.filter((t) => t.is_active).length;
  const inactiveCount = tables.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#1e2417]/10 p-6 rounded-3xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#f6f2e8] text-[#1b2414]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e2417] tracking-tight">Tables & Dining Areas</h2>
              <p className="text-xs text-[#57604f]">
                Manage physical tables, dining labels, and active states for <strong className="text-[#1e2417] font-semibold">{storeName}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1b2414] text-[#c8f04a] px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-black active:scale-95 transition-all shadow-xs min-h-[42px] shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Table
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#1e2417]/10 p-4.5 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#57604f]">Total Tables</p>
            <p className="text-2xl font-black text-[#1e2417] mt-1">{tables.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#f6f2e8] flex items-center justify-center text-[#1b2414]">
            <Hash className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#1e2417]/10 p-4.5 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#57604f]">Active Tables</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#1e2417]/10 p-4.5 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#57604f]">Disabled / Inactive</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{inactiveCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#1e2417]/10 p-3.5 sm:p-4 rounded-3xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-2xs">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57604f]" />
          <input
            type="text"
            placeholder="Search by table number or label..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f6f2e8]/40 border border-[#1e2417]/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#1e2417] focus:outline-none focus:ring-2 focus:ring-[#1b2414]/20 focus:border-[#1b2414] transition-all placeholder:text-[#57604f]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#f6f2e8] p-1 rounded-2xl border border-[#1e2417]/10 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "all"
                ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                : "text-[#57604f] hover:text-[#1e2417]"
            }`}
          >
            All ({tables.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "active"
                ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                : "text-[#57604f] hover:text-[#1e2417]"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus("inactive")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "inactive"
                ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                : "text-[#57604f] hover:text-[#1e2417]"
            }`}
          >
            Disabled ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Tables Grid / List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#57604f] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1b2414]" />
          <p className="text-xs font-medium">Loading restaurant tables...</p>
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="bg-white border border-[#1e2417]/10 rounded-3xl p-12 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 bg-[#f6f2e8] rounded-2xl flex items-center justify-center mx-auto text-[#1b2414]">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-[#1e2417]">No tables found</h3>
            <p className="text-xs text-[#57604f] mt-1 leading-relaxed">
              {searchQuery || filterStatus !== "all"
                ? "No tables match your current search or filter criteria."
                : "Add your tables here (e.g. Table 1, Table 2, VIP Booth). Each table can then be paired with an individual QR code."}
            </p>
          </div>
          {(!searchQuery && filterStatus === "all") && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 bg-[#1b2414] text-[#c8f04a] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add First Table
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((t) => {
            const isToggling = togglingId === t.id;
            return (
              <div
                key={t.id}
                className={`bg-white border rounded-3xl p-5 shadow-2xs transition-all flex flex-col justify-between ${
                  t.is_active
                    ? "border-[#1e2417]/10 hover:border-[#1e2417]/20"
                    : "border-slate-200 bg-slate-50/60 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                          t.is_active
                            ? "bg-[#1b2414] text-[#c8f04a]"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {t.table_number}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1e2417] truncate">
                            Table {t.table_number}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.is_active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {t.is_active ? "Active" : "Disabled"}
                          </span>
                        </div>
                        {t.label ? (
                          <p className="text-xs text-[#57604f] mt-0.5 truncate flex items-center gap-1 font-medium">
                            <Tag className="w-3 h-3 text-[#57604f]" /> {t.label}
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#57604f]/70 mt-0.5 italic">No label set</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="p-2 rounded-xl text-[#57604f] hover:text-[#1e2417] hover:bg-[#f6f2e8] transition-colors"
                      title="Edit table details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1e2417]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#57604f] font-mono">
                    Token: {t.qr_token ? t.qr_token.slice(0, 8) + "..." : t.table_number}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(t)}
                    disabled={isToggling}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      t.is_active
                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    } disabled:opacity-50`}
                  >
                    {isToggling && <Loader2 className="w-3 h-3 animate-spin" />}
                    {t.is_active ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Table Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl border border-[#1e2417]/10 p-6 space-y-5 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1e2417]/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1e2417]">
                  {editingTable ? "Edit Table" : "Add New Table"}
                </h3>
                <p className="text-xs text-[#57604f] mt-0.5">
                  {editingTable
                    ? `Update settings for Table ${editingTable.table_number}`
                    : "Add a table to generate individual QR codes and manage service"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#f6f2e8] transition-colors text-[#57604f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1e2417] mb-1.5">
                  Table Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1, 12, A3, VIP-1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-[#f6f2e8]/40 border border-[#1e2417]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1e2417] focus:outline-none focus:border-[#1b2414] font-medium"
                />
                <p className="text-[11px] text-[#57604f] mt-1">
                  Must be unique across your restaurant.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e2417] mb-1.5">
                  Dining Area / Label <span className="text-[11px] font-normal text-[#57604f]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Window Seat, Balcony, Main Hall, 2nd Floor"
                  value={tableLabel}
                  onChange={(e) => setTableLabel(e.target.value)}
                  className="w-full bg-[#f6f2e8]/40 border border-[#1e2417]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1e2417] focus:outline-none focus:border-[#1b2414] font-medium"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#f6f2e8]/40 border border-[#1e2417]/10 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-[#1e2417] block">Active Status</span>
                  <span className="text-[11px] text-[#57604f]">
                    {tableIsActive
                      ? "Table is currently open and can receive service requests."
                      : "Table is closed / disabled from receiving requests."}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={tableIsActive}
                  onChange={(e) => setTableIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1b2414] border-[#1e2417]/20 focus:ring-[#1b2414] cursor-pointer accent-[#1b2414] shrink-0"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1e2417]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#1e2417]/15 text-[#1e2417] text-xs font-bold hover:bg-[#f6f2e8] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#1b2414] text-[#c8f04a] text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 min-h-[38px]"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingTable ? "Update Table" : "Create Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
