import Link from "next/link";
import { Flame, ClipboardList, Target, TrendingUp, BookOpen, Dumbbell, Trophy, ArrowRight, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, LevelChip, LinkCard, StatCard } from "@/components/ui";
import { SKILL_MAP } from "@/lib/constants";
import { relativeDue } from "@/lib/utils";
import type { Homework, Profile, StudentProgress } from "@/lib/types";

export async function StudentDashboard({ profile }: { profile: Profile }) {
  const supabase = await createClient();

  const [{ data: progressRaw }, { data: homeworkRaw }, { data: subsRaw }] = await Promise.all([
    supabase.rpc("student_progress"),
    supabase.from("homework").select("*").order("due_at", { ascending: true }).limit(20),
    supabase.from("submissions").select("homework_id").eq("student_id", profile.id),
  ]);

  const progress = (progressRaw as StudentProgress | null) ?? null;
  const submitted = new Set((subsRaw ?? []).map((s: { homework_id: string }) => s.homework_id));
  const pending = ((homeworkRaw as Homework[] | null) ?? []).filter((h) => !submitted.has(h.id)).slice(0, 4);

  const streak = progress?.current_streak ?? 0;
  const goal = progress?.daily_goal ?? profile.daily_goal ?? 20;
  const completion = progress?.homework_completion ?? 0;
  const weakest = progress?.weakest_skill ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your dashboard</h1>
          <p className="text-sm text-muted">Keep your streak alive 🔥</p>
        </div>
        <LevelChip level={profile.level} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Flame} tone="amber" label="Day streak" value={`${streak}`} hint={`${streak} day streak`} />
        <StatCard icon={Target} tone="teal" label="Daily goal" value={`${goal}m`} hint="Daily goal" />
        <StatCard icon={ClipboardList} tone="primary" label="Homework done" value={`${completion}%`} hint="Homework done" />
        <StatCard
          icon={TrendingUp}
          tone="danger"
          label="Focus skill"
          value={weakest ? SKILL_MAP[weakest].label : "—"}
          hint="Weakest skill"
        />
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Due homework</h2>
          <Link href="/homework" className="text-sm font-medium text-primary-soft">
            See all
          </Link>
        </div>
        {pending.length === 0 ? (
          <Card className="text-center text-sm text-muted">🎉 No pending homework. Great job!</Card>
        ) : (
          <div className="space-y-2">
            {pending.map((h) => (
              <Link
                key={h.id}
                href={`/homework/${h.id}`}
                className="card flex items-center justify-between gap-3 p-3.5 transition hover:bg-elevated"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{h.title}</div>
                  <div className="text-xs text-muted">{relativeDue(h.due_at)}</div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-subtle" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">AI tools ✨</h2>
        <Link
          href="/teacher"
          className="card mb-3 flex items-center gap-3 bg-gradient-to-br from-primary/25 to-transparent p-4 transition hover:bg-elevated active:scale-[0.98]"
        >
          <span className="text-3xl">👨‍🏫</span>
          <div className="flex-1">
            <div className="font-semibold">AI Teacher</div>
            <div className="text-xs text-muted">Ask anything — it explains for your level</div>
          </div>
        </Link>
        <div className="mb-3 grid grid-cols-2 gap-3">
          <Link
            href="/exercises"
            className="card flex flex-col gap-1 bg-gradient-to-br from-amber/20 to-transparent p-4 transition hover:bg-elevated active:scale-[0.98]"
          >
            <span className="text-2xl">🧠</span>
            <span className="font-semibold">AI Practice</span>
            <span className="text-xs text-muted">Endless graded exercises</span>
          </Link>
          <Link
            href="/vocab"
            className="card flex flex-col gap-1 bg-gradient-to-br from-teal/20 to-transparent p-4 transition hover:bg-elevated active:scale-[0.98]"
          >
            <span className="text-2xl">📇</span>
            <span className="font-semibold">Vocabulary</span>
            <span className="text-xs text-muted">Daily flashcards (SRS)</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/writing"
            className="card flex flex-col gap-1 bg-gradient-to-br from-primary/20 to-transparent p-4 transition hover:bg-elevated active:scale-[0.98]"
          >
            <span className="text-2xl">✍️</span>
            <span className="font-semibold">Writing check</span>
            <span className="text-xs text-muted">Instant band + feedback</span>
          </Link>
          <Link
            href="/speaking"
            className="card flex flex-col gap-1 bg-gradient-to-br from-teal/20 to-transparent p-4 transition hover:bg-elevated active:scale-[0.98]"
          >
            <span className="text-2xl">🎙️</span>
            <span className="font-semibold">Speaking examiner</span>
            <span className="text-xs text-muted">Talk, get a band score</span>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Jump back in</h2>
        <div className="grid gap-2">
          <LinkCard href="/skills" icon={BookOpen} title="Skills" description="Listening · Reading · Writing · Speaking" tone="primary" />
          <LinkCard href="/practice" icon={Dumbbell} title="Practice Lab" description="Shadowing & typing trainer" tone="teal" />
          <LinkCard href="/ranking" icon={Trophy} title="Ranking" description="See where you stand" tone="amber" />
          <LinkCard href="/progress" icon={TrendingUp} title="My progress" description="Scores, streak & weak spots" tone="danger" />
          <LinkCard href="/placement" icon={Compass} title="Placement test" description="Find your level" tone="primary" />
        </div>
      </section>
    </div>
  );
}
