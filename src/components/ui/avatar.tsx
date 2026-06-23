import { cn } from "@/lib/utils";

/** Avatar with graceful initials fallback. */
export function Avatar({
  src,
  name,
  size = 40,
  className,
  ring,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "·";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-fg",
        ring && "ring-2 ring-primary/60",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: "linear-gradient(135deg, rgba(123,97,255,0.35), rgba(192,132,252,0.2))",
        border: "1px solid var(--color-border)",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" />
      ) : (
        <span className="font-display tracking-tight">{initials}</span>
      )}
    </span>
  );
}
