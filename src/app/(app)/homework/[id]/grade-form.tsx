"use client";

import { useActionState } from "react";
import { gradeSubmission, type HwState } from "../actions";

export function GradeForm({
  submissionId,
  homeworkId,
  studentId,
  score,
  maxScore,
  comment,
}: {
  submissionId: string;
  homeworkId: string;
  studentId: string;
  score?: number | null;
  maxScore?: number | null;
  comment?: string | null;
}) {
  const [state, action, pending] = useActionState<HwState, FormData>(gradeSubmission, undefined);

  return (
    <form action={action} className="mt-2 space-y-2 border-t border-border pt-2">
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="homework_id" value={homeworkId} />
      <input type="hidden" name="student_id" value={studentId} />
      <div className="flex items-center gap-2">
        <input
          name="score"
          type="number"
          step="0.5"
          required
          defaultValue={score ?? ""}
          placeholder="Score"
          className="w-20 rounded-lg border border-border bg-input px-2 py-1.5 text-sm"
        />
        <span className="text-muted">/</span>
        <input
          name="max_score"
          type="number"
          step="1"
          defaultValue={maxScore ?? 100}
          className="w-20 rounded-lg border border-border bg-input px-2 py-1.5 text-sm"
        />
        <button type="submit" disabled={pending} className="btn-primary ml-auto px-3 py-1.5 text-sm">
          {pending ? "…" : "Save grade"}
        </button>
      </div>
      <input
        name="comment"
        defaultValue={comment ?? ""}
        placeholder="Comment for the student…"
        className="w-full rounded-lg border border-border bg-input px-2.5 py-1.5 text-sm"
      />
      {state?.error && <p className="text-xs text-danger">{state.error}</p>}
    </form>
  );
}
