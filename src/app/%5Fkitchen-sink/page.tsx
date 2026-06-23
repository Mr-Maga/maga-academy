"use client";

import { useState } from "react";
import { Sparkles, Rocket, Trash2, ArrowRight, Inbox, Plus, Languages, Headphones } from "lucide-react";
import {
  Button, Card, Glass, CardTitle, CardDescription,
  Badge, LevelBadge, NewBadge,
  Input, Textarea, Select, Field,
  Sheet, Modal, Tabs, ToastProvider, useToast,
  Skeleton, SkeletonCard, EmptyState,
  ProgressRing, XPBar, StreakFlame, Avatar, Stat, Lock,
  Header, BottomNav, Wordmark, CountUp, CompletionMoment,
} from "@/components/ui";
import type { Cefr } from "@/lib/design/tokens";

const LEVELS: Cefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function Section({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-3">
        {kicker && <div className="text-[11px] font-semibold uppercase tracking-widest text-primary-soft">{kicker}</div>}
        <h2 className="font-display text-xl font-bold tracking-tight text-fg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Demos() {
  const { toast } = useToast();
  const [sheet, setSheet] = useState(false);
  const [modal, setModal] = useState(false);
  const [nav, setNav] = useState("home");
  const [celebrate, setCelebrate] = useState(false);
  const [xp, setXp] = useState(620);
  const [band, setBand] = useState(72);

  return (
    <>
      <Header streakDays={12} user={{ name: "Maga Owner" }} />

      <main className="mx-auto max-w-[520px] px-4 pb-28 pt-6">
        {/* HERO */}
        <div className="stagger">
          <Wordmark size="lg" />
          <h1 className="font-display mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-fg">
            English, <span className="text-gradient">mastered</span>.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            The obsidian design system — glass depth, one Iris accent, earned motion. Every primitive,
            every state, on a real phone viewport.
          </p>
          <div className="mt-5 flex gap-3">
            <Button onClick={() => toast({ tone: "success", title: "Looks expensive.", description: "That's the bar." })}>
              <Sparkles size={16} /> Try a toast
            </Button>
            <Button variant="ghost" onClick={() => setModal(true)}>
              Open modal
            </Button>
          </div>
        </div>

        {/* BUTTONS */}
        <Section kicker="Actions" title="Buttons">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="danger"><Trash2 size={16} /> Delete</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add"><Plus size={18} /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button loading>Saving…</Button>
              <Button disabled>Disabled</Button>
              <Button block><Rocket size={16} /> Full-width CTA</Button>
            </div>
          </div>
        </Section>

        {/* SURFACES */}
        <Section kicker="Surfaces" title="Cards & glass">
          <div className="grid grid-cols-1 gap-3">
            <Glass interactive>
              <CardTitle>Glass — the signature surface</CardTitle>
              <CardDescription className="mt-1">
                Hairline border, inner top-light, soft ambient shadow, blur. Hover to feel it lift.
              </CardDescription>
            </Glass>
            <Card interactive>
              <CardTitle>Opaque card</CardTitle>
              <CardDescription className="mt-1">Layered fill for dense content areas.</CardDescription>
            </Card>
          </div>
        </Section>

        {/* BADGES */}
        <Section kicker="Status" title="Badges & levels">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>Neutral</Badge>
              <Badge tone="primary">Premium</Badge>
              <Badge tone="amber">Streak</Badge>
              <Badge tone="success">Passed</Badge>
              <Badge tone="danger">Overdue</Badge>
              <NewBadge />
            </div>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => <LevelBadge key={l} level={l} />)}
            </div>
          </div>
        </Section>

        {/* INPUTS */}
        <Section kicker="Forms" title="Inputs">
          <div className="space-y-4">
            <Field label="Full name" hint="As it appears on your certificate">
              <Input placeholder="Maga Builder" />
            </Field>
            <Field label="Target band" error="Pick a band between 4.0 and 9.0">
              <Input placeholder="7.0" defaultValue="11" />
            </Field>
            <Field label="Track">
              <Select defaultValue="ielts">
                <option value="ielts">IELTS</option>
                <option value="general">General English</option>
              </Select>
            </Field>
            <Field label="Why are you learning?">
              <Textarea placeholder="Study abroad, work, travel…" />
            </Field>
          </div>
        </Section>

        {/* MICRO-INTERACTIONS */}
        <Section kicker="The addictive layer" title="Micro-interactions">
          <Glass>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-2">
                <ProgressRing value={band} size={92}>
                  <span className="font-display tnum text-2xl font-bold text-fg">
                    <CountUp value={band / 10} decimals={1} />
                  </span>
                </ProgressRing>
                <span className="text-xs text-subtle">Band score</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <StreakFlame days={12} size="lg" />
                <StreakFlame days={0} size="lg" />
                <span className="text-xs text-subtle">lit / unlit</span>
              </div>
            </div>
            <div className="mt-5">
              <XPBar value={xp} max={1000} label="Daily XP" showValue />
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setXp((v) => Math.min(1000, v + 130)); setBand((v) => Math.min(90, v + 4)); }}>
                +130 XP
              </Button>
              <Button size="sm" onClick={() => { setCelebrate(false); requestAnimationFrame(() => setCelebrate(true)); }}>
                Celebrate
              </Button>
            </div>
            <CompletionMoment show={celebrate} title="Lesson complete!" subtitle="+130 XP · streak secured" />
          </Glass>
        </Section>

        {/* STATS */}
        <Section kicker="Numbers" title="Stats">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Streak" value={<CountUp value={12} />} accent="amber" hint="days" />
            <Stat label="Words" value={<CountUp value={840} />} accent="primary" hint="learned" />
            <Stat label="Band" value={<CountUp value={7.0} decimals={1} />} accent="success" hint="avg" />
          </div>
        </Section>

        {/* GATING */}
        <Section kicker="Freemium" title="Locked content">
          <div className="relative">
            <Card>
              <div className="flex items-center gap-3">
                <Avatar name="IELTS Reading" size={44} />
                <div>
                  <CardTitle>Academic Reading — Test 7</CardTitle>
                  <CardDescription>13 questions · ~20 min</CardDescription>
                </div>
              </div>
            </Card>
            <Lock label="Premium" onUpgrade={<Button size="sm">Upgrade</Button>} />
          </div>
        </Section>

        {/* TABS */}
        <Section kicker="Navigation" title="Tabs">
          <Tabs
            items={[
              { id: "r", label: "Reading", content: <Card><CardDescription>Reading content panel.</CardDescription></Card> },
              { id: "l", label: "Listening", content: <Card><CardDescription>Listening content panel.</CardDescription></Card> },
              { id: "w", label: "Writing", content: <Card><CardDescription>Writing content panel.</CardDescription></Card> },
            ]}
          />
        </Section>

        {/* OVERLAYS */}
        <Section kicker="Overlays" title="Sheet · Modal · Toast">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setSheet(true)}>Bottom sheet</Button>
            <Button variant="ghost" onClick={() => setModal(true)}>Modal</Button>
            <Button variant="ghost" onClick={() => toast({ tone: "info", title: "Heads up", description: "AI is busy — try again soon." })}>
              Info toast
            </Button>
            <Button variant="ghost" onClick={() => toast({ tone: "danger", title: "Daily limit reached", description: "Upgrade for unlimited checks." })}>
              Error toast
            </Button>
          </div>
        </Section>

        {/* ASYNC + EMPTY */}
        <Section kicker="States" title="Loading & empty">
          <div className="space-y-3">
            <SkeletonCard />
            <div className="flex gap-3">
              <Skeleton className="h-20 flex-1" />
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <Card>
              <EmptyState
                icon={<Inbox size={24} strokeWidth={1.5} />}
                title="No homework yet"
                description="When your teacher assigns work, it'll show up right here."
                action={<Button size="sm"><Plus size={16} /> Browse practice</Button>}
              />
            </Card>
          </div>
        </Section>

        {/* TOOLS PREVIEW row */}
        <Section kicker="Feel" title="Skill grid">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Languages, label: "Translator", tint: "var(--color-level-a2)" },
              { icon: Headphones, label: "Listening", tint: "var(--color-level-b1)" },
              { icon: Sparkles, label: "AI Tutor", tint: "var(--color-primary-soft)" },
              { icon: Rocket, label: "Mock test", tint: "var(--color-amber)" },
            ].map((s) => (
              <Glass key={s.label} interactive className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "color-mix(in srgb, " + s.tint + " 16%, transparent)", color: s.tint }}
                >
                  <s.icon size={20} strokeWidth={1.7} />
                </span>
                <span className="font-display font-semibold text-fg">{s.label}</span>
                <ArrowRight size={16} className="ml-auto text-subtle" />
              </Glass>
            ))}
          </div>
        </Section>

        <p className="mt-12 text-center text-xs text-subtle">
          maga design system v3 · Obsidian · §12 gate
        </p>
      </main>

      <BottomNav active={nav} onSelect={setNav} />

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Choose a track">
        <div className="space-y-3">
          <Button block onClick={() => setSheet(false)}>IELTS</Button>
          <Button block variant="ghost" onClick={() => setSheet(false)}>General English</Button>
        </div>
      </Sheet>

      <Modal open={modal} onClose={() => setModal(false)} title="Upgrade to Premium">
        <p className="text-sm leading-relaxed text-muted">
          Unlock unlimited Writing &amp; Speaking checks, every Reading test, and progress charts.
        </p>
        <div className="mt-4 flex gap-2">
          <Button block onClick={() => setModal(false)}>Upgrade — 79 000 so&apos;m</Button>
        </div>
      </Modal>
    </>
  );
}

export default function KitchenSink() {
  return (
    <ToastProvider>
      <Demos />
    </ToastProvider>
  );
}
