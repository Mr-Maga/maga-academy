"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * XP / progress bar. Fills with an animated brand-gradient sheen sweeping
 * across; the fill width eases to its value on mount.
 */
export function XPBar({
  value,
  max = 100,
  label,
  showValue,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const [w, setW] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setW(pct); return; }
    const id = requestAnimationFrame(() => setW(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-muted">{label}</span>}
          {showValue && (
            <span className="tnum text-subtle">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className={cn("bar-fill h-full rounded-full")}
          style={{ width: `${w}%`, transition: "width 1s var(--ease-out-quint)" }}
        />
      </div>
    </div>
  );
}
