"use server";

import { requireActiveProfile } from "@/lib/dal";
import { geminiConfigured, evaluateSpeaking } from "@/lib/gemini";
import type { AiEvaluation } from "@/lib/types";

export type SpeakingCheckState = { error?: string; result?: AiEvaluation } | undefined;

export async function checkSpeaking(
  _prev: SpeakingCheckState,
  formData: FormData,
): Promise<SpeakingCheckState> {
  await requireActiveProfile();
  if (!geminiConfigured()) {
    return { error: "AI is not configured yet — ask the admin to add a Gemini key." };
  }
  const partRaw = Number(formData.get("part") ?? 2);
  const part = (partRaw === 1 || partRaw === 3 ? partRaw : 2) as 1 | 2 | 3;
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (answer.length < 30) return { error: "Please record or type a longer answer first." };
  if (answer.length > 8000) return { error: "That's too long — please shorten it." };

  try {
    const result = await evaluateSpeaking({ part, question, answer });
    return { result };
  } catch {
    return { error: "AI request failed. Please try again in a moment." };
  }
}
