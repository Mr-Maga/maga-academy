import type { Metadata } from "next";
import { CheckCircle2, Clock, Lock } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Badge, LevelChip, EmptyState } from "@/components/legacy-ui";
import { SubmitButton } from "@/components/form-controls";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate, daysUntil } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { approveAccess, lockAccess } from "../actions";

export const metadata: Metadata = { title: "Approvals & access" };

export default async function AccessPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["student", "parent"])
    .order("created_at", { ascending: false });

  const people = (data as Profile[] | null) ?? [];
  const pending = people.filter((p) => p.access_status === "pending");
  const others = people.filter((p) => p.access_status !== "pending");

  return (
    <div>
      <PageHeader title="Approvals & access" subtitle="Approve, renew or lock student & parent access." />

      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber">
        <Clock className="h-4 w-4" /> Pending ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="mb-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          No pending requests.
        </p>
      ) : (
        <div className="mb-6 space-y-2">
          {pending.map((p) => (
            <AccessCard key={p.id} p={p} />
          ))}
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold text-muted">All students & parents</h2>
      {others.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Nobody yet" description="Approved accounts will show here." />
      ) : (
        <div className="space-y-2">
          {others.map((p) => (
            <AccessCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function AccessCard({ p }: { p: Profile }) {
  const left = daysUntil(p.access_expires_at);
  const expired = p.access_status === "active" && left !== null && left < 0;
  const status: "pending" | "active" | "locked" = expired ? "locked" : p.access_status;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold">{p.full_name || p.email || "Unnamed"}</span>
            <Badge tone={p.role === "parent" ? "teal" : "primary"}>{ROLE_LABELS[p.role!]}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <LevelChip level={p.level} />
            {p.access_status === "active" && p.access_expires_at && (
              <span>
                {left !== null && left >= 0 ? `${left}d left · ` : "expired · "}
                until {formatDate(p.access_expires_at)}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <form action={approveAccess} className="flex items-center gap-2">
          <input type="hidden" name="user_id" value={p.id} />
          <select
            name="days"
            defaultValue="30"
            className="rounded-lg border border-border bg-input px-2 py-1.5 text-sm"
            aria-label="Access days"
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
          <SubmitButton className="btn-primary px-3 py-1.5 text-sm" pendingLabel="Saving…">
            {p.access_status === "active" ? "Renew" : "Approve"}
          </SubmitButton>
        </form>

        {p.access_status !== "locked" && (
          <form action={lockAccess}>
            <input type="hidden" name="user_id" value={p.id} />
            <SubmitButton className="btn-ghost px-3 py-1.5 text-sm text-danger" pendingLabel="…">
              <Lock className="h-3.5 w-3.5" /> Lock
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "active" | "locked" }) {
  if (status === "active") return <Badge tone="teal">Active</Badge>;
  if (status === "pending") return <Badge tone="amber">Pending</Badge>;
  return <Badge tone="danger">Locked</Badge>;
}
