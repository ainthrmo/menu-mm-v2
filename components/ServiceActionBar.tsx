"use client";

import React, { useState } from "react";
import { Bell, Receipt, Check, Loader2, AlertCircle } from "lucide-react";
import { useTableContext } from "@/components/TableContext";
import { createServiceRequest } from "@/lib/services/table-service";
import { createClient } from "@/lib/supabase/client";

interface ServiceActionBarProps {
  restaurantId: string;
}

export const ServiceActionBar: React.FC<ServiceActionBarProps> = ({ restaurantId }) => {
  const { activeTable } = useTableContext();
  const [loadingType, setLoadingType] = useState<"call_waiter" | "request_bill" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Client-side debounce / cooldown tracker (timestamp in ms)
  const [lastRequestedTime, setLastRequestedTime] = useState<{
    call_waiter: number;
    request_bill: number;
  }>({
    call_waiter: 0,
    request_bill: 0,
  });

  // Do not render anything if no active table context exists or restaurantId is invalid
  if (!activeTable || !restaurantId || restaurantId === "demo") {
    return null;
  }

  const handleRequest = async (requestType: "call_waiter" | "request_bill") => {
    // 15 seconds client-side cooldown per action
    const COOLDOWN_MS = 15000;
    const now = Date.now();
    const lastTime = lastRequestedTime[requestType];

    if (now - lastTime < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
      setErrorMessage(`Please wait ${remainingSeconds}s before requesting again.`);
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setLoadingType(requestType);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      await createServiceRequest(supabase, {
        restaurantId,
        tableId: activeTable.id,
        requestType,
      });

      // Update cooldown tracker
      setLastRequestedTime((prev) => ({
        ...prev,
        [requestType]: Date.now(),
      }));

      const actionText = requestType === "call_waiter" ? "Waiter called" : "Bill requested";
      setSuccessMessage(`${actionText}! Staff has been notified.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error("Service request error:", err);
      // Clean up common error messages
      const msg = err.message || "Failed to send request. Please try again.";
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="w-full mt-3 pt-3 border-t border-[#F0EEEA]">
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => handleRequest("call_waiter")}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#111111] text-xs font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50"
        >
          {loadingType === "call_waiter" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111111]" />
          ) : (
            <Bell className="w-3.5 h-3.5 text-[#111111]" />
          )}
          <span>Call Waiter</span>
        </button>

        <button
          type="button"
          onClick={() => handleRequest("request_bill")}
          disabled={loadingType !== null}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#111111] text-xs font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50"
        >
          {loadingType === "request_bill" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111111]" />
          ) : (
            <Receipt className="w-3.5 h-3.5 text-[#111111]" />
          )}
          <span>Request Bill</span>
        </button>
      </div>

      {/* Success Notification Feedback */}
      {successMessage && (
        <div className="mt-2 flex items-center gap-1.5 p-2 rounded-xl bg-[#111111] text-[#CDF22B] text-xs font-medium animate-fadeIn shadow-xs">
          <Check className="w-3.5 h-3.5 shrink-0 text-[#CDF22B]" />
          <span className="truncate">{successMessage}</span>
        </div>
      )}

      {/* Error / Cooldown Feedback */}
      {errorMessage && (
        <div className="mt-2 flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
