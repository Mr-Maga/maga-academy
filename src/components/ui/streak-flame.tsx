"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Streak flame — amber, gently breathing. Intensifies with streak length.
 * The "lit" state pops; an unlit (0) streak is dim to create the pull to return.
 */
export function StreakFlame({
  days,
  size = "md",
  className,
}: {
  days: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const lit = days > 0;
  const px = { sm: 14, md: 18, lg: 24 }[size];
  const text = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];

  // Glow grows with streak (capped).
  const intensity = Math.min(1, days / 30);
  const glow = lit ? `0 0 ${6 + intensity * 14}px rgba(255,176,32,${0.4 + intensity * 0.4})` : "none";

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold", text, className)}>
      <span
        className="inline-flex"
        style={{
          color: lit ? "var(--color-amber)" : "var(--color-subtle)",
          filter: glow === "none" ? undefined : `drop-shadow(${glow})`,
          animation: lit ? "var(--animate-flame)" : undefined,
          transformOrigin: "center bottom",
        }}
      >
        <Flame size={px} strokeWidth={1.5} fill={lit ? "rgba(255,176,32,0.25)" : "none"} />
      </span>
      <span className="tnum" style={{ color: lit ? "var(--color-fg)" : "var(--color-subtle)" }}>
        {days}
      </span>
    </span>
  );
}
