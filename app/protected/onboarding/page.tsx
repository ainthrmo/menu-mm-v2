"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Unauthorized. Please login again.");

      const { error: insertError } = await supabase
        .from("restaurants")
        .insert({
          name: restaurantName.trim(),
          owner_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push("/protected");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F1EA] flex items-center justify-center px-5 py-10 text-[#2B2A26]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B2A26]"
            aria-hidden="true"
          >
            <span
              className="text-base font-bold leading-none text-[#A8CC3C]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Q
            </span>
          </div>
          <h1
            className="text-3xl font-medium tracking-[-0.02em]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Welcome to Moss QR
          </h1>
          <p className="mt-2 text-sm leading-6 text-[rgba(43,42,38,0.62)]">
            Let&apos;s set up your restaurant before creating your digital menu.
          </p>
        </div>

        <div className="rounded-2xl border border-[rgba(43,42,38,0.10)] bg-[#FAF8F3] p-7 shadow-[0_12px_40px_rgba(43,42,38,0.06)]">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateRestaurant} className="space-y-5">
            <div>
              <label
                htmlFor="restaurant-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(43,42,38,0.58)]"
              >
                Restaurant Name
              </label>
              <input
                id="restaurant-name"
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g., Yangon Cafe & Bar"
                required
                className="w-full rounded-xl border border-[rgba(43,42,38,0.14)] bg-[#F4F1EA] px-4 py-3.5 text-sm text-[#2B2A26] outline-none transition focus:border-[#A8CC3C] focus:ring-2 focus:ring-[#A8CC3C]/25 placeholder:text-[rgba(43,42,38,0.38)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2B2A26] px-4 py-3.5 text-sm font-medium text-[#F4F1EA] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Restaurant..." : "Create Restaurant & Continue"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
