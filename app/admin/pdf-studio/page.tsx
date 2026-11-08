import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/admin-auth";
import PdfMenuStudio, { type PdfRestaurant } from "@/components/PdfMenuStudio";

export const metadata = {
  title: "PDF Menu Studio — MOSS Super Admin",
  robots: { index: false, follow: false },
};

export default async function PdfStudioPage() {
  const supabase = await createClient();

  // ── Authorization (server-side, same pattern as AdminOverviewContent) ──
  const { isAdminOrStaff } = await getCurrentUserRole(supabase);
  if (!isAdminOrStaff) {
    redirect("/protected");
  }

  // ── Fetch all restaurants with PDF-related fields ──
  // We cast the select result because database.types.ts was generated before
  // the PDF migrations were applied. The columns exist in the live DB once
  // the migrations are run (see MANUAL SETUP section in the implementation notes).
  const { data: rows, error } = await supabase
    .from("restaurants")
    .select("id, name, status, menu_mode, menu_pdf_path")
    .order("name", { ascending: true });

  if (error) {
    // If the columns don't exist yet (migrations not applied), we fall back
    // to basic restaurant data so the page doesn't crash.
    const { data: basicRows } = await supabase
      .from("restaurants")
      .select("id, name, status")
      .order("name", { ascending: true });

    const restaurants: PdfRestaurant[] = (basicRows ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      menu_mode: null,
      menu_pdf_path: null,
    }));

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", ".app") ||
      "http://localhost:3000";

    return (
      <div className="space-y-6">
        <div className="p-4 bg-amber-950/60 border border-amber-500/30 rounded-2xl text-xs text-amber-300 font-medium">
          ⚠️ PDF columns (<code>menu_mode</code>, <code>menu_pdf_path</code>) are not yet in the live database.
          Please apply the PDF migrations before uploading. Restaurant selection is still available.
        </div>
        <PdfMenuStudio restaurants={restaurants} baseUrl={baseUrl} />
      </div>
    );
  }

  const restaurants: PdfRestaurant[] = (rows ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    status: r.status,
    menu_mode: r.menu_mode ?? null,
    menu_pdf_path: r.menu_pdf_path ?? null,
  }));

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  return <PdfMenuStudio restaurants={restaurants} baseUrl={baseUrl} />;
}
