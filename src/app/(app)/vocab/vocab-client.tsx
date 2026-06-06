"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Sparkles,
  Layers,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  FolderOpen,
  Languages,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { levelLabel } from "@/lib/constants";
import type { VocabCard, VocabStats, VocabSet, VocabLookup, VocabTranslation } from "@/lib/types";
import {
  reviewCard,
  addAiWords,
  createSet,
  deleteSet,
  getSetCards,
  lookupWord,
  addLookupToToday,
  type SetState,
} from "./actions";

type Mode = "home" | "session";

export function VocabClient({
  todayQueue,
  hardQueue,
  stats,
  sets,
  lookups,
}: {
  todayQueue: VocabCard[];
  hardQueue: VocabCard[];
  stats: VocabStats;
  sets: VocabSet[];
  lookups: VocabLookup[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("home");
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [label, setLabel] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ known: 0, unknown: 0 });

  const [pending, startAdd] = useTransition();
  const [opening, startOpen] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [setState, createAction, creating] = useActionState<SetState, FormData>(createSet, undefined);

  // AI translator
  const [tInput, setTInput] = useState("");
  const [tRes, setTRes] = useState<VocabTranslation | null>(null);
  const [tLookupId, setTLookupId] = useState<string | undefined>(undefined);
  const [tLoading, startT] = useTransition();
  const [tMsg, setTMsg] = useState<string | null>(null);

  function doTranslate() {
    if (!tInput.trim()) return;
    setTMsg(null);
    setTRes(null);
    startT(async () => {
      const r = await lookupWord(tInput);
      if (r?.error) setTMsg(r.error);
      else {
        setTRes(r?.result ?? null);
        setTLookupId(r?.lookupId);
      }
    });
  }

  function addToToday(id?: string) {
    if (!id) return;
    startT(async () => {
      const r = await addLookupToToday(id);
      if (r?.ok) {
        setTMsg("✅ Bugungi to‘plamga qo‘shildi");
        setTRes(null);
        setTInput("");
        router.refresh();
      }
    });
  }

  useEffect(() => {
    if (setState?.ok) {
      setShowCreate(false);
      setMsg(`✅ "${setState.setName}" — ${setState.added} ta karta qo‘shildi`);
      router.refresh();
    } else if (setState?.error) {
      setMsg(setState.error);
    }
  }, [setState, router]);

  function start(cards: VocabCard[], lbl: string) {
    if (!cards.length) return;
    setQueue(cards);
    setLabel(lbl);
    setIndex(0);
    setFlipped(false);
    setScore({ known: 0, unknown: 0 });
    setMode("session");
  }

  function grade(known: boolean) {
    const card = queue[index];
    if (card) void reviewCard(card.id, known).catch(() => {});
    setScore((s) => ({ known: s.known + (known ? 1 : 0), unknown: s.unknown + (known ? 0 : 1) }));
    if (index < queue.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setIndex(queue.length);
    }
  }

  function move(dir: -1 | 1) {
    setIndex((i) => Math.min(Math.max(i + dir, 0), queue.length - 1));
    setFlipped(false);
  }

  function goHome() {
    setMode("home");
    router.refresh();
  }

  function openSet(set: VocabSet) {
    setMsg(null);
    startOpen(async () => {
      const cards = await getSetCards(set.id);
      if (cards.length) start(cards, set.name);
      else setMsg("Bu to‘plam hali bo‘sh.");
    });
  }

  function onAddAi() {
    setMsg(null);
    startAdd(async () => {
      const r = await addAiWords();
      if (r?.error) setMsg(r.error);
      else {
        setMsg(`✅ ${r?.added ?? 0} ta yangi so‘z qo‘shildi`);
        router.refresh();
      }
    });
  }

  // ---------------- SESSION (Quizlet-style) ----------------
  if (mode === "session") {
    if (index >= queue.length) {
      return (
        <div className="card space-y-4 p-6 text-center">
          <div className="text-4xl">🎉</div>
          <h2 className="text-lg font-bold">{label} tugadi!</h2>
          <div className="flex justify-center gap-6">
            <div>
              <div className="text-2xl font-extrabold text-teal">{score.known}</div>
              <div className="text-xs text-muted">Bilaman</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-danger">{score.unknown}</div>
              <div className="text-xs text-muted">Bilmadim</div>
            </div>
          </div>
          <button onClick={goHome} className="btn-primary w-full py-3">
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
        </div>
      );
    }

    const card = queue[index];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted">
          <button onClick={goHome} className="inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Chiqish
          </button>
          <span>{label}</span>
          <span>
            {index + 1} / {queue.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((index + 1) / queue.length) * 100}%` }}
          />
        </div>

        {/* Flip card (inline styles incl. -webkit- so it works in Safari) */}
        <div style={{ perspective: "1200px" }}>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="relative block h-72 w-full"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transition: "transform 0.5s",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              WebkitTransform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="card absolute inset-0 grid place-items-center p-6"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="text-center">
                <div className="text-3xl font-extrabold">{card.word}</div>
                <div className="mt-3 text-xs text-subtle">Aylantirish uchun bosing</div>
              </div>
            </div>
            {/* Back */}
            <div
              className="card absolute inset-0 flex flex-col gap-2 overflow-y-auto p-5 text-left"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                WebkitTransform: "rotateY(180deg)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{card.word}</span>
                {card.level && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary-soft">
                    {levelLabel(card.level)}
                  </span>
                )}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-subtle">Meaning</div>
                <p className="text-sm text-fg/90">{card.meaning}</p>
              </div>
              {card.example && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-subtle">Example</div>
                  <p className="text-sm italic text-muted">“{card.example}”</p>
                </div>
              )}
              {card.translation && (
                <div className="mt-auto rounded-lg bg-primary/10 px-3 py-2 text-center font-semibold text-primary-soft">
                  {card.translation}
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => move(-1)}
            disabled={index === 0}
            className="btn-ghost h-10 w-10 rounded-full p-0 disabled:opacity-40"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs text-subtle">oldinga / orqaga</span>
          <button
            onClick={() => move(1)}
            disabled={index === queue.length - 1}
            className="btn-ghost h-10 w-10 rounded-full p-0 disabled:opacity-40"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Grade */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => grade(false)} className="btn bg-danger py-3.5 text-white">
            <X className="h-5 w-5" /> Bilmadim
          </button>
          <button onClick={() => grade(true)} className="btn bg-teal py-3.5 text-white">
            <Check className="h-5 w-5" /> Bilaman
          </button>
        </div>
      </div>
    );
  }

  // ---------------- HOME ----------------
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-2">
        <Stat label="Bugun" value={stats.due + stats.newCount} tone="text-primary-soft" />
        <Stat label="O‘rganilyapti" value={stats.learning} tone="text-amber" />
        <Stat label="Bilaman" value={stats.known} tone="text-teal" />
        <Stat label="Qiyin" value={stats.hard} tone="text-danger" />
      </div>

      <button
        onClick={() => start(todayQueue, "Bugungi takror")}
        disabled={todayQueue.length === 0}
        className="card flex w-full items-center gap-4 bg-gradient-to-br from-primary/20 to-transparent p-5 text-left transition enabled:hover:bg-elevated disabled:opacity-60"
      >
        <Layers className="h-8 w-8 text-primary-soft" />
        <div className="flex-1">
          <div className="font-bold">Bugungi takror</div>
          <div className="text-sm text-muted">
            {todayQueue.length > 0 ? `${todayQueue.length} ta karta tayyor` : "Bugun hammasi tugadi 🎉"}
          </div>
        </div>
      </button>

      <button
        onClick={() => start(hardQueue, "Bilmaganlarim")}
        disabled={hardQueue.length === 0}
        className="card flex w-full items-center gap-4 p-5 text-left transition enabled:hover:bg-elevated disabled:opacity-60"
      >
        <AlertCircle className="h-8 w-8 text-danger" />
        <div className="flex-1">
          <div className="font-bold">Bilmaganlarim</div>
          <div className="text-sm text-muted">
            {hardQueue.length > 0 ? `${hardQueue.length} ta qiyin so‘z — takrorlang` : "Hozircha bo‘sh"}
          </div>
        </div>
      </button>

      {/* My sets */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Mening to‘plamlarim</h2>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-fg"
          >
            <Plus className="h-4 w-4" /> Yangi
          </button>
        </div>

        {showCreate && (
          <form action={createAction} className="card mb-3 space-y-3 p-4">
            <div>
              <span className="label">To‘plam nomi</span>
              <input name="name" required maxLength={60} className="input" placeholder="masalan: day1 yoki for writing" />
            </div>
            <div>
              <span className="label">Inglizcha so‘zlar (har qatorga yoki vergul bilan)</span>
              <textarea
                name="words"
                rows={4}
                required
                className="input"
                placeholder={"apple\nachieve\nreluctant\n…"}
              />
              <p className="mt-1 text-[11px] text-subtle">
                AI o‘zi tarjima, meaning, misol va darajani to‘ldiradi.
              </p>
            </div>
            <button type="submit" disabled={creating} className="btn-primary w-full py-2.5">
              {creating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" /> AI to‘ldiryapti…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> To‘plam yaratish
                </>
              )}
            </button>
          </form>
        )}

        {sets.length === 0 && !showCreate ? (
          <p className="text-sm text-muted">Hali to‘plam yo‘q. “Yangi” bosib o‘z to‘plamingizni yarating.</p>
        ) : (
          <div className="space-y-2">
            {sets.map((s) => (
              <div key={s.id} className="card flex items-center gap-3 p-3">
                <button
                  onClick={() => openSet(s)}
                  disabled={opening}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <FolderOpen className="h-5 w-5 text-amber" />
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted">{s.count} ta so‘z</div>
                  </div>
                </button>
                <button
                  onClick={() => deleteSet(s.id).then(() => router.refresh())}
                  className="text-subtle hover:text-danger"
                  aria-label="Delete set"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI Translator */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Languages className="h-5 w-5 text-primary-soft" />
          <h2 className="font-semibold">AI Tarjimon</h2>
        </div>
        <div className="flex gap-2">
          <input
            value={tInput}
            onChange={(e) => setTInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doTranslate();
              }
            }}
            placeholder="So‘z yoki ibora — uz / ru / en"
            className="input flex-1"
          />
          <button onClick={doTranslate} disabled={tLoading} className="btn-primary px-4">
            {tLoading ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        {tRes && (
          <div className="card space-y-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{tRes.word}</span>
              {tRes.level && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary-soft">
                  {tRes.level}
                </span>
              )}
            </div>
            <p className="text-sm text-fg/90">{tRes.meaning}</p>
            {tRes.example && <p className="text-sm italic text-muted">“{tRes.example}”</p>}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-semibold text-primary-soft">
                🇺🇿 {tRes.translation}
              </span>
              {tRes.translation_ru && (
                <span className="rounded-lg bg-surface px-2.5 py-1 text-muted">🇷🇺 {tRes.translation_ru}</span>
              )}
            </div>
            <button onClick={() => addToToday(tLookupId)} disabled={tLoading} className="btn bg-teal py-2.5 text-white">
              <Plus className="h-4 w-4" /> Bugungi to‘plamga qo‘shish
            </button>
          </div>
        )}
        {tMsg && <p className="text-sm text-muted">{tMsg}</p>}

        {lookups.length > 0 && (
          <div>
            <div className="mb-1.5 text-xs font-semibold text-subtle">Tarix</div>
            <div className="space-y-1.5">
              {lookups.map((l) => (
                <div key={l.id} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
                  <span className="font-medium">{l.result.word}</span>
                  <span className="truncate text-muted">— {l.result.translation}</span>
                  {l.added ? (
                    <Check className="ml-auto h-4 w-4 shrink-0 text-teal" />
                  ) : (
                    <button
                      onClick={() => addToToday(l.id)}
                      className="ml-auto shrink-0 text-primary-soft"
                      aria-label="Bugungi to‘plamga qo‘shish"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* AI random words */}
      <div className="space-y-2">
        <button onClick={onAddAi} disabled={pending} className="btn-ghost w-full py-3">
          {pending ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Qo‘shilyapti…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> AI: darajamga mos 10 ta yangi so‘z qo‘sh
            </>
          )}
        </button>
        {msg && <p className="text-center text-sm text-muted">{msg}</p>}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="card p-2.5 text-center">
      <div className={cn("text-xl font-extrabold", tone)}>{value}</div>
      <div className="text-[10px] leading-tight text-muted">{label}</div>
    </div>
  );
}
