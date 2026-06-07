"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AccountState = { error?: string; ok?: boolean } | undefined;

export async function updateAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const daily_goal = Math.max(5, Math.min(240, Number(formData.get("daily_goal")) || 20));

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: full_name || null, phone: phone || null, daily_goal })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/account");
  return { ok: true };
}

const SKILLS = ["listening", "reading", "writing", "speaking"] as const;

/** Save the student's target band per skill (0.5 steps, 4.0–9.0). */
export async function updateTargetBands(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const targets: Record<string, number> = {};
  for (const s of SKILLS) {
    const v = Number(formData.get(s));
    if (v >= 4 && v <= 9) targets[s] = Math.round(v * 2) / 2;
  }

  const { error } = await supabase.from("profiles").update({ target_bands: targets }).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { ok: true };
}
