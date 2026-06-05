import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { AccessStatus, Profile, Role } from "@/lib/types";

// Cached per-request so multiple components can call these without re-querying.

export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data as Profile) ?? null;
});

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Effective access for a profile. Staff are always active. Students/parents are
 * active only while their (admin-set) expiry is in the future.
 */
export function effectiveAccess(p: Profile): AccessStatus {
  if (p.role === "admin" || p.role === "teacher") return "active";
  if (p.access_status === "pending") return "pending";
  if (p.access_status === "locked") return "locked";
  if (p.access_expires_at && new Date(p.access_expires_at).getTime() < Date.now()) {
    return "locked";
  }
  return p.access_status;
}

/**
 * The standard gate used by the app shell: ensures the user is signed in, has
 * claimed a role, and (for students/parents) has active access. Redirects
 * otherwise. Returns the profile for authorized users.
 */
export async function requireActiveProfile(): Promise<Profile> {
  const user = await requireUser();
  const profile = await getProfile();

  if (!profile || !profile.code_claimed || !profile.role) {
    redirect("/claim");
  }

  if (effectiveAccess(profile) !== "active") {
    redirect("/status");
  }

  return profile;
}

export async function requireRole(...roles: Role[]): Promise<Profile> {
  const profile = await requireActiveProfile();
  if (!profile.role || !roles.includes(profile.role)) {
    redirect("/dashboard");
  }
  return profile;
}
