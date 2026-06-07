"use client";

import { useActionState } from "react";
import { CheckCircle2, Target } from "lucide-react";
import { updateTargetBands, type AccountState } from "./actions";

const SKILLS = [
  { key: "listening", label: "Listening" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
] as const;

const BANDS = ["9.0", "8.5", "8.0", "7.5", "7.0", "6.5", "6.0", "5.5", "5.0", "4.5", "4.0"];

export function TargetBands({ targets }: { targets: Record<string, number> }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(updateTargetBands, undefined);

  return (
    <form action={action} className="card space-y-3 p-4">
      <h2 className="flex items-center gap-2 font-semibold">
        <Target className="h-4 w-4 text-primary-soft" /> Target Bands
      </h2>
      <p className="text-xs text-muted">Set your goal for each skill — we’ll track progress toward it.</p>
      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map((s) => (
          <div key={s.key}>
            <label className="label" htmlFor={s.key}>{s.label}</label>
            <select id={s.key} name={s.key} defaultValue={targets[s.key]?.toFixed(1) ?? ""} className="input">
              <option value="">—</option>
              {BANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {state?.ok && (
        <p className="flex items-center gap-1.5 text-sm text-teal">
          <CheckCircle2 className="h-4 w-4" /> Saved
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
        {pending ? "Saving…" : "Save targets"}
      </button>
    </form>
  );
}
