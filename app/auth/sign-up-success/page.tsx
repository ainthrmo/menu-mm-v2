import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthPageShell } from "@/components/auth-page-shell";
import { authCardClass, authLinkClass } from "@/components/auth-card-styles";

export default function Page() {
  return (
    <AuthPageShell subtitle="One more step before you can sign in">
      <Card className={authCardClass}>
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-2xl font-bold font-fraunces text-[#1e2417] tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-xs text-[#57604f]">
            Confirm your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-[#57604f] leading-relaxed">
            You&apos;ve successfully signed up. Please check your email inbox to
            confirm your account before logging in.
          </p>
          <div className="pt-2 border-t border-[#1e2417]/10">
            <Link href="/auth/login" className={`text-xs ${authLinkClass}`}>
              &larr; Go to log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
