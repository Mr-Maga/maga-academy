"use server";

import { requireActiveProfile } from "@/lib/dal";
import { geminiConfigured, evaluateWriting } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import type { AiEvaluation } from "@/lib/types";

export type WritingCheckState = { error?: string; result?: AiEvaluation } | undefined;

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

  try {
    const result = await evaluateWriting({ task, question, essay });

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
