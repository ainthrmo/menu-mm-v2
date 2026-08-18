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
          <CardHeader>
            <CardTitle className="text-2xl text-[#111111]">Check your email</CardTitle>
            <CardDescription className="text-[#666666]">Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#666666]">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
            <Link href="/auth/login" className={cn("inline-block mt-4 text-sm", authLinkClass)}>
              Back to login
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className={authCardClass}>
          <CardHeader>
            <CardTitle className="text-2xl text-[#111111]">Reset your password</CardTitle>
            <CardDescription className="text-[#666666]">
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[#111111]">Email</Label>
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
                  <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" className={authButtonClass} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-[#666666]">
                Remember your password?{" "}
                <Link href="/auth/login" className={authLinkClass}>
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
