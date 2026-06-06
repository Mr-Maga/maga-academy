import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Band progress ring (the dashboard centrepiece) --------------- */

export function BandRing({
  band,
  target,
  size = 168,
  stroke = 13,
}: {
  band: number | null;
  target?: number | null;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = band ? Math.min(band / 9, 1) : 0;
  const offset = circ * (1 - pct);

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="60%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#bandGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            ["--ring-circ" as string]: `${circ}px`,
            animation: "ring-draw 1.1s cubic-bezier(0.22,1,0.36,1) both",
            filter: "drop-shadow(0 0 6px rgba(45,212,191,0.45))",
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {band ? (
          <>
            <div className="text-4xl font-extrabold leading-none text-gradient">{band.toFixed(1)}</div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-subtle">Band</div>
            {target && target > band && (
              <div className="mt-1 text-xs font-semibold text-primary-soft">→ {target.toFixed(1)}</div>
            )}
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-muted">—</div>
            <div className="mt-1 px-4 text-[11px] leading-tight text-subtle">Birinchi bandni oling</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Streak flame ---------------- */

export function StreakFlame({ days }: { days: number }) {
  const alive = days > 0;
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-2xl"
        style={alive ? { animation: "var(--animate-flame)", filter: "drop-shadow(0 0 8px rgba(251,146,60,0.6))" } : { filter: "grayscale(1) opacity(0.5)" }}
      >
        🔥
      </span>
      <div className="leading-none">
        <div className="text-xl font-extrabold">{days}</div>
        <div className="text-[11px] text-muted">kun streak</div>
      </div>
    </div>
  );
}

/* ---------------- Compact stat pill ---------------- */

const TONES: Record<string, string> = {
  primary: "text-primary-soft",
  amber: "text-amber",
  teal: "text-teal",
  indigo: "text-indigo",
  rose: "text-rose",
  danger: "text-danger",
};

export function StatPill({
  icon: Icon,
  value,
  label,
  tone = "primary",
}: {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="card flex flex-col gap-1 p-3">
      <Icon className={cn("h-4 w-4", TONES[tone])} />
      <div className="text-xl font-extrabold leading-tight">{value}</div>
      <div className="text-[11px] leading-tight text-muted">{label}</div>
    </div>
  );
}

/* ---------------- XP / daily-goal bar with shimmer ---------------- */

export function XpBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.max(0, Math.min(100, max > 0 ? (value / max) * 100 : 0));
  const done = pct >= 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted">{label}</span>
        <span className="font-semibold text-primary-soft">
          {done ? "✓ Bajarildi!" : `${value} / ${max}`}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-input">
        <div className="bar-fill h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Big gradient action tile ---------------- */

export function ActionTile({
  emoji,
  title,
  subtitle,
  from,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  from: string; // tailwind color token name, e.g. "primary"
}) {
  return (
    <div className={cn("card-i relative flex h-full flex-col gap-1 overflow-hidden p-4")}>
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: `var(--color-${from})` }}
      />
      <span className="text-2xl">{emoji}</span>
      <span className="mt-0.5 font-bold">{title}</span>
      <span className="text-xs text-muted">{subtitle}</span>
    </div>
  );
}
