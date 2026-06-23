"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles, Globe, ArrowRight, Play, Check, Star, Trophy, Flame,
  Bot, Mic, GraduationCap, Radio, Smartphone, MessagesSquare,
} from "lucide-react";
import { AnimatedBg } from "./animated-bg";
import { Marquee } from "./marquee";

type Lang = "uz" | "en";

/* ───────────────────────────── copy ───────────────────────────── */
const dict = {
  uz: {
    nav: { features: "Imkoniyatlar", levels: "Darajalar", pricing: "Narxlar", reviews: "Fikrlar", start: "Bepul boshlash" },
    hero: {
      badge: "O'ZBEKISTONDAGI #1 INGLIZ TILI PLATFORMASI",
      t1: "Ingliz tilini", t2: "ishonch", t3: "bilan gapiring",
      sub: "Jonli darslar, 24/7 AI suhbatdosh va IELTS tayyorgarligi — talaffuzdan ravon nutqqacha. Bugun boshlang, natijani 30 kunda his qiling.",
      cta1: "Bepul ro'yxatdan o'tish", cta2: "Demo darsni ko'rish",
      social: "o'quvchi allaqachon ingliz tilini o'rganmoqda",
    },
    card: { title: "Mening rivojim", live: "Jonli", s: "Speaking", l: "Listening", g: "Grammar",
      st1: "Faol kurs", st2: "So'z o'rgandi", st3: "Sertifikat", ach: "Yangi yutuq!", streak: "12 kunlik streak" },
    featBadge: "IMKONIYATLAR", feat1: "Ingliz tilini", feat2: "aqlli", feat3: "o'rganing",
    featSub: "Zamonaviy texnologiya va tajribali o'qituvchilar bilan tilni eng samarali yo'lda egallang.",
    priceBadge: "NARXLAR", price1: "Sodda,", price2: "halol narxlar",
    priceSub: "Istalgan vaqt bekor qiling. Bepul tarif chinakam foydali.", perMonth: "/oy", popular: "Eng mashhur", choose: "Tanlash", startFree: "Bepul boshlash", sum: "so'm",
    revBadge: "FIKRLAR", rev1: "Minglab", rev2: "muvaffaqiyat hikoyalari",
    ctaTitle: "Kelajagingiz bugundan boshlanadi", ctaSub: "Bepul ro'yxatdan o'ting va birinchi darsni hoziroq oching.",
    ctaBtn: "Bepul boshlash", ctaBtn2: "Tariflarni solishtirish",
    footAbout: "O'zbekistonning eng zamonaviy ingliz tili platformasi. Til — bu imkoniyat, biz uni hamma uchun ochiq qilamiz.",
    fCol1: "Platforma", fCol2: "Kompaniya", fCol3: "Yordam",
    fCol1i: ["Darajalar", "Imkoniyatlar", "Narxlar", "Mobil ilova"],
    fCol2i: ["Biz haqimizda", "Ustozlar", "Karyera", "Blog"],
    fCol3i: ["Savol-javob", "Aloqa", "Maxfiylik siyosati", "Shartlar"],
    rights: "Barcha huquqlar himoyalangan.", place: "Toshkent, O'zbekiston",
  },
  en: {
    nav: { features: "Features", levels: "Levels", pricing: "Pricing", reviews: "Reviews", start: "Start free" },
    hero: {
      badge: "UZBEKISTAN'S #1 ENGLISH PLATFORM",
      t1: "Speak English", t2: "with", t3: "confidence",
      sub: "Live classes, a 24/7 AI partner and IELTS prep — from pronunciation to fluent speech. Start today, feel the result in 30 days.",
      cta1: "Sign up free", cta2: "Watch a demo lesson",
      social: "learners are already studying English",
    },
    card: { title: "My progress", live: "Live", s: "Speaking", l: "Listening", g: "Grammar",
      st1: "Active courses", st2: "Words learned", st3: "Certificates", ach: "New achievement!", streak: "12-day streak" },
    featBadge: "FEATURES", feat1: "Learn English", feat2: "smarter", feat3: "",
    featSub: "Master the language the most effective way — modern technology and experienced teachers.",
    priceBadge: "PRICING", price1: "Simple,", price2: "honest pricing",
    priceSub: "Cancel anytime. The free tier is genuinely useful.", perMonth: "/mo", popular: "Most popular", choose: "Choose", startFree: "Start free", sum: "UZS",
    revBadge: "REVIEWS", rev1: "Thousands of", rev2: "success stories",
    ctaTitle: "Your future starts today", ctaSub: "Sign up free and open your first lesson right now.",
    ctaBtn: "Start free", ctaBtn2: "Compare plans",
    footAbout: "Uzbekistan's most modern English platform. Language is opportunity — we make it open to everyone.",
    fCol1: "Platform", fCol2: "Company", fCol3: "Help",
    fCol1i: ["Levels", "Features", "Pricing", "Mobile app"],
    fCol2i: ["About us", "Teachers", "Careers", "Blog"],
    fCol3i: ["FAQ", "Contact", "Privacy policy", "Terms"],
    rights: "All rights reserved.", place: "Tashkent, Uzbekistan",
  },
} as const;

