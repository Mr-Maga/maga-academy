"use client";

/**
 * Rotating skill-words strip — seamless horizontal scroll (the "aylanib
 * o'tiribdi yozuvlar"). Two identical halves slide -50% for an infinite loop.
 * Pauses under prefers-reduced-motion (global rule kills the animation).
 */
export function Marquee({ items }: { items: string[] }) {
  const half = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display whitespace-nowrap px-7 text-2xl font-semibold text-muted sm:text-3xl">
            {it}
          </span>
          <span aria-hidden className="text-sm" style={{ color: "var(--color-cyan)" }}>
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="marquee-mask relative w-full overflow-hidden border-y py-5"
      style={{ borderColor: "var(--color-border)", background: "rgba(255,255,255,0.012)" }}
    >
      <div className="marquee-track">
        {half}
        {half}
      </div>
    </div>
  );
}
