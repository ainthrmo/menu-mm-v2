"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  Receipt,
  CheckCircle2,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
  Filter,
  Check,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import type { ServiceRequest, RestaurantTable } from "@/lib/services/table-service";
import {
  listServiceRequests,
  updateServiceRequestStatus,
  listRestaurantTables,
} from "@/lib/services/table-service";
import { createClient } from "@/lib/supabase/client";

interface ServiceRequestFeedProps {
  restaurantId: string;
}

export const ServiceRequestFeed: React.FC<ServiceRequestFeedProps> = ({ restaurantId }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [tablesMap, setTablesMap] = useState<Record<string, RestaurantTable>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "call_waiter" | "request_bill">("all");
  const [filterStatus, setFilterStatus] = useState<"pending" | "completed">("pending");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const channelRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  // 1. Fetch tables map to display human-friendly table numbers & labels
  const loadTables = useCallback(async () => {
    if (!restaurantId || restaurantId === "demo") return;
    try {
      const supabase = createClient();
      const tables = await listRestaurantTables(supabase, restaurantId);
      const map: Record<string, RestaurantTable> = {};
      tables.forEach((t) => {
        map[t.id] = t;
      });
      setTablesMap(map);
    } catch (err) {
      console.error("Failed to load tables for service request feed:", err);
    }
  }, [restaurantId]);

  // 2. Fetch requests (defaulting to current filterStatus)
  const fetchRequests = useCallback(
    async (isManual = false) => {
      if (!restaurantId || restaurantId === "demo") {
        setLoading(false);
        return;
      }

      if (isManual) {
        setRefreshing(true);
      }

      try {
        const supabase = createClient();
        const data = await listServiceRequests(supabase, restaurantId, {
          status: filterStatus,
        });
        setRequests(data);
        setActionError(null);
      } catch (err: any) {
        console.error("Failed to fetch service requests:", err);
        setActionError(err.message || "Failed to load service requests.");
      } finally {
        setLoading(false);
        if (isManual) {
          setRefreshing(false);
        }
      }
    },
    [restaurantId, filterStatus],
  );

  // Initial load
  useEffect(() => {
    loadTables();
    fetchRequests();
  }, [loadTables, fetchRequests]);

  // 3. Realtime subscription with reconnect fallback & periodic polling backup (every 25s)
  useEffect(() => {
    if (!restaurantId || restaurantId === "demo") return;

    const supabase = createClient();

    const setupSubscription = () => {
      // Clean up previous channel if any
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(`service_requests_${restaurantId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "service_requests",
            filter: `restaurant_id=eq.${restaurantId}`,
          },
          (payload: any) => {
            const eventType = payload.eventType;
            const newRecord = payload.new as ServiceRequest;
            const oldRecord = payload.old as { id?: string };

            if (eventType === "INSERT") {
              // Add to feed if matching current view filter
              setRequests((prev) => {
                const exists = prev.some((r) => r.id === newRecord.id);
                if (exists) return prev;
                // If we are viewing pending and this is pending, prepend
                if (filterStatus === "pending" && newRecord.status === "pending") {
                  return [newRecord, ...prev];
                }
                return prev;
              });
            } else if (eventType === "UPDATE") {
              setRequests((prev) => {
                if (filterStatus === "pending") {
                  // If it's no longer pending, remove from view
                  if (newRecord.status !== "pending") {
                    return prev.filter((r) => r.id !== newRecord.id);
                  }
                  // Otherwise update in place
                  return prev.map((r) => (r.id === newRecord.id ? newRecord : r));
                } else if (filterStatus === "completed") {
                  // If viewing completed and status is completed, update or add
                  if (newRecord.status === "completed") {
                    const exists = prev.some((r) => r.id === newRecord.id);
                    return exists
                      ? prev.map((r) => (r.id === newRecord.id ? newRecord : r))
                      : [newRecord, ...prev];
                  }
                  return prev.filter((r) => r.id !== newRecord.id);
                }
                return prev;
              });
            } else if (eventType === "DELETE") {
              setRequests((prev) => prev.filter((r) => r.id !== oldRecord.id));
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsRealtimeConnected(true);
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setIsRealtimeConnected(false);
            // Schedule reconnect attempt
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            reconnectTimeoutRef.current = setTimeout(() => {
              setupSubscription();
            }, 5000);
          }
        });

      channelRef.current = channel;
    };

    setupSubscription();

    // Periodic heartbeat / polling fallback every 25 seconds
    const interval = setInterval(() => {
      fetchRequests(false);
    }, 25000);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      clearInterval(interval);
    };
  }, [restaurantId, filterStatus, fetchRequests]);

  // 4. Mark request completed
  const handleCompleteRequest = async (requestId: string) => {
    setCompletingId(requestId);
    setActionError(null);

    try {
      const supabase = createClient();
      await updateServiceRequestStatus(supabase, requestId, restaurantId, "completed");

      // Optimistically remove from pending view or update status
      setRequests((prev) => {
        if (filterStatus === "pending") {
          return prev.filter((r) => r.id !== requestId);
        }
        return prev.map((r) =>
          r.id === requestId
            ? { ...r, status: "completed", completed_at: new Date().toISOString() }
            : r,
        );
      });
    } catch (err: any) {
      console.error("Failed to complete request:", err);
      setActionError(err.message || "Failed to complete request.");
    } finally {
      setCompletingId(null);
    }
  };

  // Helper formatting for time elapsed (e.g. "2m ago", "Just now")
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = Date.now();
      const past = new Date(dateStr).getTime();
      const diffSecs = Math.floor((now - past) / 1000);

      if (diffSecs < 60) return "Just now";
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (filterType === "all") return true;
    return r.request_type === filterType;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#1e2417]/10 p-6 rounded-3xl shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b2414] text-[#c8f04a] shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1e2417] tracking-tight">Service Requests</h2>
                {isRealtimeConnected ? (
                  <span
                    title="Realtime connected"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live</span>
                  </span>
                ) : (
                  <span
                    title="Reconnecting / Polling fallback active"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                  >
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>Reconnecting</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#57604f] mt-0.5">
                Real-time waiter calls and bill requests from customer tables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRequests(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1e2417]/15 bg-white hover:bg-[#f6f2e8] text-xs font-bold text-[#1e2417] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-medium">
          {actionError}
        </div>
      )}

      {/* Control Tabs: Status toggle & Type filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#1e2417]/10 p-3 rounded-2xl shadow-2xs">
        {/* Status Pill Toggle: Pending vs Completed */}
        <div className="flex items-center p-1 bg-[#f6f2e8] rounded-xl border border-[#1e2417]/10">
          <button
            onClick={() => setFilterStatus("pending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === "pending"
                ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                : "text-[#57604f] hover:text-[#1e2417]"
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && filterStatus === "pending" && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#c8f04a] text-[#1b2414]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterStatus === "completed"
                ? "bg-[#1b2414] text-[#c8f04a] shadow-xs"
                : "text-[#57604f] hover:text-[#1e2417]"
            }`}
          >
            <span>Completed</span>
          </button>
        </div>

        {/* Request Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-semibold text-[#57604f] mr-1 hidden sm:inline">Type:</span>
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              filterType === "all"
                ? "bg-[#1b2414] text-white border-[#1b2414]"
                : "bg-white text-[#57604f] border-[#1e2417]/15 hover:bg-[#f6f2e8]"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setFilterType("call_waiter")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              filterType === "call_waiter"
                ? "bg-[#1b2414] text-white border-[#1b2414]"
                : "bg-white text-[#57604f] border-[#1e2417]/15 hover:bg-[#f6f2e8]"
            }`}
          >
            <Bell className="w-3 h-3" />
            <span>Waiter</span>
          </button>
          <button
            onClick={() => setFilterType("request_bill")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              filterType === "request_bill"
                ? "bg-[#1b2414] text-white border-[#1b2414]"
                : "bg-white text-[#57604f] border-[#1e2417]/15 hover:bg-[#f6f2e8]"
            }`}
          >
            <Receipt className="w-3 h-3" />
            <span>Bill</span>
          </button>
        </div>
      </div>

      {/* Requests Feed List */}
      {loading ? (
        <div className="bg-white border border-[#1e2417]/10 p-12 rounded-3xl text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#1b2414] mx-auto" />
          <p className="text-xs text-[#57604f] font-medium">Loading service requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-dashed border-[#1e2417]/20 rounded-3xl p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-[#f6f2e8] flex items-center justify-center mx-auto text-[#1b2414]">
            {filterStatus === "pending" ? <Bell className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <h3 className="text-sm font-bold text-[#1e2417]">
            {filterStatus === "pending" ? "No pending service requests" : "No completed requests"}
          </h3>
          <p className="text-xs text-[#57604f] max-w-sm mx-auto leading-relaxed">
            {filterStatus === "pending"
              ? "New waiter calls and bill requests from customers scanning table QR codes will appear here in real-time."
              : "Requests you complete will be archived here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredRequests.map((req) => {
            const table = tablesMap[req.table_id];
            const tableDisplay = table
              ? `Table ${table.table_number.length === 1 ? `0${table.table_number}` : table.table_number}`
              : "Table";
            const tableLabel = table?.label;
            const isCallWaiter = req.request_type === "call_waiter";
            const isPending = req.status === "pending";
            const isCompleting = completingId === req.id;

            return (
              <div
                key={req.id}
                className={`bg-white border p-4.5 rounded-2xl shadow-2xs transition-all flex flex-col justify-between gap-3 ${
                  isPending ? "border-[#1b2414]/20 hover:border-[#1b2414]" : "border-[#1e2417]/10 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCallWaiter
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-blue-100 text-blue-900 border border-blue-200"
                      }`}
                    >
                      {isCallWaiter ? <Bell className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#1e2417] tracking-tight">
                          {isCallWaiter ? "Call Waiter" : "Request Bill"}
                        </span>
                        {isPending ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        )}
                      </div>

                      {/* Table Identifier */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#1e2417] font-semibold">
                        <span className="px-2 py-0.5 rounded-md bg-[#1b2414] text-[#c8f04a] text-[11px] font-black">
                          {tableDisplay}
                        </span>
                        {tableLabel && <span className="text-[#57604f] font-normal">({tableLabel})</span>}
                      </div>

                      {/* Notes if provided */}
                      {req.notes && (
                        <p className="mt-1.5 text-xs text-[#57604f] bg-[#f6f2e8] p-2 rounded-lg italic">
                          "{req.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time badge */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 text-[11px] text-[#57604f] font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(req.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Complete button */}
                {isPending && (
                  <div className="pt-2 border-t border-[#1e2417]/10 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleCompleteRequest(req.id)}
                      disabled={isCompleting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1b2414] text-[#c8f04a] text-xs font-bold hover:bg-black transition-all shadow-xs active:scale-95 disabled:opacity-50"
                    >
                      {isCompleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Complete Request</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