const MARQUEE = ["Listening", "Grammar", "Vocabulary", "IELTS 7.0+", "Business English", "Pronunciation", "Speaking Club", "Writing", "Reading"];

const features = {
  uz: [
    { icon: Bot, t: "AI suhbatdosh", d: "24/7 ingliz tilida erkin suhbatlashing. AI talaffuzingizni real vaqtda tahlil qilib, xatolarni tuzatadi.", c: "#7C5CFF" },
    { icon: Mic, t: "Talaffuz tahlili", d: "Har bir so'zni mikrofon orqali ayting — AI tovushlarni baholab, ona tili darajasiga olib boradi.", c: "#22D3EE" },
    { icon: GraduationCap, t: "IELTS & TOEFL", d: "Xalqaro imtihonlarga to'liq tayyorgarlik: real test simulyatsiyasi va shaxsiy baho.", c: "#818CF8" },
    { icon: Radio, t: "Jonli darslar", d: "Tajribali ustozlar bilan real vaqtda gaplashing, savollaringizga darhol javob oling.", c: "#E879F9" },
    { icon: Smartphone, t: "Mobil ilova", d: "Istalgan joyda, hatto internetsiz — darslarni yuklab oling va yo'lda o'rganing.", c: "#2DD4BF" },
    { icon: MessagesSquare, t: "Speaking Club", d: "Har kuni jonli suhbat klublari. Minglab o'quvchilar bilan amaliyot qiling va do'st orttiring.", c: "#FBBF24" },
  ],
  en: [
    { icon: Bot, t: "AI partner", d: "Chat freely in English 24/7. The AI analyzes your speech in real time and fixes mistakes.", c: "#7C5CFF" },
    { icon: Mic, t: "Pronunciation", d: "Say each word into the mic — the AI scores your sounds and pushes you toward native level.", c: "#22D3EE" },
    { icon: GraduationCap, t: "IELTS & TOEFL", d: "Full exam prep: realistic test simulation and personal scoring.", c: "#818CF8" },
    { icon: Radio, t: "Live classes", d: "Talk in real time with experienced teachers and get instant answers.", c: "#E879F9" },
    { icon: Smartphone, t: "Mobile app", d: "Anywhere, even offline — download lessons and learn on the go.", c: "#2DD4BF" },
    { icon: MessagesSquare, t: "Speaking Club", d: "Daily live conversation clubs. Practice with thousands of learners and make friends.", c: "#FBBF24" },
  ],
} as const;

const tiers = [
  { id: "free", price: 0, accent: false, name: { uz: "Bepul", en: "Free" },
    feats: { uz: ["Ikkala yo'nalish", "Har guruhdan eng yaxshi 3 ta", "Kuniga 3 AI baho", "Kuniga 15 tutor xabari"], en: ["Both tracks", "Best 3 per group", "3 AI checks / day", "15 tutor messages / day"] } },
  { id: "starter", price: 39000, accent: false, name: { uz: "Starter", en: "Starter" },
    feats: { uz: ["Cheksiz AI mashq + tutor", "Cheksiz tarjimon", "To'liq tarix va progress", "Barcha daraja kontenti"], en: ["Unlimited AI practice + tutor", "Unlimited translator", "Full history & progress", "All-level content"] } },
  { id: "premium", price: 79000, accent: true, name: { uz: "Premium", en: "Premium" },
    feats: { uz: ["Cheksiz Writing & Speaking", "Barcha Reading/Listening", "Progress grafiklari", "Ustuvor AI"], en: ["Unlimited Writing & Speaking", "All Reading/Listening", "Progress charts", "Priority AI"] } },
  { id: "vip", price: 149000, accent: false, name: { uz: "VIP", en: "VIP" },
    feats: { uz: ["To'liq Mock testlar", "Examiner chuqur tahlili", "Eng yuqori ustuvorlik", "Barcha kontent"], en: ["Full Mock tests", "Examiner deep feedback", "Top priority", "Everything unlocked"] } },
] as const;

