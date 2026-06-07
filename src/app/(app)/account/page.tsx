import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader, Card, Badge } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";
import { Achievements } from "@/components/achievements";
import { AccountForm } from "./account-form";
import { TargetBands } from "./target-bands";
import { chooseLearningPath } from "@/app/onboarding/actions";

export const metadata: Metadata = { title: "My Profile" };

export default async function AccountPage() {
  const profile = await requireActiveProfile();
  const isStudent = profile.role === "student";
  const initial = (profile.full_name || profile.email || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-5">
      <PageHeader title="My Profile" subtitle="Your profile, goals and settings." />

      <Card className="flex items-center gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold text-bg"
          style={{ backgroundImage: "linear-gradient(135deg, #2dd4bf, #14b8a6)" }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{profile.full_name || "—"}</div>
          <div className="truncate text-sm text-muted">{profile.email}</div>
        </div>
        {isStudent && profile.learning_path && (
          <Badge tone="teal">{profile.learning_path === "ielts" ? "IELTS" : "General"}</Badge>
        )}
      </Card>

      {isStudent && <TargetBands targets={profile.target_bands ?? {}} />}

      {isStudent && <Achievements studentId={profile.id} />}

      <AccountForm
        fullName={profile.full_name ?? ""}
        phone={profile.phone ?? ""}
        dailyGoal={profile.daily_goal ?? 20}
      />

      {isStudent && (
        <Card className="space-y-3">
          <div className="text-sm font-semibold">Learning track</div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["ielts", "🎓 IELTS"],
              ["general", "💬 General"],
            ] as const).map(([key, label]) => {
              const active = profile.learning_path === key;
              if (active) {
                return (
                  <div
                    key={key}
                    className="rounded-xl border-2 border-primary-soft bg-primary-soft/10 px-3 py-2.5 text-center text-sm font-semibold text-primary-soft"
                  >
                    {label} ✓
                  </div>
                );
              }
              return (
                <form key={key} action={chooseLearningPath.bind(null, key)}>
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-center text-sm font-medium transition hover:border-primary-soft/40"
                  >
                    {label}
                  </button>
                </form>
              );
            })}
          </div>
        </Card>
      )}

      <SignOutButton />
    </div>
  );
}
