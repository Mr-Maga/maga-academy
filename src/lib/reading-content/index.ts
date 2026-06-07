// Curated reading library for the Reading hub.
//
// Split across files so the (growing) content stays manageable:
//   index.ts     — types, helpers, level metadata, combined exports
//   stories.ts   — short stories (A1 → C1)
//   articles.ts  — factual articles (A1 → C1)
//
// All pieces are ORIGINAL, fact-checked writing (never copied from any website —
// that would breach copyright). Factual articles are grounded in well-
// established, reliable information so learners can trust what they read.

import { STORIES } from "./stories";
import { ARTICLES } from "./articles";

export type ReadingLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type ReadingKind = "article" | "story";

export interface ReadingPiece {
  id: string;
  kind: ReadingKind;
  level: ReadingLevel;
  title: string;
  subtitle?: string;
  topic?: string;
  /** Paragraphs separated by a blank line. */
  body: string;
}

export const READING_LEVELS: ReadingLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export const LEVEL_META: Record<ReadingLevel, { label: string; color: string }> = {
  A1: { label: "Beginner", color: "var(--color-teal)" },
  A2: { label: "Elementary", color: "var(--color-primary-soft)" },
  B1: { label: "Intermediate", color: "var(--color-indigo)" },
  B2: { label: "Upper-Int.", color: "var(--color-amber)" },
  C1: { label: "Advanced", color: "var(--color-rose)" },
};

export function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function readMinutes(body: string): number {
  return Math.max(1, Math.round(wordCount(body) / 130));
}

export const READING_LIBRARY: ReadingPiece[] = [...STORIES, ...ARTICLES];

export function piecesByKind(kind: ReadingKind): ReadingPiece[] {
  return READING_LIBRARY.filter((p) => p.kind === kind);
}

export function pieceById(id: string): ReadingPiece | undefined {
  return READING_LIBRARY.find((p) => p.id === id);
}

export function countByKindLevel(kind: ReadingKind, level: ReadingLevel): number {
  return READING_LIBRARY.filter((p) => p.kind === kind && p.level === level).length;
}
