import type { Metadata } from "next";
import { GraduationCap, Link2, UserRound, X } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui";
import { AutoSubmitSelect, SubmitButton } from "@/components/form-controls";
import { LEVELS, ROLE_LABELS } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { setLevel, setRole, linkParent, unlinkParent } from "../actions";

export const metadata: Metadata = { title: "Users & links" };

type LinkRow = { id: string; parent_id: string; student: { id: string; full_name: string | null; email: string | null } | null };

export default async function UsersPage() {
  await requireRole("admin");
  const supabase = await createClient();

  const [{ data: allRaw }, { data: linksRaw }] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name"),
    supabase.from("parent_links").select("id, parent_id, student:student_id(id, full_name, email)"),
  ]);

  const all = (allRaw as Profile[] | null) ?? [];
  const links = (linksRaw as LinkRow[] | null) ?? [];
  const students = all.filter((p) => p.role === "student");
  const parents = all.filter((p) => p.role === "parent");

  const linksByParent = new Map<string, LinkRow[]>();
  for (const l of links) {
    const arr = linksByParent.get(l.parent_id) ?? [];
    arr.push(l);
    linksByParent.set(l.parent_id, arr);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users, levels & links" subtitle="Assign levels, fix roles and connect parents to children." />

      {/* Students & levels */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted">
          <GraduationCap className="h-4 w-4" /> Students &amp; levels ({students.length})
        </h2>
        {students.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No students yet" />
        ) : (
          <div className="space-y-2">
            {students.map((s) => (
              <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{s.full_name || s.email}</div>
                  <div className="text-xs text-muted capitalize">{s.access_status}</div>
                </div>
                <div className="flex items-center gap-2">
                  <form action={setLevel}>
                    <input type="hidden" name="user_id" value={s.id} />
                    <AutoSubmitSelect name="level" defaultValue={s.level ?? ""} aria-label="Level">
                      <option value="">No level</option>
                      {LEVELS.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.short} · {l.label}
                        </option>
                      ))}
                    </AutoSubmitSelect>
                  </form>
                  <form action={setRole}>
                    <input type="hidden" name="user_id" value={s.id} />
                    <AutoSubmitSelect name="role" defaultValue="student" aria-label="Role">
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Admin</option>
                    </AutoSubmitSelect>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Parent links */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted">
          <Link2 className="h-4 w-4" /> Parent ↔ child links ({parents.length})
        </h2>
        {parents.length === 0 ? (
          <EmptyState icon={UserRound} title="No parents yet" description="Parents appear here after they claim the family code." />
        ) : (
          <div className="space-y-2">
            {parents.map((p) => {
              const childLinks = linksByParent.get(p.id) ?? [];
              return (
                <Card key={p.id}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{p.full_name || p.email}</div>
                    <Badge tone={p.access_status === "active" ? "teal" : "amber"}>{p.access_status}</Badge>
                  </div>

                  {childLinks.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {childLinks.map((l) => (
                        <li key={l.id} className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs">
                          {l.student?.full_name || l.student?.email || "—"}
                          <form action={unlinkParent}>
                            <input type="hidden" name="link_id" value={l.id} />
                            <SubmitButton className="text-danger" pendingLabel="…">
                              <X className="h-3 w-3" />
                            </SubmitButton>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}

                  <form action={linkParent} className="mt-3 flex items-center gap-2">
                    <input type="hidden" name="parent_id" value={p.id} />
                    <AutoSubmitSelect name="student_id" defaultValue="" aria-label="Link a child" className="flex-1">
                      <option value="" disabled>
                        + Link a child…
                      </option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.full_name || s.email}
                        </option>
                      ))}
                    </AutoSubmitSelect>
                  </form>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
