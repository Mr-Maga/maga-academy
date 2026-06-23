import { cn } from "@/lib/utils";

/**
 * The maga wordmark — lowercase, display font, with a spark dot on the 'a'.
 * A real wordmark instantly reads "product," not "template."
 */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const dot = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-2.5 w-2.5" };
  return (
    <span
      className={cn(
        "font-display inline-flex select-none items-end font-bold leading-none tracking-tight text-fg",
        sizes[size],
        className,
      )}
    >
      maga
      <span
        aria-hidden
        className={cn(
          "ml-0.5 mb-[0.15em] rounded-full bg-amber",
          dot[size],
        )}
        style={{ boxShadow: "0 0 12px 1px rgba(255,176,32,0.7)" }}
      />
    </span>
  );
}
