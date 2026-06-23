import type { Metadata } from "next";
import { Users, Plus, Trash2, CalendarClock } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, LevelChip, EmptyState } from "@/components/legacy-ui";
import { AutoSubmitSelect, SubmitButton } from "@/components/form-controls";
import { LEVELS, levelLabel } from "@/lib/constants";
import type { Group, Profile } from "@/lib/types";
import { createGroup, updateGroup, deleteGroup, assignGroup } from "../actions";

export const metadata: Metadata = { title: "Groups" };

type GroupRow = Group & { teacher: { full_name: string | null } | null };

export default async function GroupsPage() {
  await requireRole("admin");
  const supabase = await createClient();

  const [{ data: groupsRaw }, { data: teachersRaw }, { data: studentsRaw }] = await Promise.all([
    supabase.from("groups").select("*, teacher:teacher_id(full_name)").order("name"),
    supabase.from("profiles").select("id, full_name, email").eq("role", "teacher").order("full_name"),
    supabase
      .from("profiles")
      .select("id, full_name, email, level, group_id")
      .eq("role", "student")
      .order("full_name"),
  ]);

  const groups = (groupsRaw as GroupRow[] | null) ?? [];
  const teachers = (teachersRaw as Pick<Profile, "id" | "full_name" | "email">[] | null) ?? [];
  const students = (studentsRaw as Pick<Profile, "id" | "full_name" | "email" | "level" | "group_id">[] | null) ?? [];

  const byGroup = new Map<string, typeof students>();
  for (const s of students) {
    if (s.group_id) {
      const arr = byGroup.get(s.group_id) ?? [];
      arr.push(s);
      byGroup.set(s.group_id, arr);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Groups" subtitle="Create a group, assign a teacher, then add students." />

      {/* Create group */}
      <Card>
        <h2 className="mb-3 flex items-center gap-2 font-semibold">
          <Plus className="h-4 w-4 text-primary-soft" /> New group
        </h2>
        <form action={createGroup} className="space-y-3">
          <input name="name" required placeholder="Group name (e.g. Grade 10-A)" className="input" />
          <div className="grid grid-cols-2 gap-3">
            <select name="level" required defaultValue="" className="input" aria-label="Level">
              <option value="" disabled>
                Level…
              </option>
              {LEVELS.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label} ({l.short})
                </option>
              ))}
            </select>
            <select name="teacher_id" defaultValue="" className="input" aria-label="Teacher">
              <option value="">No teacher yet</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name || t.email}
                </option>
              ))}
            </select>
          </div>
          <input name="schedule" placeholder="Schedule (e.g. Mon/Wed/Fri 18:00)" className="input" />
          <SubmitButton className="btn-primary w-full py-2.5" pendingLabel="Creating…">
            Create group
          </SubmitButton>
        </form>
      </Card>

      {/* Existing groups */}
      {groups.length === 0 ? (
        <EmptyState icon={Users} title="No groups yet" description="Create your first group above." />
      ) : (
        <div className="space-y-3">
          {groups.map((g) => {
            const members = byGroup.get(g.id) ?? [];
            const addable = students.filter((s) => s.group_id !== g.id);
            return (
              <Card key={g.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{g.name}</h3>
                      <LevelChip level={g.level} />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {g.schedule || "No schedule"} · {members.length} student(s)
                    </p>
                  </div>
                  <form action={deleteGroup}>
                    <input type="hidden" name="group_id" value={g.id} />
                    <SubmitButton className="btn-ghost px-2.5 py-1.5 text-danger" pendingLabel="…">
                      <Trash2 className="h-4 w-4" />
                    </SubmitButton>
                  </form>
                </div>

                {/* Teacher + schedule edit */}
                <form action={updateGroup} className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <input type="hidden" name="group_id" value={g.id} />
                  <AutoSubmitSelect name="teacher_id" defaultValue={g.teacher_id ?? ""} aria-label="Group teacher">
                    <option value="">No teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name || t.email}
                      </option>
                    ))}
                  </AutoSubmitSelect>
                  <input
                    name="schedule"
                    defaultValue={g.schedule ?? ""}
                    placeholder="Schedule"
                    className="flex-1 rounded-lg border border-border bg-input px-2.5 py-1.5 text-sm"
                  />
                  <SubmitButton className="btn-ghost px-3 py-1.5 text-sm" pendingLabel="…">
                    Save
                  </SubmitButton>
                </form>

                {/* Members */}
                {members.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {members.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
                        <span className="truncate">{s.full_name || s.email}</span>
                        <form action={assignGroup}>
                          <input type="hidden" name="user_id" value={s.id} />
                          <input type="hidden" name="group_id" value="" />
                          <SubmitButton className="text-xs font-medium text-danger" pendingLabel="…">
                            Remove
                          </SubmitButton>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add student */}
                <form action={assignGroup} className="mt-3 flex items-center gap-2">
                  <input type="hidden" name="group_id" value={g.id} />
                  <AutoSubmitSelect name="user_id" defaultValue="" aria-label="Add student" className="flex-1">
                    <option value="" disabled>
                      + Add a student…
                    </option>
                    {addable.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name || s.email}
                        {s.group_id ? " (move here)" : ""} · {levelLabel(s.level)}
                      </option>
                    ))}
                  </AutoSubmitSelect>
                </form>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
