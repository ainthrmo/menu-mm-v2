import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

interface AuthPageShellProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthPageShell({ children, subtitle }: AuthPageShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 bg-[#F4F1EA]">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[#1C1917] hover:opacity-80 transition-opacity"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B7A5F] text-white shadow-sm">
            <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">Mee Nhuu</span>
        </Link>
        {subtitle && (
          <p className="text-xs text-[#78716C] mt-2">{subtitle}</p>
        )}
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
