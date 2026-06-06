import "server-only";
import { createClient } from "./supabase/server";
import { ACADEMY_DEFAULTS } from "./academy";
import type { AcademyInfo } from "./types";

/** Read academy info from app_settings, falling back to code defaults. */
export async function getAcademyInfo(): Promise<AcademyInfo> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
    const d = ((data as { data?: Partial<AcademyInfo> } | null)?.data ?? {}) as Partial<AcademyInfo>;
    return {
      name: d.name || ACADEMY_DEFAULTS.name,
      about: d.about || ACADEMY_DEFAULTS.about,
      contactTelegram: d.contactTelegram || ACADEMY_DEFAULTS.contactTelegram,
      schedule: d.schedule || ACADEMY_DEFAULTS.schedule,
      prices:
        Array.isArray(d.prices) && d.prices.length ? (d.prices as AcademyInfo["prices"]) : ACADEMY_DEFAULTS.prices,
    };
  } catch {
    return ACADEMY_DEFAULTS;
  }
}
