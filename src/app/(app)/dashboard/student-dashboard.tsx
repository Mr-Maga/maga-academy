import Link from "next/link";
import { Flame, Trophy, Zap, Sparkles, ArrowRight, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BandRing, StatPill, ActionTile } from "@/components/gamify";
import { DailyPlan } from "./daily-plan";
import type { Profile, StudentProgress, DailyTask } from "@/lib/types";

// Uzbekistan is UTC+5 (no DST) — give a correct time-of-day greeting.
function greeting(): string {
  const h = (new Date().getUTCHours() + 5) % 24;
  if (h < 6) return "Tungi mashq 🌙";
  if (h < 12) return "Xayrli tong ☀️";
  if (h < 18) return "Xayrli kun 👋";
  return "Xayrli kech 🌆";
}

export async function StudentDashboard({ profile }: { profile: Profile }) {
  const supabase = await createClient();

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: progressRaw }, { data: evalsRaw }, { data: tasksRaw }] = await Promise.all([
    supabase.rpc("student_progress"),
    supabase
      .from("evaluations")
      .select("overall_band, kind, result, created_at")
      .eq("student_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("daily_tasks")
      .select("id, title, tool, done, task_date, created_at")
      .eq("student_id", profile.id)
      .eq("task_date", today)
      .order("created_at", { ascending: true }),
  ]);

  const progress = (progressRaw as StudentProgress | null) ?? null;
  const evals = (evalsRaw as { overall_band: number; result: { target_band?: number }; created_at: string }[] | null) ?? [];

  const streak = progress?.current_streak ?? 0;
  const bestBand = evals.length ? Math.max(...evals.map((e) => Number(e.overall_band) || 0)) : null;
  const latestTarget = evals[0]?.result?.target_band ?? (bestBand ? Math.min(bestBand + 0.5, 9) : null);

  const tasks = (tasksRaw as DailyTask[] | null) ?? [];
  const xp = evals.length * 20 + streak * 15;
  const level = Math.floor(xp / 100) + 1;
  const first = (profile.full_name || profile.email || "do‘st").split(/[ @]/)[0];

  return (
    <div className="stagger space-y-5">
      {/* Hero */}
      <section className="card relative overflow-hidden p-5">
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-soft/10 blur-3xl" />
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted">{greeting()}</p>
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{first} 👋</h1>
            <p className="mt-2 text-sm text-muted">
              {streak > 0 ? (
                <>Streakni o‘chirma — <span className="font-semibold text-amber">{streak} kun</span> 🔥</>
              ) : (
                <>Bugun bitta mashq bilan streakni boshla 🔥</>
              )}
            </p>
          </div>
          <BandRing band={bestBand} target={latestTarget} size={148} />
        </div>
      </section>

      {/* Gamified stats */}
      <section className="grid grid-cols-3 gap-3">
        <StatPill icon={Flame} tone="amber" value={streak} label="kun streak" />
        <StatPill icon={Trophy} tone="teal" value={bestBand ? bestBand.toFixed(1) : "—"} label="eng yaxshi band" />
        <StatPill icon={Zap} tone="indigo" value={xp} label={`Daraja ${level}`} />
      </section>

      {/* Daily plan — set by the student via Maga */}
      <DailyPlan initial={tasks} />

      {/* AI tools — the stars */}
      <section className="space-y-3">
        <h2 className="px-1 text-sm font-semibold text-muted">AI Tools ✨</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/writing" className="block">
            <ActionTile emoji="✍️" title="Writing" subtitle="Instant band & feedback" from="primary" />
          </Link>
          <Link href="/speaking" className="block">
            <ActionTile emoji="🎙️" title="Speaking" subtitle="Speak, get your band" from="indigo" />
          </Link>
          <Link href="/reading" className="block">
            <ActionTile emoji="📖" title="Reading" subtitle="AI tests + band" from="rose" />
          </Link>
          <Link href="/vocab" className="block">
            <ActionTile emoji="📇" title="Vocabulary" subtitle="Flashcards + AI translator" from="teal" />
          </Link>
          <Link href="/exercises" className="block">
            <ActionTile emoji="🧠" title="Practice" subtitle="Endless questions" from="amber" />
          </Link>
        </div>
      </section>

      {/* AI tutor banner */}
      <Link
        href="/teacher"
        className="card-i flex items-center gap-3 overflow-hidden p-4"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft/15 text-xl">🤖</span>
        <div className="min-w-0 flex-1">
          <div className="font-bold">Maga — AI ustoz</div>
          <div className="text-xs text-muted">Istalgan savol — darajangizga moslab tushuntiradi</div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary-soft" />
      </Link>

      {/* Mock test teaser (Pro) */}
      <div className="card flex items-center gap-3 border-dashed p-4 opacity-90">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-xl">📝</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-bold">
            Full Mock Test
            <span className="chip bg-amber/15 text-amber">
              <Sparkles className="h-3 w-3" /> Pro
            </span>
          </div>
          <div className="text-xs text-muted">4 bo‘lim + taymer + umumiy band — tez kunda</div>
        </div>
        <Lock className="h-4 w-4 shrink-0 text-subtle" />
      </div>
    </div>
  );
}
