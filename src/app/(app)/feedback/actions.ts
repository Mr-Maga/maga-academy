"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/dal";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { geminiConfigured, geminiGenerate } from "@/lib/gemini";
import { isStaff, ROLE_LABELS } from "@/lib/constants";
import type { FeedbackKind } from "@/lib/types";

export type FeedbackState = { error?: string; ok?: boolean } | undefined;

export async function submitFeedback(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please sign in again." };

  const message = String(formData.get("message") ?? "").trim();
  if (message.length < 3) return { error: "Please write a longer message." };

  // Parents file complaints; students send platform feedback. Either can send a
  // product suggestion.
  const requested = String(formData.get("kind") ?? "");
  const allowed: FeedbackKind[] = profile.role === "parent" ? ["complaint", "suggestion"] : ["feedback", "suggestion"];
  const kind: FeedbackKind = (allowed as string[]).includes(requested)
    ? (requested as FeedbackKind)
    : allowed[0];

  const supabase = await createClient();
  const { error } = await supabase.from("feedback").insert({
    user_id: profile.id,
    kind,
    source: "web",
    message,
    level: profile.level,
  });
  if (error) return { error: error.message };

  // Mirror to the centre's Telegram (best effort).
  const who = profile.full_name || profile.email || "Someone";
  const role = profile.role ? ROLE_LABELS[profile.role] : "User";
  await sendTelegramMessage(
    `📨 <b>New ${kind}</b> (${role})\n<b>${escapeHtml(who)}</b>\n\n${escapeHtml(message)}`,
  );

  revalidatePath("/feedback");
  return { ok: true };
}

export async function markHandled(formData: FormData) {
  const supabase = await createClient();
  const profile = await getProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) return;
  const id = String(formData.get("feedback_id") ?? "");
  const handled = String(formData.get("handled") ?? "true") === "true";
  if (id) await supabase.from("feedback").update({ handled }).eq("id", id);
  revalidatePath("/feedback");
}

/** Staff-only: AI summary of recent complaints & feedback. */
export async function summariseFeedback(): Promise<{ summary?: string; error?: string }> {
  const profile = await getProfile();
  if (!profile || !isStaff(profile.role)) return { error: "Not allowed." };
  if (!geminiConfigured()) return { error: "AI is not configured yet (add GEMINI_API_KEY)." };

  const supabase = await createClient();
  const { data } = await supabase
    .from("feedback")
    .select("kind, message")
    .order("created_at", { ascending: false })
    .limit(50);
  const items = (data as { kind: string; message: string }[] | null) ?? [];
  if (items.length === 0) return { summary: "No feedback to summarise yet." };

  const list = items.map((f, i) => `${i + 1}. [${f.kind}] ${f.message}`).join("\n");
  try {
    const summary = await geminiGenerate({
      system:
        "You analyse student and parent feedback for a language academy. Reply in clear English using short bullet points.",
      messages: [
        {
          role: "user",
          content: `Summarise these ${items.length} messages for the admin. Provide: 1) top themes, 2) any urgent complaints, 3) app/product improvement ideas users mention (what to add or fix), 4) three concrete suggested actions.\n\n${list}`,
        },
      ],
      temperature: 0.3,
    });
    return { summary };
  } catch {
    return { error: "AI request failed. Please try again." };
  }
}
