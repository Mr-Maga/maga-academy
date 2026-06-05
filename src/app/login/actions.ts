"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string } | undefined;

function readCreds(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    fullName: String(formData.get("full_name") ?? "").trim(),
    mode: String(formData.get("mode") ?? "signin"),
  };
}

export async function emailAuth(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password, fullName, mode } = readCreds(formData);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  if (mode === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || null } },
    });
    if (error) return { error: error.message };
    // With "Confirm email" turned OFF, sign-up returns an active session.
    if (!data.session) {
      return { info: "Account created. Please confirm your email, then sign in." };
    }
    redirect("/claim");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}
