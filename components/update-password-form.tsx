"use client";

import { cn } from "@/lib/utils";
import { authButtonClass, authCardClass, authInputClass, authLinkClass } from "@/components/auth-card-styles";
import { updatePasswordAction } from "@/app/auth/actions";
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

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await updatePasswordAction({ password });
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while saving your password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className={authCardClass}>
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-bold font-fraunces text-[#1e2417] tracking-tight">
              Password updated!
            </CardTitle>
            <CardDescription className="text-xs text-[#57604f]">
              Your password has been successfully changed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-[#57604f] leading-relaxed">
              You can now sign in to your restaurant dashboard with your new password.
            </p>
            <div className="pt-2">
              <Link href="/auth/login" className="block w-full">
                <Button className={cn("w-full", authButtonClass)}>
                  Continue to Log in
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={authCardClass}>
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-2xl font-bold font-fraunces text-[#1e2417] tracking-tight">
            Set new password
          </CardTitle>
          <CardDescription className="text-xs text-[#57604f]">
            Choose a strong password (at least 8 characters)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-[#1e2417]">
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={authInputClass}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="confirm-password" className="text-xs font-bold text-[#1e2417]">
                  Confirm new password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat your new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={authInputClass}
                />
              </div>
              {error && (
                <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 font-medium" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className={authButtonClass} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save new password"}
              </Button>
            </div>
            <div className="mt-5 pt-4 border-t border-[#1e2417]/10 text-center text-xs text-[#57604f]">
              <Link href="/auth/login" className={authLinkClass}>
                &larr; Back to log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
