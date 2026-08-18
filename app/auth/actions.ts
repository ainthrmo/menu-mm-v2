"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Structured auth response sent back to the client.
 * - error: human-readable on failure
 * - success: true when operation succeeded
 * - details: optional raw info for debugging (remove in prod)
 */
type AuthResult = { error?: string; success?: boolean; redirectUrl?: string; details?: any };

export async function loginAction(formData: { email: string; password: string }): Promise<AuthResult> {
  // Defensive validation
  if (!formData?.email || !formData?.password) {
    return { error: "Email and password are required." };
  }

  // Try to create server Supabase client
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    // Log server-side for debugging
    // eslint-disable-next-line no-console
    console.error("[actions] createClient failed:", err);
    return { error: "Server configuration error. Check logs.", details: String(err) };
  }

  // Attempt sign-in; catch both returned error and thrown exceptions
  try {
    const res = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (res?.error) {
      // eslint-disable-next-line no-console
      console.error("[actions] signInWithPassword returned error:", res.error);
      return { error: res.error.message || "Sign-in failed", details: res.error };
    }

    const data = (res as any).data ?? {};
    const user = data?.user ?? null;
    const session = data?.session ?? null;

    if (!user && !session) {
      // eslint-disable-next-line no-console
      console.error("[actions] signIn did not return user/session:", res);
      return { error: "Login failed: no user session returned.", details: res };
    }

    // Check if user already owns a restaurant
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    const redirectUrl = restaurant ? "/protected" : "/protected/onboarding";

    // Success: return structured success result with destination URL.
    return { success: true, redirectUrl, details: { user, session } };
  } catch (err) {
    // Network/fetch or unexpected runtime error while calling Supabase
    // eslint-disable-next-line no-console
    console.error("[actions] signInWithPassword threw:", err);
    return { error: err instanceof Error ? `Network/server error: ${err.message}` : "Unknown sign-in error", details: String(err) };
  }
}

export async function signUpAction(formData: { email: string; password: string; origin: string; }): Promise<AuthResult> {
  if (!formData?.email || !formData?.password) {
    return { error: "Email and password are required." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] createClient (signup) failed:", err);
    return { error: "Server configuration error. Check logs.", details: String(err) };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        emailRedirectTo: `${formData.origin}/auth/confirm`,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[actions] signUp returned error:", error);
      return { error: error.message || "Sign up failed.", details: error };
    }

    return { success: true, details: data };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] signUp threw:", err);
    return { error: err instanceof Error ? err.message : "Unexpected error during sign up.", details: String(err) };
  }
}

export async function forgotPasswordAction(formData: { email: string; origin: string; }): Promise<AuthResult> {
  if (!formData?.email) return { error: "Email is required." };

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] createClient (forgotPassword) failed:", err);
    return { error: "Server configuration error. Check logs.", details: String(err) };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim(), {
      redirectTo: `${formData.origin}/auth/update-password`,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[actions] resetPasswordForEmail returned error:", error);
      return { error: error.message || "Failed to send reset email.", details: error };
    }

    return { success: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] resetPasswordForEmail threw:", err);
    return { error: err instanceof Error ? err.message : "Unexpected error.", details: String(err) };
  }
}

export async function updatePasswordAction(formData: { password: string }): Promise<AuthResult> {
  if (!formData?.password) return { error: "Password is required." };

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] createClient (updatePassword) failed:", err);
    return { error: "Server configuration error. Check logs.", details: String(err) };
  }

  try {
    const { data, error } = await supabase.auth.updateUser({ password: formData.password });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[actions] updateUser returned error:", error);
      return { error: error.message || "Failed to update password.", details: error };
    }

    return { success: true, details: data };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] updateUser threw:", err);
    return { error: err instanceof Error ? err.message : "Unexpected error.", details: String(err) };
  }
}

export async function signOutAction(): Promise<AuthResult> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] createClient (signOut) failed:", err);
    return { error: "Server configuration error. Check logs.", details: String(err) };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[actions] signOut returned error:", error);
      return { error: error.message || "Failed to sign out.", details: error };
    }
    return { success: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[actions] signOut threw:", err);
    return { error: err instanceof Error ? err.message : "Unexpected error.", details: String(err) };
  }
}