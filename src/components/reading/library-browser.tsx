"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, FileText, ArrowRight } from "lucide-react";
import { READING_LEVELS, LEVEL_META, type ReadingLevel } from "@/lib/reading-content";
import { cn } from "@/lib/utils";

export interface LibraryCard {
  id: string;
  level: ReadingLevel;
  title: string;
  subtitle?: string;
  topic?: string;
  minutes: number;
  words: number;
}

export function LibraryBrowser({ items, basePath }: { items: LibraryCard[]; basePath: string }) {
  const [level, setLevel] = useState<ReadingLevel | "all">("all");
  const filtered = level === "all" ? items : items.filter((i) => i.level === level);

  return (
    <div className="space-y-4">
      {/* Level filter */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Pill active={level === "all"} onClick={() => setLevel("all")} label="All" count={items.length} />
        {READING_LEVELS.map((lv) => (
          <Pill
            key={lv}
            active={level === lv}
            onClick={() => setLevel(lv)}
            label={lv}
            count={items.filter((i) => i.level === lv).length}
            color={LEVEL_META[lv].color}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">
          Bu daraja uchun matnlar tez kunda qo‘shiladi.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((it) => (
            <Link
              key={it.id}
              href={`${basePath}/${it.id}`}
              className="card-i group flex flex-col p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="chip font-semibold"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${LEVEL_META[it.level].color} 18%, transparent)`,
                    color: LEVEL_META[it.level].color,
                  }}
                >
                  {it.level}
                </span>
                {it.topic && <span className="chip bg-surface text-subtle">{it.topic}</span>}
              </div>
              <h3 className="font-bold leading-snug">{it.title}</h3>
              {it.subtitle && <p className="mt-1 line-clamp-2 text-sm text-muted">{it.subtitle}</p>}
              <div className="mt-3 flex items-center gap-3 text-xs text-subtle">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {it.minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> {it.words} words
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-primary-soft transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary-soft/50 bg-primary-soft/15 text-fg"
          : "border-border text-muted hover:border-primary-soft/40 hover:text-fg",
      )}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
      {label}
      <span className="text-xs text-subtle">{count}</span>
    </button>
  );
}
