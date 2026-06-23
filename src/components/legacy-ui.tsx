import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVEL_MAP } from "@/lib/constants";
import type { LevelKey } from "@/lib/types";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card p-4", className)}>{children}</div>;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  tone?: "primary" | "amber" | "teal" | "danger";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/15 text-primary-soft",
    amber: "bg-amber/15 text-amber",
    teal: "bg-teal/15 text-teal",
    danger: "bg-danger/15 text-danger",
  };
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-2xl font-bold leading-tight">{value}</div>
        <div className="truncate text-xs text-muted">{hint ?? label}</div>
      </div>
    </div>
  );
}

export function LevelChip({ level, className }: { level: LevelKey | null | undefined; className?: string }) {
  if (!level) {
    return (
      <span className={cn("chip bg-surface text-subtle", className)}>No level</span>
    );
  }
  const l = LEVEL_MAP[level];
  return (
    <span
      className={cn("chip", className)}
      style={{ backgroundColor: `color-mix(in srgb, ${l.cssVar} 18%, transparent)`, color: l.cssVar }}
    >
      <span className="font-semibold">{l.short}</span>
      <span className="opacity-80">{l.label}</span>
    </span>
  );
}

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "amber" | "teal" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: "bg-surface text-muted",
    primary: "bg-primary/15 text-primary-soft",
    amber: "bg-amber/15 text-amber",
    teal: "bg-teal/15 text-teal",
    danger: "bg-danger/15 text-danger",
  };
  return <span className={cn("chip", tones[tone], className)}>{children}</span>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-subtle">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LinkCard({
  href,
  icon: Icon,
  title,
  description,
  tone = "primary",
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: "primary" | "amber" | "teal" | "danger";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/15 text-primary-soft",
    amber: "bg-amber/15 text-amber",
    teal: "bg-teal/15 text-teal",
    danger: "bg-danger/15 text-danger",
  };
  return (
    <Link href={href} className="card flex items-center gap-3 p-4 transition hover:bg-elevated active:scale-[0.99]">
      <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{title}</div>
        {description && <div className="truncate text-xs text-muted">{description}</div>}
      </div>
    </Link>
  );
}
