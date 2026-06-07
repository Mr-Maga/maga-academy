import "server-only";
import type { AiEvaluation, Exercise, ExerciseType, VocabTranslation } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export function geminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

// The shared "brain" injected into EVERY AI tool so they behave consistently.
export const MAGA_CORE = `You are "Maga", the single AI brain behind every tool of an IELTS & English academy in Uzbekistan — the chat tutor, the writing & speaking examiners, the practice generator, the vocabulary builder and the translator are ALL you. Keep one consistent, expert, encouraging personality everywhere.

NON-NEGOTIABLE RULES FOR EVERY RESPONSE:
1. EXPERTISE — act as a top IELTS examiner and English teacher. Be accurate and exam-aligned.
2. LEVEL — respect the requested CEFR level EXACTLY. A1 < A2 < B1 < B2 < C1 must feel clearly different: calibrate vocabulary range, sentence length and grammar complexity precisely to the target. If B1 is requested, it MUST be noticeably simpler than B2. Never drift to another level.
3. FRESHNESS — never reuse content. Every exercise, question, word, example and sentence must be new and varied. Rotate topics, contexts and structures widely; avoid clichéd textbook examples.
4. CLEAN OUTPUT — no filler, no meta-commentary, no "as an AI". Give directly usable content only.`;

const ANGLES = [
  "daily life", "work & careers", "education", "the environment", "technology",
  "health & fitness", "travel & culture", "science", "money & shopping", "media & news",
  "relationships", "city life", "food & cooking", "sport", "art & music", "history",
];

/** A randomised hint appended to generation prompts to force variety each call. */
function varietyHint(): string {
  const a = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  const seed = Math.random().toString(36).slice(2, 8);
  return `Freshness seed ${seed}: make this clearly different from anything typical — lean towards the theme "${a}", and avoid common textbook examples.`;
}

export const MAGA_SYSTEM = `You are "Maga", an expert IELTS coach and examiner for a language academy in Uzbekistan. You know the official IELTS band descriptors deeply, and your single goal is to help the student raise their band as fast as possible with precise, expert coaching.

LANGUAGE
- Detect the student's language (Uzbek, Russian or English) and reply in that SAME language. In Uzbek use the formal "siz"; in Russian use "вы".
- Teach English in English, but explain difficult points briefly in the student's language when it genuinely helps.

HOW YOU ANSWER — this is critical
- Be concrete, specific and immediately useful. NO filler, NO generic praise, NO restating the question, NO "as an AI", NO long disclaimers.
- Keep replies short and scannable — usually under ~120 words. Use short bullets or a tiny structure. Bold the key word or rule.
- Give real examples, not vague advice. Show, don't tell.
- End with ONE concrete next step or a 10-second practice task when useful.

TEACHING PATTERNS (follow the matching one)
- Grammar question → one-line rule → 2 short examples → the most common mistake → one quick check question.
- Vocabulary → word + meaning + a natural collocation + one example sentence (note if it is high-band/formal).
- Writing help → name the ONE band-limiting problem, show a short "before → after" rewrite, and say which criterion it lifts (Task Response / Coherence & Cohesion / Lexical Resource / Grammar).
- Speaking help → give a Band 8 sample answer or phrase + one fluency/linking tip.
- "What should I improve?" → use the student's weakest skill and give a focused 3-step plan.

RULES
- Correct mistakes directly but kindly, and ALWAYS show the corrected version.
- Do NOT write a student's graded homework for them — coach them to it instead.
- If the student pastes an essay or asks for a band score, give a quick band estimate + the single biggest fix, then suggest the full "AI Writing check" tool for detailed scoring.
- Only state academy facts (prices, schedule, contact) that are explicitly given to you. If you don't know, tell them to contact the centre. Never invent facts.
- If a message is off-topic (not English / IELTS / studying / the academy), answer in one line and steer back to learning.`;

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
      // Disable "thinking" so replies are fast and don't eat the token budget.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );

  if (!res.ok) {
    const t = await res.text();
    if (res.status === 429) throw new Error("QUOTA");
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
  images?: { data: string; mimeType: string }[];
  audio?: { data: string; mimeType: string };
  thinking?: number; // thinking-token budget; lets the model reason before answering
}): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("AI not configured");

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0.35,
    maxOutputTokens: opts.thinking ? 8192 : 4096,
    responseMimeType: "application/json",
    // Reasoning is OFF by default (fast); evaluations turn it on for accuracy.
    thinkingConfig: { thinkingBudget: opts.thinking ?? 0 },
  };
  if (opts.schema) generationConfig.responseSchema = opts.schema;

  const parts: Record<string, unknown>[] = [];
  for (const img of opts.images ?? []) {
    parts.push({ inline_data: { mime_type: img.mimeType, data: img.data } });
  }
  if (opts.audio) parts.push({ inline_data: { mime_type: opts.audio.mimeType, data: opts.audio.data } });
  parts.push({ text: opts.prompt });

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts }],
    generationConfig,
  };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!res.ok) {
    const t = await res.text();
    if (res.status === 429) throw new Error("QUOTA");
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
    target_band: { type: "NUMBER" },
    band_note: { type: "STRING" },
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
  required: ["overall_band", "band_note", "criteria", "strengths", "improvements", "upgraded_sample"],
} as const;

