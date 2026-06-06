"use client";

import { useState, type ReactNode } from "react";
import { Sparkles, ChevronRight, ArrowLeft, Shuffle, MessageSquare, FileText, Layers, Mic } from "lucide-react";
import { AiEvaluationView } from "@/components/ai-evaluation";
import { VoiceRecorder } from "./recorder";
import { SpeakingChat } from "./speaking-chat";
import {
  PART1_SETS,
  PART2_CUECARDS,
  PART3_SETS,
  randomOf,
  part1Text,
  cueText,
  part3Text,
  type Part1Set,
  type CueCard,
  type Part3Set,
} from "@/lib/speaking-prompts";
import type { AiEvaluation } from "@/lib/types";

type Part = 1 | 2 | 3;
type Mode = Part | "full";
type Selected = { title: string; question: string; display: ReactNode };

const round5 = (n: number) => Math.round(n * 2) / 2;

function evalSummary(ev: AiEvaluation): string {
  return (
    `Overall ${ev.overall_band.toFixed(1)}. ${ev.band_note ?? ""} ` +
    ev.criteria.map((c) => `${c.name}: ${c.band.toFixed(1)}`).join("; ")
  );
}

async function gradeSpeaking(
  part: number,
  question: string,
  blob: Blob,
): Promise<{ result?: AiEvaluation; error?: string }> {
  const fd = new FormData();
  fd.append("part", String(part));
  fd.append("question", question);
  fd.append("audio", blob, "answer.wav");
  const res = await fetch("/api/ai/speaking", { method: "POST", body: fd });
  return res.json();
}

