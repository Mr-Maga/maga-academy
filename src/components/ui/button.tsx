import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  subtle: "btn-subtle",
  danger: "btn-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-13 px-6 text-base",
  icon: "h-11 w-11 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, block, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        variantClass[variant],
        sizeClass[size],
        block && "w-full",
        "focus-ring",
        className,
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
});
