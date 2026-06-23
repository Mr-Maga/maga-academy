"use client";

import { useEffect, useState } from "react";

/**
 * Completion moment — a checkmark that draws + a restrained confetti burst.
 * Earned, not constant. Render when a lesson/test is finished.
 */
export function CompletionMoment({
  show,
  title = "Nice work!",
  subtitle,
}: {
  show: boolean;
  title?: string;
  subtitle?: string;
}) {
  const [pieces, setPieces] = useState<{ id: number; left: number; delay: number; color: string; dur: number }[]>([]);

  useEffect(() => {
    if (!show) { setPieces([]); return; }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const colors = ["#7B61FF", "#C084FC", "#FFB020", "#34D399", "#60A5FA"];
    setPieces(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        dur: 0.9 + Math.random() * 0.7,
        color: colors[i % colors.length],
      })),
    );
  }, [show]);

  if (!show) return null;

  return (
    <div className="pointer-events-none relative flex flex-col items-center justify-center py-6">
      <div className="absolute inset-0 overflow-hidden">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 h-2 w-1.5 rounded-sm"
            style={{
              left: `${p.left}%`,
              background: p.color,
              animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in forwards`,
            }}
          />
        ))}
      </div>
      <svg width="64" height="64" viewBox="0 0 64 64" className="relative">
        <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-success)" strokeWidth="3" opacity="0.25" />
        <path
          d="M20 33 L29 42 L45 24"
          fill="none"
          stroke="var(--color-success)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: "draw-check 0.5s 0.15s var(--ease-out-quint) forwards" }}
        />
      </svg>
      <div className="font-display mt-3 text-xl font-bold tracking-tight text-fg">{title}</div>
      {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
    </div>
  );
}
