import type { Metadata } from "next";
import { MessageSquare, CheckCircle2, RotateCcw } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Badge, EmptyState } from "@/components/legacy-ui";
import { SubmitButton } from "@/components/form-controls";
import { isStaff } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { Feedback } from "@/lib/types";
import { FeedbackForm } from "./feedback-form";
import { markHandled } from "./actions";
import { FeedbackSummary } from "./feedback-summary";

export const metadata: Metadata = { title: "Feedback" };

type Row = Feedback & { author: { full_name: string | null; email: string | null } | null };

const KIND_TABS = [
  { key: "", label: "All" },
  { key: "complaint", label: "Complaints" },
  { key: "feedback", label: "Feedback" },
  { key: "suggestion", label: "Suggestions" },
] as const;

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const profile = await requireActiveProfile();
  const staff = isStaff(profile.role);
  const { kind } = await searchParams;
  const activeKind = staff && KIND_TABS.some((t) => t.key === kind) ? kind : "";
  const supabase = await createClient();

  let query = supabase
    .from("feedback")
    .select("*, author:user_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(staff ? 100 : 20);
  if (activeKind) query = query.eq("kind", activeKind);
  const { data } = await query;
  const rows = (data as Row[] | null) ?? [];

  if (!staff) {
    return (
      <div className="space-y-5">
        <PageHeader title={profile.role === "parent" ? "Message the centre" : "Feedback"} />
        <FeedbackForm isParent={profile.role === "parent"} />
        {rows.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold text-muted">Your messages</h2>
            <div className="space-y-2">
              {rows.map((r) => (
                <Card key={r.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <Badge tone={r.kind === "complaint" ? "danger" : "primary"} className="capitalize">{r.kind}</Badge>
                    <span className="text-[11px] text-subtle">{formatDateTime(r.created_at)}</span>
                  </div>
                  <p className="text-sm">{r.message}</p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Staff view
  const unhandled = rows.filter((r) => !r.handled);
  return (
    <div className="space-y-5">
      <PageHeader title="Complaints & feedback" subtitle={`${unhandled.length} new of ${rows.length} total`} />

      <div className="flex flex-wrap gap-2">
        {KIND_TABS.map((t) => (
          <a key={t.key} href={t.key ? `/feedback?kind=${t.key}` : "/feedback"}>
            <Badge tone={activeKind === t.key ? "primary" : "muted"} className={activeKind === t.key ? "ring-1 ring-primary-soft/50" : ""}>
              {t.label}
            </Badge>
          </a>
        ))}
      </div>

      <FeedbackSummary />

      {rows.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages yet" description="Complaints and feedback from the app & Telegram appear here." />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Card key={r.id} className={r.handled ? "opacity-60" : ""}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge tone={r.kind === "complaint" ? "danger" : r.kind === "placement" ? "amber" : "primary"} className="capitalize">
                    {r.kind}
                  </Badge>
                  <Badge tone="muted">{r.source}</Badge>
                </div>
                <span className="text-[11px] text-subtle">{formatDateTime(r.created_at)}</span>
              </div>
              <div className="text-sm font-medium">
                {r.author?.full_name || r.author?.email || r.telegram_username || "Anonymous"}
              </div>
              <p className="mt-0.5 text-sm text-fg/90">{r.message}</p>
              <form action={markHandled} className="mt-2">
                <input type="hidden" name="feedback_id" value={r.id} />
                <input type="hidden" name="handled" value={(!r.handled).toString()} />
                <SubmitButton className="text-xs font-medium text-primary-soft" pendingLabel="…">
                  {r.handled ? (
                    <span className="inline-flex items-center gap-1"><RotateCcw className="h-3 w-3" /> Mark unread</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Mark handled</span>
                  )}
                </SubmitButton>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
