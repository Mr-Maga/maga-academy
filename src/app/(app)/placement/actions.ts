"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/dal";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import type { LevelKey } from "@/lib/types";

const LEVELS: LevelKey[] = ["a1", "a2", "b1", "b2", "cefr", "ielts"];

export async function savePlacement(input: {
  recommended: LevelKey;
  correct: number;
  total: number;
  summary: string;
}): Promise<{ ok: boolean }> {
  const profile = await getProfile();
  if (!profile) return { ok: false };
  if (!LEVELS.includes(input.recommended)) return { ok: false };

  const supabase = await createClient();
  const message = `Placement test → recommended ${input.recommended.toUpperCase()} · ${input.correct}/${input.total} correct (${input.summary})`;

  await supabase.from("feedback").insert({
    user_id: profile.id,
    kind: "placement",
    source: "web",
    message,
    level: input.recommended,
  });

  const who = profile.full_name || profile.email || "A learner";
  await sendTelegramMessage(
    `🎯 <b>Placement result</b>\n${escapeHtml(who)} → <b>${input.recommended.toUpperCase()}</b>\nScore: ${input.correct}/${input.total}\n${escapeHtml(input.summary)}`,
  );

  return { ok: true };
}
