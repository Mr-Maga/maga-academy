"use client";

import { useState, useTransition } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand";
import { cn } from "@/lib/utils";
import { chooseLearningPath } from "./actions";
import type { LearningPath } from "@/lib/types";

const OPTIONS: {
  key: LearningPath;
  emoji: string;
  title: string;
  sub: string;
  points: string[];
  accent: string;
  soon?: boolean;
}[] = [
  {
    key: "ielts",
    emoji: "🎓",
    title: "IELTS",
    sub: "Imtihonga tayyorgarlik — band 5.5 → 8.0",
    points: ["Writing & Speaking AI baho", "Mock test · Listening · Reading", "Band o‘sishini kuzatish"],
    accent: "primary",
  },
  {
    key: "general",
    emoji: "💬",
    title: "General English",
    sub: "Kundalik ingliz — noldan suhbatgacha",
    points: ["Grammar darslari (A1 → C1)", "Kundalik so‘zlashuv & tinglash", "Daraja testi"],
    accent: "indigo",
    soon: true,
  },
];

export function OnboardingChoice({ firstName }: { firstName: string }) {
  const [pick, setPick] = useState<LearningPath | null>(null);
  const [pending, start] = useTransition();

  function confirm() {
    if (!pick) return;
    start(() => chooseLearningPath(pick));
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-5 py-10">
      <div className="stagger space-y-7">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-16 w-16 text-3xl" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Salom, {firstName}! 👋</h1>
          <p className="mt-1.5 text-muted">Nima o‘rganmoqchisiz? Keyin o‘zgartirsangiz ham bo‘ladi.</p>
        </div>

        <div className="space-y-3.5">
          {OPTIONS.map((o) => {
            const active = pick === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setPick(o.key)}
                aria-pressed={active}
                className={cn(
                  "card relative w-full overflow-hidden p-5 text-left transition duration-200",
                  active
                    ? "border-primary-soft ring-2 ring-primary-soft/40 -translate-y-0.5"
                    : "hover:border-primary-soft/30 hover:-translate-y-0.5",
                )}
              >
                <span
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
                  style={{ backgroundColor: `var(--color-${o.accent})` }}
                />
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface text-3xl">
                    {o.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{o.title}</h2>
                      {o.soon && <span className="chip bg-amber/15 text-amber">Tez kunda</span>}
                    </div>
                    <p className="text-sm text-muted">{o.sub}</p>
                    <ul className="mt-3 space-y-1">
                      {o.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-fg/80">
                          <Check className="h-3.5 w-3.5 shrink-0 text-primary-soft" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition",
                      active ? "border-primary-soft bg-primary-soft text-bg" : "border-border",
                    )}
                  >
                    {active && <Check className="h-4 w-4" strokeWidth={3} />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={confirm} disabled={!pick || pending} className="btn-primary w-full py-3.5 text-base">
          {pending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Tayyorlanmoqda…
            </>
          ) : (
            <>
              Boshlash <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}
