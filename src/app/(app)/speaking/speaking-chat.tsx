"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, MessageCircle } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function SpeakingChat({
  part,
  question,
  transcript,
  evalSummary,
}: {
  part: number;
  question: string;
  transcript: string;
  evalSummary: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/speaking-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ part, question, transcript, evalSummary, messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "…" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Xatolik. Qayta urinib ko‘ring." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-3 p-4">
      <h3 className="flex items-center gap-1.5 font-semibold text-primary-soft">
        <MessageCircle className="h-4 w-4" /> Maga bilan suhbat — shu javobingiz haqida
      </h3>
      {messages.length === 0 && (
        <p className="text-sm text-muted">
          Savol bering: “Ravonligimni qanday oshiraman?”, “Qaysi tovushni noto‘g‘ri aytdim?”, “Band 8 uchun qanday gapirardim?”…
        </p>
      )}
      {messages.length > 0 && (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user" ? "bg-primary text-white" : "bg-surface"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-surface px-3 py-2 text-sm text-muted">
                <Sparkles className="inline h-4 w-4 animate-pulse" /> …
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Savolingizni yozing…"
          className="input flex-1"
        />
        <button onClick={send} disabled={loading} className="btn-primary px-4" aria-label="Yuborish">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
