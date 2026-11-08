import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/admin-auth";
import { signOutAction } from "@/app/auth/actions";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  Users,
  UtensilsCrossed,
  ShieldAlert,
  LogOut,
  ChevronRight,
  ExternalLink,
  FileText,
} from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login?next=/admin");
  }

  const { role, isAdminOrStaff } = await getCurrentUserRole(supabase);

  // If user is not admin or staff, restrict access with a clean unauthorized view
  if (!isAdminOrStaff) {
    return (
      <div className="min-h-screen bg-[#0F1410] text-[#F4F6F1] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-[#141C16] border border-[#2A362D] p-8 text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">Access Restricted</h1>
            <p className="text-sm text-[#8C988E] leading-relaxed">
              This area is strictly reserved for MOSSQR Super Administrators and Staff.
              Your current account role is <span className="font-semibold text-[#F4F6F1] uppercase">{role}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/protected"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8F55A] px-5 py-3 text-xs font-black text-[#0F1410] hover:bg-[#b5e048] active:scale-[0.98] transition-all"
            >
              Go to Restaurant Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/menu?restaurantId=50094dc1-dd94-41a6-a29a-d4ab223d3717"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1C261F] border border-[#2A362D] px-5 py-3 text-xs font-bold text-[#C5CEC7] hover:bg-[#253229] hover:text-white transition-all"
            >
              Explore Live Demo Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1410] text-[#F4F6F1] font-sans antialiased selection:bg-[#C8F55A] selection:text-[#0F1410]">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#141C16]/90 backdrop-blur-xl border-b border-[#2A362D] px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-[#C8F55A] flex items-center justify-center text-[#0F1410] font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-[#F4F6F1]">MOSSQR</span>
                <span className="rounded-md bg-[#1C261F] border border-[#2A362D] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#C8F55A]">
                  Super Admin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#F4F6F1] bg-[#1C261F] border border-[#2A362D] transition-all"
              >
                <LayoutDashboard className="h-4 w-4 text-[#C8F55A]" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/menu-parser"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#8C988E] hover:text-[#F4F6F1] hover:bg-[#1C261F] transition-all"
              >
                <UtensilsCrossed className="h-4 w-4" />
                <span>AI Menu Parser</span>
              </Link>
              <Link
                href="/admin/pdf-studio"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#8C988E] hover:text-[#F4F6F1] hover:bg-[#1C261F] transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>PDF Studio</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-[#F4F6F1] leading-tight">{user.email}</span>
              <span className="text-[10px] font-semibold text-[#C8F55A] uppercase tracking-wider">
                {role} mode
              </span>
            </div>

            <Link
              href="/protected"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#1C261F] border border-[#2A362D] px-3 py-1.5 text-xs font-bold text-[#C5CEC7] hover:bg-[#253229] hover:text-white transition-all"
              title="Open Owner Dashboard"
            >
              <span>Owner View</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <form
              action={async () => {
                "use server";
                await signOutAction();
              }}
            >
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2A362D] bg-[#1C261F] text-[#8C988E] hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
