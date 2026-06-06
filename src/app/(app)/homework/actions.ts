"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, requireRole } from "@/lib/dal";
import { geminiConfigured, evaluateWriting, evaluateSpeaking } from "@/lib/gemini";
import type { AiEvaluation, LevelKey, Skill } from "@/lib/types";

export type HwState = { error?: string } | undefined;

/** Staff: create/assign homework. */
export async function createHomework(_prev: HwState, formData: FormData): Promise<HwState> {
  const profile = await requireRole("admin", "teacher");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const level = String(formData.get("level") ?? "") as LevelKey | "";
  const skill = String(formData.get("skill") ?? "") as Skill | "";
  const groupId = String(formData.get("group_id") ?? "");
  const due = String(formData.get("due_at") ?? "");

  if (!title || !level) return { error: "Title and level are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("homework").insert({
    title,
    description: description || null,
    level,
    skill: skill === "" ? null : skill,
    group_id: groupId === "" ? null : groupId,
    due_at: due ? new Date(due).toISOString() : null,
    created_by: profile.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/homework");
  redirect("/homework");
}

export async function deleteHomework(formData: FormData) {
  await requireRole("admin", "teacher");
  const id = String(formData.get("homework_id") ?? "");
  const supabase = await createClient();
  if (id) await supabase.from("homework").delete().eq("id", id);
  revalidatePath("/homework");
  redirect("/homework");
}

/** Student: submit text and/or a file for a homework. */
export async function submitHomework(_prev: HwState, formData: FormData): Promise<HwState> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "student") return { error: "Only students can submit homework." };

  const homeworkId = String(formData.get("homework_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const file = formData.get("file");
  if (!homeworkId) return { error: "Missing homework." };

  const supabase = await createClient();
  let filePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > 15 * 1024 * 1024) return { error: "File too large (max 15MB)." };
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    filePath = `${profile.id}/${homeworkId}-${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("submissions")
      .upload(filePath, file, { upsert: true });
    if (upErr) return { error: `Upload failed: ${upErr.message}` };
  }

  if (!body && !filePath) return { error: "Add some text or attach a file." };

  const { error } = await supabase.from("submissions").upsert(
    {
      homework_id: homeworkId,
      student_id: profile.id,
      body: body || null,
      ...(filePath ? { file_path: filePath } : {}),
      status: "submitted",
    },
    { onConflict: "homework_id,student_id" },
  );
  if (error) return { error: error.message };

  revalidatePath(`/homework/${homeworkId}`);
  revalidatePath("/homework");
  return undefined;
}

/** Staff: grade a submission. Also writes a row into `scores` so ranking and
 * progress reflect the grade. */
export async function gradeSubmission(_prev: HwState, formData: FormData): Promise<HwState> {
  const profile = await requireRole("admin", "teacher");
  const submissionId = String(formData.get("submission_id") ?? "");
  const homeworkId = String(formData.get("homework_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  const score = Number(formData.get("score"));
  const maxScore = Number(formData.get("max_score") ?? 100) || 100;
  const comment = String(formData.get("comment") ?? "").trim();

  if (!submissionId || Number.isNaN(score)) return { error: "Enter a valid score." };

  const supabase = await createClient();

  const { error } = await supabase
    .from("submissions")
    .update({
      score,
      max_score: maxScore,
      comment: comment || null,
      status: "graded",
      graded_at: new Date().toISOString(),
      graded_by: profile.id,
    })
    .eq("id", submissionId);
  if (error) return { error: error.message };

  // Mirror into scores (one per homework+student) for ranking/progress.
  const { data: hw } = await supabase.from("homework").select("skill").eq("id", homeworkId).maybeSingle();
  const { data: stu } = await supabase.from("profiles").select("group_id").eq("id", studentId).maybeSingle();
  await supabase.from("scores").delete().eq("homework_id", homeworkId).eq("student_id", studentId);
  await supabase.from("scores").insert({
    student_id: studentId,
    homework_id: homeworkId,
    skill: hw?.skill ?? null,
    group_id: stu?.group_id ?? null,
    value: score,
    max_value: maxScore,
    comment: comment || null,
    created_by: profile.id,
  });

  revalidatePath(`/homework/${homeworkId}`);
  revalidatePath("/ranking");
  return undefined;
}

export type OpinionState = { error?: string; result?: AiEvaluation } | undefined;

/** Staff: run an AI examiner pass on a submission to speed up grading. */
export async function aiSecondOpinion(submissionId: string): Promise<OpinionState> {
  await requireRole("admin", "teacher");
  if (!geminiConfigured()) return { error: "AI is not configured yet (add GEMINI_API_KEY)." };

  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("body, homework:homework_id(title, description, skill)")
    .eq("id", submissionId)
    .maybeSingle();

  const sub = data as {
    body: string | null;
    homework: { title: string; description: string | null; skill: Skill | null } | null;
  } | null;

  if (!sub?.body || sub.body.trim().length < 20) {
    return { error: "This submission has no text answer to evaluate." };
  }

  const hw = sub.homework;
  const question = [hw?.title, hw?.description].filter(Boolean).join(" — ");
  try {
    const result =
      hw?.skill === "speaking"
        ? await evaluateSpeaking({ part: 2, question, answer: sub.body })
        : await evaluateWriting({ task: "task2", question, essay: sub.body });
    return { result };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message === "QUOTA"
          ? "AI is busy (free limit reached). Please try again in a minute."
          : "AI request failed. Please try again.",
    };
  }
}
