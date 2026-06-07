import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  BookOpen,
  ClipboardList,
  BookMarked,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { piecesByKind } from "@/lib/reading-content";

export const metadata: Metadata = { title: "Reading" };

type Section = {
  href: string;
  icon: LucideIcon;
  emoji: string;
  title: string;
  desc: string;
  accent: string;
  status: string;
  ready: boolean;
};

export default async function ReadingPage() {
  await requireActiveProfile();

  const articleCount = piecesByKind("article").length;
  const storyCount = piecesByKind("story").length;

  const sections: Section[] = [
    {
      href: "/reading/articles",
      icon: Newspaper,
      emoji: "📰",
      title: "Articles",
      desc: "Real-world topics across every level — science, culture, society and more.",
      accent: "primary",
      status: `${articleCount} ready`,
      ready: true,
    },
    {
      href: "/reading/stories",
      icon: BookOpen,
      emoji: "📖",
      title: "Short Stories",
      desc: "Engaging stories graded A1 → C1. Read for pleasure, learn without noticing.",
      accent: "indigo",
      status: `${storyCount} ready`,
      ready: true,
    },
    {
      href: "/reading/summaries",
      icon: BookMarked,
      emoji: "📚",
      title: "Book Summaries",
      desc: "The big ideas of great books — short & long versions.",
      accent: "amber",
      status: "Soon",
      ready: false,
    },
    {
      href: "/reading/mock",
      icon: ClipboardList,
      emoji: "📝",
      title: "IELTS Mock",
      desc: "Full reading mocks — Passage 1, 2, 3 & timed full test.",
      accent: "rose",
      status: "Soon",
      ready: false,
    },
  ];

  return (
    <div className="stagger space-y-5">
      <PageHeader title="Reading" subtitle="Read every day — the fastest way to grow your English." />

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card-i group relative flex flex-col overflow-hidden p-5"
          >
            <span
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl"
              style={{ background: `var(--color-${s.accent})` }}
            />
            <div className="mb-3 flex items-center justify-between">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl text-2xl"
                style={{ backgroundColor: `color-mix(in srgb, var(--color-${s.accent}) 16%, transparent)` }}
              >
                {s.emoji}
              </span>
              <span className={s.ready ? "chip bg-teal/15 text-teal" : "chip bg-amber/15 text-amber"}>
                {s.status}
              </span>
            </div>
            <h2 className="text-lg font-extrabold">{s.title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{s.desc}</p>
            <div className="mt-3 flex items-center text-sm font-semibold text-primary-soft">
              Open
              <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* AI reading test */}
      <Link href="/reading/lab" className="card-i flex items-center gap-3 overflow-hidden p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft/15 text-xl">
          ✨
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-bold">
            AI Reading Test
            <span className="chip bg-primary-soft/15 text-primary-soft">
              <Sparkles className="h-3 w-3" /> Live
            </span>
          </div>
          <div className="text-xs text-muted">
            Maga writes a fresh passage + questions and grades you instantly.
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary-soft" />
      </Link>
    </div>
  );
}
