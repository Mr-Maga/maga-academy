"use client";

import { useActionState, useState } from "react";
import { PenLine, Sparkles, Shuffle, ArrowLeft, FileBarChart, FileText, Layers, ChevronRight } from "lucide-react";
import { AiEvaluationView } from "@/components/ai-evaluation";
import {
  checkWriting,
  checkMockWriting,
  type WritingCheckState,
  type MockWritingState,
} from "./actions";
import { promptsFor, randomPrompt, type WritingPrompt } from "@/lib/writing-prompts";
import { WritingChat } from "./writing-chat";
import type { AiEvaluation } from "@/lib/types";

type Mode = "task1" | "task2" | "mock";

const wc = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

function evalSummary(ev: AiEvaluation): string {
  return (
    `Overall ${ev.overall_band.toFixed(1)}. ${ev.band_note ?? ""} ` +
    ev.criteria.map((c) => `${c.name}: ${c.band.toFixed(1)}`).join("; ")
  );
}

export function WritingClient() {
  const [mode, setMode] = useState<Mode | null>(null);
  if (!mode) return <ModePicker onPick={setMode} />;
  if (mode === "mock") return <MockView onBack={() => setMode(null)} />;
  return <SingleView task={mode} onBack={() => setMode(null)} />;
}

/* ----------------------------- Mode picker ----------------------------- */

function ModePicker({ onPick }: { onPick: (m: Mode) => void }) {
  const cards: { mode: Mode; icon: React.ReactNode; title: string; sub: string }[] = [
    { mode: "task1", icon: <FileBarChart className="h-6 w-6" />, title: "Academic Task 1", sub: "Grafik / jadval / xarita — 150+ so‘z" },
    { mode: "task2", icon: <FileText className="h-6 w-6" />, title: "Task 2 (essay)", sub: "Insho — 250+ so‘z" },
    { mode: "mock", icon: <Layers className="h-6 w-6" />, title: "Mock Writing", sub: "Task 1 + Task 2 + umumiy band" },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Qaysi qismni mashq qilamiz?</p>
      {cards.map((c) => (
        <button
          key={c.mode}
          onClick={() => onPick(c.mode)}
          className="card flex w-full items-center gap-4 p-4 text-left transition active:scale-[0.99]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary-soft">
            {c.icon}
          </span>
          <span className="flex-1">
            <span className="block font-semibold">{c.title}</span>
            <span className="block text-xs text-muted">{c.sub}</span>
          </span>
          <ChevronRight className="h-5 w-5 text-subtle" />
        </button>
      ))}
    </div>
  );
}

/* --------------------------- Single task flow --------------------------- */

function SingleView({ task, onBack }: { task: "task1" | "task2"; onBack: () => void }) {
  const [selected, setSelected] = useState<WritingPrompt | null>(null);
  const [state, action, pending] = useActionState<WritingCheckState, FormData>(checkWriting, undefined);
  const [essay, setEssay] = useState("");
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  if (!selected) {
    return <PromptPicker task={task} onBack={onBack} onSelect={setSelected} />;
  }

  const label = task === "task1" ? "Academic Task 1" : "Task 2";

  return (
    <div className="space-y-5">
      <BackBar onBack={() => setSelected(null)} label={`${label} — mavzular`} />

      <div className="card space-y-2 p-4">
        <div className="label">
          {label} · {selected.label} · {selected.type}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{selected.prompt}</p>
        {!state?.result && (
          <button
            onClick={() => setSelected(randomPrompt(task))}
            className="btn-ghost mt-1 text-xs"
            type="button"
          >
            <Shuffle className="h-3.5 w-3.5" /> Boshqa mavzu
          </button>
        )}
      </div>

      <form action={action} className="card space-y-3 p-4">
        <input type="hidden" name="task" value={task} />
        <input type="hidden" name="question" value={selected.prompt} />

        {task === "task1" && (
          <div>
            <span className="label">Task 1 rasmi (ixtiyoriy — grafik/jadval/xarita)</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="input text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setImgPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
            {imgPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgPreview} alt="Task 1" className="border-line mt-2 max-h-60 rounded-lg border" />
            )}
            <p className="mt-1 text-xs text-subtle">Rasm yuklasangiz, AI undagi ma’lumotni ko‘rib baholaydi.</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="label">Javobingiz</span>
          <span className="text-xs text-subtle">{wc(essay)} so‘z</span>
        </div>
        <textarea
          name="essay"
          rows={12}
          required
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          className="input"
          placeholder="Javobingizni shu yerga yozing…"
        />
        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full py-3">
          {pending ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Baholanyapti…
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4" /> Bandni olish
            </>
          )}
        </button>
      </form>

      {state?.result && (
        <>
          <AiEvaluationView ev={state.result} />
          <WritingChat question={selected.prompt} essay={essay} evalSummary={evalSummary(state.result)} />
        </>
      )}
    </div>
  );
}

