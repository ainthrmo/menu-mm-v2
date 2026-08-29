import { SupabaseClient } from "@supabase/supabase-js";

export type UserRole = "owner" | "admin" | "staff";

export interface UserProfile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

/**
 * Checks if the current authenticated user has an 'admin' or 'staff' role.
 * Resilient fallback checks user profile table and user metadata.
 */
export async function getCurrentUserRole(supabase: SupabaseClient): Promise<{
  userId: string | null;
  email: string | null;
  role: UserRole;
  isAdminOrStaff: boolean;
}> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return { userId: null, email: null, role: "owner", isAdminOrStaff: false };
    }

    // 1. Try querying profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    let role: UserRole = "owner";
    if (profile?.role) {
      role = profile.role as UserRole;
    } else if (user.user_metadata?.role) {
      role = user.user_metadata.role as UserRole;
    }

    const isAdminOrStaff = role === "admin" || role === "staff";
    return {
      userId: user.id,
      email: user.email ?? null,
      role,
      isAdminOrStaff,
    };
  } catch (err) {
    console.error("Error determining user role:", err);
    return { userId: null, email: null, role: "owner", isAdminOrStaff: false };
  }
}
