"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface PendingRestaurant {
  id: string;
  name: string;
  created_at: string;
}

interface PendingApprovalsPanelProps {
  initialRestaurants: PendingRestaurant[];
}

export default function PendingApprovalsPanel({
  initialRestaurants,
}: PendingApprovalsPanelProps) {
  const supabase = createClient();
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleApprove = async (restaurant: PendingRestaurant) => {
    setApprovingId(restaurant.id);

    try {
      const { error } = await supabase
        .from("restaurants")
        .update({ status: "active" })
        .eq("id", restaurant.id)
        .eq("status", "pending");

      if (error) throw error;

      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
    } catch (error: any) {
      console.error("Error approving restaurant:", error);
      window.alert(error?.message || "Failed to approve restaurant");
    } finally {
      setApprovingId(null);
    }
  };

  if (restaurants.length === 0) return null;

  return (
    <section className="rounded-3xl bg-[#15151A] border border-amber-500/20 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-black text-white">Pending Approvals</h2>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400">
              {restaurants.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Review new restaurants before giving them dashboard access.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Store className="h-4 w-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{restaurant.name}</p>
                <p className="text-[10px] text-neutral-500">
                  Signed up {new Date(restaurant.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleApprove(restaurant)}
              disabled={approvingId === restaurant.id}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CDF22B] px-4 py-2.5 text-xs font-black text-black hover:bg-[#bce022] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {approvingId === restaurant.id ? "Approving..." : "Approve"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
