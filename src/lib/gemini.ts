import "server-only";
import type { AiEvaluation } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export function geminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export const MAGA_SYSTEM = `You are "Maga", a warm, polite English and IELTS tutor for a language academy in Uzbekistan.
Rules:
- Detect the user's language from their message (Uzbek, Russian, or English) and ALWAYS reply in that same language.
- Be polite and respectful; in Uzbek use the formal "siz", in Russian use "вы".
- Help with grammar, vocabulary, reading, listening, writing and speaking.
- For writing, give friendly, specific feedback and an estimated IELTS band (0–9) with one or two concrete tips.
- Be concise, clear and encouraging. Prefer short paragraphs and simple examples.
- Guide students to the answer; do not simply write their graded homework for them.`;

interface Part {
  text: string;
}
interface Content {
  role: "user" | "model";
  parts: Part[];
}

export async function geminiGenerate(opts: {
  system?: string;
  messages: { role: "user" | "assistant"; content: string }[];
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI not configured");

  const contents: Content[] = opts.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.6,
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
    },
  };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: Part[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  return text.trim() || "…";
}

/* ----------------------------- JSON mode ----------------------------- */

export async function geminiJSON<T>(opts: {
  system?: string;
  prompt: string;
  schema?: object;
  temperature?: number;
}): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI not configured");

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0.35,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
  };
  if (opts.schema) generationConfig.responseSchema = opts.schema;

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    generationConfig,
  };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = (await res.json()) as { candidates?: { content?: { parts?: Part[] } }[] };
  let text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "{}";
  text = text.trim().replace(/^```json/i, "").replace(/```$/, "").trim();
  return JSON.parse(text) as T;
}

/* --------------------- IELTS examiner evaluations --------------------- */

const EVAL_SCHEMA = {
  type: "OBJECT",
  properties: {
    overall_band: { type: "NUMBER" },
    criteria: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          band: { type: "NUMBER" },
          comment: { type: "STRING" },
        },
        required: ["name", "band", "comment"],
      },
    },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    improvements: { type: "ARRAY", items: { type: "STRING" } },
    upgraded_sample: { type: "STRING" },
  },
  required: ["overall_band", "criteria", "strengths", "improvements", "upgraded_sample"],
} as const;

export async function evaluateWriting(input: {
  task: "task1" | "task2";
  question: string;
  essay: string;
}): Promise<AiEvaluation> {
  const criteria =
    input.task === "task1"
      ? "Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy"
      : "Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy";

  const prompt = `You are a certified IELTS Writing examiner. Assess the candidate's ${input.task === "task1" ? "Academic Task 1" : "Task 2"} response strictly against the four official band descriptors: ${criteria}.

QUESTION:
${input.question || "(not provided)"}

CANDIDATE'S RESPONSE:
${input.essay}

Return JSON with:
- overall_band: the overall band (0–9, in 0.5 steps), realistic and strict.
- criteria: exactly the four criteria above, each with a band (0–9) and a one-sentence justification.
- strengths: 2–4 short bullet points.
- improvements: 3–5 short, concrete, actionable bullet points (cite specific issues).
- upgraded_sample: a rewritten model answer that would score ONE band higher than the candidate's overall (keep it the appropriate length, natural and exam-realistic).
Write all feedback in clear English.`;

  return geminiJSON<AiEvaluation>({ prompt, schema: EVAL_SCHEMA, temperature: 0.3 });
}

export async function evaluateSpeaking(input: {
  part: 1 | 2 | 3;
  question: string;
  answer: string;
}): Promise<AiEvaluation> {
  const prompt = `You are a certified IELTS Speaking examiner. Assess the candidate's spoken answer (provided as a transcript) for IELTS Speaking Part ${input.part}, using the four official criteria: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation.

NOTE: You only have the transcript, so judge Pronunciation cautiously and focus mainly on the other three; mention this limitation briefly in the Pronunciation comment.

QUESTION / CUE:
${input.question}

CANDIDATE'S TRANSCRIBED ANSWER:
${input.answer}

Return JSON with:
- overall_band: realistic overall band (0–9, in 0.5 steps).
- criteria: the four criteria above, each with a band and a one-sentence justification.
- strengths: 2–4 bullets.
- improvements: 3–5 concrete bullets (e.g. linking words, tenses, range of vocabulary, ideas).
- upgraded_sample: a model spoken answer to the same question at roughly Band 8 (natural, spoken style, suitable length for Part ${input.part}).
Write all feedback in clear English.`;

  return geminiJSON<AiEvaluation>({ prompt, schema: EVAL_SCHEMA, temperature: 0.4 });
}

/* --------------------- Context-aware tutor prompt --------------------- */

export interface TutorContext {
  name?: string | null;
  role?: string | null;
  level?: string | null;
  weakestSkill?: string | null;
  streak?: number;
  homeworkCompletion?: number;
}

export function buildTutorSystem(ctx: TutorContext, academyInfo: string): string {
  const lines: string[] = [];
  if (ctx.name) lines.push(`- Name: ${ctx.name}`);
  if (ctx.role) lines.push(`- Role: ${ctx.role}`);
  if (ctx.level) lines.push(`- Current level: ${ctx.level}`);
  if (ctx.weakestSkill) lines.push(`- Weakest skill right now: ${ctx.weakestSkill} (gently steer practice here)`);
  if (typeof ctx.streak === "number") lines.push(`- Practice streak: ${ctx.streak} day(s)`);
  if (typeof ctx.homeworkCompletion === "number")
    lines.push(`- Homework completion: ${ctx.homeworkCompletion}%`);

  const profile = lines.length
    ? `\n\nLEARNER PROFILE (use this to personalise your help):\n${lines.join("\n")}`
    : "";

  return `${MAGA_SYSTEM}

You also act as a helpful assistant for the academy: answer questions about courses, prices, schedule and how the platform works, and give personalised study advice based on the learner's profile and weak areas.

${academyInfo}${profile}`;
}
