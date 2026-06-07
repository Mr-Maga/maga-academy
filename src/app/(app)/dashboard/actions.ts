"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { geminiConfigured, planTasks } from "@/lib/gemini";
import type { DailyTask } from "@/lib/types";

const COLS = "id, title, tool, done, task_date, created_at";

/** Maga turns the student's free text into concrete tasks and saves them for today. */
export async function addPlanFromText(text: string): Promise<DailyTask[]> {
  const clean = text.trim().slice(0, 300);
  if (!clean) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let planned: { title: string; tool: DailyTask["tool"] }[] = [];
  if (geminiConfigured()) {
    try {
      planned = await planTasks(clean);
    } catch {
      planned = [];
    }
  }
  // Resilient fallback: if AI is off/failed, keep the raw text as one task.
  if (planned.length === 0) planned = [{ title: clean.slice(0, 80), tool: null }];

  const rows = planned.map((p) => ({ student_id: user.id, title: p.title, tool: p.tool }));
  const { data } = await supabase.from("daily_tasks").insert(rows).select(COLS);

  revalidatePath("/dashboard");
  return (data as DailyTask[]) ?? [];
}

export async function toggleTask(id: string, done: boolean): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("daily_tasks").update({ done }).eq("id", id).eq("student_id", user.id);
  revalidatePath("/dashboard");
}

export async function removeTask(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("daily_tasks").delete().eq("id", id).eq("student_id", user.id);
  revalidatePath("/dashboard");
}
