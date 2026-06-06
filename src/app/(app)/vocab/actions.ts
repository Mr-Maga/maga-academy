"use server";

import { revalidatePath } from "next/cache";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { geminiConfigured, generateVocab, generateCardsForWords, translateWord } from "@/lib/gemini";
import type { LevelKey, VocabCard, VocabTranslation } from "@/lib/types";

// Leitner intervals (days) per box. box 5 = mature (review every 30 days).
const INTERVALS = [1, 2, 4, 8, 16, 30];

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
      return "advanced, IELTS preparation (B2–C1)";
    default:
      return "intermediate (CEFR B1)";
  }
}

/** Record a review answer and schedule the next review (spaced repetition). */
export async function reviewCard(cardId: string, known: boolean) {
  const profile = await requireActiveProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("vocab_progress")
    .select("box, ease, wrong_count")
    .eq("student_id", profile.id)
    .eq("card_id", cardId)
    .maybeSingle();

  const cur = existing as { box: number; ease: number; wrong_count: number } | null;
  const curBox = cur?.box ?? 0;
  const ease = cur?.ease ?? 0;
  const wrong = cur?.wrong_count ?? 0;

  let box: number;
  let status: string;
  let wrongCount = wrong;
  let easeNew = ease;

  if (known) {
    box = Math.min(curBox + 1, 5);
    easeNew = ease + 1;
    status = box >= 5 ? "known" : "learning";
  } else {
    box = 0;
    wrongCount = wrong + 1;
    status = "hard";
  }

  const days = known ? INTERVALS[box] : 1;
  const due = new Date();
  due.setDate(due.getDate() + days);

  await supabase.from("vocab_progress").upsert(
    {
      student_id: profile.id,
      card_id: cardId,
      box,
      ease: easeNew,
      wrong_count: wrongCount,
      status,
      due_at: due.toISOString().slice(0, 10),
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: "student_id,card_id" },
  );

  return { ok: true };
}

/** Generate fresh vocabulary with AI and add it to the student's own deck. */
export async function addAiWords() {
  const profile = await requireActiveProfile();
  if (!geminiConfigured()) return { error: "AI is not configured yet." };
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("vocab_cards")
    .select("word")
    .or(`owner_id.is.null,owner_id.eq.${profile.id}`)
    .limit(200);
  const avoid = ((existing as { word: string }[] | null) ?? []).map((w) => w.word);

  try {
    const words = await generateVocab({ level: levelToPrompt(profile.level), count: 10, avoid });
    const seen = new Set(avoid.map((w) => w.toLowerCase()));
    const rows = words
      .filter((w) => w.word && !seen.has(w.word.toLowerCase()))
      .map((w) => ({
        owner_id: profile.id,
        word: w.word.trim(),
        meaning: w.meaning,
        example: w.example,
        translation: w.translation,
        level: profile.level,
      }));
    if (!rows.length) return { error: "No new words this time — try again." };
    await supabase.from("vocab_cards").insert(rows);
    revalidatePath("/vocab");
    return { ok: true, added: rows.length };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message === "QUOTA"
          ? "AI is busy (free limit reached). Please try again in a minute."
          : "Couldn't add words. Please try again.",
    };
  }
}

function mapCefr(s?: string): LevelKey | null {
  switch ((s ?? "").trim().toUpperCase()) {
    case "A1":
      return "a1";
    case "A2":
      return "a2";
    case "B1":
      return "b1";
    case "B2":
      return "b2";
    case "C1":
    case "C2":
      return "ielts";
    default:
      return null;
  }
}

export type SetState = { error?: string; ok?: boolean; added?: number; setName?: string } | undefined;

