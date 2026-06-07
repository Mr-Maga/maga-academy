"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenText, Sparkles, Loader2, Check, X, Clock, RotateCcw, ArrowRight } from "lucide-react";
import { newReadingTest, saveReadingAttempt } from "./actions";
import type { ReadingTest } from "@/lib/types";

type Phase = "intro" | "loading" | "test" | "result";

function norm(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/^(a|an|the)\s+/, "")
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, " ");
}

function bandFromPct(p: number): number {
  const x = p * 100;
  if (x >= 90) return 8.5;
  if (x >= 83) return 8;
  if (x >= 75) return 7.5;
  if (x >= 67) return 7;
  if (x >= 58) return 6.5;
  if (x >= 50) return 6;
  if (x >= 42) return 5.5;
  if (x >= 33) return 5;
  if (x >= 25) return 4.5;
  return 4;
}

function bandColor(b: number) {
  if (b >= 7) return "var(--color-teal)";
  if (b >= 6) return "var(--color-amber)";
  return "var(--color-rose)";
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export function ReadingClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [test, setTest] = useState<ReadingTest | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "test") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase]);

  async function start() {
    setPhase("loading");
    setError(null);
    const res = await newReadingTest();
    if (res.test) {
      setTest(res.test);
      setAnswers({});
      setElapsed(0);
      setPhase("test");
    } else {
      setError(res.error ?? "Xatolik.");
      setPhase("intro");
    }
  }

  const correctCount = test
    ? test.questions.filter((q, i) => norm(answers[i] ?? "") === norm(q.answer)).length
    : 0;
  const total = test?.questions.length ?? 0;
  const band = total ? bandFromPct(correctCount / total) : 0;

  function submit() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("result");
    if (test) {
      void saveReadingAttempt({ title: test.title, score: correctCount, total, band });
    }
  }

  /* ----------------------------- intro ----------------------------- */
  if (phase === "intro") {
    return (
      <div className="space-y-4">
        <div className="card relative overflow-hidden p-6 text-center">
          <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-soft/10 blur-3xl" />
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft/15 text-primary-soft">
            <BookOpenText className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-xl font-extrabold">IELTS Reading test</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            AI yangi akademik matn + 12 ta savol yaratadi (True/False/Not Given, ko‘p tanlovli, bo‘sh joy).
            Yechasiz — darhol band va izohlar olasiz.
          </p>
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          <button onClick={start} className="btn-primary mx-auto mt-5 w-fit px-6 py-3">
            <Sparkles className="h-4 w-4" /> Yangi test yaratish
          </button>
        </div>
        <p className="text-center text-xs text-subtle">Tavsiya: bitta matnga ~20 daqiqa.</p>
      </div>
    );
  }

  /* ----------------------------- loading ----------------------------- */
  if (phase === "loading") {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-soft" />
        <p className="text-sm text-muted">Maga yangi test tayyorlamoqda…</p>
      </div>
    );
  }

  if (!test) return null;

  /* ----------------------------- result ----------------------------- */
  if (phase === "result") {
    return (
      <div className="space-y-4">
        <div className="card flex items-center gap-4 p-5">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 text-2xl font-extrabold"
            style={{ borderColor: bandColor(band), color: bandColor(band) }}
          >
            {band.toFixed(1)}
          </div>
          <div>
            <div className="text-sm text-muted">Estimated Reading band</div>
            <div className="text-lg font-bold">
              {correctCount} / {total} correct
            </div>
            <div className="text-xs text-subtle">Time: {fmtTime(elapsed)}</div>
          </div>
        </div>

        <div className="space-y-2">
          {test.questions.map((q, i) => {
            const your = answers[i] ?? "";
            const ok = norm(your) === norm(q.answer);
            return (
              <div key={i} className="card p-4">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${ok ? "bg-teal/20 text-teal" : "bg-rose/20 text-rose"}`}
                  >
                    {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {i + 1}. {q.prompt}
                    </p>
                    <div className="mt-1.5 space-y-0.5 text-xs">
                      <div className={ok ? "text-teal" : "text-rose"}>
                        Sizning javob: {your || "—"}
                      </div>
                      {!ok && <div className="text-teal">To‘g‘ri: {q.answer}</div>}
                      <div className="text-muted">{q.explanation}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={start} className="btn-primary w-full py-3">
          <RotateCcw className="h-4 w-4" /> Yangi test
        </button>
      </div>
    );
  }

  /* ----------------------------- test ----------------------------- */
  const answered = Object.values(answers).filter((v) => v && v.trim()).length;
  return (
    <div className="space-y-4">
      <div className="sticky top-[60px] z-10 flex items-center justify-between rounded-xl border border-border bg-surface/95 px-4 py-2 backdrop-blur">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted">
          <Clock className="h-4 w-4 text-primary-soft" /> {fmtTime(elapsed)}
        </span>
        <span className="text-xs text-subtle">
          {answered} / {total}
        </span>
      </div>

      <div className="card max-h-[42vh] overflow-y-auto p-4">
        <h2 className="mb-2 font-bold">{test.title}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{test.passage}</p>
      </div>

      <div className="space-y-3">
        {test.questions.map((q, i) => (
          <div key={i} className="card p-4">
            <p className="mb-2.5 text-sm font-medium">
              {i + 1}. {q.prompt}
            </p>
            {q.type === "gap" ? (
              <input
                value={answers[i] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                placeholder="Javob (1–2 so‘z)…"
                className="input"
              />
            ) : (
              <div className="grid gap-2">
                {q.options.map((opt) => {
                  const active = answers[i] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? "border-primary-soft bg-primary-soft/10 text-fg"
                          : "border-border hover:border-primary-soft/40"
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                          active ? "border-primary-soft bg-primary-soft text-bg" : "border-border"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={submit} className="btn-primary w-full py-3">
        Submit & get band <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
