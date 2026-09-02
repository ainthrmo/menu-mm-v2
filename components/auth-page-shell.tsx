import Link from "next/link";
import Image from "next/image";

interface AuthPageShellProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthPageShell({ children, subtitle }: AuthPageShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 bg-[#f6f2e8]">
      <div className="mb-6 text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[#1e2417] hover:opacity-85 transition-opacity"
        >
          <Image
            src="/moss_logo.jpg"
            alt="Moss QR"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-cover border border-[#1e2417]/10 shadow-2xs"
          />
          <span className="text-xl font-bold tracking-tight font-space-grotesk text-[#1e2417]">
            Moss QR
          </span>
        </Link>
        {subtitle && (
          <p className="text-xs text-[#57604f] font-medium max-w-xs mx-auto">{subtitle}</p>
        )}
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