/* ----------------------------- Prompt picker ----------------------------- */

function PromptPicker({
  task,
  onBack,
  onSelect,
}: {
  task: "task1" | "task2";
  onBack: () => void;
  onSelect: (p: WritingPrompt) => void;
}) {
  const prompts = promptsFor(task);
  const [custom, setCustom] = useState("");
  return (
    <div className="space-y-4">
      <BackBar onBack={onBack} label="Writing" />

      {/* Your own topic + random beside it (Engnovate-style) */}
      <div className="card space-y-2 p-4">
        <span className="label">O‘z mavzuingizni kiriting</span>
        <textarea
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          rows={3}
          className="input"
          placeholder="Boshqa joydan olgan mavzuni shu yerga joylang…"
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={custom.trim().length < 10}
            onClick={() =>
              onSelect({
                id: "custom",
                label: "O‘z mavzum",
                type: task === "task1" ? "Custom — rasm yuklashingiz mumkin" : "Custom",
                prompt: custom.trim(),
              })
            }
            className="btn-primary flex-1 py-2.5"
          >
            <PenLine className="h-4 w-4" /> Shu mavzu bilan boshlash
          </button>
          <button
            type="button"
            onClick={() => onSelect(randomPrompt(task))}
            className="btn-ghost px-4"
          >
            <Shuffle className="h-4 w-4" /> Random
          </button>
        </div>
      </div>

      <p className="text-xs text-subtle">yoki tayyor {prompts.length} ta eng muhim mavzudan tanlang:</p>
      <div className="space-y-2">
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="card flex w-full items-center gap-3 p-3 text-left transition active:scale-[0.99]"
          >
            <span className="flex-1">
              <span className="block text-sm font-semibold">{p.label}</span>
              <span className="block text-xs text-muted">{p.type}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-subtle" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Mock flow ------------------------------ */

function MockView({ onBack }: { onBack: () => void }) {
  const [p1, setP1] = useState<WritingPrompt>(() => randomPrompt("task1"));
  const [p2, setP2] = useState<WritingPrompt>(() => randomPrompt("task2"));
  const [state, action, pending] = useActionState<MockWritingState, FormData>(checkMockWriting, undefined);
  const [e1, setE1] = useState("");
  const [e2, setE2] = useState("");
  const done = state?.task1 && state?.task2;

  return (
    <div className="space-y-5">
      <BackBar onBack={onBack} label="Writing" />

      {!done && (
        <button
          type="button"
          onClick={() => {
            setP1(randomPrompt("task1"));
            setP2(randomPrompt("task2"));
          }}
          className="btn-ghost text-xs"
        >
          <Shuffle className="h-3.5 w-3.5" /> Yangi mavzular
        </button>
      )}

      <form action={action} className="space-y-4">
        <input type="hidden" name="question1" value={p1.prompt} />
        <input type="hidden" name="question2" value={p2.prompt} />

        <div className="card space-y-2 p-4">
          <div className="label">Task 1 · {p1.label} · {p1.type}</div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{p1.prompt}</p>
          <textarea
            name="essay1"
            rows={8}
            value={e1}
            onChange={(e) => setE1(e.target.value)}
            className="input"
            placeholder="Task 1 javobi (≥150 so‘z)…"
          />
          <div className="text-right text-xs text-subtle">{wc(e1)} so‘z</div>
        </div>

        <div className="card space-y-2 p-4">
          <div className="label">Task 2 · {p2.label} · {p2.type}</div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{p2.prompt}</p>
          <textarea
            name="essay2"
            rows={12}
            value={e2}
            onChange={(e) => setE2(e.target.value)}
            className="input"
            placeholder="Task 2 javobi (≥250 so‘z)…"
          />
          <div className="text-right text-xs text-subtle">{wc(e2)} so‘z</div>
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full py-3">
          {pending ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Ikkala vazifa baholanyapti…
            </>
          ) : (
            <>
              <Layers className="h-4 w-4" /> Mockni baholash
            </>
          )}
        </button>
      </form>

      {done && state?.task1 && state?.task2 && (
        <div className="space-y-4">
          <div className="card p-4 text-center">
            <div className="text-sm text-muted">Umumiy Writing band</div>
            <div className="text-4xl font-extrabold text-primary-soft">{state.overall?.toFixed(1)}</div>
            <div className="text-xs text-subtle">Task 2 ikki barobar og‘irlikda hisoblanadi</div>
          </div>
          <details open className="card p-4">
            <summary className="cursor-pointer font-semibold">Task 1 — natija</summary>
            <div className="mt-3">
              <AiEvaluationView ev={state.task1} />
            </div>
          </details>
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold">Task 2 — natija</summary>
            <div className="mt-3">
              <AiEvaluationView ev={state.task2} />
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- helpers ------------------------------- */

function BackBar({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted hover:text-fg" type="button">
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}