/** Create a named set, then let AI build a full flashcard for each English word. */
export async function createSet(_prev: SetState, formData: FormData): Promise<SetState> {
  const profile = await requireActiveProfile();
  if (!geminiConfigured()) return { error: "AI is not configured yet." };

  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  const wordsRaw = String(formData.get("words") ?? "");
  if (!name) return { error: "Nom bering (masalan: day1)." };
  const words = Array.from(
    new Set(
      wordsRaw
        .split(/[\n,;]+/)
        .map((w) => w.trim())
        .filter(Boolean),
    ),
  ).slice(0, 30);
  if (words.length === 0) return { error: "Kamida bitta inglizcha so‘z kiriting." };

  // Generate the cards FIRST (with one retry) so we never leave an empty set.
  let cards: Awaited<ReturnType<typeof generateCardsForWords>> = [];
  for (let attempt = 0; attempt < 2 && cards.length === 0; attempt++) {
    try {
      cards = await generateCardsForWords({ words, level: levelToPrompt(profile.level) });
    } catch (e) {
      if (e instanceof Error && e.message === "QUOTA") {
        return { error: "AI biroz band (bepul limit). Bir daqiqadan keyin urinib ko'ring." };
      }
      if (attempt === 1) return { error: "AI kartalarni to'ldira olmadi. Qayta urinib ko'ring." };
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  const rows = cards
    .filter((c) => c.word?.trim())
    .map((c) => ({
      owner_id: profile.id,
      set_id: "",
      word: c.word.trim(),
      meaning: c.meaning,
      example: c.example,
      translation: c.translation,
      level: mapCefr(c.level) ?? profile.level,
    }));
  if (rows.length === 0) return { error: "Kartalar yaratilmadi. Qayta urinib ko'ring." };

  const supabase = await createClient();
  const { data: setRow, error: setErr } = await supabase
    .from("vocab_sets")
    .insert({ owner_id: profile.id, name })
    .select("id")
    .single();
  if (setErr || !setRow) return { error: "To'plam yaratilmadi. Qayta urinib ko'ring." };
  const setId = (setRow as { id: string }).id;

  for (const r of rows) r.set_id = setId;
  const { error: insErr } = await supabase.from("vocab_cards").insert(rows);
  if (insErr) {
    await supabase.from("vocab_sets").delete().eq("id", setId); // roll back empty set
    return { error: "Kartalarni saqlab bo'lmadi. Qayta urinib ko'ring." };
  }
  revalidatePath("/vocab");
  return { ok: true, added: rows.length, setName: name };
}

export async function deleteSet(setId: string) {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  await supabase.from("vocab_sets").delete().eq("id", setId).eq("owner_id", profile.id);
  revalidatePath("/vocab");
  return { ok: true };
}

export async function getSetCards(setId: string): Promise<VocabCard[]> {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("vocab_cards")
    .select("id, word, meaning, example, translation, level")
    .eq("set_id", setId)
    .eq("owner_id", profile.id)
    .order("created_at");
  return (data as VocabCard[] | null) ?? [];
}

/* --------------------------- AI translator --------------------------- */

export type LookupState = { error?: string; result?: VocabTranslation; lookupId?: string } | undefined;

/** Translate a word/phrase (Uz/Ru/En), make a sentence, and log it to history. */
export async function lookupWord(text: string): Promise<LookupState> {
  const profile = await requireActiveProfile();
  if (!geminiConfigured()) return { error: "AI hozircha sozlanmagan." };
  const q = text.trim().slice(0, 120);
  if (!q) return { error: "So‘z yoki ibora kiriting." };
  try {
    const result = await translateWord(q);
    const supabase = await createClient();
    const { data } = await supabase
      .from("vocab_lookups")
      .insert({ student_id: profile.id, query: q, word: result.word, result })
      .select("id")
      .single();
    return { result, lookupId: (data as { id: string } | null)?.id };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message === "QUOTA"
          ? "AI biroz band (bepul limit). Bir daqiqadan keyin urinib ko‘ring."
          : "Tarjima qilib bo‘lmadi. Qayta urinib ko‘ring.",
    };
  }
}

/** Add a looked-up word to today's review (creates a card due today). */
export async function addLookupToToday(lookupId: string) {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  const { data: lk } = await supabase
    .from("vocab_lookups")
    .select("result")
    .eq("id", lookupId)
    .eq("student_id", profile.id)
    .maybeSingle();
  const r = (lk as { result: VocabTranslation } | null)?.result;
  if (!r) return { error: "Topilmadi." };

  const { data: card } = await supabase
    .from("vocab_cards")
    .insert({
      owner_id: profile.id,
      word: r.word,
      meaning: r.meaning,
      example: r.example,
      translation: r.translation,
      level: mapCefr(r.level) ?? profile.level,
    })
    .select("id")
    .single();
  if (card) {
    await supabase.from("vocab_progress").insert({
      student_id: profile.id,
      card_id: (card as { id: string }).id,
      box: 0,
      status: "learning",
      due_at: new Date().toISOString().slice(0, 10),
    });
  }
  await supabase.from("vocab_lookups").update({ added: true }).eq("id", lookupId);
  revalidatePath("/vocab");
  return { ok: true };
}
