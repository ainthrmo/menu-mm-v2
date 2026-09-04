"use server";

import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
  error?: string;
  success?: boolean;
  redirectUrl?: string;
};

const MIN_PASSWORD_LENGTH = 8;

export async function loginAction(formData: { email: string; password: string }): Promise<AuthResult> {
  if (!formData?.email || !formData?.password) {
    return { error: "Email and password are required." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error("[auth:actions] createClient failed during login:", err);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  try {
    const res = await supabase.auth.signInWithPassword({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (res?.error) {
      console.error("[auth:actions] signInWithPassword error:", res.error.message);
      return { error: "Invalid email or password." };
    }

    const user = res.data?.user;
    if (!user) {
      console.error("[auth:actions] signIn succeeded but no user returned.");
      return { error: "Login failed: could not verify user account." };
    }

    // Check if user already owns a restaurant
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    const redirectUrl = restaurant ? "/protected" : "/protected/onboarding";

    return { success: true, redirectUrl };
  } catch (err) {
    console.error("[auth:actions] signInWithPassword unexpected exception:", err);
    return { error: "An unexpected error occurred during log in. Please try again." };
  }
}

export async function signUpAction(formData: { email: string; password: string; origin: string }): Promise<AuthResult> {
  if (!formData?.email || !formData?.password) {
    return { error: "Email and password are required." };
  }

  if (formData.password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error("[auth:actions] createClient failed during signup:", err);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  try {
    const { error } = await supabase.auth.signUp({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      options: {
        emailRedirectTo: `${formData.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("[auth:actions] signUp error:", error.message);
      return { error: "Unable to create account. Please check your details and try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("[auth:actions] signUp unexpected exception:", err);
    return { error: "An unexpected error occurred during sign up. Please try again." };
  }
}

export async function forgotPasswordAction(formData: { email: string; origin: string }): Promise<AuthResult> {
  if (!formData?.email) {
    return { error: "Email is required." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error("[auth:actions] createClient failed during forgotPassword:", err);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim().toLowerCase(), {
      redirectTo: `${formData.origin}/auth/callback?next=/auth/update-password`,
    });

    if (error) {
      console.error("[auth:actions] resetPasswordForEmail error:", error.message);
      return { error: "Failed to send reset email. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("[auth:actions] resetPasswordForEmail unexpected exception:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updatePasswordAction(formData: { password: string }): Promise<AuthResult> {
  if (!formData?.password) {
    return { error: "Password is required." };
  }

  if (formData.password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error("[auth:actions] createClient failed during updatePassword:", err);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: formData.password });

    if (error) {
      console.error("[auth:actions] updateUser error:", error.message);
      return { error: "Failed to update password. Your reset link may have expired." };
    }

    return { success: true };
  } catch (err) {
    console.error("[auth:actions] updateUser unexpected exception:", err);
    return { error: "An unexpected error occurred while updating your password." };
  }
}

export async function signOutAction(): Promise<AuthResult> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    console.error("[auth:actions] createClient failed during signOut:", err);
    return { error: "Unable to connect to authentication service." };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[auth:actions] signOut error:", error.message);
      return { error: "Failed to sign out. Please try again." };
    }
    return { success: true };
  } catch (err) {
    console.error("[auth:actions] signOut unexpected exception:", err);
    return { error: "An unexpected error occurred during sign out." };
  }
}