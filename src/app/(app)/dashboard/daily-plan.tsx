"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CalendarCheck, Send, Loader2, Check, X, ArrowRight, Sparkles } from "lucide-react";
import { XpBar } from "@/components/gamify";
import { cn } from "@/lib/utils";
import { addPlanFromText, toggleTask, removeTask } from "./actions";
import type { DailyTask, TaskTool } from "@/lib/types";

const TOOL_HREF: Partial<Record<TaskTool, string>> = {
  writing: "/writing",
  speaking: "/speaking",
  vocab: "/vocab",
  exercises: "/exercises",
};

export function DailyPlan({ initial }: { initial: DailyTask[] }) {
  const [tasks, setTasks] = useState<DailyTask[]>(initial);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();

  const done = tasks.filter((t) => t.done).length;

  function add() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    start(async () => {
      const created = await addPlanFromText(text);
      if (created.length) setTasks((prev) => [...prev, ...created]);
      else setInput(text); // restore on failure
    });
  }

  function toggle(t: DailyTask) {
    const next = !t.done;
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: next } : x)));
    start(() => toggleTask(t.id, next));
  }

  function remove(t: DailyTask) {
    setTasks((prev) => prev.filter((x) => x.id !== t.id));
    start(() => removeTask(t.id));
  }

  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CalendarCheck className="h-4 w-4 text-primary-soft" /> Bugungi reja
        </div>
        {tasks.length > 0 && (
          <span className="text-xs font-semibold text-primary-soft">
            {done}/{tasks.length}
          </span>
        )}
      </div>

      {tasks.length > 0 && (
        <>
          <XpBar value={done} max={tasks.length} label="Bajarilgan" />
          <ul className="space-y-1.5">
            {tasks.map((t) => {
              const href = t.tool ? TOOL_HREF[t.tool] : undefined;
              return (
                <li key={t.id} className="group flex items-center gap-2.5 rounded-xl bg-surface/60 p-2.5">
                  <button
                    type="button"
                    onClick={() => toggle(t)}
                    aria-label={t.done ? "Bekor qilish" : "Bajarildi"}
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition",
                      t.done ? "border-primary-soft bg-primary-soft text-bg" : "border-border hover:border-primary-soft/60",
                    )}
                  >
                    {t.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </button>

                  {href ? (
                    <Link
                      href={href}
                      className={cn("flex-1 text-sm transition", t.done ? "text-subtle line-through" : "hover:text-primary-soft")}
                    >
                      {t.title}
                    </Link>
                  ) : (
                    <span className={cn("flex-1 text-sm", t.done && "text-subtle line-through")}>{t.title}</span>
                  )}

                  {href && !t.done && (
                    <Link href={href} aria-label="Boshlash" className="text-subtle transition hover:text-primary-soft">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(t)}
                    aria-label="O‘chirish"
                    className="text-subtle opacity-0 transition hover:text-danger group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          {done === tasks.length && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-soft">
              <Sparkles className="h-3.5 w-3.5" /> Reja bajarildi — zo‘rsiz! 🎉
            </p>
          )}
        </>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Bugun nima qilasiz? Maga rejaga qo‘shadi…"
          className="input flex-1"
          disabled={pending}
        />
        <button onClick={add} disabled={pending || !input.trim()} className="btn-primary px-4" aria-label="Qo‘shish">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      {tasks.length === 0 && (
        <p className="text-xs text-subtle">
          Masalan: <span className="text-muted">“Writing Task 2, 10 ta yangi so‘z, Speaking Part 2”</span>
        </p>
      )}
    </section>
  );
}
