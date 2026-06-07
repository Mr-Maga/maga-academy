"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateAccount, type AccountState } from "./actions";

export function AccountForm({
  fullName,
  phone,
  dailyGoal,
}: {
  fullName: string;
  phone: string;
  dailyGoal: number;
}) {
  const [state, action, pending] = useActionState<AccountState, FormData>(updateAccount, undefined);

  return (
    <form action={action} className="card space-y-4 p-4">
      <div>
        <label className="label" htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" defaultValue={fullName} className="input" placeholder="Ism Familiya" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" defaultValue={phone} className="input" placeholder="+998 90 123 45 67" />
      </div>
      <div>
        <label className="label" htmlFor="daily_goal">Daily practice goal (minutes)</label>
        <input id="daily_goal" name="daily_goal" type="number" min={5} max={240} defaultValue={dailyGoal} className="input" />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {state?.ok && (
        <p className="flex items-center gap-1.5 text-sm text-teal">
          <CheckCircle2 className="h-4 w-4" /> Saved
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