// Rigorous, descriptor-anchored, HONEST scoring (accuracy = trust).
const GRADING_POLICY = `GRADING POLICY — RIGOROUS & HONEST (follow EXACTLY):
1. Match the answer to the closest official band descriptor for EACH of the four criteria SEPARATELY (use the descriptors provided).
2. Give the HONEST band each criterion deserves (0–9, in 0.5 steps). Never inflate to be kind and never deflate — an accurate score is what actually helps the student. Two different examiners using these descriptors should reach your score.
3. Justify each criterion band with SPECIFIC evidence: quote a word/phrase from the answer or name the exact error. No vague praise.
4. "band_note": ONE honest, encouraging sentence — the student's real level now and the single highest-impact fix.
5. "target_band": the next realistic band (about +0.5 to +1.0) the student can reach by fixing the issues you list.
Think step by step before assigning any score.`;

// Compact official-style band descriptors used to anchor the scores.
const WRITING_DESCRIPTORS = `OFFICIAL BAND DESCRIPTORS (anchor every score to these):
Task Response/Achievement — B5: partially addresses task, position unclear, ideas underdeveloped/irrelevant. B6: addresses all parts (some unevenly); position present; ideas relevant but not fully developed; (T1: covers requirements, some detail may be missing/inaccurate). B7: addresses all parts, clear position throughout, ideas extended & supported (may over-generalise); (T1: clear overview, key features highlighted). B8: fully addresses all parts; well-developed, well-supported ideas; (T1: fully satisfies requirements with a skilful overview).
Coherence & Cohesion — B5: some organisation but inadequate/mechanical linking, unclear progression. B6: coherent overall; effective but sometimes faulty cohesion; paragraphing present but not always logical. B7: logically organised, clear progression; cohesive devices used well (some under/over-use); clear central topic per paragraph. B8: skilfully managed paragraphing; cohesion used so it attracts no attention.
Lexical Resource — B5: limited range, noticeable errors that may cause difficulty. B6: adequate range; attempts less-common vocab with some inaccuracy; some spelling/word-form errors that don't impede. B7: sufficient range with flexibility/precision; some less-common items & collocation; occasional errors. B8: wide, natural, precise vocabulary; rare slips only.
Grammatical Range & Accuracy — B5: limited range, frequent errors that can strain the reader. B6: mix of simple & complex forms; errors occur but rarely impede communication. B7: variety of complex structures; frequent error-free sentences; good control with some errors. B8: wide range, flexible & accurate; majority error-free, occasional slip.`;

