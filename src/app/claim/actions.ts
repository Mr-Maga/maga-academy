"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ClaimState = { error?: string } | undefined;

export async function claimRole(_prev: ClaimState, formData: FormData): Promise<ClaimState> {
  const code = String(formData.get("code") ?? "").trim();
  const isParent = formData.get("is_parent") === "on";

  if (!code) return { error: "Please enter your code." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // claim_role is a SECURITY DEFINER function — the code→role mapping lives in
  // the database, so a user can never escalate their own role from the client.
  const { error } = await supabase.rpc("claim_role", { p_code: code, p_is_parent: isParent });

  if (error) {
    if (/already claimed/i.test(error.message)) {
      redirect("/dashboard");
    }
    return { error: "That code isn’t valid. Please check it and try again." };
  }

  redirect("/dashboard");
}
