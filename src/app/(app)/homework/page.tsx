import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ClipboardList, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Badge, EmptyState, LevelChip } from "@/components/legacy-ui";
import { isStaff, levelLabel } from "@/lib/constants";
import { relativeDue } from "@/lib/utils";
import type { Homework, Submission } from "@/lib/types";

export const metadata: Metadata = { title: "Homework" };

export default async function HomeworkPage() {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  const staff = isStaff(profile.role);

  const { data: hwRaw } = await supabase
    .from("homework")
    .select("*")
    .order("due_at", { ascending: true, nullsFirst: false });
  const homework = (hwRaw as Homework[] | null) ?? [];

  // For students, fetch their own submissions to compute status.
  let subsByHw = new Map<string, Submission>();
  if (!staff) {
    const { data: subs } = await supabase
      .from("submissions")
      .select("*")
      .eq("student_id", profile.id);
    subsByHw = new Map(((subs as Submission[] | null) ?? []).map((s) => [s.homework_id, s]));
  }

  return (
    <div>
      <PageHeader
        title="Homework"
        subtitle={staff ? "Assign tasks and grade submissions." : "Your tasks and deadlines."}
        action={
          staff ? (
            <Link href="/homework/new" className="btn-primary px-3 py-2 text-sm">
              <Plus className="h-4 w-4" /> Assign
            </Link>
          ) : undefined
        }
      />

      {homework.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No homework yet"
          description={staff ? "Tap Assign to create the first task." : "You're all caught up. Check back later."}
        />
      ) : (
        <div className="space-y-2">
          {homework.map((h) => {
            const sub = subsByHw.get(h.id);
            const overdue = h.due_at ? new Date(h.due_at).getTime() < Date.now() : false;
            return (
              <Link
                key={h.id}
                href={`/homework/${h.id}`}
                className="card flex items-center justify-between gap-3 p-4 transition hover:bg-elevated"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold">{h.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    {staff ? <LevelChip level={h.level} /> : null}
                    {!staff && <span>{levelLabel(h.level)}</span>}
                    <span className={overdue && !sub ? "text-danger" : ""}>{relativeDue(h.due_at)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!staff && <StudentStatus sub={sub} overdue={overdue} />}
                  <ArrowRight className="h-4 w-4 text-subtle" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StudentStatus({ sub, overdue }: { sub: Submission | undefined; overdue: boolean }) {
  if (sub?.status === "graded") {
    return (
      <Badge tone="teal">
        <CheckCircle2 className="h-3 w-3" /> {sub.score ?? 0}/{sub.max_score ?? 100}
      </Badge>
    );
  }
  if (sub) return <Badge tone="primary">Submitted</Badge>;
  if (overdue) {
    return (
      <Badge tone="danger">
        <AlertTriangle className="h-3 w-3" /> Not done
      </Badge>
    );
  }
  return <Badge tone="amber">To do</Badge>;
}
