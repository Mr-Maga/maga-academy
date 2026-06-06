"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Assalomu alaykum! Men Maga — sizning ingliz tili va IELTS yordamchingizman. Grammatika, lug‘at, yozuv yoki gapirish — nima kerak? (Uzbek / Русский / English)",
};

const QUICK_PROMPTS = [
  { label: "📚 Vocabulary", text: "Teach me 5 useful IELTS words with example sentences." },
  { label: "📝 Grammar", text: "Explain a grammar rule I often get wrong, with examples." },
  { label: "🎯 My weak skill", text: "Based on my progress, what should I focus on to improve fastest?" },
  { label: "🗣️ Speaking Q", text: "Ask me one IELTS Speaking Part 2 question, then wait for my answer." },
  { label: "💰 Prices", text: "What are the course prices?" },
];

export function AiTutorLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }), // drop the local greeting
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Kechirasiz, hozir javob bera olmadim.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Tarmoq xatosi. Birozdan keyin urinib ko‘ring." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI tutor"
          className="fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-soft px-4 py-3 font-semibold text-primary-fg shadow-xl shadow-primary/40 transition active:scale-95"
        >
          <Sparkles className="h-5 w-5" />
          Maga AI
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm sm:items-end sm:p-4">
          <div className="card flex h-[80dvh] w-full flex-col overflow-hidden rounded-b-none sm:h-[600px] sm:max-w-md sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-soft text-primary-fg">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">Maga AI Tutor</div>
                  <div className="text-[11px] text-teal">● Online</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-elevated hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-primary text-primary-fg"
                        : "rounded-bl-md bg-surface text-fg",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-sm text-muted">
                    <span className="inline-flex gap-1">
                      <Dot /> <Dot /> <Dot />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => void send(q.text)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition hover:text-fg"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-border bg-surface p-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
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
                  className="input max-h-32 flex-1 resize-none py-2.5"
                />
                <button
                  onClick={() => void send()}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-fg transition active:scale-95 disabled:opacity-40"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-subtle [animation-delay:0ms] [&:nth-child(2)]:[animation-delay:150ms] [&:nth-child(3)]:[animation-delay:300ms]" />;
}
