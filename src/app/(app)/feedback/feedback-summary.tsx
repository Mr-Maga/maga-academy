"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { summariseFeedback } from "./actions";

export function FeedbackSummary() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    const res = await summariseFeedback();
    setLoading(false);
    if (res.error) setError(res.error);
    else setSummary(res.summary ?? "");
  }

  return (
    <div className="card border-primary-soft/30 bg-primary/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary-soft" /> AI summary
        </div>
        <button onClick={run} disabled={loading} className="btn-primary px-3 py-1.5 text-sm">
          {loading ? "Analysing…" : summary ? "Refresh" : "Summarise"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {summary && <p className="mt-3 whitespace-pre-wrap text-sm text-fg/90">{summary}</p>}
      {!summary && !error && (
        <p className="mt-2 text-sm text-muted">Let Maga AI digest recent complaints & feedback into key themes and actions.</p>
      )}
    </div>
  );
}
