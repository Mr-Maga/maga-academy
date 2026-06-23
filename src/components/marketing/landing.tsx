"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles, Mic, PenLine, BookOpen, Headphones, GraduationCap,
  Brain, Zap, Flame, Target, Check, Star, ArrowRight, Globe,
} from "lucide-react";
import { Wordmark } from "@/components/ui/wordmark";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/ui/badge";
import { Starfield } from "./starfield";
import type { Cefr } from "@/lib/design/tokens";

type Lang = "uz" | "en";

/* ─────────────────────────── copy (uz / en) ─────────────────────────── */
const dict = {
  uz: {
    nav: { tracks: "Yo'nalishlar", pricing: "Narxlar", reviews: "Sharhlar", signin: "Kirish", start: "Boshlash" },
    hero: {
      badge: "Ingliz tili · IELTS & General",
      title1: "Ingliz tilini",
      title2: "qayta kashf eting",
      sub: "AI repetitor, jonli band baholash va kunlik mashqlar — telefoningizda. 60 soniyada boshlang, har kuni qaytishni xohlang.",
      cta1: "Bepul boshlash",
      cta2: "Tariflarni ko'rish",
      note: "Karta talab qilinmaydi · Google bilan bir bosishda",
    },
    stats: [
      { v: "12 000+", l: "o'quvchi" },
      { v: "1.4M+", l: "bajarilgan mashq" },
      { v: "4.9", l: "do'kon reytingi" },
      { v: "Band 7+", l: "o'rtacha natija" },
    ],
    tracksTitle1: "Eng ko'p tanlangan",
    tracksTitle2: "yo'nalishlar",
    tracksSub: "Har biri darajangizga moslashadi — A1 dan C2 gacha.",
    featTitle1: "Nega",
    featTitle2: "maga?",
    pricingTitle1: "Sodda,",
    pricingTitle2: "halol narxlar",
    pricingSub: "Istalgan vaqt bekor qiling. Bepul tarif chinakam foydali.",
    perMonth: "/oy",
    popular: "Eng mashhur",
    choose: "Tanlash",
    startFree: "Bepul boshlash",
    reviewsTitle1: "Minglab",
    reviewsTitle2: "muvaffaqiyat hikoyalari",
    ctaTitle: "Kelajagingiz bugundan boshlanadi",
    ctaSub: "Bepul ro'yxatdan o'ting va birinchi darsni hoziroq oching.",
    ctaBtn: "Hoziroq boshlash",
    footer: "Ingliz tili, mukammal o'zlashtirilgan.",
    sum: "so'm",
  },
  en: {
    nav: { tracks: "Tracks", pricing: "Pricing", reviews: "Reviews", signin: "Sign in", start: "Get started" },
    hero: {
      badge: "English · IELTS & General",
      title1: "Rediscover",
      title2: "learning English",
      sub: "An AI tutor, instant band scoring and daily practice — in your pocket. Start in 60 seconds and actually want to come back.",
      cta1: "Start free",
      cta2: "See pricing",
      note: "No card required · One tap with Google",
    },
    stats: [
      { v: "12,000+", l: "learners" },
      { v: "1.4M+", l: "exercises done" },
      { v: "4.9", l: "store rating" },
      { v: "Band 7+", l: "average result" },
    ],
    tracksTitle1: "Most popular",
    tracksTitle2: "tracks",
    tracksSub: "Each one adapts to your level — A1 through C2.",
    featTitle1: "Why",
    featTitle2: "maga?",
    pricingTitle1: "Simple,",
    pricingTitle2: "honest pricing",
    pricingSub: "Cancel anytime. The free tier is genuinely useful.",
    perMonth: "/mo",
    popular: "Most popular",
    choose: "Choose",
    startFree: "Start free",
    reviewsTitle1: "Thousands of",
    reviewsTitle2: "success stories",
    ctaTitle: "Your future starts today",
    ctaSub: "Sign up free and open your first lesson right now.",
    ctaBtn: "Start now",
    footer: "English, mastered.",
    sum: "UZS",
  },
} as const;

