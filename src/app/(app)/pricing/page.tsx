import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Crown,
  Zap,
  GraduationCap,
  Star,
  Brain,
  Mic,
  PenLine,
  TrendingUp,
  CalendarCheck,
  Globe,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Plans" };

type Tier = {
  name: string;
  icon: LucideIcon;
  tagline: string;
  basedOn: string;
  accent: string;
  features: string[];
  highlight?: string;
  cta: string;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    icon: Star,
    tagline: "Start now, no card needed",
    basedOn: "For anyone starting their English journey",
    accent: "teal",
    cta: "Current plan",
    features: [
      "IELTS + General English content",
      "Unlimited vocabulary flashcards (SRS)",
      "10 AI practice tasks per section / day",
      "3 AI band evaluations / day",
      "Daily plan with Maga",
      "AI Tutor — 15 questions / day",
    ],
  },
  {
    name: "Starter",
    icon: Zap,
    tagline: "Learn English every day",
    basedOn: "Based on: everyday & general learners",
    accent: "indigo",
    cta: "Coming soon",
    features: [
      "Everything in Free",
      "Unlimited AI practice (all sections)",
      "Unlimited AI Tutor",
      "Unlimited AI translator",
      "Full progress & test history",
    ],
  },
  {
    name: "Premium",
    icon: GraduationCap,
    tagline: "Serious IELTS preparation",
    basedOn: "Based on: candidates targeting a band",
    accent: "primary",
    highlight: "Most popular",
    cta: "Coming soon",
    features: [
      "Everything in Starter",
      "Unlimited Writing & Speaking band checks",
      "Listening Lab + Reading test bank",
      "Band progress charts",
      "Writing & Speaking Master chat",
    ],
  },
  {
    name: "VIP",
    icon: Crown,
    tagline: "Everything, at maximum",
    basedOn: "Based on: top achievers who want it all",
    accent: "amber",
    highlight: "Most powerful",
    cta: "Coming soon",
    features: [
      "Everything in Premium",
      "Full Mock Tests — timed, 4 sections, overall band",
      "1-on-1 examiner-style deep feedback",
      "Personal study roadmap from Maga",
      "Priority AI + early access to new features",
      "VIP badge on your profile",
    ],
  },
];

const PERKS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Brain, title: "AI that really grades", desc: "Band scores anchored to the official IELTS descriptors — honest, examiner-level feedback." },
  { icon: Mic, title: "Real speaking practice", desc: "Record your voice; get fluency, grammar and pronunciation feedback from real audio." },
  { icon: PenLine, title: "Instant writing checks", desc: "Task 1 & Task 2 scored in seconds, with a rewritten model answer at your target band." },
  { icon: CalendarCheck, title: "Your plan, your pace", desc: "Tell Maga what you'll study and it builds your daily checklist automatically." },
  { icon: TrendingUp, title: "Track every band", desc: "Streaks, history and weak-spot insights so you always know your next move." },
  { icon: Globe, title: "IELTS + General", desc: "Exam prep or everyday English — switch tracks anytime, all in one app." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Is it really free to start?", a: "Yes — no card required. Free includes both IELTS and General content, unlimited vocabulary flashcards, and generous daily AI limits." },
  { q: "How accurate is the AI scoring?", a: "Every evaluation is anchored to the official IELTS band descriptors and reasons step-by-step before scoring, so your band reflects real exam standards — not guesswork." },
  { q: "Can I practise Speaking with my own voice?", a: "Yes. You record real audio; Maga transcribes it and scores fluency, vocabulary, grammar and pronunciation." },
  { q: "Which languages does Maga understand?", a: "Uzbek, Russian and English. Ask in your language — it teaches English back to you clearly." },
  { q: "When do the paid plans launch?", a: "Soon. During launch everything is free, so build your streak now and lock in early." },
  { q: "Can I switch between IELTS and General?", a: "Anytime, from your profile. Your progress is kept for both tracks." },
];

export default async function PricingPage() {
  await requireActiveProfile();

  return (
    <div className="space-y-10">
      <div>
        <PageHeader title="Plans" subtitle="One AI coach. Choose how far you want to go." />

        <div className="card mb-5 flex items-center gap-3 border-teal/30 bg-teal/10 p-4">
          <Sparkles className="h-5 w-5 shrink-0 text-primary-soft" />
          <p className="text-sm">
            <span className="font-semibold text-primary-soft">Launch offer:</span> everything is free
            right now. Paid plans arrive soon — start your streak today.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const isPremium = t.name === "Premium";
            return (
              <div key={t.name} className={cn("card relative flex flex-col p-5", isPremium && "ring-2 ring-primary-soft/50")}>
                {t.highlight && (
                  <span
                    className="absolute -top-2.5 left-5 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-bg"
                    style={{ backgroundColor: `var(--color-${t.accent})` }}
                  >
                    {t.highlight}
                  </span>
                )}

                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in srgb, var(--color-${t.accent}) 18%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: `var(--color-${t.accent})` }} />
                  </span>
                  <div>
                    <div className="text-lg font-extrabold">{t.name}</div>
                    <div className="text-xs text-muted">{t.tagline}</div>
                  </div>
                </div>

                <p className="mb-4 text-xs font-medium text-subtle">{t.basedOn}</p>

                <ul className="mb-5 flex-1 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: `var(--color-${t.accent})` }} />
                      <span className={f.startsWith("Everything in") ? "font-semibold" : "text-fg/90"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled
                  className={cn(
                    "w-full rounded-xl py-2.5 text-sm font-semibold",
                    t.name === "Free" ? "border border-border bg-surface text-muted" : "cursor-not-allowed text-bg opacity-90",
                  )}
                  style={t.name === "Free" ? undefined : { backgroundColor: `var(--color-${t.accent})` }}
                >
                  {t.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-subtle">
          <ShieldCheck className="h-3.5 w-3.5" /> No credit card to start · cancel anytime · prices announced soon
        </p>
      </div>

      {/* Why Maga */}
      <section>
        <h2 className="text-center text-xl font-extrabold tracking-tight">Everything you need to raise your band</h2>
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-muted">
          Maga is one AI coach across writing, speaking, vocabulary and practice — built to be honest, fast and always available.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="card p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft/15 text-primary-soft">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-center text-xl font-extrabold tracking-tight">Frequently asked questions</h2>
        <div className="mx-auto mt-5 max-w-2xl space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="card group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                {f.q}
                <span className="text-primary-soft transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="card relative overflow-hidden p-8 text-center">
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-soft/15 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo/15 blur-3xl" />
        <h2 className="text-2xl font-extrabold tracking-tight">Ready to raise your band?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Start free today — record a speaking answer or get a writing band in the next 5 minutes.
        </p>
        <Link href="/dashboard" className="btn-primary mx-auto mt-5 w-fit px-6 py-3">
          Start free <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