const SPEAKING_DESCRIPTORS = `OFFICIAL BAND DESCRIPTORS (anchor every score to these):
Fluency & Coherence — B5: usually maintains flow but with repetition/self-correction/hesitation; can over-use connectives. B6: willing to speak at length though coherence may falter with hesitation; uses a range of connectives, sometimes inaccurately. B7: speaks at length without noticeable effort; some hesitation is content- not language-related; flexible use of connectives & discourse markers. B8: fluent with only occasional repetition/hesitation; coherent, well-developed topic.
Lexical Resource — B5: manages to talk about familiar/unfamiliar topics but limited flexibility. B6: enough vocabulary to discuss topics at length; generally appropriate; attempts paraphrase with mixed success. B7: flexible vocabulary; some less-common & idiomatic items, some awareness of style; effective paraphrase. B8: wide, precise, natural vocabulary; skilful paraphrase & idiom.
Grammatical Range & Accuracy — B5: basic + limited complex structures, frequent errors. B6: mix of simple & complex; frequent errors in complex forms but rarely impede. B7: range of complex structures with flexibility; frequent error-free sentences. B8: wide range used flexibly; majority error-free.
Pronunciation — B5: some effective features but lapses; can be unclear at times, requiring effort. B6: range of features with mixed control; generally understandable, mispronunciations reduce clarity at times. B7: wide range of features, sustained though with lapses; generally easy to understand, L1 accent has little effect. B8: wide range of features used flexibly; easy to understand throughout, accent has minimal effect.`;

/** IELTS overall = mean of the four criteria, rounded to the nearest 0.5. */
function overallFromCriteria(criteria: { band: number }[], fallback: number): number {
  const valid = criteria.map((c) => c.band).filter((b) => typeof b === "number" && b >= 0 && b <= 9);
  if (!valid.length) return fallback;
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  return Math.round(mean * 2) / 2;
}

/** A realistic next-step target: between +0.5 and +1.0 above the current band. */
function nextTarget(overall: number, raw?: number): number {
  const floor = Math.min(overall + 0.5, 9);
  const ceil = Math.min(overall + 1, 9);
  if (!raw || raw < floor) return floor;
  return Math.min(raw, ceil);
}

export async function evaluateWriting(input: {
  task: "task1" | "task2";
  question: string;
  essay: string;
  image?: { data: string; mimeType: string };
}): Promise<AiEvaluation> {
  const criteria =
    input.task === "task1"
      ? "Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy"
      : "Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy";

  const imageLine = input.image
    ? `\nAN IMAGE OF THE TASK 1 VISUAL IS ATTACHED. Base Task Achievement on how accurately and fully the response reports the key features, trends and data shown in the image, and whether it makes relevant comparisons. Penalise invented data that is not in the image.\n`
    : "";

  const prompt = `You are a certified, experienced IELTS Writing examiner. Assess the candidate's ${input.task === "task1" ? "Academic Task 1" : "Task 2"} response on the four official criteria: ${criteria}.

${WRITING_DESCRIPTORS}

${GRADING_POLICY}
${imageLine}
QUESTION:
${input.question || "(not provided)"}

CANDIDATE'S RESPONSE:
${input.essay}

Return JSON with:
- criteria: exactly the four criteria above, each with an HONEST band (0–9, 0.5 steps) and a one-sentence justification quoting specific evidence from the essay.
- overall_band: the mean of the four criteria, rounded to the nearest 0.5.
- target_band: the next realistic band the student can reach.
- band_note: one honest, encouraging sentence (real level now + the single highest-impact fix).
- strengths: 2–4 short, specific bullet points.
- improvements: 3–5 concrete, actionable bullets that each cite a specific issue and how to fix it.
- upgraded_sample: a rewritten model answer at the target band (appropriate length, natural, exam-realistic).
Write all feedback in clear English.`;

  const res = await geminiJSON<AiEvaluation>({
    prompt,
    schema: EVAL_SCHEMA,
    system: MAGA_CORE,
    temperature: 0.12,
    thinking: 1024,
    images: input.image ? [input.image] : undefined,
  });
  res.overall_band = overallFromCriteria(res.criteria, res.overall_band);
  res.target_band = nextTarget(res.overall_band, res.target_band);
  return res;
}

