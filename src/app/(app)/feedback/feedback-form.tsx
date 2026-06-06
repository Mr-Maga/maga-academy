"use client";

import { useActionState, useRef, useEffect } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitFeedback, type FeedbackState } from "./actions";

export function FeedbackForm({ isParent }: { isParent: boolean }) {
  const [state, action, pending] = useActionState<FeedbackState, FormData>(submitFeedback, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form ref={formRef} action={action} className="card space-y-3 p-4">
      <h2 className="font-semibold">{isParent ? "Send a message / complaint" : "Weekly feedback"}</h2>
      <p className="text-sm text-muted">
        {isParent
          ? "Tell the centre about anything — it reaches the admin directly."
          : "How is the platform working for you? Share feedback or an idea — what should we add or improve?"}
      </p>
      <select name="kind" defaultValue={isParent ? "complaint" : "feedback"} className="input" aria-label="Message type">
        {isParent ? (
          <>
            <option value="complaint">Complaint / message</option>
            <option value="suggestion">Suggestion for the app</option>
          </>
        ) : (
          <>
            <option value="feedback">Feedback</option>
            <option value="suggestion">Suggestion for the app</option>
          </>
        )}
      </select>
      <textarea
        name="message"
        rows={4}
        required
        className="input"
        placeholder={isParent ? "Write your message…" : "Your feedback or an idea to improve the app…"}
      />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {state?.ok && (
        <p className="flex items-center gap-1.5 text-sm text-teal">
          <CheckCircle2 className="h-4 w-4" /> Sent — thank you!
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
        <Send className="h-4 w-4" /> {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