const tracks: { icon: typeof Mic; level: Cefr; uz: string; en: string; learners: string }[] = [
  { icon: GraduationCap, level: "B2", uz: "IELTS Academic", en: "IELTS Academic", learners: "4 200" },
  { icon: BookOpen, level: "B1", uz: "IELTS General", en: "IELTS General", learners: "2 800" },
  { icon: Mic, level: "B1", uz: "Speaking (AI suhbat)", en: "Speaking (AI partner)", learners: "5 100" },
  { icon: PenLine, level: "B2", uz: "Writing (band baho)", en: "Writing (band scoring)", learners: "3 600" },
  { icon: Headphones, level: "A2", uz: "Listening", en: "Listening", learners: "3 900" },
  { icon: Globe, level: "A1", uz: "Grammar & Vocabulary", en: "Grammar & Vocabulary", learners: "6 400" },
];

const features = {
  uz: [
    { icon: Brain, t: "24/7 AI repetitor", d: "Savol bering, tushuntirib beradi — o'zbek yoki rus tilida." },
    { icon: Zap, t: "Jonli band baholash", d: "Writing va Speaking uchun bir necha soniyada IELTS bandi." },
    { icon: Flame, t: "Kunlik streak & XP", d: "Odat shakllantiring — har kuni qaytishni xohlaysiz." },
    { icon: Target, t: "Mock testlar", d: "Haqiqiy imtihon formati, batafsil tahlil bilan." },
  ],
  en: [
    { icon: Brain, t: "24/7 AI tutor", d: "Ask anything, get it explained — in Uzbek or Russian." },
    { icon: Zap, t: "Instant band scoring", d: "An IELTS band for Writing and Speaking in seconds." },
    { icon: Flame, t: "Daily streak & XP", d: "Build the habit — you'll want to come back every day." },
    { icon: Target, t: "Mock tests", d: "Real exam format with detailed breakdowns." },
  ],
} as const;

const tiers = [
  {
    id: "free", price: 0, accent: false,
    name: { uz: "Bepul", en: "Free" },
    feats: {
      uz: ["Ikkala yo'nalish", "Har guruhdan eng yaxshi 3 ta", "Kuniga 3 AI baho", "Kuniga 15 tutor xabari"],
      en: ["Both tracks", "Best 3 per group", "3 AI checks / day", "15 tutor messages / day"],
    },
  },
  {
    id: "starter", price: 39000, accent: false,
    name: { uz: "Starter", en: "Starter" },
    feats: {
      uz: ["Cheksiz AI mashq + tutor", "Cheksiz tarjimon", "To'liq tarix va progress", "Barcha darajadagi kontent"],
      en: ["Unlimited AI practice + tutor", "Unlimited translator", "Full history & progress", "All-level content"],
    },
  },
  {
    id: "premium", price: 79000, accent: true,
    name: { uz: "Premium", en: "Premium" },
    feats: {
      uz: ["Cheksiz Writing & Speaking", "Barcha Reading/Listening", "Progress grafiklari", "Ustuvor AI"],
      en: ["Unlimited Writing & Speaking", "All Reading/Listening", "Progress charts", "Priority AI"],
    },
  },
  {
    id: "vip", price: 149000, accent: false,
    name: { uz: "VIP", en: "VIP" },
    feats: {
      uz: ["To'liq Mock testlar", "Examiner chuqur tahlili", "Eng yuqori ustuvorlik", "Barcha kontent"],
      en: ["Full Mock tests", "Examiner deep feedback", "Top priority", "Everything unlocked"],
    },
  },
] as const;

