import { cn } from "@/lib/utils";

/** A labelled stat with a tabular number that won't jitter on update. */
export function Stat({
  label,
  value,
  hint,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: "primary" | "amber" | "success";
  className?: string;
}) {
  const accentColor =
    accent === "primary" ? "var(--color-primary-soft)"
    : accent === "amber" ? "var(--color-amber)"
    : accent === "success" ? "var(--color-success)"
    : "var(--color-fg)";
  return (
    <div className={cn("card p-4", className)}>
      <div className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</div>
      <div
        className="font-display tnum mt-1 text-2xl font-bold leading-none"
        style={{ color: accentColor }}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}
