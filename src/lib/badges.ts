import "server-only";
import { createClient } from "./supabase/server";
import type { Profile } from "./types";

/** Counts shown as little dots on the bottom-nav (e.g. pending homework,
 * unhandled feedback). */
export async function getNavBadges(profile: Profile): Promise<Record<string, number>> {
  const badges: Record<string, number> = {};
  try {
    const supabase = await createClient();
    if (profile.role === "student") {
      const [{ data: hw }, { data: subs }] = await Promise.all([
        supabase.from("homework").select("id"),
        supabase.from("submissions").select("homework_id").eq("student_id", profile.id),
      ]);
      const done = new Set(((subs as { homework_id: string }[] | null) ?? []).map((s) => s.homework_id));
      const pending = ((hw as { id: string }[] | null) ?? []).filter((h) => !done.has(h.id)).length;
      if (pending > 0) badges["/homework"] = pending;
    } else if (profile.role === "admin" || profile.role === "teacher") {
      const { count } = await supabase
        .from("feedback")
        .select("id", { count: "exact", head: true })
        .eq("handled", false);
      if (count) badges["/feedback"] = count;
    }
  } catch {
    // best-effort; badges are non-critical
  }
  return badges;
}
