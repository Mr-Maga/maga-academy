"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastTone = "success" | "danger" | "info";
interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

const ToastCtx = createContext<{ toast: (t: Omit<Toast, "id">) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const icons = { success: CheckCircle2, danger: AlertTriangle, info: Info };
const toneColor: Record<ToastTone, string> = {
  success: "var(--color-success)",
  danger: "var(--color-danger)",
  info: "var(--color-info)",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0.75rem)" }}
      >
        {items.map((t) => {
          const Icon = icons[t.tone];
          return (
            <div
              key={t.id}
              className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 p-3.5"
              style={{ animation: "fade-up 0.35s var(--ease-out-quint) both" }}
            >
              <Icon size={18} style={{ color: toneColor[t.tone] }} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-fg">{t.title}</div>
                {t.description && <div className="mt-0.5 text-xs text-muted">{t.description}</div>}
              </div>
              <button
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-subtle hover:text-fg"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
