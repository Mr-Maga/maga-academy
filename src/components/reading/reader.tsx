import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import {
  LEVEL_META,
  readMinutes,
  wordCount,
  type ReadingPiece,
} from "@/lib/reading-content";

export function ReadingReader({ piece, backHref, backLabel }: {
  piece: ReadingPiece;
  backHref: string;
  backLabel: string;
}) {
  const paragraphs = piece.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const color = LEVEL_META[piece.level].color;

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <div className="mb-2 flex items-center gap-2">
        <span
          className="chip font-semibold"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
            color,
          }}
        >
          {piece.level} · {LEVEL_META[piece.level].label}
        </span>
        {piece.topic && <span className="chip bg-surface text-subtle">{piece.topic}</span>}
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight">{piece.title}</h1>

      <div className="mt-2 flex items-center gap-3 text-xs text-subtle">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {readMinutes(piece.body)} min read
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" /> {wordCount(piece.body)} words
        </span>
      </div>

      <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-fg/90">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8">
        <Link href={backHref} className="btn-primary w-full justify-center py-3">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
      </div>
    </article>
  );
}