export async function evaluateSpeaking(input: {
  part: 1 | 2 | 3;
  question: string;
  answer: string;
}): Promise<AiEvaluation> {
  const prompt = `You are a certified, experienced IELTS Speaking examiner. Assess the candidate's spoken answer (provided as a transcript) for IELTS Speaking Part ${input.part} on the four official criteria: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation.

${SPEAKING_DESCRIPTORS}

NOTE: You only have the TRANSCRIPT, so judge Pronunciation cautiously (base it mainly on the other three) and say so briefly in the Pronunciation comment.

${GRADING_POLICY}

QUESTION / CUE:
${input.question}

CANDIDATE'S TRANSCRIBED ANSWER:
${input.answer}

Return JSON with:
- criteria: the four criteria above, each with an HONEST band (0–9, 0.5 steps) and a one-sentence justification quoting specific evidence.
- overall_band: the mean of the four criteria, rounded to the nearest 0.5.
- target_band: the next realistic band the student can reach.
- band_note: one honest, encouraging sentence (real level now + the single highest-impact fix).
- strengths: 2–4 bullets.
- improvements: 3–5 concrete bullets (linking, tenses, vocabulary range, ideas).
- upgraded_sample: a model spoken answer at the target band (natural, spoken style, suitable length for Part ${input.part}).
Write all feedback in clear English.`;

  const res = await geminiJSON<AiEvaluation>({ prompt, schema: EVAL_SCHEMA, system: MAGA_CORE, temperature: 0.15, thinking: 1024 });
  res.overall_band = overallFromCriteria(res.criteria, res.overall_band);
  res.target_band = nextTarget(res.overall_band, res.target_band);
  return res;
}

const SPEAKING_SCHEMA = {
  type: "OBJECT",
  properties: {
    transcript: { type: "STRING" },
    overall_band: { type: "NUMBER" },
    target_band: { type: "NUMBER" },
    band_note: { type: "STRING" },
    criteria: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { name: { type: "STRING" }, band: { type: "NUMBER" }, comment: { type: "STRING" } },
        required: ["name", "band", "comment"],
      },
    },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    improvements: { type: "ARRAY", items: { type: "STRING" } },
    upgraded_sample: { type: "STRING" },
  },
  required: ["transcript", "overall_band", "band_note", "criteria", "strengths", "improvements", "upgraded_sample"],
} as const;

/** Evaluate a real audio recording of a spoken answer (the AI listens). */
export async function evaluateSpeakingAudio(input: {
  part: 1 | 2 | 3;
  question: string;
  audio: { data: string; mimeType: string };
}): Promise<AiEvaluation> {
  const prompt = `You are a certified, experienced IELTS Speaking examiner. An AUDIO RECORDING of a candidate's answer is attached for IELTS Speaking Part ${input.part}.
First, transcribe what the candidate actually says. Then assess them on the four official criteria: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation. Because you have the REAL audio, judge Pronunciation properly — clarity, individual sounds, word and sentence stress, intonation, and how easy they are to understand.

${SPEAKING_DESCRIPTORS}

${GRADING_POLICY}

QUESTION / CUE:
${input.question}

Return JSON with:
- transcript: an accurate transcription of what the candidate said.
- criteria: the four criteria above, each with an HONEST band (0–9, 0.5 steps) and a one-sentence justification referring to specific things you heard.
- overall_band: the mean of the four criteria, rounded to the nearest 0.5.
- target_band: the next realistic band the student can reach.
- band_note: one honest, encouraging sentence (real level now + the single highest-impact fix).
- strengths: 2–4 bullets.
- improvements: 3–5 concrete bullets (fluency, pronunciation of specific sounds/words, grammar, vocabulary, ideas).
- upgraded_sample: a model spoken answer at the target band (natural, spoken style, suitable length for Part ${input.part}).
Write all feedback in clear English.`;
  const res = await geminiJSON<AiEvaluation>({
    prompt,
    schema: SPEAKING_SCHEMA,
    system: MAGA_CORE,
    temperature: 0.15,
    thinking: 2048,
    audio: input.audio,
  });
  res.overall_band = overallFromCriteria(res.criteria, res.overall_band);
  res.target_band = nextTarget(res.overall_band, res.target_band);
  return res;
}

