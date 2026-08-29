import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/admin-auth";
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
} from "lucide-react";

export const instant = false;

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
      <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-[#1A1A1E] border border-white/10 p-8 text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">Access Restricted</h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              This area is strictly reserved for MOSSQR Super Administrators and Staff.
              Your current account role is <span className="font-semibold text-white uppercase">{role}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/protected"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#CDF22B] px-5 py-3 text-xs font-black text-black hover:bg-[#bce022] active:scale-[0.98] transition-all"
            >
              Go to Restaurant Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
            >
              Explore Live Demo Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDED] font-sans antialiased selection:bg-[#CDF22B] selection:text-black">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#121216]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-[#CDF22B] flex items-center justify-center text-black font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">MOSSQR</span>
                <span className="rounded-md bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#CDF22B]">
                  Super Admin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <LayoutDashboard className="h-4 w-4 text-[#CDF22B]" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/menu-parser"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <UtensilsCrossed className="h-4 w-4" />
                <span>AI Menu Parser</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-white leading-tight">{user.email}</span>
              <span className="text-[10px] font-semibold text-[#CDF22B] uppercase tracking-wider">
                {role} mode
              </span>
            </div>

            <Link
              href="/protected"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
              title="Open Owner Dashboard"
            >
              <span>Owner View</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
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
