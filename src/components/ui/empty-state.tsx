import { cn } from "@/lib/utils";

/** Designed empty state — illustration + one CTA. Never a blank page. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      {icon && (
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-primary-soft"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            border: "1px solid var(--color-border)",
            boxShadow: "inset 0 1px 0 var(--color-highlight)",
          }}
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
