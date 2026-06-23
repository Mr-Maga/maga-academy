import { cn } from "@/lib/utils";
import type { Cefr } from "@/lib/design/tokens";

type SpanProps = React.HTMLAttributes<HTMLSpanElement>;

const toneStyles: Record<string, string> = {
  neutral: "bg-white/5 text-muted",
  primary: "bg-primary-dim text-primary-soft",
  amber: "text-amber",
  success: "text-success",
  danger: "text-danger",
};

/** Generic chip / badge. */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: SpanProps & { tone?: keyof typeof toneStyles }) {
  return (
    <span
      className={cn("chip", toneStyles[tone], className)}
      style={tone === "amber" ? { backgroundColor: "rgba(255,176,32,0.14)" } : tone === "success" ? { backgroundColor: "rgba(52,211,153,0.14)" } : tone === "danger" ? { backgroundColor: "rgba(251,113,133,0.14)" } : undefined}
      {...props}
    />
  );
}

/** CEFR level pill, tinted to its level color. */
export function LevelBadge({ level, className }: { level: Cefr; className?: string }) {
  const map: Record<Cefr, string> = {
    A1: "level-a1", A2: "level-a2", B1: "level-b1", B2: "level-b2", C1: "level-c1", C2: "level-c2",
  };
  const v = `var(--color-${map[level]})`;
  return (
    <span
      className={cn("chip", className)}
      style={{ color: v, backgroundColor: "color-mix(in srgb, " + v + " 16%, transparent)" }}
    >
      {level}
    </span>
  );
}

/** "NEW" badge with a soft pulsing ring — for content < 5 days old. */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span className={cn("chip relative", className)} style={{ color: "#0A0A0D", backgroundColor: "var(--color-amber)" }}>
      <span
        aria-hidden
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full"
        style={{ backgroundColor: "var(--color-amber)", animation: "var(--animate-pulse-ring)" }}
      />
      NEW
    </span>
  );
}
