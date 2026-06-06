import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import type { VocabCard, VocabStats, VocabSet, VocabLookup } from "@/lib/types";
import { VocabClient } from "./vocab-client";

export const metadata: Metadata = { title: "Vocabulary" };

const TODAY = () => new Date().toISOString().slice(0, 10);

export default async function VocabPage() {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  const me = profile.id;
  const today = TODAY();

  // All of my progress rows (small per student).
  const { data: progRaw } = await supabase
    .from("vocab_progress")
    .select("card_id, due_at, wrong_count, status")
    .eq("student_id", me);
  const prog = (progRaw as { card_id: string; due_at: string; wrong_count: number; status: string }[] | null) ?? [];

  const startedIds = prog.map((p) => p.card_id);
  const dueIds = prog.filter((p) => p.due_at <= today).map((p) => p.card_id);
  const hardIds = prog.filter((p) => p.wrong_count > 0).map((p) => p.card_id);

  // New cards (global deck + my own AI words) that I haven't started yet.
  let newQuery = supabase
    .from("vocab_cards")
    .select("id, word, meaning, example, translation, level")
    .or(`owner_id.is.null,owner_id.eq.${me}`)
    .order("created_at", { ascending: true })
    .limit(10);
  if (startedIds.length) newQuery = newQuery.not("id", "in", `(${startedIds.join(",")})`);
  const { data: newCards } = await newQuery;

  // Due cards (need their card content).
  const dueCards = dueIds.length
    ? ((
        await supabase
          .from("vocab_cards")
          .select("id, word, meaning, example, translation, level")
          .in("id", dueIds)
          .limit(40)
      ).data as VocabCard[] | null) ?? []
    : [];

  // Hard deck ("words I didn't know").
  const hardCards = hardIds.length
    ? ((
        await supabase
          .from("vocab_cards")
          .select("id, word, meaning, example, translation, level")
          .in("id", hardIds)
      ).data as VocabCard[] | null) ?? []
    : [];

  // My named sets (Quizlet-style folders) + card counts.
  const { data: setsRaw } = await supabase
    .from("vocab_sets")
    .select("id, name")
    .eq("owner_id", me)
    .order("created_at", { ascending: false });
  const setRows = (setsRaw as { id: string; name: string }[] | null) ?? [];
  const counts: Record<string, number> = {};
  if (setRows.length) {
    const { data: cardSets } = await supabase
      .from("vocab_cards")
      .select("set_id")
      .in(
        "set_id",
        setRows.map((s) => s.id),
      );
    for (const c of (cardSets as { set_id: string }[] | null) ?? []) {
      counts[c.set_id] = (counts[c.set_id] ?? 0) + 1;
    }
  }
  const sets: VocabSet[] = setRows.map((s) => ({ id: s.id, name: s.name, count: counts[s.id] ?? 0 }));

  // Recent translator lookups (history).
  const { data: lookupsRaw } = await supabase
    .from("vocab_lookups")
    .select("id, query, added, result, created_at")
    .eq("student_id", me)
    .order("created_at", { ascending: false })
    .limit(15);
  const lookups = (lookupsRaw as VocabLookup[] | null) ?? [];

  const todayQueue: VocabCard[] = [...dueCards, ...((newCards as VocabCard[] | null) ?? [])].slice(0, 25);

  const stats: VocabStats = {
    due: dueCards.length,
    newCount: ((newCards as VocabCard[] | null) ?? []).length,
    learning: prog.filter((p) => p.status === "learning").length,
    known: prog.filter((p) => p.status === "known").length,
    hard: hardIds.length,
  };

  return (
    <div>
      <PageHeader
        title="📇 Vocabulary"
        subtitle="Daily flashcards with spaced repetition — review a little every day."
      />
      <VocabClient
        todayQueue={todayQueue}
        hardQueue={hardCards}
        stats={stats}
        sets={sets}
        lookups={lookups}
      />
    </div>
  );
}
