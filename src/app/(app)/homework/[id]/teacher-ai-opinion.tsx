"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AiEvaluationView } from "@/components/ai-evaluation";
import { aiSecondOpinion, type OpinionState } from "../actions";

export function TeacherAiOpinion({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<OpinionState>(undefined);

  async function run() {
    setLoading(true);
    const res = await aiSecondOpinion(submissionId);
    setState(res);
    setLoading(false);
  }

  return (
    <div className="mt-2">
      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-soft disabled:opacity-60"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {loading ? "Analysing…" : "AI second opinion"}
      </button>
      {state?.error && <p className="mt-1 text-xs text-danger">{state.error}</p>}
      {state?.result && (
        <div className="mt-2">
          <AiEvaluationView ev={state.result} />
        </div>
      )}
    </div>
  );
}
