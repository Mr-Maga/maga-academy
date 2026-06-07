import { Trophy, Star, Flame, CalendarCheck, PenLine, Mic, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export async function Achievements({ studentId }: { studentId: string }) {
  const supabase = await createClient();
  const [{ data: evalsRaw }, { data: streakRaw }] = await Promise.all([
    supabase.from("evaluations").select("overall_band, kind").eq("student_id", studentId),
    supabase.from("streaks").select("longest_streak").eq("user_id", studentId).maybeSingle(),
  ]);

  const evals = (evalsRaw as { overall_band: number; kind: string }[] | null) ?? [];
  const longest = (streakRaw as { longest_streak?: number } | null)?.longest_streak ?? 0;
  const writingBest = Math.max(0, ...evals.filter((e) => e.kind === "writing").map((e) => Number(e.overall_band)));
  const speakingBest = Math.max(0, ...evals.filter((e) => e.kind === "speaking").map((e) => Number(e.overall_band)));

  const badges = [
    { icon: Star, label: "First Step", desc: "Complete your first test", got: evals.length >= 1 },
    { icon: Trophy, label: "Getting Serious", desc: "Complete 5 tests", got: evals.length >= 5 },
    { icon: Flame, label: "On Fire", desc: "3-day streak", got: longest >= 3 },
    { icon: CalendarCheck, label: "Week Champion", desc: "7-day streak", got: longest >= 7 },
    { icon: PenLine, label: "Sharp Writer", desc: "Writing band 6.0+", got: writingBest >= 6 },
    { icon: Mic, label: "Smooth Speaker", desc: "Speaking band 6.0+", got: speakingBest >= 6 },
  ];
  const unlocked = badges.filter((b) => b.got).length;

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <Trophy className="h-4 w-4 text-amber" /> Achievements
        </h2>
        <span className="text-xs text-muted">
          {unlocked} / {badges.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {badges.map((b) => {
          const Icon = b.got ? b.icon : Lock;
          return (
            <div
              key={b.label}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-2.5",
                b.got ? "border-amber/30 bg-amber/5" : "border-border opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                  b.got ? "bg-amber/15 text-amber" : "bg-surface text-subtle",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{b.label}</div>
                <div className="truncate text-[11px] text-muted">{b.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
