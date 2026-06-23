"use client";

import { useMemo } from "react";

/** Deterministic PRNG so server and client render identical stars (no hydration mismatch). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Starfield + purple nebula. Fixed, behind all content, non-interactive.
 * Subtle twinkle; killed automatically under prefers-reduced-motion (global rule).
 */
export function Starfield({ count = 90, seed = 7 }: { count?: number; seed?: number }) {
  const stars = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => {
      const bright = rand() > 0.86;
      return {
        top: rand() * 100,
        left: rand() * 100,
        size: bright ? 1.6 + rand() * 1.6 : 0.6 + rand() * 1.2,
        opacity: 0.25 + rand() * 0.6,
        delay: rand() * 6,
        dur: 2.4 + rand() * 4,
        bright,
      };
    });
  }, [count, seed]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Nebula glows — concentrated purple, like the reference */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(38rem 30rem at 50% -6%, rgba(123,97,255,0.28), transparent 60%)," +
            "radial-gradient(30rem 26rem at 12% 18%, rgba(157,123,255,0.16), transparent 60%)," +
            "radial-gradient(34rem 28rem at 88% 30%, rgba(192,132,252,0.14), transparent 62%)",
        }}
      />
      {/* Stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: "#fff",
            opacity: s.opacity,
            boxShadow: s.bright ? "0 0 6px 1px rgba(199,210,254,0.8)" : undefined,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:.18}50%{opacity:.9}}`}</style>
    </div>
  );
}
