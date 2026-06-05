"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/dal";
import type { Skill } from "@/lib/types";

export async function addScore(formData: FormData) {
  const profile = await requireRole("admin", "teacher");
  const studentId = String(formData.get("student_id") ?? "");
  const skill = String(formData.get("skill") ?? "") as Skill | "";
  const value = Number(formData.get("value"));
  const maxValue = Number(formData.get("max_value") ?? 100) || 100;
  const comment = String(formData.get("comment") ?? "").trim();
  if (!studentId || Number.isNaN(value)) {
    revalidatePath("/students");
    return;
  }

  const supabase = await createClient();
  const { data: stu } = await supabase.from("profiles").select("group_id").eq("id", studentId).maybeSingle();
  await supabase.from("scores").insert({
    student_id: studentId,
    group_id: stu?.group_id ?? null,
    skill: skill === "" ? null : skill,
    value,
    max_value: maxValue,
    comment: comment || null,
    created_by: profile.id,
  });
  revalidatePath("/students");
  revalidatePath("/ranking");
}