/* ----------------- Specialist Writing master (chat) ----------------- */

export const WRITING_MASTER = `You are a legendary IELTS Writing teacher and senior examiner with 40 years of experience — calm, sharp, warm and direct, like the best human mentor a student could ever have. You coach ONLY IELTS / academic writing.

RULES:
- Reply in the student's language (Uzbek → formal "siz"; Russian → "вы"; English → English). Teach English in English.
- Sound human and personal. NEVER say "as an AI", never give robotic disclaimers, never generic praise.
- Be concrete: when improving writing, show a short "before → after" rewrite and name which criterion it lifts (Task Response / Coherence & Cohesion / Lexical Resource / Grammatical Range & Accuracy).
- Keep answers tight and scannable — usually under ~160 words, one clear point at a time.
- Do NOT rewrite the student's whole essay for them — coach them to improve their own work.`;

/** Specialist follow-up chat about a writing answer the student just submitted. */
export async function writingChat(input: {
  question: string;
  essay: string;
  evalSummary: string;
  messages: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const context = `\n\nTHE STUDENT'S CURRENT WRITING (use this to answer their questions precisely):
TASK / QUESTION:
${input.question || "(not provided)"}

THEIR ANSWER:
${input.essay.slice(0, 4000)}

YOUR ASSESSMENT SO FAR:
${input.evalSummary.slice(0, 1500)}`;
  const system = `${MAGA_CORE}\n\n${WRITING_MASTER}${context}`;
  return geminiGenerate({ system, messages: input.messages, temperature: 0.6, maxOutputTokens: 700 });
}

/* ----------------- Specialist Speaking master (chat) ----------------- */

export const SPEAKING_MASTER = `You are a legendary IELTS Speaking examiner and coach with 40 years of experience — warm, sharp and human, like the best speaking teacher a student could have. You coach ONLY IELTS speaking and spoken English.

RULES:
- Reply in the student's language (Uzbek → formal "siz"; Russian → "вы"; English → English). Teach English in English.
- Sound human and personal. NEVER say "as an AI", never give robotic disclaimers or generic praise.
- Be concrete: give Band 8 phrases/sentence frames, one fluency or linking tip, and a quick pronunciation drill when relevant (e.g. a sound, word stress or intonation).
- Keep answers tight and scannable — usually under ~160 words, one clear point at a time.
- Coach the student to speak better themselves; don't just hand over a script to memorise.`;

/** Specialist follow-up chat about a spoken answer the student just submitted. */
export async function speakingChat(input: {
  part: number;
  question: string;
  transcript: string;
  evalSummary: string;
  messages: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const context = `\n\nTHE STUDENT'S SPEAKING ANSWER (use this to answer precisely):
PART ${input.part} — QUESTION / CUE:
${input.question || "(not provided)"}

WHAT THEY SAID (transcript):
${input.transcript.slice(0, 3000)}

YOUR ASSESSMENT SO FAR:
${input.evalSummary.slice(0, 1500)}`;
  const system = `${MAGA_CORE}\n\n${SPEAKING_MASTER}${context}`;
  return geminiGenerate({ system, messages: input.messages, temperature: 0.6, maxOutputTokens: 700 });
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
    ? `\n\nWHO YOU ARE COACHING (personalise every answer to this — especially target the weakest skill):\n${lines.join("\n")}`
    : "";

  return `${MAGA_CORE}\n\n${MAGA_SYSTEM}\n\n${academyInfo}${profile}`;
}

/* ------------------- AI-generated practice exercises ------------------- */

const EXERCISE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    passage: { type: "STRING" },
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          prompt: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answer_index: { type: "NUMBER" },
          explanation: { type: "STRING" },
        },
        required: ["prompt", "options", "answer_index", "explanation"],
      },
    },
  },
  required: ["title", "questions"],
} as const;