const reviews = {
  uz: [
    { n: "Dilnoza R.", r: "IELTS 5.5 → 7.0", q: "Speaking'dan qo'rqardim. AI bilan har kuni gaplashib, 2 oyda 7.0 oldim." },
    { n: "Jasur K.", r: "Writing Band 6 → 7.5", q: "Har bir esseni baholab, bir band yuqori namuna ko'rsatadi. Shu narsa hammasini o'zgartirdi." },
    { n: "Malika T.", r: "A2 → B2", q: "Kunlik streak meni ushlab turdi. Birinchi marta ingliz tilini tashlab ketmadim." },
  ],
  en: [
    { n: "Dilnoza R.", r: "IELTS 5.5 → 7.0", q: "I was scared of Speaking. Talking to the AI daily, I hit 7.0 in 2 months." },
    { n: "Jasur K.", r: "Writing Band 6 → 7.5", q: "It scores every essay and shows a one-band-higher sample. That changed everything." },
    { n: "Malika T.", r: "A2 → B2", q: "The daily streak kept me going. First time I didn't quit English." },
  ],
} as const;

/* ─────────────────────────── helpers ─────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .6s var(--ease-out-quint) ${delay}s, transform .6s var(--ease-out-quint) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU").replace(/,/g, " ");
}

/* ─────────────────────────── page ─────────────────────────── */
export function Landing() {
  const [lang, setLang] = useState<Lang>("uz");
  const t = dict[lang];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Starfield />

      <div className="relative z-10">
        {/* ───── Top bar ───── */}
        <header
          className="sticky top-0 z-40 w-full"
          style={{
            background: "linear-gradient(180deg, rgba(10,10,13,0.82), rgba(10,10,13,0.45))",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--color-border)",
            paddingTop: "max(env(safe-area-inset-top), 0px)",
          }}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Wordmark size="md" />
            <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
              <a href="#tracks" className="transition-colors hover:text-fg">{t.nav.tracks}</a>
              <a href="#pricing" className="transition-colors hover:text-fg">{t.nav.pricing}</a>
              <a href="#reviews" className="transition-colors hover:text-fg">{t.nav.reviews}</a>
            </nav>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setLang((l) => (l === "uz" ? "en" : "uz"))}
                className="focus-ring flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-fg"
                style={{ border: "1px solid var(--color-border)" }}
                aria-label="Toggle language"
              >
                <Globe size={13} />
                {lang === "uz" ? "UZ" : "EN"}
              </button>
              <Link href="/login" className="btn-subtle hidden h-9 px-3 text-sm sm:inline-flex">{t.nav.signin}</Link>
              <Link href="/login" className="btn-primary h-9 px-4 text-sm">{t.nav.start}</Link>
            </div>
          </div>
        </header>

        {/* ───── Hero ───── */}
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 text-center sm:pt-24">
          <div className="stagger mx-auto max-w-2xl">
            <span
              className="chip mx-auto mb-6 inline-flex"
              style={{ color: "var(--color-primary-soft)", background: "var(--color-primary-dim)", border: "1px solid rgba(123,97,255,0.3)" }}
            >
              <Sparkles size={13} /> {t.hero.badge}
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-6xl">
              {t.hero.title1}{" "}
              <span className="text-gradient">{t.hero.title2}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-lg">
              {t.hero.sub}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/login" className="btn-primary h-12 w-full px-6 text-base sm:w-auto">
                {t.hero.cta1} <ArrowRight size={18} />
              </Link>
              <a href="#pricing" className="btn-ghost h-12 w-full px-6 text-base sm:w-auto">{t.hero.cta2}</a>
            </div>
            <p className="mt-4 text-xs text-subtle">{t.hero.note}</p>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.l} className="glass px-4 py-5">
                <div className="font-display tnum text-2xl font-bold text-fg sm:text-3xl">{s.v}</div>
                <div className="mt-1 text-xs text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ───── Tracks ───── */}
        <section id="tracks" className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                {t.tracksTitle1} <span className="text-gradient">{t.tracksTitle2}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.tracksSub}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((tr, i) => {
              const Icon = tr.icon;
              return (
                <Reveal key={tr.en} delay={(i % 3) * 0.06}>
                  <div className="glass card-i group flex h-full items-center gap-4 p-5">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-soft"
                      style={{ background: "var(--color-primary-dim)", border: "1px solid rgba(123,97,255,0.25)" }}
                    >
                      <Icon size={22} strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display truncate font-semibold text-fg">{lang === "uz" ? tr.uz : tr.en}</h3>
                        <LevelBadge level={tr.level} />
                      </div>
                      <p className="mt-0.5 text-xs text-subtle">
                        {fmt(Number(tr.learners.replace(/\s/g, "")))} {lang === "uz" ? "o'quvchi" : "learners"}
                      </p>
                    </div>
                    <ArrowRight size={18} className="text-subtle transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ───── Features ───── */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                {t.featTitle1} <span className="text-gradient">{t.featTitle2}</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features[lang].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.t} delay={(i % 2) * 0.06}>
                  <div className="glass h-full p-6">
                    <span
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: "var(--gradient-brand, linear-gradient(135deg,#7B61FF,#C084FC))", color: "#fff", boxShadow: "var(--shadow-glow)" }}
                    >
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-fg">{f.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ───── Pricing ───── */}
        <section id="pricing" className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                {t.pricingTitle1} <span className="text-gradient">{t.pricingTitle2}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.pricingSub}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={(i % 4) * 0.05}>
                <div
                  className="glass relative flex h-full flex-col p-6"
                  style={tier.accent ? { border: "1.5px solid var(--color-primary)", boxShadow: "0 0 0 1px rgba(123,97,255,0.3), 0 20px 60px -20px rgba(123,97,255,0.45)" } : undefined}
                >
                  {tier.accent && (
                    <span
                      className="chip absolute -top-3 left-1/2 -translate-x-1/2"
                      style={{ color: "#0A0A0D", background: "var(--color-amber)" }}
                    >
                      {t.popular}
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold text-fg">{tier.name[lang]}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display tnum text-3xl font-bold text-fg">{tier.price === 0 ? "0" : fmt(tier.price)}</span>
                    <span className="text-xs text-subtle">{t.sum}{t.perMonth}</span>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.feats[lang].map((ft) => (
                      <li key={ft} className="flex items-start gap-2 text-sm text-muted">
                        <Check size={16} className="mt-0.5 shrink-0" style={{ color: tier.accent ? "var(--color-primary-soft)" : "var(--color-success)" }} />
                        {ft}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className={tier.accent ? "btn-primary mt-6 h-11" : "btn-ghost mt-6 h-11"}
                  >
                    {tier.price === 0 ? t.startFree : t.choose}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───── Reviews ───── */}
        <section id="reviews" className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                {t.reviewsTitle1} <span className="text-gradient">{t.reviewsTitle2}</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {reviews[lang].map((rv, i) => (
              <Reveal key={rv.n} delay={(i % 3) * 0.06}>
                <div className="glass flex h-full flex-col p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={15} fill="var(--color-amber)" stroke="none" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg">“{rv.q}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold text-fg"
                      style={{ background: "linear-gradient(135deg, rgba(123,97,255,0.4), rgba(192,132,252,0.25))", border: "1px solid var(--color-border)" }}
                    >
                      {rv.n[0]}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-fg">{rv.n}</div>
                      <div className="text-xs text-primary-soft">{rv.r}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───── Final CTA ───── */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <div
              className="glass relative overflow-hidden px-6 py-14 text-center"
              style={{ borderColor: "rgba(123,97,255,0.4)" }}
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundImage: "radial-gradient(30rem 18rem at 50% -20%, rgba(123,97,255,0.35), transparent 60%)" }}
              />
              <div className="relative">
                <h2 className="font-display mx-auto max-w-xl text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                  {t.ctaTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.ctaSub}</p>
                <Link href="/login" className="btn-primary mx-auto mt-7 h-12 px-8 text-base">
                  {t.ctaBtn} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───── Footer ───── */}
        <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
            <div className="flex items-center gap-3">
              <Wordmark size="sm" />
              <span className="text-xs text-subtle">{t.footer}</span>
            </div>
            <div className="text-xs text-subtle">© {new Date().getFullYear()} maga</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
