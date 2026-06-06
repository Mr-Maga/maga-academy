"use client";

import { useEffect, useRef, useState } from "react";
import { Send, GraduationCap } from "lucide-react";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Men Maga — sizning AI o‘qituvchingiz. Istalgan narsani so‘rang: grammatika qoidasi, lug‘at, IELTS strategiyasi yoki “band’imni qanday ko‘taraman?”. Murakkab savoldan ham qo‘rqmang. 🙂",
};

const EXAMPLES = [
  "Passive voice’ni oddiy qilib tushuntir",
  "Band’imni 1 pog‘ona qanday ko‘taraman?",
  "Present Perfect va Past Simple farqi",
  "True / False / Not Given strategiyasi",
  "Writing Task 2 uchun 5 ta kuchli bog‘lovchi",
];

export function TeacherChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "…" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Kechirasiz, qayta urinib ko‘ring." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-fg"
                  : "max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-surface px-3.5 py-2.5 text-sm leading-relaxed"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-surface px-3.5 py-2.5 text-sm text-muted">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-subtle" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-subtle [animation-delay:0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-subtle [animation-delay:0.3s]" />
              </span>
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {EXAMPLES.map((q) => (
              <button
                key={q}
                onClick={() => void send(q)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-left text-xs font-medium text-muted transition hover:text-fg"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Savolingizni yozing…"
            className="input max-h-28 flex-1 resize-none py-2.5"
          />
          <button
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="btn-primary grid h-11 w-11 shrink-0 place-items-center rounded-full p-0 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-subtle">
          <GraduationCap className="h-3 w-3" /> AI o‘qituvchi — sizning darajangizga moslab javob beradi.
        </p>
      </div>
    </div>
  );
}
