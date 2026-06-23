"use client";

import { useState } from "react";
import Link from "next/link";
import { Headphones, ArrowRight, ListChecks } from "lucide-react";
import { READING_LEVELS, LEVEL_META, type ReadingLevel } from "@/lib/reading-content";
import { cn } from "@/lib/utils";

export interface ListenCard {
  id: string;
  level: ReadingLevel;
  title: string;
  topic?: string;
  questions: number;
}

export function ListeningBrowser({ items }: { items: ListenCard[] }) {
  const [level, setLevel] = useState<ReadingLevel | "all">("all");
  const filtered = level === "all" ? items : items.filter((i) => i.level === level);

  return (
    <div className="space-y-4">
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
          Bu daraja uchun mashqlar tez kunda qo‘shiladi.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((it) => (
            <Link key={it.id} href={`/listening/${it.id}`} className="card-i group flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft/15 text-primary-soft">
                <Headphones className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
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
                <div className="truncate font-bold">{it.title}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-subtle">
                  <ListChecks className="h-3.5 w-3.5" /> {it.questions} questions
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary-soft transition group-hover:translate-x-0.5" />
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
