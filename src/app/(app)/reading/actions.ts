"use server";

import { createClient } from "@/lib/supabase/server";
import { geminiConfigured, generateReadingTest } from "@/lib/gemini";
import type { ReadingTest } from "@/lib/types";

export async function newReadingTest(): Promise<{ test?: ReadingTest; error?: string }> {
  if (!geminiConfigured()) return { error: "AI hozircha sozlanmagan (server kaliti yo‘q)." };
  try {
    const test = await generateReadingTest();
    if (!test.questions?.length) return { error: "Test yaratilmadi. Qayta urinib ko‘ring." };
    return { test };
  } catch (e) {
    const quota = e instanceof Error && e.message === "QUOTA";
    return {
      error: quota
        ? "AI biroz band (bepul limit). Birozdan keyin urinib ko‘ring 🙏"
        : "Xatolik yuz berdi. Qayta urinib ko‘ring.",
    };
  }
}

export async function saveReadingAttempt(input: {
  title: string;
  score: number;
  total: number;
  band: number;
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("reading_attempts").insert({
    student_id: user.id,
    title: input.title.slice(0, 120),
    score: input.score,
    total: input.total,
    band: input.band,
  });
}
