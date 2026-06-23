"use client";

import { useEffect, useRef, useState } from "react";

/** Number that counts up to its value on mount/change. Tabular, no jitter. */
export function CountUp({
  value,
  duration = 900,
  className,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(value); from.current = value; return; }
    const start = performance.now();
    const startVal = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(startVal + (value - startVal) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
