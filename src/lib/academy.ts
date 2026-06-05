// ─────────────────────────────────────────────────────────────
// Academy facts the AI tutor "Maga" is allowed to share.
// EDIT THIS FILE to update prices, schedule and contact details.
// ─────────────────────────────────────────────────────────────

export const ACADEMY = {
  name: "Maga Academy",
  about: "An IELTS & English language centre. Levels from Beginner (A1) up to IELTS.",
  contactTelegram: "@maga_academy", // EDIT: your real Telegram username/link
  schedule: "Group classes run on weekdays; ask the centre for the timetable that fits your level.",
  currency: "so'm",
  // Monthly course prices (UZS). EDIT these any time.
  prices: [
    { plan: "IELTS", price: "800 000 so'm / oy" },
    { plan: "CEFR", price: "600 000 so'm / oy" },
    { plan: "General English (A1–B2)", price: "500 000 so'm / oy" },
  ],
  // Things the tutor should gently encourage.
  policies: [
    "Students get the best results by practising a little every day and keeping their streak.",
    "A monthly subscription gives access; the centre activates accounts after approval.",
  ],
};

/** Compact academy facts injected into the AI tutor's system prompt. */
export function academyInfoForPrompt(): string {
  const prices = ACADEMY.prices.map((p) => `  • ${p.plan}: ${p.price}`).join("\n");
  return `ACADEMY FACTS (you may share these when asked):
- Name: ${ACADEMY.name}
- About: ${ACADEMY.about}
- Contact: Telegram ${ACADEMY.contactTelegram}
- Schedule: ${ACADEMY.schedule}
- Monthly prices:
${prices}
- Notes: ${ACADEMY.policies.join(" ")}
If asked something about the academy you don't have here (exact timetable, discounts, enrolment), politely suggest contacting the centre on Telegram ${ACADEMY.contactTelegram}.`;
}
