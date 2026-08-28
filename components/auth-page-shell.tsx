import Link from "next/link";
import Image from "next/image";

interface AuthPageShellProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthPageShell({ children, subtitle }: AuthPageShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 bg-[#F5F5F5]">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[#111111] hover:opacity-80 transition-opacity"
        >
          <Image
            src="/moss_logo.jpg"
            alt="Moss QR"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-cover"
          />
          <span className="text-lg font-bold tracking-tight">Moss QR</span>
        </Link>
        {subtitle && (
          <p className="text-xs text-[#666666] mt-2">{subtitle}</p>
        )}
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
