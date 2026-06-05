// Domain types for Maga Academy. These mirror the Postgres schema in
// supabase/schema.sql. The Supabase client is left untyped (returns `any`),
// and query results are cast to these interfaces in app code.

export type Role = "admin" | "teacher" | "student" | "parent";

export type LevelKey = "a1" | "a2" | "b1" | "b2" | "cefr" | "ielts";

export type Skill = "listening" | "reading" | "writing" | "speaking";

export type AccessStatus = "pending" | "active" | "locked";

export type FeedbackKind = "complaint" | "feedback" | "placement" | "system";

export type FeedbackSource = "telegram" | "web";

export type SubmissionStatus = "submitted" | "graded";

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: Role | null;
  level: LevelKey | null;
  group_id: string | null;
  access_status: AccessStatus;
  access_expires_at: string | null;
  daily_goal: number;
  code_claimed: boolean;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  level: LevelKey;
  teacher_id: string | null;
  schedule: string | null;
  created_at: string;
}

export interface Material {
  id: string;
  title: string;
  description: string | null;
  level: LevelKey;
  skill: Skill;
  group_id: string | null;
  file_path: string | null;
  video_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string | null;
  level: LevelKey;
  skill: Skill | null;
  group_id: string | null;
  due_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  homework_id: string;
  student_id: string;
  body: string | null;
  file_path: string | null;
  status: SubmissionStatus;
  score: number | null;
  max_score: number | null;
  comment: string | null;
  submitted_at: string;
  graded_at: string | null;
  graded_by: string | null;
}

export interface Score {
  id: string;
  student_id: string;
  group_id: string | null;
  skill: Skill | null;
  homework_id: string | null;
  value: number;
  max_value: number;
  comment: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ParentLink {
  id: string;
  parent_id: string;
  student_id: string;
  created_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active: string | null; // date
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  kind: FeedbackKind;
  source: FeedbackSource;
  message: string;
  telegram_username: string | null;
  level: LevelKey | null;
  handled: boolean;
  created_at: string;
}

// RPC return shapes
export interface LeaderboardRow {
  student_id: string;
  full_name: string | null;
  level: LevelKey | null;
  group_id: string | null;
  group_name: string | null;
  total_score: number;
  avg_percent: number;
  rank_overall: number;
  rank_in_group: number;
}

export interface ProgressPoint {
  bucket: string; // ISO date (week/day)
  avg_percent: number;
  total: number;
}

export interface StudentProgress {
  points: ProgressPoint[];
  homework_completion: number; // 0..100
  weakest_skill: Skill | null;
  current_streak: number;
  daily_goal: number;
}

// AI examiner (Writing / Speaking) evaluation shape.
export interface BandCriterion {
  name: string;
  band: number;
  comment: string;
}
export interface AiEvaluation {
  overall_band: number;
  criteria: BandCriterion[];
  strengths: string[];
  improvements: string[];
  upgraded_sample: string;
}
