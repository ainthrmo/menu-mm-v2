"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: { email: string; password: string }): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "An unexpected error occurred during login." };
  }

  redirect("/protected");
}

export async function signUpAction(formData: {
  email: string;
  password: string;
  origin: string;
}): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        emailRedirectTo: `${formData.origin}/auth/confirm`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "An unexpected error occurred during registration." };
  }
}

export async function forgotPasswordAction(formData: {
  email: string;
  origin: string;
}): Promise<{ error?: string; success?: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim(), {
      redirectTo: `${formData.origin}/auth/update-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "An unexpected error occurred." };
  }
}

export async function updatePasswordAction(formData: { password: string }): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "An unexpected error occurred." };
  }

  redirect("/protected");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
