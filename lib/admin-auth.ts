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
 * Security: Role is strictly determined by the database profiles table.
 * User metadata is never trusted for authorization.
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

    // Query profiles table — the authoritative source of truth for user roles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[admin-auth] Error fetching user profile:", profileError);
    }

    let role: UserRole = "owner";
    if (profile?.role && (profile.role === "admin" || profile.role === "staff" || profile.role === "owner")) {
      role = profile.role as UserRole;
    }

    const isAdminOrStaff = role === "admin" || role === "staff";
    return {
      userId: user.id,
      email: user.email ?? null,
      role,
      isAdminOrStaff,
    };
  } catch (err) {
    console.error("[admin-auth] Unexpected error determining user role:", err);
    return { userId: null, email: null, role: "owner", isAdminOrStaff: false };
  }
}
