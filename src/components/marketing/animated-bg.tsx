"use client";

import { useMemo } from "react";

/** Deterministic PRNG — identical output on server + client (no hydration mismatch). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GLYPHS = ["Aa", "Bb", "Cc", "Dd", "Hello", "Fluent", "Speak", "Words", "Learn", "Listen", "Grammar", "Rr"];

/**
 * The living background — drifting ghost-glyphs, twinkling particles, soft
 * outlined orbits, and violet+teal nebula glows. Fixed, behind content,
 * non-interactive. All motion stops under prefers-reduced-motion (global rule).
 */
export function AnimatedBg({ seed = 11 }: { seed?: number }) {
  const rand = useMemo(() => mulberry32(seed), [seed]);

  const glyphs = useMemo(
    () =>
      GLYPHS.map((g, i) => ({
        text: g,
        top: 6 + rand() * 86,
        left: rand() * 92,
        size: 60 + rand() * 120,
        rot: -16 + rand() * 32,
        dur: 9 + rand() * 10,
        delay: rand() * 6,
        op: 0.025 + rand() * 0.035,
        key: i,
      })),
    [rand],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const bright = rand() > 0.84;
        const hue = rand();
        return {
          key: i,
          top: rand() * 100,
          left: rand() * 100,
          size: bright ? 2 + rand() * 2 : 0.7 + rand() * 1.3,
          dur: 2.6 + rand() * 4,
          delay: rand() * 6,
          color: hue > 0.66 ? "#22D3EE" : hue > 0.33 ? "#A78BFA" : "#FFFFFF",
          bright,
        };
      }),
    [rand],
  );

  const orbits = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        key: i,
        top: rand() * 90,
        left: rand() * 90,
        size: 160 + rand() * 320,
        dur: 16 + rand() * 14,
        delay: rand() * 4,
      })),
    [rand],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Nebula glows */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(46rem 34rem at 78% 4%, rgba(124,92,255,0.30), transparent 60%)," +
            "radial-gradient(34rem 30rem at 10% 26%, rgba(34,211,238,0.16), transparent 60%)," +
            "radial-gradient(30rem 26rem at 92% 64%, rgba(232,121,249,0.12), transparent 62%)",
        }}
      />

      {/* Soft outlined orbits */}
      {orbits.map((o) => (
        <span
          key={`o${o.key}`}
          className="absolute rounded-full"
          style={{
            top: `${o.top}%`,
            left: `${o.left}%`,
            width: o.size,
            height: o.size,
            border: "1px solid rgba(255,255,255,0.05)",
            animation: `drift ${o.dur}s ease-in-out ${o.delay}s infinite`,
          }}
        />
      ))}

      {/* Ghost glyphs — outer holds the static tilt, inner floats vertically */}
      {glyphs.map((g) => (
        <span
          key={`g${g.key}`}
          className="absolute"
          style={{ top: `${g.top}%`, left: `${g.left}%`, transform: `rotate(${g.rot}deg)` }}
        >
          <span
            className="font-display block font-bold leading-none"
            style={{
              fontSize: g.size,
              color: "#FFFFFF",
              opacity: g.op,
              animation: `glyph-float ${g.dur}s ease-in-out ${g.delay}s infinite`,
            }}
          >
            {g.text}
          </span>
        </span>
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <span
          key={`p${p.key}`}
          className="absolute rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: p.bright ? `0 0 8px 1px ${p.color}` : undefined,
            animation: `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
