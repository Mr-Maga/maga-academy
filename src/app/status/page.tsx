import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Clock, Lock } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { SignOutButton } from "@/components/sign-out-button";
import { effectiveAccess, getProfile, requireUser } from "@/lib/dal";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Account status" };

export default async function StatusPage() {
  await requireUser();
  const profile = await getProfile();

  if (!profile || !profile.code_claimed || !profile.role) redirect("/claim");
  const access = effectiveAccess(profile);
  if (access === "active") redirect("/dashboard");

  const pending = access === "pending";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 flex justify-center">
        <Wordmark />
      </div>

      <div className="card p-7 text-center shadow-2xl shadow-black/40">
        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
            pending ? "bg-amber/15 text-amber" : "bg-danger/15 text-danger"
          }`}
        >
          {pending ? <Clock className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
        </div>

        <h1 className="mt-4 text-xl font-bold">
          {pending ? "Awaiting approval" : "Access paused"}
        </h1>

        <p className="mt-2 text-sm text-muted">
          {pending ? (
            <>
              Your {ROLE_LABELS[profile.role].toLowerCase()} account is registered and waiting for
              the centre to approve access. You’ll get in as soon as it’s confirmed.
            </>
          ) : (
            <>
              Your subscription has ended
              {profile.access_expires_at ? ` (expired ${formatDate(profile.access_expires_at)})` : ""}.
              Please renew with the centre to continue.
            </>
          )}
        </p>

        <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm">
          <Row label="Name" value={profile.full_name || "—"} />
          <Row label="Role" value={ROLE_LABELS[profile.role]} />
          <Row label="Status" value={pending ? "Pending" : "Locked"} />
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-subtle">
        Need help? Send a message to the centre on Telegram.
      </p>

      <div className="mx-auto mt-6 w-40">
        <SignOutButton />
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
