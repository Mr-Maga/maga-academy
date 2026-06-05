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
