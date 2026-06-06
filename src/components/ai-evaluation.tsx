import { CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import type { AiEvaluation } from "@/lib/types";

function bandColor(band: number): string {
  if (band >= 7) return "var(--color-teal)";
  if (band >= 6) return "var(--color-amber)";
  return "var(--color-danger)";
}

export function AiEvaluationView({ ev }: { ev: AiEvaluation }) {
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4">
        <div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 text-2xl font-extrabold"
          style={{ borderColor: bandColor(ev.overall_band), color: bandColor(ev.overall_band) }}
        >
          {ev.overall_band.toFixed(1)}
        </div>
        <div>
          <div className="text-sm text-muted">Estimated overall band</div>
          <div className="text-lg font-bold">IELTS {ev.overall_band.toFixed(1)}</div>
          {ev.band_note ? (
            <div className="mt-0.5 text-xs text-amber">{ev.band_note}</div>
          ) : (
            <div className="text-xs text-subtle">AI estimate — your teacher confirms the final score.</div>
          )}
        </div>
      </Card>

      {ev.transcript && (
        <Card>
          <h3 className="mb-1.5 text-sm font-semibold text-muted">🎧 AI eshitgan matn</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{ev.transcript}</p>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 font-semibold">Criteria</h3>
        <div className="space-y-3">
          {ev.criteria.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="font-bold" style={{ color: bandColor(c.band) }}>
                  {c.band.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(c.band / 9) * 100}%`, backgroundColor: bandColor(c.band) }}
                />
              </div>
              <p className="mt-1 text-xs text-muted">{c.comment}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <h3 className="mb-2 flex items-center gap-1.5 font-semibold text-teal">
            <CheckCircle2 className="h-4 w-4" /> Strengths
          </h3>
          <ul className="space-y-1.5 text-sm">
            {ev.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-teal">•</span> {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2 flex items-center gap-1.5 font-semibold text-amber">
            <ArrowUpRight className="h-4 w-4" /> How to improve
          </h3>
          <ul className="space-y-1.5 text-sm">
            {ev.improvements.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber">•</span> {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border-primary-soft/30 bg-primary/5">
        <h3 className="mb-2 flex items-center gap-1.5 font-semibold text-primary-soft">
          <Sparkles className="h-4 w-4" /> Model answer (one band higher)
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{ev.upgraded_sample}</p>
      </Card>
    </div>
  );
}
