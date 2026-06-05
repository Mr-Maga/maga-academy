"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Mark today's practice — bumps the daily streak via the touch_streak RPC. */
export async function recordPractice(): Promise<{ streak: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { streak: 0 };
  const { data } = await supabase.rpc("touch_streak");
  revalidatePath("/practice");
  revalidatePath("/dashboard");
  const streak = (data as { current_streak?: number } | null)?.current_streak ?? 0;
  return { streak };
}

export async function setDailyGoal(formData: FormData) {
  const supabase = await createClient();
  const goal = Math.max(5, Math.min(240, Number(formData.get("daily_goal")) || 20));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await supabase.from("profiles").update({ daily_goal: goal }).eq("id", user.id);
  revalidatePath("/practice");
}