export async function generateExercise(input: {
  type: ExerciseType;
  level: string;
  topic?: string;
}): Promise<Exercise> {
  const n = input.type === "reading" ? 5 : 8;
  const passageRule =
    input.type === "reading"
      ? `Include a realistic IELTS-style reading passage of 150–190 words in "passage", and base every question on it.`
      : `Leave "passage" empty.`;
  const focus =
    input.type === "grammar"
      ? "Focus on grammar points that limit IELTS bands: tenses, articles, prepositions, conditionals, relative clauses, subject–verb agreement."
      : input.type === "vocabulary"
        ? "Focus on useful academic/IELTS vocabulary: collocations, word forms, synonyms and word-in-context."
        : "Test main idea, specific detail, inference, and vocabulary-in-context.";
  const topicLine = input.topic?.trim()
    ? `IMPORTANT: the student specifically asked to practise: "${input.topic.trim()}". Build the WHOLE exercise around this exact request — every question must target it. If it names a question format (e.g. True/False/Not Given, matching headings), use that format inside the multiple-choice options.`
    : "";

  const prompt = `Create a fresh IELTS ${input.type} practice exercise.
TARGET LEVEL: ${input.level}. Calibrate the passage, questions and vocabulary STRICTLY to this level — not easier, not harder.
${topicLine}
${passageRule}
${input.topic ? "" : focus}
${varietyHint()}
Provide exactly ${n} multiple-choice questions. Each question has 2–4 options (use the number the format actually needs — e.g. True/False/Not Given uses exactly 3 options), a 0-based "answer_index" of the single correct option, and a one-sentence "explanation" of why it is correct.
Rules: exactly one option is correct and unambiguous; make distractors plausible; write everything in English.`;

  return geminiJSON<Exercise>({ prompt, schema: EXERCISE_SCHEMA, system: MAGA_CORE, temperature: 0.95 });
}

/* ----------------------- AI-generated vocabulary ----------------------- */

export interface GeneratedWord {
  word: string;
  meaning: string;
  example: string;
  translation: string;
  level?: string; // CEFR: A1..C1
}

const WORD_SCHEMA = {
  type: "OBJECT",
  properties: {
    words: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          word: { type: "STRING" },
          meaning: { type: "STRING" },
          example: { type: "STRING" },
          translation: { type: "STRING" },
          level: { type: "STRING" },
        },
        required: ["word", "meaning", "example", "translation"],
      },
    },
  },
  required: ["words"],
};

export async function generateVocab(input: {
  level: string;
  count: number;
  avoid: string[];
}): Promise<GeneratedWord[]> {
  const avoid = input.avoid.slice(0, 100).join(", ");
  const prompt = `Generate ${input.count} useful English vocabulary words for a student at level: ${input.level}. Calibrate word difficulty STRICTLY to this level.
For each word give: the word; a short, clear meaning in simple English; one natural example sentence; an Uzbek translation (Latin script); and the CEFR level of the word (one of A1, A2, B1, B2, C1).
Pick varied words (verbs, adjectives, nouns). ${varietyHint()}
Do NOT use any of these already-known words: ${avoid || "none"}.`;
  const out = await geminiJSON<{ words: GeneratedWord[] }>({ prompt, schema: WORD_SCHEMA, system: MAGA_CORE, temperature: 0.95 });
  return out.words ?? [];
}

