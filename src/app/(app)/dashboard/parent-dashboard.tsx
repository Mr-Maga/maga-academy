import Link from "next/link";
import { Flame, ClipboardList, TrendingUp, UserRound, ArrowRight, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, EmptyState, LevelChip } from "@/components/legacy-ui";
import { SKILL_MAP } from "@/lib/constants";
import type { Profile, StudentProgress } from "@/lib/types";

export async function ParentDashboard({ profile }: { profile: Profile }) {
  const supabase = await createClient();

  const { data: linksRaw } = await supabase
    .from("parent_links")
    .select("student:student_id(*)")
    .eq("parent_id", profile.id);

  const children = ((linksRaw as { student: Profile }[] | null) ?? [])
    .map((l) => l.student)
    .filter(Boolean);

  const withProgress = await Promise.all(
    children.map(async (c) => {
      const { data } = await supabase.rpc("student_progress", { p_student: c.id });
      return { child: c, progress: (data as StudentProgress | null) ?? null };
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Parent portal</h1>
        <p className="text-sm text-muted">Follow your child’s progress (read-only).</p>
      </div>

      {withProgress.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No linked child yet"
          description="The centre links your account to your child. Once linked and your child is active, their progress appears here."
        />
      ) : (
        <div className="space-y-3">
          {withProgress.map(({ child, progress }) => (
            <Link key={child.id} href={`/progress/${child.id}`} className="card block p-4 transition hover:bg-elevated">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 font-bold text-primary-soft">
                    {(child.full_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{child.full_name || "Student"}</div>
                    <LevelChip level={child.level} className="mt-0.5" />
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-subtle" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Mini icon={<Flame className="h-4 w-4 text-amber" />} label="Streak" value={`${progress?.current_streak ?? 0}`} />
                <Mini icon={<ClipboardList className="h-4 w-4 text-primary-soft" />} label="Homework" value={`${progress?.homework_completion ?? 0}%`} />
                <Mini
                  icon={<TrendingUp className="h-4 w-4 text-teal" />}
                  label="Focus"
                  value={progress?.weakest_skill ? SKILL_MAP[progress.weakest_skill].label : "—"}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Card className="flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-primary-soft" />
        <div className="flex-1 text-sm">
          <div className="font-medium">Questions or concerns?</div>
          <div className="text-muted">Send the centre a message any time.</div>
        </div>
        <Link href="/feedback" className="btn-ghost px-3 py-2 text-sm">
          Message
        </Link>
      </Card>
    </div>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-2 py-2.5">
      <div className="flex items-center justify-center">{icon}</div>
      <div className="mt-1 text-sm font-bold leading-none">{value}</div>
      <div className="text-[10px] text-muted">{label}</div>
    </div>
  );
}
