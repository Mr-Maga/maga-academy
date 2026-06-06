import { History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/dal";
import type { AiEvaluationRecord, EvalKind } from "@/lib/types";

function bandColor(band: number): string {
  if (band >= 7) return "var(--color-teal)";
  if (band >= 6) return "var(--color-amber)";
  return "var(--color-danger)";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function subLabel(kind: EvalKind, sub: string | null) {
  if (!sub) return kind === "writing" ? "Writing" : "Speaking";
  if (kind === "writing") return sub === "task1" ? "Task 1" : "Task 2";
  // speaking: part1/part2/part3
  return sub.replace("part", "Part ");
}

export async function EvaluationHistory({ kind }: { kind: EvalKind }) {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("evaluations")
    .select("id, kind, sub_type, question, overall_band, created_at")
    .eq("student_id", user.id)
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(10);

  const rows = (data ?? []) as Pick<
    AiEvaluationRecord,
    "id" | "kind" | "sub_type" | "question" | "overall_band" | "created_at"
  >[];

  if (rows.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
        <History className="h-4 w-4" /> Past results
      </h2>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="card flex items-center gap-4 px-4 py-3">
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 text-sm font-extrabold"
              style={{
                borderColor: bandColor(row.overall_band),
                color: bandColor(row.overall_band),
              }}
            >
              {Number(row.overall_band).toFixed(1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-medium">{subLabel(row.kind, row.sub_type)}</span>
                <span>·</span>
                <span>{formatDate(row.created_at)}</span>
              </div>
              {row.question && (
                <p className="mt-0.5 truncate text-sm text-fg/80">{row.question}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
