"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { claimRole, type ClaimState } from "./actions";

export function ClaimForm() {
  const [state, action, pending] = useActionState<ClaimState, FormData>(claimRole, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="code">
          Your code
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" />
          <input
            id="code"
            name="code"
            required
            autoFocus
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="input pl-11 tracking-wide"
            placeholder="Enter the code you were given"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <input
          type="checkbox"
          name="is_parent"
          className="mt-0.5 h-5 w-5 accent-[color:var(--color-primary)]"
        />
        <span className="text-sm">
          <span className="font-medium">I am a parent</span>
          <span className="block text-muted">
            Tick this only if you’re a parent using the family code.
          </span>
        </span>
      </label>

      {state?.error && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
