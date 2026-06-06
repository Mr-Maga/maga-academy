"use client";

import { useActionState, useEffect, useState } from "react";
import { Sparkles, BookOpen, Check, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExerciseType } from "@/lib/types";
import { makeExercise, type ExerciseState } from "./actions";

const TYPES: { key: ExerciseType; label: string; emoji: string }[] = [
  { key: "reading", label: "Reading", emoji: "📖" },
  { key: "grammar", label: "Grammar", emoji: "✏️" },
  { key: "vocabulary", label: "Vocabulary", emoji: "📚" },
];

export function ExercisesClient() {
  const [state, action, pending] = useActionState<ExerciseState, FormData>(makeExercise, undefined);
  const [type, setType] = useState<ExerciseType>("reading");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const exercise = state?.exercise;

  // Reset answers whenever a new exercise is generated.
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [exercise]);

  const total = exercise?.questions.length ?? 0;
  const correct = exercise
    ? exercise.questions.reduce((acc, q, i) => acc + (answers[i] === q.answer_index ? 1 : 0), 0)
    : 0;
  const allAnswered = total > 0 && Object.keys(answers).length === total;

  return (
    <div className="space-y-5">
      <form action={action} className="card space-y-3 p-4">
        <span className="label">Choose a skill — AI builds a fresh exercise at your level</span>
        <input type="hidden" name="type" value={type} />
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setType(t.key)}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-semibold transition",
                type === t.key ? "bg-primary text-primary-fg" : "bg-surface text-muted",
              )}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div>
          <span className="label">Level</span>
          <select name="level" defaultValue="auto" className="input">
            <option value="auto">Auto (mening darajam)</option>
            <option value="a1">A1</option>
            <option value="a2">A2</option>
            <option value="b1">B1</option>
            <option value="b2">B2</option>
            <option value="cefr">CEFR (B1–B2)</option>
            <option value="ielts">IELTS</option>
          </select>
        </div>
        <div>
          <span className="label">What do you want to practise? (optional)</span>
          <input
            name="topic"
            className="input"
            placeholder={
              type === "reading"
                ? "e.g. True / False / Not Given"
                : type === "grammar"
                  ? "e.g. passive voice, hard parts"
                  : "e.g. environment vocabulary"
            }
          />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full py-3">
          {pending ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {exercise ? "New exercise" : "Generate exercise"}
            </>
          )}
        </button>
        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      </form>

      {exercise && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">{exercise.title}</h2>

          {exercise.passage && (
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
                <BookOpen className="h-4 w-4" /> Passage
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{exercise.passage}</p>
            </div>
          )}

          {exercise.questions.map((q, qi) => (
            <div key={qi} className="card p-4">
              <p className="mb-3 font-medium">
                {qi + 1}. {q.prompt}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi;
                  const isCorrect = q.answer_index === oi;
                  let tone = "bg-surface text-fg/90";
                  if (submitted) {
                    if (isCorrect) tone = "bg-teal/15 text-teal ring-1 ring-teal/40";
                    else if (chosen) tone = "bg-danger/15 text-danger ring-1 ring-danger/40";
                    else tone = "bg-surface text-subtle";
                  } else if (chosen) {
                    tone = "bg-primary/15 text-fg ring-1 ring-primary-soft/50";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition", tone)}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[11px] font-bold">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isCorrect && <Check className="h-4 w-4 text-teal" />}
                      {submitted && chosen && !isCorrect && <X className="h-4 w-4 text-danger" />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-2 rounded-lg bg-elevated px-3 py-2 text-xs text-muted">💡 {q.explanation}</p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {allAnswered ? "Check answers" : `Answer all ${total} questions`}
            </button>
          ) : (
            <div className="card flex items-center justify-between p-4">
              <div>
                <div className="text-sm text-muted">Your score</div>
                <div className="text-2xl font-extrabold">
                  {correct}/{total}{" "}
                  <span className="text-base text-muted">({Math.round((correct / total) * 100)}%)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="btn-ghost px-3 py-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
