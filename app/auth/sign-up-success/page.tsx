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
        <CardHeader>
          <CardTitle className="text-2xl text-[#111111]">
            Check your email
          </CardTitle>
          <CardDescription className="text-[#666666]">
            Confirm your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#666666]">
            You&apos;ve successfully signed up. Please check your email to
            confirm your account before signing in.
          </p>
          <Link href="/auth/login" className={`text-sm ${authLinkClass}`}>
            Go to login
          </Link>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
