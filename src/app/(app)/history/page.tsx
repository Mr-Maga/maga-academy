import type { Metadata } from "next";
import Link from "next/link";
import { PenLine, Mic, BarChart3 } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/legacy-ui";
import type { EvalKind } from "@/lib/types";

export const metadata: Metadata = { title: "Test History" };

function bandColor(band: number): string {
  if (band >= 7) return "var(--color-teal)";
  if (band >= 6) return "var(--color-amber)";
  return "var(--color-rose)";
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function label(kind: EvalKind, sub: string | null) {
  const base = kind === "writing" ? "Writing" : "Speaking";
  if (!sub) return base;
  if (kind === "writing") return `${base} · ${sub === "task1" ? "Task 1" : "Task 2"}`;
  return `${base} · ${sub.replace("part", "Part ")}`;
}

type Row = {
  id: string;
  kind: EvalKind;
  sub_type: string | null;
  question: string | null;
  overall_band: number;
  created_at: string;
};

export default async function HistoryPage() {
  const profile = await requireActiveProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("evaluations")
    .select("id, kind, sub_type, question, overall_band, created_at")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data as Row[] | null) ?? [];

  return (
    <div>
      <PageHeader
        title="Test History"
        subtitle="Your past Writing & Speaking results."
        action={
          rows.length > 0 ? (
            <span className="chip bg-surface text-muted">{rows.length} attempts</span>
          ) : undefined
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No tests yet"
          description="Take a Writing or Speaking test — your bands and progress will appear here."
          action={
            <Link href="/writing" className="btn-primary px-5 py-2.5">
              Start a test
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const band = Number(r.overall_band);
            const Icon = r.kind === "writing" ? PenLine : Mic;
            return (
              <div key={r.id} className="card flex items-center gap-4 px-4 py-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-sm font-extrabold"
                  style={{ borderColor: bandColor(band), color: bandColor(band) }}
                >
                  {band.toFixed(1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary-soft" /> {label(r.kind, r.sub_type)}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    <span>{fmt(r.created_at)}</span>
                    {r.question && (
                      <>
                        <span>·</span>
                        <span className="truncate">{r.question}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
