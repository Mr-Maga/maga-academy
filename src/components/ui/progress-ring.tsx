"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SVG progress ring that draws on mount. Used for daily goal, band score, etc.
 * Respects prefers-reduced-motion (snaps to value instead of animating).
 */
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  color = "var(--color-primary)",
  track = "rgba(255,255,255,0.08)",
  children,
  label,
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const [shown, setShown] = useState(0);
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(clamped); return; }
    const id = requestAnimationFrame(() => setShown(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const offset = circ - (shown / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s var(--ease-out-quint)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
        {label && <span className="mt-0.5 text-[10px] uppercase tracking-wide text-subtle">{label}</span>}
      </div>
    </div>
  );
}