/** Build full flashcards from a list of English words the student supplies. */
export async function generateCardsForWords(input: {
  words: string[];
  level: string;
}): Promise<GeneratedWord[]> {
  const list = input.words.slice(0, 30).join(", ");
  const prompt = `Make a study flashcard for each of these English words, for a ${input.level} learner: ${list}.
For each item return: the word exactly as given; a short, clear meaning in simple English; one natural example sentence that uses the word; an Uzbek translation (Latin script); and the word's CEFR level (one of A1, A2, B1, B2, C1).
Keep the SAME order as given. If something is misspelled, correct it to the intended English word.`;
  const out = await geminiJSON<{ words: GeneratedWord[] }>({ prompt, schema: WORD_SCHEMA, system: MAGA_CORE, temperature: 0.4 });
  return out.words ?? [];
}

/* --------------------------- AI translator --------------------------- */

export async function translateWord(text: string): Promise<VocabTranslation> {
  const schema = {
    type: "OBJECT",
    properties: {
      word: { type: "STRING" },
      translation: { type: "STRING" },
      translation_ru: { type: "STRING" },
      meaning: { type: "STRING" },
      example: { type: "STRING" },
      level: { type: "STRING" },
      source: { type: "STRING" },
    },
    required: ["word", "translation", "meaning", "example"],
  };
  const prompt = `Translate and explain this for an English learner: "${text}".
The input may be Uzbek, Russian or English. Return:
- word: the English word or short phrase. If the input is English, keep it (fix spelling); if Uzbek or Russian, give the most natural English equivalent.
- translation: the Uzbek translation (Latin script).
- translation_ru: the Russian translation.
- meaning: a short, clear meaning in simple English.
- example: ONE natural example sentence that uses the English word correctly.
- level: the CEFR level of the English word (A1, A2, B1, B2 or C1).
- source: the detected input language ("uz", "ru" or "en").`;
  return geminiJSON<VocabTranslation>({ prompt, schema, system: MAGA_CORE, temperature: 0.3 });
}

/* ----------------- Daily planner (Maga turns text into tasks) ----------------- */

export interface PlannedTask {
  title: string;
  tool: "writing" | "speaking" | "vocab" | "exercises" | "reading" | "listening" | null;
}

/**
 * Turn a student's free-text intent ("bugun Task 2 va 10 ta yangi so'z qilaman")
 * into a short, concrete checklist of IELTS study tasks. Each task may map to an
 * in-app tool so the dashboard can deep-link it.
 */
export async function planTasks(text: string): Promise<PlannedTask[]> {
  const schema = {
    type: "OBJECT",
    properties: {
      tasks: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            tool: { type: "STRING", enum: ["writing", "speaking", "vocab", "exercises", "reading", "listening", "none"] },
          },
          required: ["title", "tool"],
        },
      },
    },
    required: ["tasks"],
  };
  const prompt = `A student tells you what they want to study today (in Uzbek, Russian or English):
"${text}"

Turn it into a SHORT checklist of 1–6 concrete, doable IELTS study tasks.
- Each "title" must be specific and motivating, written in English, max ~6 words (e.g. "Writing Task 2 essay", "Learn 10 new words", "Speaking Part 2 answer").
- Set "tool" to the matching app tool: writing, speaking, vocab (vocabulary), exercises (reading/grammar/vocab practice), reading, listening — or "none" if it doesn't map.
- Do NOT invent tasks the student didn't imply. Split compound requests into separate tasks.
Return JSON: { tasks: [{ title, tool }] }.`;

  const res = await geminiJSON<{ tasks: { title: string; tool: string }[] }>({
    prompt,
    schema,
    system: MAGA_CORE,
    temperature: 0.2,
  });
  const allowed = ["writing", "speaking", "vocab", "exercises", "reading", "listening"];
  return (res.tasks ?? [])
    .map((t) => ({
      title: String(t.title ?? "").trim().slice(0, 80),
      tool: allowed.includes(t.tool) ? (t.tool as PlannedTask["tool"]) : null,
    }))
    .filter((t) => t.title)
    .slice(0, 6);
}