const reviews = {
  uz: [
    { n: "Dilnoza R.", r: "IELTS 5.5 → 7.0", q: "Speaking'dan qo'rqardim. AI bilan har kuni gaplashib, 2 oyda 7.0 oldim." },
    { n: "Jasur K.", r: "Writing 6 → 7.5", q: "Har bir esseni baholab, bir band yuqori namuna ko'rsatadi. Shu hammasini o'zgartirdi." },
    { n: "Malika T.", r: "A2 → B2", q: "Kunlik streak meni ushlab turdi. Birinchi marta ingliz tilini tashlab ketmadim." },
  ],
  en: [
    { n: "Dilnoza R.", r: "IELTS 5.5 → 7.0", q: "I was scared of Speaking. Talking to the AI daily, I hit 7.0 in 2 months." },
    { n: "Jasur K.", r: "Writing 6 → 7.5", q: "It scores every essay and shows a one-band-higher sample. That changed everything." },
    { n: "Malika T.", r: "A2 → B2", q: "The daily streak kept me going. First time I didn't quit English." },
  ],
} as const;

/* ───────────────────────────── helpers ───────────────────────────── */
function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-glow)" }}
      >
        <span className="block h-4 w-4 rotate-45 rounded-[4px]" style={{ border: "2px solid rgba(10,10,18,0.85)" }} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-fg">maga</span>
    </span>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(26px)", transition: `opacity .6s var(--ease-out-quint) ${delay}s, transform .6s var(--ease-out-quint) ${delay}s` }}>
      {children}
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setW(pct); return; }
    const id = setTimeout(() => setW(pct), 200);
    return () => clearTimeout(id);
  }, [pct]);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="tnum text-sm font-semibold" style={{ color: "var(--color-cyan)" }}>{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div className="bar-fill h-full rounded-full" style={{ width: `${w}%`, transition: "width 1.1s var(--ease-out-quint)" }} />
      </div>
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU").replace(/,/g, " ");
}

const AVATARS = [
  { l: "A", c: "#7C5CFF" }, { l: "S", c: "#22D3EE" }, { l: "M", c: "#818CF8" }, { l: "D", c: "#FBBF24" },
];

