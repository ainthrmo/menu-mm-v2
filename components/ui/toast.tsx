"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  visible: boolean;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, message, visible: false }]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
          );
        });
      });
      const timer = setTimeout(() => dismiss(id), 3000);
      timerMap.current.set(id, timer);
    },
    [dismiss]
  );

  useEffect(() => {
    return () => {
      timerMap.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const ctx: ToastContextValue = {
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    info: (msg) => addToast("info", msg),
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />,
    error: <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />,
    info: <Info className="h-4 w-4 shrink-0 text-[#1E45FB]" />,
  };

  const accents: Record<ToastType, string> = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-[#1E45FB]",
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-xs w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto relative flex items-start gap-3 rounded-2xl bg-white border border-[#E5E5E5] shadow-xl px-4 py-3 transition-all duration-300 ${
              toast.visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[110%]"
            }`}
          >
            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${accents[toast.type]}`} />
            <div className="pl-2 flex items-start gap-3 flex-1 min-w-0">
              {icons[toast.type]}
              <p className="text-xs font-semibold text-[#111111] leading-relaxed flex-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 p-0.5 rounded text-[#888888] hover:text-[#111111] transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
