"use client";

import { useActionState } from "react";
import { Paperclip, Send } from "lucide-react";
import { submitHomework, type HwState } from "../actions";

export function SubmitForm({
  homeworkId,
  defaultBody,
  graded,
}: {
  homeworkId: string;
  defaultBody?: string | null;
  graded?: boolean;
}) {
  const [state, action, pending] = useActionState<HwState, FormData>(submitHomework, undefined);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="homework_id" value={homeworkId} />
      <textarea
        name="body"
        rows={5}
        defaultValue={defaultBody ?? ""}
        disabled={graded}
        className="input disabled:opacity-60"
        placeholder="Type your answer here…"
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
        <Paperclip className="h-4 w-4" />
        <input type="file" name="file" disabled={graded} className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-fg" />
      </label>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {!graded && (
        <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
          <Send className="h-4 w-4" /> {pending ? "Submitting…" : "Submit / Update"}
        </button>
      )}
      {graded && <p className="text-xs text-muted">This homework has been graded and is locked.</p>}
    </form>
  );
}
