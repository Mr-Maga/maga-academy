"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useActionState, useEffect, useRef, useState } from "react";
import { Mic, Square, Sparkles, Eraser } from "lucide-react";
import { SPEAKING_TOPICS, questionForPart } from "@/lib/speaking-questions";
import { AiEvaluationView } from "@/components/ai-evaluation";
import { cn } from "@/lib/utils";
import { checkSpeaking, type SpeakingCheckState } from "./actions";

export function SpeakingClient() {
  const [state, action, pending] = useActionState<SpeakingCheckState, FormData>(checkSpeaking, undefined);
  const [topicId, setTopicId] = useState(SPEAKING_TOPICS[0].id);
  const [part, setPart] = useState<1 | 2 | 3>(2);
  const [answer, setAnswer] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  const recRef = useRef<any>(null);
  const finalRef = useRef("");

  const topic = SPEAKING_TOPICS.find((t) => t.id === topicId) ?? SPEAKING_TOPICS[0];
  const question = questionForPart(topic, part);

  useEffect(() => {
    const w = window as any;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => {
      try {
        recRef.current?.stop();
      } catch {}
    };
  }, []);

  function toggleListening() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    finalRef.current = answer ? answer + " " : "";
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current += t + " ";
        else interim += t;
      }
      setAnswer((finalRef.current + interim).replace(/\s+/g, " ").trimStart());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      {/* Topic + part pickers */}
      <div className="card space-y-3 p-4">
        <label>
          <span className="label">Topic</span>
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="input">
            {SPEAKING_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.theme}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPart(p)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-semibold transition",
                part === p ? "bg-primary text-primary-fg" : "bg-surface text-muted",
              )}
            >
              Part {p}
            </button>
          ))}
        </div>
      </div>

      {/* The question / cue card */}
      <div className="card p-4">
        {part === 2 ? (
          <>
            <p className="font-semibold">{topic.cue.card}</p>
            <p className="mt-2 text-sm text-muted">You should say:</p>
            <ul className="mt-1 list-inside list-disc text-sm text-muted">
              {topic.cue.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {(part === 1 ? topic.part1 : topic.part3).map((q, i) => (
              <li key={i} className="font-medium">
                {i + 1}. {q}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Answer */}
      <form action={action} className="card space-y-3 p-4">
        <input type="hidden" name="part" value={part} />
        <input type="hidden" name="question" value={question} />

        <div className="flex items-center justify-between">
          <span className="label mb-0">Your answer {supported && "(speak or type)"}</span>
          <span className="text-xs text-subtle">{words} words</span>
        </div>

        {supported && (
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "btn w-full py-3",
              listening ? "bg-danger text-white" : "bg-primary text-primary-fg",
            )}
          >
            {listening ? (
              <>
                <Square className="h-5 w-5" /> Stop recording
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" /> Record &amp; transcribe
              </>
            )}
          </button>
        )}
        {!supported && (
          <p className="text-xs text-amber">
            Voice typing isn’t supported in this browser — please type your answer (Chrome supports voice).
          </p>
        )}

        <textarea
          name="answer"
          rows={6}
          required
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="input"
          placeholder="Your spoken answer appears here as you talk — you can edit it too."
        />

        <div className="flex gap-2">
          {answer && (
            <button type="button" onClick={() => setAnswer("")} className="btn-ghost px-3 py-2.5 text-sm">
              <Eraser className="h-4 w-4" /> Clear
            </button>
          )}
          <button type="submit" disabled={pending} className="btn-primary flex-1 py-3">
            {pending ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" /> Evaluating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Get my band score
              </>
            )}
          </button>
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      </form>

      {state?.result && <AiEvaluationView ev={state.result} />}
    </div>
  );
}
