import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, LevelChip } from "@/components/legacy-ui";
import { ProgressView } from "@/components/progress-view";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Student progress" };

export default async function StudentProgressPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  await requireActiveProfile();

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, level")
    .eq("id", studentId)
    .maybeSingle();
  const student = (data as Pick<Profile, "id" | "full_name" | "level"> | null) ?? null;

  return (
    <div>
      <Link href="/dashboard" className="mb-3 inline-flex items-center gap-1 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <PageHeader
        title={student?.full_name || "Student"}
        subtitle="Progress overview"
        action={<LevelChip level={student?.level} />}
      />
      <ProgressView studentId={studentId} />
    </div>
  );
}
