import { Lock as LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lock overlay for gated content. The item still renders (to create desire)
 * but is dimmed with a 🔒 + Upgrade affordance. Color is never the only signal.
 */
export function Lock({
  label = "Premium",
  className,
  onUpgrade,
}: {
  label?: string;
  className?: string;
  onUpgrade?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl backdrop-blur-[3px]",
        className,
      )}
      style={{ background: "rgba(10,10,13,0.55)" }}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full text-amber"
        style={{ backgroundColor: "rgba(255,176,32,0.14)", border: "1px solid rgba(255,176,32,0.3)" }}
      >
        <LockIcon size={18} strokeWidth={1.5} />
      </span>
      <span className="text-xs font-semibold text-fg">{label}</span>
      {onUpgrade}
    </div>
  );
}
