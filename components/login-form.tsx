"use client";

import { cn } from "@/lib/utils";
import { authButtonClass, authCardClass, authInputClass, authLinkClass } from "@/components/auth-card-styles";
import { createClient } from "@/lib/supabase/client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className={authCardClass}>
        <CardHeader>
          <CardTitle className="text-2xl text-[#1C1917]">Login</CardTitle>
          <CardDescription className="text-[#78716C]">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#1C1917]">Email</Label>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-[#1C1917]">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className={cn("ml-auto inline-block text-sm", authLinkClass)}
                  >
                    Forgot your password?
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
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" className={authButtonClass} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-[#78716C]">
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
