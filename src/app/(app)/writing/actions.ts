"use server";

import { requireActiveProfile } from "@/lib/dal";
import { geminiConfigured, evaluateWriting } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import type { AiEvaluation } from "@/lib/types";

export type WritingCheckState = { error?: string; result?: AiEvaluation } | undefined;
export type MockWritingState =
  | { error?: string; task1?: AiEvaluation; task2?: AiEvaluation; overall?: number }
  | undefined;

const round5 = (n: number) => Math.round(n * 2) / 2;

export async function checkWriting(
  _prev: WritingCheckState,
  formData: FormData,
): Promise<WritingCheckState> {
  const profile = await requireActiveProfile();
  if (!geminiConfigured()) {
    return { error: "AI is not configured yet — ask the admin to add a Gemini key." };
  }
  const task = (String(formData.get("task") ?? "task2") as "task1" | "task2") || "task2";
  const question = String(formData.get("question") ?? "").trim();
  const essay = String(formData.get("essay") ?? "").trim();
  if (essay.length < 40) return { error: "Please write (or paste) at least a few sentences." };
  if (essay.length > 8000) return { error: "That's too long — please shorten it." };

  // Optional Task 1 chart/diagram image — sent to the AI so it can judge accuracy.
  let image: { data: string; mimeType: string } | undefined;
  const file = formData.get("image");
  if (task === "task1" && file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) return { error: "Rasm juda katta (maksimal 5MB)." };
    if (!file.type.startsWith("image/")) return { error: "Faqat rasm fayl yuklang." };
    const buf = Buffer.from(await file.arrayBuffer());
    image = { data: buf.toString("base64"), mimeType: file.type };
  }

  try {
    const result = await evaluateWriting({ task, question, essay, image });

    // Persist to DB (fire-and-forget — don't block the response on a DB error)
    const supabase = await createClient();
    await supabase.from("evaluations").insert({
      student_id: profile.id,
      kind: "writing",
      sub_type: task,
      question: question || null,
      answer: essay,
      overall_band: result.overall_band,
      result,
    });

    return { result };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message === "QUOTA"
          ? "AI is busy (free limit reached). Please try again in a minute."
          : "AI request failed. Please try again in a moment.",
    };
  }
}

/** Full Mock Writing: grade Task 1 + Task 2 and combine (Task 2 weighted ×2). */
export async function checkMockWriting(
  _prev: MockWritingState,
  formData: FormData,
): Promise<MockWritingState> {
  const profile = await requireActiveProfile();
  if (!geminiConfigured()) {
    return { error: "AI is not configured yet — ask the admin to add a Gemini key." };
  }
  const q1 = String(formData.get("question1") ?? "").trim();
  const e1 = String(formData.get("essay1") ?? "").trim();
  const q2 = String(formData.get("question2") ?? "").trim();
  const e2 = String(formData.get("essay2") ?? "").trim();
  if (e1.length < 40 || e2.length < 40) {
    return { error: "Iltimos ikkala vazifani ham yozing (kamida bir necha gap)." };
  }
  if (e1.length > 8000 || e2.length > 8000) return { error: "Juda uzun — qisqartiring." };

  try {
    // Sequential (free tier is happier with one call at a time).
    const task1 = await evaluateWriting({ task: "task1", question: q1, essay: e1 });
    const task2 = await evaluateWriting({ task: "task2", question: q2, essay: e2 });
    const overall = round5((task1.overall_band + task2.overall_band * 2) / 3);

    const supabase = await createClient();
    await supabase.from("evaluations").insert([
      { student_id: profile.id, kind: "writing", sub_type: "mock-task1", question: q1 || null, answer: e1, overall_band: task1.overall_band, result: task1 },
      { student_id: profile.id, kind: "writing", sub_type: "mock-task2", question: q2 || null, answer: e2, overall_band: task2.overall_band, result: task2 },
    ]);

    return { task1, task2, overall };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message === "QUOTA"
          ? "AI biroz band (bepul limit). Bir daqiqadan keyin urinib ko'ring."
          : "AI so'rovi muvaffaqiyatsiz. Birozdan keyin urinib ko'ring.",
    };
  }
}
