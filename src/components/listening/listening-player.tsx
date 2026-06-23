"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  X,
  Headphones,
  Eye,
  Gauge,
} from "lucide-react";
import { LEVEL_META } from "@/lib/reading-content";
import type { ListenExercise } from "@/lib/listening-content";
import { cn } from "@/lib/utils";

type Phase = "idle" | "playing" | "paused" | "done";

// Strip "Speaker:" labels so the voice sounds natural when reading dialogues.
function speakable(transcript: string): string {
  return transcript
    .split("\n")
    .map((line) => line.replace(/^\s*[A-Za-z][\w .'-]{0,24}:\s*/, ""))
    .join("\n");
}

export function ListeningPlayer({ exercise }: { exercise: ListenExercise }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rate, setRate] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function pickVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => /en[-_]GB/i.test(v.lang)) ??
      voices.find((v) => /en[-_]US/i.test(v.lang)) ??
      voices.find((v) => /^en/i.test(v.lang)) ??
      null
    );
  }

  function play() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (phase === "paused") {
      synth.resume();
      setPhase("playing");
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(speakable(exercise.transcript));
    u.lang = "en-GB";
    u.rate = rate;
    const v = pickVoice();
    if (v) u.voice = v;
    u.onend = () => setPhase("done");
    u.onerror = () => setPhase("done");
    utterRef.current = u;
    synth.speak(u);
    setPhase("playing");
  }

  function pause() {
    if (!supported) return;
    window.speechSynthesis.pause();
    setPhase("paused");
  }

  function replay() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setPhase("idle");
    setTimeout(play, 60);
  }

  const total = exercise.questions.length;
  const correct = exercise.questions.filter((q, i) => answers[i] === q.answer).length;
  const color = LEVEL_META[exercise.level].color;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href="/listening"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> All listening
      </Link>

      <div className="flex items-center gap-2">
        <span
          className="chip font-semibold"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
        >
          {exercise.level} · {LEVEL_META[exercise.level].label}
        </span>
        {exercise.topic && <span className="chip bg-surface text-subtle">{exercise.topic}</span>}
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight">{exercise.title}</h1>

      {/* Player */}
      <div className="card relative overflow-hidden p-6 text-center">
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-soft/10 blur-3xl" />
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft/15 text-primary-soft">
          <Headphones className="h-7 w-7" />
        </span>

        {!supported ? (
          <p className="mx-auto mt-4 max-w-sm text-sm text-danger">
            Brauzeringiz ovozni qo‘llab-quvvatlamaydi. Chrome yoki Safari’da oching.
          </p>
        ) : (
          <>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
              Tinglang, keyin savollarga javob bering. Matnni avval ko‘rmang — bu haqiqiy listening.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              {phase === "playing" ? (
                <button onClick={pause} className="btn-primary px-6 py-3">
                  <Pause className="h-5 w-5" /> Pause
                </button>
              ) : (
                <button onClick={play} className="btn-primary px-6 py-3">
                  <Play className="h-5 w-5" /> {phase === "paused" ? "Resume" : "Play"}
                </button>
              )}
              <button
                onClick={replay}
                className="grid h-12 w-12 place-items-center rounded-xl border border-border text-muted transition hover:text-fg"
                aria-label="Replay"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            {/* Speed */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-subtle">
              <Gauge className="h-3.5 w-3.5" />
              {[0.75, 1, 1.25].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 transition",
                    rate === r
                      ? "border-primary-soft/50 bg-primary-soft/15 text-fg"
                      : "border-border hover:text-fg",
                  )}
                >
                  {r}×
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {exercise.questions.map((q, i) => (
          <div key={i} className="card p-4">
            <p className="mb-2.5 text-sm font-medium">
              {i + 1}. {q.prompt}
            </p>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[i] === oi;
                const isCorrect = q.answer === oi;
                let tone = "border-border hover:border-primary-soft/40";
                if (submitted) {
                  if (isCorrect) tone = "border-teal bg-teal/10";
                  else if (chosen) tone = "border-rose bg-rose/10";
                } else if (chosen) {
                  tone = "border-primary-soft bg-primary-soft/10";
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                      tone,
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                        chosen && !submitted && "border-primary-soft bg-primary-soft text-bg",
                        submitted && isCorrect && "border-teal bg-teal text-bg",
                        submitted && chosen && !isCorrect && "border-rose bg-rose text-bg",
                      )}
                    >
                      {submitted && isCorrect && <Check className="h-3 w-3" strokeWidth={3} />}
                      {submitted && chosen && !isCorrect && <X className="h-3 w-3" strokeWidth={3} />}
                      {!submitted && chosen && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < total}
          className="btn-primary w-full justify-center py-3 disabled:opacity-50"
        >
          Submit answers
        </button>
      ) : (
        <div className="space-y-3">
          <div className="card flex items-center gap-4 p-5">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 text-xl font-extrabold"
              style={{
                borderColor: correct === total ? "var(--color-teal)" : "var(--color-amber)",
                color: correct === total ? "var(--color-teal)" : "var(--color-amber)",
              }}
            >
              {correct}/{total}
            </div>
            <div>
              <div className="font-bold">
                {correct === total ? "Perfect! 🎉" : correct >= total / 2 ? "Good job!" : "Keep practising"}
              </div>
              <div className="text-sm text-muted">
                You got {correct} of {total} correct.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTranscript((s) => !s)}
            className="card-i flex w-full items-center gap-2 p-4 text-sm font-medium"
          >
            <Eye className="h-4 w-4 text-primary-soft" />
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>

          {showTranscript && (
            <div className="card p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">
                {exercise.transcript}
              </p>
            </div>
          )}

          <Link href="/listening" className="btn-primary w-full justify-center py-3">
            <ArrowLeft className="h-4 w-4" /> More listening
          </Link>
        </div>
      )}
    </div>
  );
}
