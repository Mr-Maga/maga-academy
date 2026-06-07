import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookMarked, Zap, BookOpenText } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Book Summaries" };

export default async function SummariesPage() {
  await requireActiveProfile();

  const variants = [
    {
      icon: Zap,
      title: "Short summaries",
      desc: "The core idea of a book in ~3 minutes. Perfect for a quick read on the go.",
      accent: "teal",
    },
    {
      icon: BookOpenText,
      title: "Long summaries",
      desc: "A deeper walk through the key chapters, examples and lessons of each book.",
      accent: "indigo",
    },
  ];

  return (
    <div>
      <Link
        href="/reading"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> Reading
      </Link>
      <PageHeader title="Book Summaries" subtitle="The big ideas of great books — in short or long form." />

      <div className="grid gap-3 sm:grid-cols-2">
        {variants.map((v) => (
          <div key={v.title} className="card relative flex flex-col overflow-hidden p-5 opacity-90">
            <div className="mb-3 flex items-center justify-between">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ backgroundColor: `color-mix(in srgb, var(--color-${v.accent}) 16%, transparent)`, color: `var(--color-${v.accent})` }}
              >
                <v.icon className="h-6 w-6" />
              </span>
              <span className="chip bg-amber/15 text-amber">Tez kunda</span>
            </div>
            <h2 className="text-lg font-extrabold">{v.title}</h2>
            <p className="mt-1 text-sm text-muted">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="card mt-4 flex items-center gap-3 border-dashed p-4">
        <BookMarked className="h-5 w-5 shrink-0 text-primary-soft" />
        <p className="text-sm text-muted">
          50+ book summaries are on the way — each one written to be reliable, meaningful and useful.
        </p>
      </div>
    </div>
  );
}
