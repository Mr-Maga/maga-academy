import type { Metadata } from "next";
import { Flame, Target } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard } from "@/components/legacy-ui";
import { AutoSubmitSelect } from "@/components/form-controls";
import type { Streak } from "@/lib/types";
import { PracticeClient } from "./practice-client";
import { setDailyGoal } from "./actions";

export const metadata: Metadata = { title: "Practice Lab" };

const GOALS = [10, 15, 20, 30, 45, 60];

export default async function PracticePage() {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  const { data } = await supabase.from("streaks").select("*").eq("user_id", profile.id).maybeSingle();
  const streak = (data as Streak | null) ?? null;
  const goal = profile.daily_goal ?? 20;

  return (
    <div className="space-y-5">
      <PageHeader title="Practice Lab" subtitle="Shadowing & typing — keep the streak going." />

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Flame} tone="amber" label="Current streak" value={`${streak?.current_streak ?? 0}`} hint="Current streak" />
        <StatCard icon={Target} tone="teal" label="Best" value={`${streak?.longest_streak ?? 0}`} hint="Longest streak" />
      </div>

      <div className="card flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-primary-soft" />
          <span className="font-medium">Daily goal</span>
        </div>
        <form action={setDailyGoal}>
          <AutoSubmitSelect name="daily_goal" defaultValue={String(goal)} aria-label="Daily goal minutes">
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g} min / day
              </option>
            ))}
          </AutoSubmitSelect>
        </form>
      </div>

      <PracticeClient initialStreak={streak?.current_streak ?? 0} />
    </div>
  );
}
