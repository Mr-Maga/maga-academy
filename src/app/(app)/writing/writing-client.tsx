"use client";

import { useActionState, useState } from "react";
import { PenLine, Sparkles } from "lucide-react";
import { AiEvaluationView } from "@/components/ai-evaluation";
import { checkWriting, type WritingCheckState } from "./actions";

export function WritingClient() {
  const [state, action, pending] = useActionState<WritingCheckState, FormData>(checkWriting, undefined);
  const [essay, setEssay] = useState("");
  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      <form action={action} className="card space-y-3 p-4">
        <div className="flex gap-2">
          <label className="flex-1">
            <span className="label">Task</span>
            <select name="task" defaultValue="task2" className="input">
              <option value="task2">Task 2 (essay)</option>
              <option value="task1">Task 1 (report/letter)</option>
            </select>
          </label>
        </div>
        <div>
          <span className="label">Question / topic</span>
          <textarea name="question" rows={2} className="input" placeholder="Paste the exact question you answered…" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="label">Your answer</span>
            <span className="text-xs text-subtle">{words} words</span>
          </div>
          <textarea
            name="essay"
            rows={10}
            required
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            className="input"
            placeholder="Write or paste your full essay here…"
          />
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}

        <button type="submit" disabled={pending} className="btn-primary w-full py-3">
          {pending ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Evaluating…
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4" /> Get my band score
            </>
          )}
        </button>
      </form>

      {state?.result && <AiEvaluationView ev={state.result} />}
    </div>
  );
}
