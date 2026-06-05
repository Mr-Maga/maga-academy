import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, UserRound } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState, LevelChip } from "@/components/ui";
import { ProgressView } from "@/components/progress-view";
import { isStaff } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  const profile = await requireActiveProfile();

  if (profile.role === "student") {
    return (
      <div>
        <PageHeader title="My progress" subtitle="Scores, streak and where to focus." action={<LevelChip level={profile.level} />} />
        <ProgressView studentId={profile.id} />
      </div>
    );
  }

  if (isStaff(profile.role)) redirect("/students");

  // Parent: list linked children.
  const supabase = await createClient();
  const { data } = await supabase.from("parent_links").select("student:student_id(*)").eq("parent_id", profile.id);
  const children = ((data as { student: Profile }[] | null) ?? []).map((l) => l.student).filter(Boolean);

  return (
    <div>
      <PageHeader title="Progress" subtitle="Choose a child to view their progress." />
      {children.length === 0 ? (
        <EmptyState icon={UserRound} title="No linked child" description="The centre links your child to your account." />
      ) : (
        <div className="space-y-2">
          {children.map((c) => (
            <Link key={c.id} href={`/progress/${c.id}`} className="card flex items-center justify-between gap-3 p-4 transition hover:bg-elevated">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 font-bold text-primary-soft">
                  {(c.full_name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{c.full_name || "Student"}</div>
                  <LevelChip level={c.level} className="mt-0.5" />
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-subtle" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
