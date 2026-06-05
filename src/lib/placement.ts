import type { LevelKey } from "./types";

export interface PlacementItem {
  id: string;
  level: LevelKey;
  skill: "reading" | "listening";
  prompt: string;
  context?: string; // passage or "audio" transcript
  options: string[];
  answer: number; // index into options
}

// Two "hard" items per level (one reading, one listening) — hardest of each
// level — used to find how high the learner can go.
export const PLACEMENT_ITEMS: PlacementItem[] = [
  {
    id: "a1r",
    level: "a1",
    skill: "reading",
    prompt: "Choose the correct sentence.",
    options: ["She don't likes tea.", "She doesn't like tea.", "She not like tea.", "She no like tea."],
    answer: 1,
  },
  {
    id: "a1l",
    level: "a1",
    skill: "listening",
    context: "Audio: “The train leaves at half past seven from platform two.”",
    prompt: "What time does the train leave?",
    options: ["7:15", "7:30", "8:30", "2:00"],
    answer: 1,
  },
  {
    id: "a2r",
    level: "a2",
    skill: "reading",
    prompt: "Complete: “Yesterday we ___ to the cinema and saw a great film.”",
    options: ["go", "goed", "went", "have gone"],
    answer: 2,
  },
  {
    id: "a2l",
    level: "a2",
    skill: "listening",
    context: "Audio: “Turn left at the bank. The library is opposite the café.”",
    prompt: "Where is the library?",
    options: ["Next to the bank", "Opposite the café", "Behind the cinema", "Inside the bank"],
    answer: 1,
  },
  {
    id: "b1r",
    level: "b1",
    skill: "reading",
    prompt: "Choose the best option: “By the time we arrived, the meeting ___.”",
    options: ["already started", "has already started", "had already started", "is already starting"],
    answer: 2,
  },
  {
    id: "b1l",
    level: "b1",
    skill: "listening",
    context: "Audio: “I'd rather you didn't tell anyone about the surprise party just yet.”",
    prompt: "What does the speaker want?",
    options: ["To cancel the party", "To keep it secret for now", "To invite more people", "To tell everyone"],
    answer: 1,
  },
  {
    id: "b2r",
    level: "b2",
    skill: "reading",
    prompt: "Choose the most natural collocation: “The new policy had a profound ___ on small businesses.”",
    options: ["affect", "effect", "impact", "result"],
    answer: 2,
  },
  {
    id: "b2l",
    level: "b2",
    skill: "listening",
    context: "Audio: “While the proposal has merit, I'm not entirely convinced it's feasible within the budget.”",
    prompt: "What is the speaker's attitude?",
    options: ["Fully supportive", "Cautiously doubtful", "Completely against", "Indifferent"],
    answer: 1,
  },
  {
    id: "cefrr",
    level: "cefr",
    skill: "reading",
    prompt: "Choose the word closest in meaning to “meticulous”.",
    options: ["careless", "thorough", "generous", "reluctant"],
    answer: 1,
  },
  {
    id: "cefrl",
    level: "cefr",
    skill: "listening",
    context:
      "Audio: “Far from being a setback, the delay actually allowed us to refine the design considerably.”",
    prompt: "How does the speaker view the delay?",
    options: ["As a serious problem", "As ultimately beneficial", "As irrelevant", "As unfair"],
    answer: 1,
  },
  {
    id: "ieltsr",
    level: "ielts",
    skill: "reading",
    context:
      "Passage: “Although solar capacity grew rapidly, its share of total generation remained modest, partly because storage technology lagged behind.”",
    prompt: "“Solar provided most of the electricity generated.” This statement is…",
    options: ["True", "False", "Not Given", "Partly True"],
    answer: 1,
  },
  {
    id: "ieltsl",
    level: "ielts",
    skill: "listening",
    context:
      "Audio: “The lecturer implies that the methodology, though innovative, was insufficiently rigorous to draw firm conclusions.”",
    prompt: "What is the lecturer's main point?",
    options: [
      "The method was both new and reliable",
      "The method was new but not rigorous enough",
      "The conclusions were firmly proven",
      "The method was outdated",
    ],
    answer: 1,
  },
];

const ORDER: LevelKey[] = ["a1", "a2", "b1", "b2", "cefr", "ielts"];

export interface PlacementResult {
  recommended: LevelKey;
  correct: number;
  total: number;
  perLevel: { level: LevelKey; correct: number; total: number }[];
  summary: string;
}

/** Recommend the highest level where the learner answered at least half right. */
export function scorePlacement(answers: Record<string, number>): PlacementResult {
  const perLevel = ORDER.map((level) => {
    const items = PLACEMENT_ITEMS.filter((i) => i.level === level);
    const correct = items.filter((i) => answers[i.id] === i.answer).length;
    return { level, correct, total: items.length };
  });

  let recommended: LevelKey = "a1";
  for (const pl of perLevel) {
    if (pl.total > 0 && pl.correct / pl.total >= 0.5) recommended = pl.level;
  }

  const correct = perLevel.reduce((s, p) => s + p.correct, 0);
  const total = PLACEMENT_ITEMS.length;
  const summary = perLevel.map((p) => `${p.level.toUpperCase()} ${p.correct}/${p.total}`).join(", ");

  return { recommended, correct, total, perLevel, summary };
}
