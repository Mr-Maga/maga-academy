import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

/** Opaque layered card. */
export function Card({ className, interactive, ...props }: DivProps & { interactive?: boolean }) {
  return (
    <div
      className={cn("card p-5", interactive && "card-i cursor-pointer", className)}
      {...props}
    />
  );
}

/** Signature glass surface — lift + hairline + inner light + soft shadow. */
export function Glass({ className, interactive, ...props }: DivProps & { interactive?: boolean }) {
  return (
    <div
      className={cn("glass p-5", interactive && "card-i cursor-pointer", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("mb-3 flex items-center justify-between gap-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-lg font-semibold tracking-tight text-fg", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed text-muted", className)} {...props} />;
}
