"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Mic, Square, CheckCircle2, ArrowRight, Trophy } from "lucide-react";
import { PLACEMENT_ITEMS, scorePlacement, type PlacementResult } from "@/lib/placement";
import { LEVEL_MAP } from "@/lib/constants";
import { LevelChip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { savePlacement } from "./actions";

type Phase = "quiz" | "speaking" | "result";

export function PlacementClient() {
  const items = PLACEMENT_ITEMS;
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [saving, setSaving] = useState(false);

  const item = items[step];
  const progress = useMemo(() => Math.round((step / items.length) * 100), [step, items.length]);

  function choose(i: number) {
    setAnswers((a) => ({ ...a, [item.id]: i }));
  }

  function next() {
    if (step < items.length - 1) setStep(step + 1);
    else setPhase("speaking");
  }

  async function finish() {
    const r = scorePlacement(answers);
    setResult(r);
    setPhase("result");
    setSaving(true);
    await savePlacement({ recommended: r.recommended, correct: r.correct, total: r.total, summary: r.summary });
    setSaving(false);
  }

  if (phase === "result" && result) {
    const lvl = LEVEL_MAP[result.recommended];
    return (
      <div className="space-y-4">
        <div className="card flex flex-col items-center p-6 text-center">
          <Trophy className="h-10 w-10 text-amber" />
          <p className="mt-3 text-sm text-muted">Recommended level</p>
          <h2 className="mt-1 text-3xl font-extrabold" style={{ color: lvl.cssVar }}>
            {lvl.label} ({lvl.short})
          </h2>
          <p className="mt-2 text-sm text-muted">
            {result.correct}/{result.total} correct
          </p>
          <p className="mt-3 text-xs text-teal">
            <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
            {saving ? "Sending to the centre…" : "Result sent to the centre"}
          </p>
        </div>

        <div className="card p-4">
          <h3 className="mb-2 text-sm font-semibold">Breakdown</h3>
          <ul className="space-y-1.5">
            {result.perLevel.map((p) => (
              <li key={p.level} className="flex items-center justify-between text-sm">
                <LevelChip level={p.level} />
                <span className={cn("font-medium", p.correct / p.total >= 0.5 ? "text-teal" : "text-muted")}>
                  {p.correct}/{p.total}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/dashboard" className="btn-primary w-full py-3">
          Go to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (phase === "speaking") {
    return <SpeakingStep onDone={finish} />;
  }

  const picked = answers[item.id];
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>
            Question {step + 1} of {items.length}
          </span>
          <span className="uppercase">{item.skill}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card p-4">
        {item.context && (
          <p className="mb-3 rounded-xl bg-surface px-3 py-2 text-sm italic text-muted">{item.context}</p>
        )}
        <p className="font-medium">{item.prompt}</p>
        <div className="mt-3 space-y-2">
          {item.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => choose(i)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                picked === i
                  ? "border-primary-soft bg-primary/15 text-fg"
                  : "border-border bg-surface text-muted hover:text-fg",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button onClick={next} disabled={picked === undefined} className="btn-primary w-full py-3">
        {step < items.length - 1 ? "Next" : "Continue"} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function SpeakingStep({ onDone }: { onDone: () => void }) {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecorded(true);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      setError("Microphone needed — or you can skip this step.");
    }
  }
  function stop() {
    recRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="card space-y-4 p-5">
      <div>
        <div className="text-xs font-medium uppercase text-muted">Speaking</div>
        <p className="mt-1 font-medium">Speak for ~30 seconds:</p>
        <p className="mt-1 text-sm text-muted">
          “Describe your hometown and what you like about it.” Your teacher will review your speaking.
        </p>
      </div>

      <div className="flex justify-center">
        {!recording ? (
          <button onClick={start} className="btn-primary px-5 py-3">
            <Mic className="h-5 w-5" /> {recorded ? "Record again" : "Record"}
          </button>
        ) : (
          <button onClick={stop} className="btn bg-danger px-5 py-3 text-white">
            <Square className="h-5 w-5" /> Stop
          </button>
        )}
      </div>

      {error && <p className="text-center text-sm text-danger">{error}</p>}
      {recorded && <p className="text-center text-sm text-teal">Recorded ✓</p>}

      <button onClick={onDone} className="btn-ghost w-full py-3">
        See my result <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
