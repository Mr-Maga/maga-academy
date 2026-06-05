import type { LevelKey, Role, Skill } from "./types";

export const LEVELS: { key: LevelKey; label: string; short: string; cssVar: string }[] = [
  { key: "a1", label: "Beginner", short: "A1", cssVar: "var(--color-level-a1)" },
  { key: "a2", label: "Elementary", short: "A2", cssVar: "var(--color-level-a2)" },
  { key: "b1", label: "Pre-Intermediate", short: "B1", cssVar: "var(--color-level-b1)" },
  { key: "b2", label: "Intermediate", short: "B2", cssVar: "var(--color-level-b2)" },
  { key: "cefr", label: "CEFR", short: "CEFR", cssVar: "var(--color-level-cefr)" },
  { key: "ielts", label: "IELTS", short: "IELTS", cssVar: "var(--color-level-ielts)" },
];

export const LEVEL_MAP: Record<LevelKey, (typeof LEVELS)[number]> = Object.fromEntries(
  LEVELS.map((l) => [l.key, l]),
) as Record<LevelKey, (typeof LEVELS)[number]>;

export function levelLabel(key: LevelKey | null | undefined): string {
  if (!key) return "—";
  const l = LEVEL_MAP[key];
  return l ? `${l.label} (${l.short})` : key;
}

export const SKILLS: { key: Skill; label: string; emoji: string }[] = [
  { key: "listening", label: "Listening", emoji: "🎧" },
  { key: "reading", label: "Reading", emoji: "📖" },
  { key: "writing", label: "Writing", emoji: "✍️" },
  { key: "speaking", label: "Speaking", emoji: "🎙️" },
];

export const SKILL_MAP: Record<Skill, (typeof SKILLS)[number]> = Object.fromEntries(
  SKILLS.map((s) => [s.key, s]),
) as Record<Skill, (typeof SKILLS)[number]>;

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export function isStaff(role: Role | null | undefined): boolean {
  return role === "admin" || role === "teacher";
}

// Languages the AI tutor and UI hints support.
export const LANGUAGES = [
  { code: "uz", label: "O‘zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
] as const;

export const ACCESS_DEFAULT_DAYS = 30;
