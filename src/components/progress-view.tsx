import { Flame, ClipboardList, Target, TrendingDown, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard, Card, EmptyState, Badge } from "@/components/legacy-ui";
import { SKILL_MAP } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { ProgressPoint, Score, StudentProgress } from "@/lib/types";

type ScoreRow = Score & { homework: { title: string } | null };

export async function ProgressView({ studentId }: { studentId: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("student_progress", { p_student: studentId });

  if (error || !data) {
    return (
      <EmptyState
        icon={Activity}
        title="No progress data"
        description="Scores will appear here once the student is graded."
      />
    );
  }

  const p = data as StudentProgress;
  const points = (p.points ?? []) as ProgressPoint[];
  const max = Math.max(100, ...points.map((pt) => pt.avg_percent));

  const { data: scoresRaw } = await supabase
    .from("scores")
    .select("*, homework:homework_id(title)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(10);
  const scores = (scoresRaw as ScoreRow[] | null) ?? [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Flame} tone="amber" label="Streak" value={`${p.current_streak ?? 0}`} hint="Day streak" />
        <StatCard icon={ClipboardList} tone="primary" label="Homework" value={`${p.homework_completion ?? 0}%`} hint="Homework done" />
        <StatCard icon={Target} tone="teal" label="Daily goal" value={`${p.daily_goal ?? 20}m`} hint="Daily goal" />
        <StatCard
          icon={TrendingDown}
          tone="danger"
          label="Focus"
          value={p.weakest_skill ? SKILL_MAP[p.weakest_skill].label : "—"}
          hint="Weakest skill"
        />
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Weekly average</h2>
        {points.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No scores yet.</p>
        ) : (
          <div className="flex h-36 items-end gap-2">
            {points.map((pt) => (
              <div key={pt.bucket} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-soft"
                    style={{ height: `${Math.max(4, (pt.avg_percent / max) * 100)}%` }}
                    title={`${pt.avg_percent}%`}
                  />
                </div>
                <span className="text-[10px] text-subtle">{pt.bucket.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Recent scores</h2>
        {scores.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted">No scores recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {scores.map((s) => {
              const pct = s.max_value ? Math.round((s.value / s.max_value) * 100) : 0;
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {s.homework?.title ?? (s.skill ? SKILL_MAP[s.skill].label : "Score")}
                    </div>
                    <div className="text-[11px] text-subtle">{formatDate(s.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.skill && <Badge tone="muted">{SKILL_MAP[s.skill].label}</Badge>}
                    <span className="font-bold">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