function p1Selected(s: Part1Set): Selected {
  return {
    title: `Part 1 · ${s.theme}`,
    question: part1Text(s),
    display: (
      <ul className="space-y-1.5 text-sm">
        {s.questions.map((q, i) => (
          <li key={i} className="font-medium">
            {i + 1}. {q}
          </li>
        ))}
      </ul>
    ),
  };
}
function cueSelected(c: CueCard): Selected {
  return {
    title: `Part 2 · ${c.theme}`,
    question: cueText(c),
    display: (
      <>
        <p className="font-semibold">{c.card}</p>
        <p className="mt-2 text-sm text-muted">You should say:</p>
        <ul className="mt-1 list-inside list-disc text-sm text-muted">
          {c.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </>
    ),
  };
}
function p3Selected(s: Part3Set): Selected {
  return {
    title: `Part 3 · ${s.theme}`,
    question: part3Text(s),
    display: (
      <ul className="space-y-1.5 text-sm">
        {s.questions.map((q, i) => (
          <li key={i} className="font-medium">
            {i + 1}. {q}
          </li>
        ))}
      </ul>
    ),
  };
}

export function SpeakingClient() {
  const [mode, setMode] = useState<Mode | null>(null);
  if (!mode) return <ModePicker onPick={setMode} />;
  if (mode === "full") return <FullTestView onBack={() => setMode(null)} />;
  return <SinglePartView part={mode} onBack={() => setMode(null)} />;
}

/* ----------------------------- Mode picker ----------------------------- */

function ModePicker({ onPick }: { onPick: (m: Mode) => void }) {
  const cards: { mode: Mode; title: string; sub: string; icon: ReactNode }[] = [
    { mode: 1, title: "Part 1", sub: "Tanish mavzular — qisqa savol-javob", icon: <MessageSquare className="h-6 w-6" /> },
    { mode: 2, title: "Part 2", sub: "Cue card — 1–2 daqiqa gapirish", icon: <FileText className="h-6 w-6" /> },
    { mode: 3, title: "Part 3", sub: "Chuqur muhokama savollari", icon: <MessageSquare className="h-6 w-6" /> },
    { mode: "full", title: "Full Test", sub: "Part 1 + 2 + 3 → umumiy band", icon: <Layers className="h-6 w-6" /> },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Qaysi qismni mashq qilamiz?</p>
      {cards.map((c) => (
        <button
          key={String(c.mode)}
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

/* --------------------------- Single part flow --------------------------- */

function SinglePartView({ part, onBack }: { part: Part; onBack: () => void }) {
  const [sel, setSel] = useState<Selected | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiEvaluation | null>(null);

  if (!sel) return <TopicPicker part={part} onBack={onBack} onSelect={setSel} />;

  async function submit() {
    if (!blob || loading || !sel) return;
    setLoading(true);
    setError(null);
    const data = await gradeSpeaking(part, sel.question, blob);
    if (data.error) setError(data.error);
    else setResult(data.result ?? null);
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <BackBar onBack={() => setSel(null)} label="Mavzular" />

      <div className="card space-y-1 p-4">
        <div className="label">{sel.title}</div>
        {sel.display}
      </div>

      {!result && (
        <div className="card space-y-3 p-4">
          <div className="label">Javobingizni yozib oling</div>
          <VoiceRecorder key={sel.title} onRecorded={setBlob} />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button onClick={submit} disabled={!blob || loading} className="btn-primary w-full py-3">
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" /> AI eshityapti va baholayapti…
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" /> Bandni olish
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <>
          <AiEvaluationView ev={result} />
          <SpeakingChat
            part={part}
            question={sel.question}
            transcript={result.transcript ?? ""}
            evalSummary={evalSummary(result)}
          />
        </>
      )}
    </div>
  );
}

/* ----------------------------- Topic picker ----------------------------- */

function TopicPicker({
  part,
  onBack,
  onSelect,
}: {
  part: Part;
  onBack: () => void;
  onSelect: (s: Selected) => void;
}) {
  const [custom, setCustom] = useState("");

  const pickRandom = () => {
    if (part === 1) onSelect(p1Selected(randomOf(PART1_SETS)));
    else if (part === 2) onSelect(cueSelected(randomOf(PART2_CUECARDS)));
    else onSelect(p3Selected(randomOf(PART3_SETS)));
  };

  const startCustom = () => {
    const label = part === 1 ? "Part 1" : part === 2 ? "Part 2" : "Part 3";
    onSelect({
      title: `${label} · O‘z mavzum`,
      question: `IELTS Speaking ${label}. ${custom.trim()}`,
      display: <p className="whitespace-pre-wrap text-sm">{custom.trim()}</p>,
    });
  };

  const list =
    part === 1
      ? PART1_SETS.map((s) => ({ id: s.id, theme: s.theme, sub: "4 ta savol", pick: () => onSelect(p1Selected(s)) }))
      : part === 2
        ? PART2_CUECARDS.map((c) => ({ id: c.id, theme: c.theme, sub: c.card, pick: () => onSelect(cueSelected(c)) }))
        : PART3_SETS.map((s) => ({ id: s.id, theme: s.theme, sub: "muhokama", pick: () => onSelect(p3Selected(s)) }));

  return (
    <div className="space-y-4">
      <BackBar onBack={onBack} label="Speaking" />

      <div className="card space-y-2 p-4">
        <span className="label">O‘z mavzuingizni kiriting</span>
        <textarea
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          rows={2}
          className="input"
          placeholder={part === 2 ? "Cue card matnini joylang…" : "Savol(lar)ni joylang…"}
        />
        <div className="flex gap-2">
          <button type="button" disabled={custom.trim().length < 8} onClick={startCustom} className="btn-primary flex-1 py-2.5">
            <Mic className="h-4 w-4" /> Shu mavzu bilan
          </button>
          <button type="button" onClick={pickRandom} className="btn-ghost px-4">
            <Shuffle className="h-4 w-4" /> Random
          </button>
        </div>
      </div>

      <p className="text-xs text-subtle">yoki tayyor {list.length} ta mavzudan tanlang:</p>
      <div className="space-y-2">
        {list.map((it) => (
          <button
            key={it.id}
            onClick={it.pick}
            className="card flex w-full items-center gap-3 p-3 text-left transition active:scale-[0.99]"
          >
            <span className="flex-1">
              <span className="block text-sm font-semibold">{it.theme}</span>
              <span className="block truncate text-xs text-muted">{it.sub}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-subtle" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Full test ------------------------------ */

function FullTestView({ onBack }: { onBack: () => void }) {
  const [p1, setP1] = useState<Part1Set>(() => randomOf(PART1_SETS));
  const [c2, setC2] = useState<CueCard>(() => randomOf(PART2_CUECARDS));
  const [p3, setP3] = useState<Part3Set>(() => randomOf(PART3_SETS));
  const [b1, setB1] = useState<Blob | null>(null);
  const [b2, setB2] = useState<Blob | null>(null);
  const [b3, setB3] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<{ r1: AiEvaluation; r2: AiEvaluation; r3: AiEvaluation; overall: number } | null>(null);

  const ready = b1 && b2 && b3;

  async function submit() {
    if (!ready || loading) return;
    setLoading(true);
    setError(null);
    const d1 = await gradeSpeaking(1, part1Text(p1), b1!);
    if (d1.error || !d1.result) return fail(d1.error);
    const d2 = await gradeSpeaking(2, cueText(c2), b2!);
    if (d2.error || !d2.result) return fail(d2.error);
    const d3 = await gradeSpeaking(3, part3Text(p3), b3!);
    if (d3.error || !d3.result) return fail(d3.error);
    const overall = round5((d1.result.overall_band + d2.result.overall_band + d3.result.overall_band) / 3);
    setRes({ r1: d1.result, r2: d2.result, r3: d3.result, overall });
    setLoading(false);
  }
  function fail(msg?: string) {
    setError(msg ?? "Xatolik. Qayta urinib ko‘ring.");
    setLoading(false);
  }

  if (res) {
    return (
      <div className="space-y-4">
        <BackBar onBack={onBack} label="Speaking" />
        <div className="card p-4 text-center">
          <div className="text-sm text-muted">Umumiy Speaking band</div>
          <div className="text-4xl font-extrabold text-primary-soft">{res.overall.toFixed(1)}</div>
          <div className="text-xs text-subtle">Part 1 + Part 2 + Part 3 o‘rtachasi</div>
        </div>
        <details open className="card p-4">
          <summary className="cursor-pointer font-semibold">Part 1 — natija</summary>
          <div className="mt-3"><AiEvaluationView ev={res.r1} /></div>
        </details>
        <details className="card p-4">
          <summary className="cursor-pointer font-semibold">Part 2 — natija</summary>
          <div className="mt-3"><AiEvaluationView ev={res.r2} /></div>
        </details>
        <details className="card p-4">
          <summary className="cursor-pointer font-semibold">Part 3 — natija</summary>
          <div className="mt-3"><AiEvaluationView ev={res.r3} /></div>
        </details>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BackBar onBack={onBack} label="Speaking" />
      <button
        type="button"
        onClick={() => {
          setP1(randomOf(PART1_SETS));
          setC2(randomOf(PART2_CUECARDS));
          setP3(randomOf(PART3_SETS));
          setB1(null);
          setB2(null);
          setB3(null);
        }}
        className="btn-ghost text-xs"
      >
        <Shuffle className="h-3.5 w-3.5" /> Yangi savollar
      </button>

      <div className="card space-y-2 p-4">
        <div className="label">Part 1 · {p1.theme}</div>
        <ul className="space-y-1 text-sm">{p1.questions.map((q, i) => <li key={i}>{i + 1}. {q}</li>)}</ul>
        <VoiceRecorder key={`1-${p1.id}`} onRecorded={setB1} />
      </div>

      <div className="card space-y-2 p-4">
        <div className="label">Part 2 · {c2.theme}</div>
        <p className="font-semibold">{c2.card}</p>
        <ul className="list-inside list-disc text-sm text-muted">{c2.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
        <VoiceRecorder key={`2-${c2.id}`} onRecorded={setB2} />
      </div>

      <div className="card space-y-2 p-4">
        <div className="label">Part 3 · {p3.theme}</div>
        <ul className="space-y-1 text-sm">{p3.questions.map((q, i) => <li key={i}>{i + 1}. {q}</li>)}</ul>
        <VoiceRecorder key={`3-${p3.id}`} onRecorded={setB3} />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      <button onClick={submit} disabled={!ready || loading} className="btn-primary w-full py-3">
        {loading ? (
          <>
            <Sparkles className="h-4 w-4 animate-pulse" /> 3 qism baholanyapti…
          </>
        ) : (
          <>
            <Layers className="h-4 w-4" /> {ready ? "Full testni baholash" : "Avval 3 qismni ham yozing"}
          </>
        )}
      </button>
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
