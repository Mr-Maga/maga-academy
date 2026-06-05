import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-soft font-black text-primary-fg shadow-lg shadow-primary/30",
        className,
      )}
    >
      <span className="leading-none">M</span>
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo className="h-9 w-9 text-lg" />
      <div className="leading-tight">
        <div className="text-base font-extrabold tracking-tight">Maga Academy</div>
        <div className="text-[11px] font-medium text-muted">IELTS &amp; English</div>
      </div>
    </div>
  );
}
