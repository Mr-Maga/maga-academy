"use client";

import { useActionState, useState } from "react";
import { emailAuth, type AuthState } from "./actions";

export function EmailForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [state, action, pending] = useActionState<AuthState, FormData>(emailAuth, undefined);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="mode" value={mode} />

      {mode === "signup" && (
        <div>
          <label className="label" htmlFor="full_name">
            Full name
          </label>
          <input id="full_name" name="full_name" className="input" placeholder="Ism Familiya" autoComplete="name" />
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input"
          placeholder="••••••••"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {state?.info && <p className="text-sm text-teal">{state.info}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button type="button" className="font-semibold text-primary-soft" onClick={() => setMode("signup")}>
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" className="font-semibold text-primary-soft" onClick={() => setMode("signin")}>
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}
