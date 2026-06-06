import Link from "next/link";
import { Flame, Trophy, Zap, CalendarCheck, Sparkles, ArrowRight, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BandRing, StatPill, XpBar, ActionTile } from "@/components/gamify";
import type { Profile, StudentProgress } from "@/lib/types";

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

  const [{ data: progressRaw }, { data: evalsRaw }] = await Promise.all([
    supabase.rpc("student_progress"),
    supabase
      .from("evaluations")
      .select("overall_band, kind, result, created_at")
      .eq("student_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const progress = (progressRaw as StudentProgress | null) ?? null;
  const evals = (evalsRaw as { overall_band: number; result: { target_band?: number }; created_at: string }[] | null) ?? [];

  const streak = progress?.current_streak ?? 0;
  const bestBand = evals.length ? Math.max(...evals.map((e) => Number(e.overall_band) || 0)) : null;
  const latestTarget = evals[0]?.result?.target_band ?? (bestBand ? Math.min(bestBand + 0.5, 9) : null);

  const now = Date.now();
  const weekAgo = now - 7 * 864e5;
  const todayStart = new Date(); todayStart.setUTCHours(0, 0, 0, 0);
  const weekCount = evals.filter((e) => new Date(e.created_at).getTime() >= weekAgo).length;
  const todayCount = evals.filter((e) => new Date(e.created_at).getTime() >= todayStart.getTime()).length;

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

      {/* Daily goal */}
      <section className="card space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CalendarCheck className="h-4 w-4 text-primary-soft" /> Bugungi maqsad
        </div>
        <XpBar value={todayCount} max={3} label="3 ta mashq bajaring" />
        <p className="text-xs text-subtle">
          Bu hafta: <span className="font-semibold text-fg">{weekCount}</span> mashq · davom eting!
        </p>
      </section>

      {/* AI examiners — the stars */}
      <section className="space-y-3">
        <h2 className="px-1 text-sm font-semibold text-muted">AI imtihonchilar ✨</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/writing" className="block">
            <ActionTile emoji="✍️" title="Writing" subtitle="Tezkor band + tahlil" from="primary" />
          </Link>
          <Link href="/speaking" className="block">
            <ActionTile emoji="🎙️" title="Speaking" subtitle="Gapiring, band oling" from="indigo" />
          </Link>
          <Link href="/vocab" className="block">
            <ActionTile emoji="📇" title="Lug‘at" subtitle="SRS + AI tarjimon" from="teal" />
          </Link>
          <Link href="/exercises" className="block">
            <ActionTile emoji="🧠" title="AI Mashq" subtitle="Cheksiz savollar" from="amber" />
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
