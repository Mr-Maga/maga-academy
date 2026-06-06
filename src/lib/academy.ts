import type { AcademyInfo } from "./types";

// ─────────────────────────────────────────────────────────────
// Default academy facts. Admins can override these in-app
// (Manage → Academy info), which is stored in the app_settings table.
// ─────────────────────────────────────────────────────────────

export const ACADEMY_DEFAULTS: AcademyInfo = {
  name: "Maga Academy",
  about: "An IELTS & English language centre. Levels from Beginner (A1) up to IELTS.",
  contactTelegram: "@maga_academy",
  schedule: "Group classes run on weekdays; ask the centre for the timetable that fits your level.",
  prices: [
    { plan: "IELTS", price: "800 000 so'm / oy" },
    { plan: "CEFR", price: "600 000 so'm / oy" },
    { plan: "General English (A1–B2)", price: "500 000 so'm / oy" },
  ],
};

/** Compact academy facts injected into the AI tutor's system prompt. */
export function academyInfoForPrompt(info: AcademyInfo): string {
  const prices = info.prices.map((p) => `  • ${p.plan}: ${p.price}`).join("\n");
  return `ACADEMY FACTS (you may share these when asked):
- Name: ${info.name}
- About: ${info.about}
- Contact: Telegram ${info.contactTelegram}
- Schedule: ${info.schedule}
- Monthly prices:
${prices}
Students get the best results by practising a little every day and keeping their streak.
If asked something not listed here (exact timetable, discounts, enrolment), politely suggest contacting the centre on Telegram ${info.contactTelegram}.`;
}
