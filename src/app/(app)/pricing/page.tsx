import type { Metadata } from "next";
import { Check, Sparkles, Crown, Zap, GraduationCap, Star } from "lucide-react";
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
  accent: string; // css color var name
  features: string[];
  highlight?: string; // ribbon label
  cta: string;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    icon: Star,
    tagline: "Get started, no card needed",
    basedOn: "For anyone who wants to try Maga",
    accent: "teal",
    cta: "Current plan",
    features: [
      "10 AI practice questions / day",
      "3 AI band evaluations / day",
      "Daily plan with Maga",
      "10 vocabulary cards / day",
      "AI Tutor — 10 questions / day",
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
      "Unlimited AI practice",
      "Unlimited AI Tutor",
      "Unlimited vocabulary (SRS) + AI translator",
      "Full progress statistics",
    ],
  },
  {
    name: "Premium",
    icon: GraduationCap,
    tagline: "Serious IELTS preparation",
    basedOn: "Based on: exam candidates targeting a band",
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

export default async function PricingPage() {
  await requireActiveProfile();

  return (
    <div>
      <PageHeader title="Plans" subtitle="Choose how far you want to go." />

      <div className="card mb-5 flex items-center gap-3 border-teal/30 bg-teal/10 p-4">
        <Sparkles className="h-5 w-5 shrink-0 text-primary-soft" />
        <p className="text-sm">
          <span className="font-semibold text-primary-soft">Launch offer:</span> everything is free
          right now. Paid plans arrive soon — keep practising!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((t) => {
          const Icon = t.icon;
          const isPremium = t.name === "Premium";
          return (
            <div
              key={t.name}
              className={cn(
                "card relative flex flex-col p-5",
                isPremium && "ring-2 ring-primary-soft/50",
              )}
            >
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
                  t.name === "Free"
                    ? "border border-border bg-surface text-muted"
                    : "cursor-not-allowed text-bg opacity-90",
                )}
                style={
                  t.name === "Free"
                    ? undefined
                    : { backgroundColor: `var(--color-${t.accent})` }
                }
              >
                {t.cta}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-subtle">
        Prices will be announced soon. Questions? Contact us on Telegram.
      </p>
    </div>
  );
}
