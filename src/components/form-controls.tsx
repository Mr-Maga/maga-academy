"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A <select> that submits its enclosing form as soon as the value changes. */
export function AutoSubmitSelect({
  name,
  defaultValue,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  name: string;
  defaultValue?: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      aria-label={ariaLabel}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={cn(
        "rounded-lg border border-border bg-input px-2.5 py-1.5 text-sm text-fg outline-none focus:border-primary-soft",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function SubmitButton({
  children,
  className,
  pendingLabel,
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(className, pending && "opacity-60")}>
      {pending ? (pendingLabel ?? "…") : children}
    </button>
  );
}
