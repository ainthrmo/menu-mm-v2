"use client";

import { cn } from "@/lib/utils";
import { authButtonClass, authCardClass, authInputClass, authLinkClass } from "@/components/auth-card-styles";
import { forgotPasswordAction } from "@/app/auth/actions";
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await forgotPasswordAction({
        email,
        origin: window.location.origin,
      });
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className={authCardClass}>
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-bold font-fraunces text-[#1e2417] tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-xs text-[#57604f]">
              Password reset instructions sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#57604f] leading-relaxed">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
            <div className="mt-5 pt-4 border-t border-[#1e2417]/10">
              <Link href="/auth/login" className={cn("inline-block text-xs", authLinkClass)}>
                &larr; Back to log in
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={authCardClass}>
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-bold font-fraunces text-[#1e2417] tracking-tight">
              Reset password
            </CardTitle>
            <CardDescription className="text-xs text-[#57604f]">
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
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
                {error && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 font-medium" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" className={authButtonClass} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </div>
              <div className="mt-5 pt-4 border-t border-[#1e2417]/10 text-center text-xs text-[#57604f]">
                Remember your password?{" "}
                <Link href="/auth/login" className={authLinkClass}>
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
