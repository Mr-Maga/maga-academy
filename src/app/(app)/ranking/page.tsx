import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Trophy, Medal } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState, LevelChip, Badge } from "@/components/legacy-ui";
import { isStaff, LEVELS, levelLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LeaderboardRow, LevelKey } from "@/lib/types";

export const metadata: Metadata = { title: "Ranking" };

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const profile = await requireActiveProfile();
  if (profile.role === "parent") redirect("/dashboard");

  const staff = isStaff(profile.role);
  const { level } = await searchParams;
  const filterLevel = staff && level && LEVELS.some((l) => l.key === level) ? (level as LevelKey) : null;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_leaderboard", filterLevel ? { p_level: filterLevel } : {});
  const rows = (data as LeaderboardRow[] | null) ?? [];

  return (
    <div>
      <PageHeader
        title="Ranking"
        subtitle={staff ? "From teacher scores — overall & per group." : `Your level — ${levelLabel(profile.level)}`}
      />

      {staff && (
        <div className="mb-4 flex flex-wrap gap-2">
          <LevelPill href="/ranking" label="All levels" active={!filterLevel} />
          {LEVELS.map((l) => (
            <LevelPill key={l.key} href={`/ranking?level=${l.key}`} label={l.short} active={filterLevel === l.key} />
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState icon={Trophy} title="No scores yet" description="Ranking appears once teachers grade homework or add scores." />
      ) : (
        <ol className="space-y-2">
          {rows.map((r) => {
            const isMe = r.student_id === profile.id;
            return (
              <li
                key={r.student_id}
                className={cn(
                  "card flex items-center gap-3 p-3.5",
                  isMe && "border-primary-soft/60 bg-primary/10",
                )}
              >
                <RankBadge rank={r.rank_overall} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">
                      {r.full_name || "Student"} {isMe && <span className="text-primary-soft">(you)</span>}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    {staff && <LevelChip level={r.level} />}
                    {r.group_name && <span>{r.group_name} · #{r.rank_in_group} in group</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{Math.round(r.avg_percent)}%</div>
                  <div className="text-[11px] text-subtle">{Math.round(r.total_score)} pts</div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const tones = ["text-amber", "text-muted", "text-[#cd7f32]"];
  if (rank <= 3) {
    return (
      <div className="grid h-9 w-9 shrink-0 place-items-center">
        <Medal className={cn("h-7 w-7", tones[rank - 1])} />
      </div>
    );
  }
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-sm font-bold text-muted">
      {rank}
    </div>
  );
}

function LevelPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a href={href}>
      <Badge tone={active ? "primary" : "muted"} className={active ? "ring-1 ring-primary-soft/50" : ""}>
        {label}
      </Badge>
    </a>
  );
}
