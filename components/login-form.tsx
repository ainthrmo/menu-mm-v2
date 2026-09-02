"use client";

import { cn } from "@/lib/utils";
import { authButtonClass, authCardClass, authInputClass, authLinkClass } from "@/components/auth-card-styles";
import { loginAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAction({ email, password });
      // eslint-disable-next-line no-console
      console.log("[LoginForm] loginAction result:", { success: !!res?.success, hasRedirectUrl: !!res?.redirectUrl, hasError: !!res?.error });

      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        router.push(res.redirectUrl || "/protected");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={authCardClass}>
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-2xl font-bold font-fraunces text-[#1e2417] tracking-tight">
            Log in
          </CardTitle>
          <CardDescription className="text-xs text-[#57604f]">
            Enter your email below to access your restaurant admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-[#1e2417]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@restaurant.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputClass}
                />
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-[#1e2417]">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className={cn("text-xs text-[#57604f] hover:text-[#1e2417] transition-colors")}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={authInputClass}
                />
              </div>
              {error && (
                <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 font-medium" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className={authButtonClass} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </div>
            <div className="mt-5 pt-4 border-t border-[#1e2417]/10 text-center text-xs text-[#57604f]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className={authLinkClass}>
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