/* ───────────────────────────── page ───────────────────────────── */
export function Landing() {
  const [lang, setLang] = useState<Lang>("uz");
  const t = dict[lang];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBg />

      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 w-full" style={{ background: "linear-gradient(180deg, rgba(8,8,15,0.85), rgba(8,8,15,0.45))", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--color-border)", paddingTop: "max(env(safe-area-inset-top),0px)" }}>
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <BrandMark />
            <nav className="hidden items-center gap-8 text-sm text-muted lg:flex">
              <a href="#features" className="transition-colors hover:text-fg">{t.nav.features}</a>
              <a href="#pricing" className="transition-colors hover:text-fg">{t.nav.pricing}</a>
              <a href="#reviews" className="transition-colors hover:text-fg">{t.nav.reviews}</a>
            </nav>
            <div className="flex items-center gap-2.5">
              <button onClick={() => setLang((l) => (l === "uz" ? "en" : "uz"))} className="focus-ring flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-fg" style={{ border: "1px solid var(--color-border)" }} aria-label="Toggle language">
                <Globe size={13} /> {lang === "uz" ? "UZ" : "EN"}
              </button>
              <Link href="/login" className="btn-primary h-9 px-4 text-sm">{t.nav.start}</Link>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-8 pt-14 lg:grid-cols-2 lg:pt-20">
          <div className="stagger">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-cyan)", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.22)" }}>
              <Globe size={13} /> {t.hero.badge}
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-fg sm:text-6xl">
              {t.hero.t1} <span className="text-gradient">{t.hero.t2}</span> {t.hero.t3}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted sm:text-lg">{t.hero.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn-primary h-12 px-6 text-base">{t.hero.cta1} <ArrowRight size={18} /></Link>
              <a href="#features" className="btn-ghost h-12 px-6 text-base"><Play size={16} /> {t.hero.cta2}</a>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a) => (
                  <span key={a.l} className="font-display flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#0A0A12]" style={{ background: a.c, border: "2px solid var(--color-bg)" }}>{a.l}</span>
                ))}
              </div>
              <p className="text-sm text-muted"><span className="font-semibold text-fg">50 000+</span> {t.hero.social}</p>
            </div>
          </div>

          {/* Progress card */}
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="glass p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-fg">{t.card.title}</h3>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-teal)", boxShadow: "0 0 8px var(--color-teal)" }} /> {t.card.live}
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  <Bar label={t.card.s} pct={82} />
                  <Bar label={t.card.l} pct={74} />
                  <Bar label={t.card.g} pct={91} />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[{ v: "18", l: t.card.st1 }, { v: "240", l: t.card.st2 }, { v: "7", l: t.card.st3 }].map((s) => (
                    <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
                      <div className="font-display tnum text-2xl font-bold text-fg">{s.v}</div>
                      <div className="mt-0.5 text-[11px] text-subtle">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badges */}
              <div className="glass absolute -right-3 -top-4 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-fg" style={{ animation: "float-soft 4s ease-in-out infinite" }}>
                <Trophy size={16} style={{ color: "var(--color-amber)" }} /> {t.card.ach}
              </div>
              <div className="glass absolute -bottom-4 -left-3 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-fg" style={{ animation: "float-soft 4.6s ease-in-out 0.4s infinite" }}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--color-primary-dim)" }}><Flame size={15} style={{ color: "var(--color-amber)" }} /></span>
                {t.card.streak}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Marquee ── */}
        <div className="my-10"><Marquee items={MARQUEE} /></div>

        {/* ── Features ── */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-cyan)" }}>{t.featBadge}</span>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                {t.feat1} <span className="text-gradient">{t.feat2}</span> {t.feat3}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.featSub}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features[lang].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.t} delay={(i % 3) * 0.06}>
                  <div className="glass card-i h-full p-6">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${f.c} 20%, transparent)`, border: `1px solid color-mix(in srgb, ${f.c} 35%, transparent)`, color: f.c }}>
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-fg">{f.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-cyan)" }}>{t.priceBadge}</span>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{t.price1} <span className="text-gradient">{t.price2}</span></h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.priceSub}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={(i % 4) * 0.05}>
                <div className="glass relative flex h-full flex-col p-6" style={tier.accent ? { border: "1.5px solid var(--color-primary)", boxShadow: "0 0 0 1px rgba(124,92,255,0.3), 0 22px 60px -22px rgba(124,92,255,0.5)" } : undefined}>
                  {tier.accent && <span className="chip absolute -top-3 left-1/2 -translate-x-1/2" style={{ color: "#0A0A12", background: "var(--gradient-cta)" }}>{t.popular}</span>}
                  <h3 className="font-display text-lg font-semibold text-fg">{tier.name[lang]}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display tnum text-3xl font-bold text-fg">{tier.price === 0 ? "0" : fmt(tier.price)}</span>
                    <span className="text-xs text-subtle">{t.sum}{t.perMonth}</span>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.feats[lang].map((ft) => (
                      <li key={ft} className="flex items-start gap-2 text-sm text-muted">
                        <Check size={16} className="mt-0.5 shrink-0" style={{ color: tier.accent ? "var(--color-cyan)" : "var(--color-success)" }} /> {ft}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className={tier.accent ? "btn-primary mt-6 h-11" : "btn-ghost mt-6 h-11"}>{tier.price === 0 ? t.startFree : t.choose}</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="reviews" className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-cyan)" }}>{t.revBadge}</span>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">{t.rev1} <span className="text-gradient">{t.rev2}</span></h2>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {reviews[lang].map((rv, i) => (
              <Reveal key={rv.n} delay={(i % 3) * 0.06}>
                <div className="glass flex h-full flex-col p-6">
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={15} fill="var(--color-amber)" stroke="none" />)}</div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg">“{rv.q}”</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-display flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#0A0A12]" style={{ background: "var(--gradient-cta)" }}>{rv.n[0]}</span>
                    <div><div className="text-sm font-semibold text-fg">{rv.n}</div><div className="text-xs" style={{ color: "var(--color-cyan)" }}>{rv.r}</div></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <div className="glass relative overflow-hidden px-6 py-14 text-center" style={{ borderColor: "rgba(124,92,255,0.4)" }}>
              <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "radial-gradient(32rem 18rem at 50% -20%, rgba(124,92,255,0.4), transparent 60%), radial-gradient(28rem 16rem at 80% 120%, rgba(34,211,238,0.22), transparent 60%)" }} />
              <div className="relative">
                <h2 className="font-display mx-auto max-w-xl text-3xl font-bold tracking-tight text-fg sm:text-4xl">{t.ctaTitle}</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.ctaSub}</p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/login" className="btn-primary h-12 px-8 text-base">{t.ctaBtn} <ArrowRight size={18} /></Link>
                  <a href="#pricing" className="btn-ghost h-12 px-8 text-base">{t.ctaBtn2}</a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <BrandMark />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{t.footAbout}</p>
            </div>
            {[{ h: t.fCol1, items: t.fCol1i }, { h: t.fCol2, items: t.fCol2i }, { h: t.fCol3, items: t.fCol3i }].map((col) => (
              <div key={col.h}>
                <div className="mb-3 text-sm font-semibold text-fg">{col.h}</div>
                <ul className="space-y-2">
                  {col.items.map((it) => <li key={it}><span className="cursor-pointer text-sm text-muted transition-colors hover:text-fg">{it}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-subtle sm:flex-row">
              <span>© {new Date().getFullYear()} maga. {t.rights}</span>
              <span>{t.place} · hello@maga.uz</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
