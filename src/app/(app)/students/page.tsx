import type { Metadata } from "next";
import Link from "next/link";
import { Users, TrendingUp, Plus } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState, LevelChip } from "@/components/legacy-ui";
import { SubmitButton } from "@/components/form-controls";
import { SKILLS, levelLabel } from "@/lib/constants";
import type { Group, Profile } from "@/lib/types";
import { addScore } from "./actions";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage() {
  const profile = await requireRole("admin", "teacher");
  const supabase = await createClient();

  // Teachers see students in the groups they teach; admins see all students.
  let groups: Pick<Group, "id" | "name">[] = [];
  let students: Pick<Profile, "id" | "full_name" | "email" | "level" | "group_id">[] = [];

  if (profile.role === "teacher") {
    const { data: g } = await supabase.from("groups").select("id, name").eq("teacher_id", profile.id);
    groups = (g as Pick<Group, "id" | "name">[] | null) ?? [];
    const ids = groups.map((x) => x.id);
    if (ids.length) {
      const { data: s } = await supabase
        .from("profiles")
        .select("id, full_name, email, level, group_id")
        .eq("role", "student")
        .in("group_id", ids)
        .order("full_name");
      students = (s as typeof students | null) ?? [];
    }
  } else {
    const [{ data: g }, { data: s }] = await Promise.all([
      supabase.from("groups").select("id, name"),
      supabase
        .from("profiles")
        .select("id, full_name, email, level, group_id")
        .eq("role", "student")
        .order("full_name"),
    ]);
    groups = (g as Pick<Group, "id" | "name">[] | null) ?? [];
    students = (s as typeof students | null) ?? [];
  }

  const groupName = new Map(groups.map((g) => [g.id, g.name]));

  return (
    <div>
      <PageHeader title="Students" subtitle="View progress and add scores for ranking." />

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description={
            profile.role === "teacher"
              ? "You'll see students once an admin adds them to your group."
              : "Students appear here after they register and are approved."
          }
        />
      ) : (
        <div className="space-y-2">
          {students.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{s.full_name || s.email}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <LevelChip level={s.level} />
                    <span>{s.group_id ? groupName.get(s.group_id) ?? "—" : "No group"}</span>
                  </div>
                </div>
                <Link href={`/progress/${s.id}`} className="btn-ghost px-3 py-2 text-sm">
                  <TrendingUp className="h-4 w-4" /> Progress
                </Link>
              </div>

              <form action={addScore} className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <input type="hidden" name="student_id" value={s.id} />
                <select name="skill" defaultValue="" className="rounded-lg border border-border bg-input px-2 py-1.5 text-sm" aria-label="Skill">
                  <option value="">General</option>
                  {SKILLS.map((sk) => (
                    <option key={sk.key} value={sk.key}>{sk.label}</option>
                  ))}
                </select>
                <input name="value" type="number" step="0.5" required placeholder="Score" className="w-20 rounded-lg border border-border bg-input px-2 py-1.5 text-sm" />
                <span className="text-muted">/</span>
                <input name="max_value" type="number" defaultValue={100} className="w-20 rounded-lg border border-border bg-input px-2 py-1.5 text-sm" />
                <SubmitButton className="btn-primary ml-auto px-3 py-1.5 text-sm" pendingLabel="…">
                  <Plus className="h-3.5 w-3.5" /> Add score
                </SubmitButton>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
