"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Client-side supabase client

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
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Unauthorized. Please login again.");

      // 2. Insert new restaurant linked to owner_id
      const { data, error: insertError } = await supabase
        .from("restaurants")
        .insert({
          name: restaurantName.trim(),
          owner_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Success -> Redirect back to dashboard (PostgreSQL trigger on_restaurant_created_subscription automatically provisions initial FREE subscription)
      router.push("/protected");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E5E5E5] rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#111111]">Welcome to Menuu! 🚀</h1>
          <p className="text-sm text-[#666666] mt-1">
            Let's set up your restaurant before creating your digital menu.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateRestaurant} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="e.g., Yangon Cafe & Bar"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#1E45FB] bg-white text-[#111111]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#1E45FB] hover:bg-[#1737C9] text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Creating Restaurant..." : "Create Restaurant & Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}