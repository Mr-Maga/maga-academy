import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader, Card, Badge, LevelChip } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { AccountForm } from "./account-form";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const profile = await requireActiveProfile();

  return (
    <div className="space-y-5">
      <PageHeader title="Account" subtitle="Your profile and settings." />

      <Card className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-lg font-bold text-primary-soft">
          {(profile.full_name || profile.email || "?").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{profile.full_name || "—"}</div>
          <div className="truncate text-sm text-muted">{profile.email}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge tone="primary">{profile.role ? ROLE_LABELS[profile.role] : "—"}</Badge>
          {profile.role === "student" && <LevelChip level={profile.level} />}
        </div>
      </Card>

      {profile.role === "student" && profile.access_expires_at && (
        <p className="text-center text-xs text-subtle">
          Access active until {formatDate(profile.access_expires_at)}
        </p>
      )}

      <AccountForm
        fullName={profile.full_name ?? ""}
        phone={profile.phone ?? ""}
        dailyGoal={profile.daily_goal ?? 20}
      />

      <SignOutButton />
    </div>
  );
}
