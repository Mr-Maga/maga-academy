import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/legacy-ui";

export const metadata: Metadata = { title: "IELTS Reading Mock" };

export default async function MockPage() {
  await requireActiveProfile();

  const parts = [
    { title: "Passage 1", desc: "Shorter, easier passage with 13 questions." },
    { title: "Passage 2", desc: "Medium difficulty — 13 questions." },
    { title: "Passage 3", desc: "The hardest passage — 14 questions." },
    { title: "Full Test", desc: "All 3 passages, 40 questions, 60-minute timer." },
  ];

  return (
    <div>
      <Link
        href="/reading"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> Reading
      </Link>
      <PageHeader
        title="IELTS Reading Mock"
        subtitle="Real exam structure — Passage 1, 2, 3 and a timed full test."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {parts.map((p) => (
          <div key={p.title} className="card flex items-center gap-3 p-4 opacity-90">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-base font-bold text-subtle">
              {p.title.startsWith("Passage") ? p.title.split(" ")[1] : "★"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-bold">{p.title}</div>
              <div className="text-xs text-muted">{p.desc}</div>
            </div>
            <Lock className="h-4 w-4 shrink-0 text-subtle" />
            <span className="chip bg-amber/15 text-amber">Soon</span>
          </div>
        ))}
      </div>

      {/* Working alternative right now */}
      <Link href="/reading/lab" className="card-i mt-4 flex items-center gap-3 overflow-hidden p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft/15 text-xl">
          ✨
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-bold">
            Try the AI Reading Test now
            <span className="chip bg-primary-soft/15 text-primary-soft">
              <Sparkles className="h-3 w-3" /> Live
            </span>
          </div>
          <div className="text-xs text-muted">
            Until the official mocks land, practise with a fresh AI passage and instant band.
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary-soft" />
      </Link>
    </div>
  );
}
