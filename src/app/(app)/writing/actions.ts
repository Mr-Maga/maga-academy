"use server";

import { requireActiveProfile } from "@/lib/dal";
import { geminiConfigured, evaluateWriting } from "@/lib/gemini";
import type { AiEvaluation } from "@/lib/types";

export type WritingCheckState = { error?: string; result?: AiEvaluation } | undefined;

export async function checkWriting(
  _prev: WritingCheckState,
  formData: FormData,
): Promise<WritingCheckState> {
  await requireActiveProfile();
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
    return { result };
  } catch {
    return { error: "AI request failed. Please try again in a moment." };
  }
}
