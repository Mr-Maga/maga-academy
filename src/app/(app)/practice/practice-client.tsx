"use client";

import { useCallback, useRef, useState } from "react";
import { Keyboard, Mic, Square, Play, RefreshCw, Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordPractice } from "./actions";

const PASSAGES = [
  "The most effective way to improve your English is to practise a little every single day.",
  "Many candidates underestimate the importance of reading the questions carefully before answering.",
  "In the listening section, you should predict the kind of answer that is expected for each gap.",
  "A strong essay presents a clear position and supports it with relevant, specific examples.",
  "Fluency comes from confidence, and confidence comes from consistent, deliberate practice.",
];

const SENTENCES = [
  "I would like to talk about a place that is very special to me.",
  "On the one hand, technology has made communication faster and easier.",
  "To sum up, the advantages clearly outweigh the disadvantages.",
  "Could you possibly explain what you mean by that question?",
  "I have been studying English for several years, and I enjoy it.",
];

export function PracticeClient({ initialStreak }: { initialStreak: number }) {
  const [tab, setTab] = useState<"typing" | "shadowing">("typing");
  const [streak, setStreak] = useState(initialStreak);
  const [celebrate, setCelebrate] = useState(false);

  const onComplete = useCallback(async () => {
    const res = await recordPractice();
    setStreak(res.streak);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2500);
  }, []);

  return (
    <div className="space-y-4">
      {celebrate && (
        <div className="card flex items-center gap-2 border-amber/40 bg-amber/10 p-3 text-sm font-medium text-amber">
          <Flame className="h-5 w-5" /> Nice! Streak is now {streak} day{streak === 1 ? "" : "s"} 🔥
        </div>
      )}

      <div className="flex gap-2 rounded-xl bg-surface p-1">
        <TabBtn active={tab === "typing"} onClick={() => setTab("typing")} icon={<Keyboard className="h-4 w-4" />}>
          Typing
        </TabBtn>
        <TabBtn active={tab === "shadowing"} onClick={() => setTab("shadowing")} icon={<Mic className="h-4 w-4" />}>
          Shadowing
        </TabBtn>
      </div>

      {tab === "typing" ? <TypingTrainer onComplete={onComplete} /> : <ShadowingTrainer onComplete={onComplete} />}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition",
        active ? "bg-primary text-primary-fg" : "text-muted hover:text-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ------------------------------ Typing ------------------------------ */
function TypingTrainer({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * PASSAGES.length));
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const completedRef = useRef(false);
  const target = PASSAGES[idx];

  let correct = 0;
  for (let i = 0; i < input.length && i < target.length; i++) if (input[i] === target[i]) correct++;
  const accuracy = input.length ? Math.round((correct / input.length) * 100) : 100;
  const minutes = start ? (Date.now() - start) / 60000 : 0;
  const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0;
  const done = input.length >= target.length;

  if (done && !completedRef.current) {
    completedRef.current = true;
    void onComplete();
  }

  function reset() {
    setInput("");
    setStart(null);
    completedRef.current = false;
    setIdx(Math.floor(Math.random() * PASSAGES.length));
  }

  return (
    <div className="card space-y-3 p-4">
      <p className="font-mono text-[15px] leading-relaxed">
        {target.split("").map((ch, i) => {
          const typed = i < input.length;
          const ok = typed && input[i] === ch;
          return (
            <span
              key={i}
              className={cn(
                typed ? (ok ? "text-teal" : "rounded bg-danger/30 text-danger") : "text-subtle",
              )}
            >
              {ch}
            </span>
          );
        })}
      </p>

      <textarea
        value={input}
        onChange={(e) => {
          if (!start && e.target.value.length > 0) setStart(Date.now());
          setInput(e.target.value);
        }}
        rows={3}
        disabled={done}
        autoFocus
        className="input font-mono disabled:opacity-70"
        placeholder="Start typing the sentence above…"
      />

      <div className="grid grid-cols-3 gap-2 text-center">
        <Metric label="WPM" value={wpm} />
        <Metric label="Accuracy" value={`${accuracy}%`} />
        <Metric label="Chars" value={`${input.length}/${target.length}`} />
      </div>

      {done ? (
        <div className="space-y-2">
          <div className="rounded-xl bg-teal/10 px-3 py-2 text-center text-sm font-medium text-teal">
            <Check className="mr-1 inline h-4 w-4" /> Done — {wpm} WPM, {accuracy}% accuracy
          </div>
          <button onClick={reset} className="btn-ghost w-full">
            <RefreshCw className="h-4 w-4" /> New sentence
          </button>
        </div>
      ) : (
        <button onClick={reset} className="text-sm text-muted">
          Skip / new sentence
        </button>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface py-2.5">
      <div className="text-xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted">{label}</div>
    </div>
  );
}

/* ----------------------------- Shadowing ----------------------------- */
function ShadowingTrainer({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function startRec() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      setError("Microphone permission is needed for shadowing.");
    }
  }

  function stopRec() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  function next() {
    setAudioUrl(null);
    setIdx((i) => (i + 1) % SENTENCES.length);
  }

  return (
    <div className="card space-y-4 p-4">
      <div>
        <div className="text-xs font-medium text-muted">Read this aloud, record, then listen back:</div>
        <p className="mt-1 text-lg font-medium leading-relaxed">“{SENTENCES[idx]}”</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        {!recording ? (
          <button onClick={startRec} className="btn-primary px-5 py-3">
            <Mic className="h-5 w-5" /> Record
          </button>
        ) : (
          <button onClick={stopRec} className="btn px-5 py-3 bg-danger text-white">
            <Square className="h-5 w-5" /> Stop
          </button>
        )}
      </div>

      {error && <p className="text-center text-sm text-danger">{error}</p>}

      {audioUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-teal">
            <Play className="h-4 w-4" /> Your recording
          </div>
          <audio src={audioUrl} controls className="w-full" />
          <button
            onClick={() => {
              void onComplete();
              next();
            }}
            className="btn-ghost w-full"
          >
            <Check className="h-4 w-4" /> I practised this — next sentence
          </button>
        </div>
      )}

      {!audioUrl && (
        <button onClick={next} className="w-full text-center text-sm text-muted">
          Skip to next sentence
        </button>
      )}
    </div>
  );
}
