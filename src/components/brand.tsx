import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-2xl font-black text-primary-fg shadow-lg shadow-primary/30",
        className,
      )}
      style={{ backgroundImage: "linear-gradient(135deg, #0d9488, #14b8a6 50%, #2dd4bf)" }}
    >
      <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/25 blur-md" />
      <span className="relative leading-none">M</span>
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
