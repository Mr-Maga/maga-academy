import { Users, ClipboardCheck, FolderPlus, Trophy, AlertTriangle, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, LinkCard, StatCard } from "@/components/legacy-ui";
import { levelLabel } from "@/lib/constants";
import type { Group, Profile } from "@/lib/types";

export async function TeacherDashboard({ profile }: { profile: Profile }) {
  const supabase = await createClient();

  const [{ data: groupsRaw }, { count: studentCount }, { count: ungraded }] = await Promise.all([
    supabase.from("groups").select("*").eq("teacher_id", profile.id).order("name"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("submissions").select("id", { count: "exact", head: true }).eq("status", "submitted"),
  ]);

  const groups = (groupsRaw as Group[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teacher dashboard</h1>
        <p className="text-sm text-muted">Manage your groups, materials and homework.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Users} tone="primary" label="My groups" value={groups.length} hint="My groups" />
        <StatCard icon={GraduationCap} tone="teal" label="Students" value={studentCount ?? 0} hint="All students" />
        <StatCard icon={ClipboardCheck} tone="amber" label="To grade" value={ungraded ?? 0} hint="Submissions to grade" />
        <StatCard icon={Trophy} tone="danger" label="Ranking" value="View" hint="Class ranking" />
      </div>

      <section>
        <h2 className="mb-2 font-semibold">My groups</h2>
        {groups.length === 0 ? (
          <Card className="text-center text-sm text-muted">
            You aren’t assigned to any group yet. An admin assigns you as the group teacher.
          </Card>
        ) : (
          <div className="space-y-2">
            {groups.map((g) => (
              <div key={g.id} className="card flex items-center justify-between gap-3 p-3.5">
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted">
                    {levelLabel(g.level)}
                    {g.schedule ? ` · ${g.schedule}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Quick actions</h2>
        <div className="grid gap-2">
          <LinkCard href="/homework/new" icon={ClipboardCheck} title="Assign homework" description="Set a deadline by level or group" tone="primary" />
          <LinkCard href="/materials/new" icon={FolderPlus} title="Upload material" description="File to storage or a video link" tone="teal" />
          <LinkCard href="/students" icon={Users} title="Students & grading" description="See submissions and give scores" tone="amber" />
          <LinkCard href="/ranking" icon={Trophy} title="Ranking" description="Overall & per group" tone="danger" />
        </div>
      </section>

      <p className="flex items-center gap-2 text-xs text-subtle">
        <AlertTriangle className="h-3.5 w-3.5" />
        Students who miss a deadline get a red flag on the homework page.
      </p>
    </div>
  );
}
