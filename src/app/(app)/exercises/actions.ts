"use server";

import { requireActiveProfile } from "@/lib/dal";
import { geminiConfigured, generateExercise } from "@/lib/gemini";
import type { Exercise, ExerciseType, LevelKey } from "@/lib/types";

export type ExerciseState = { error?: string; exercise?: Exercise } | undefined;

function levelToPrompt(level: LevelKey | null): string {
  switch (level) {
    case "a1":
      return "beginner (CEFR A1)";
    case "a2":
      return "elementary (CEFR A2)";
    case "b1":
      return "intermediate (CEFR B1)";
    case "b2":
      return "upper-intermediate (CEFR B2)";
    case "cefr":
      return "intermediate to upper-intermediate (CEFR B1–B2)";
    case "ielts":
      return "advanced, IELTS preparation (CEFR B2–C1, target band 6.5–7.5)";
    default:
      return "intermediate (CEFR B1)";
  }
}

export async function makeExercise(
  _prev: ExerciseState,
  formData: FormData,
): Promise<ExerciseState> {
  const profile = await requireActiveProfile();
  if (!geminiConfigured()) {
    return { error: "AI is not configured yet — ask the admin to add a Gemini key." };
  }
  const valid: ExerciseType[] = ["reading", "grammar", "vocabulary"];
  const raw = String(formData.get("type") ?? "reading") as ExerciseType;
  const type = valid.includes(raw) ? raw : "reading";
  const topic = String(formData.get("topic") ?? "").trim().slice(0, 200);
  const levelKeys: LevelKey[] = ["a1", "a2", "b1", "b2", "cefr", "ielts"];
  const lvlRaw = String(formData.get("level") ?? "auto");
  const chosenLevel = levelKeys.includes(lvlRaw as LevelKey) ? (lvlRaw as LevelKey) : profile.level;

  try {
    const exercise = await generateExercise({ type, level: levelToPrompt(chosenLevel), topic });
    if (!exercise.questions?.length) return { error: "Couldn't generate questions — please try again." };
    return { exercise };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message === "QUOTA"
          ? "AI is busy (free limit reached). Please try again in a minute."
          : "Couldn't generate the exercise. Please try again.",
    };
  }
}
