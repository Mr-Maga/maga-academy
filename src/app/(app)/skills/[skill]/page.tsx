import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/ui";
import { MaterialItem } from "@/components/material-item";
import { signedUrls } from "@/lib/storage";
import { SKILL_MAP, isStaff } from "@/lib/constants";
import type { Material, Skill } from "@/lib/types";

const VALID: Skill[] = ["listening", "reading", "writing", "speaking"];

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
  const { skill } = await params;
  const s = SKILL_MAP[skill as Skill];
  return { title: s ? s.label : "Skill" };
}

export default async function SkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  if (!VALID.includes(skill as Skill)) notFound();
  const profile = await requireActiveProfile();
  if (isStaff(profile.role)) redirect("/materials");

  const supabase = await createClient();
  // RLS already restricts to the student's level + group.
  const { data } = await supabase
    .from("materials")
    .select("*")
    .eq("skill", skill)
    .order("created_at", { ascending: false });
  const materials = (data as Material[] | null) ?? [];
  const urls = await signedUrls("materials", materials.map((m) => m.file_path));
  const meta = SKILL_MAP[skill as Skill];

  return (
    <div>
      <Link href="/skills" className="mb-3 inline-flex items-center gap-1 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" /> Skills
      </Link>
      <PageHeader title={`${meta.emoji} ${meta.label}`} subtitle="Tap to download or watch." />
      {(skill === "writing" || skill === "speaking") && (
        <Link
          href={skill === "writing" ? "/writing" : "/speaking"}
          className="card mb-3 flex items-center gap-3 border-primary-soft/40 bg-primary/10 p-4 transition hover:bg-elevated"
        >
          <Sparkles className="h-5 w-5 text-primary-soft" />
          <div className="flex-1 text-sm">
            <div className="font-semibold">AI {meta.label} check</div>
            <div className="text-muted">Get an instant band score &amp; examiner feedback</div>
          </div>
          <ArrowRight className="h-4 w-4 text-subtle" />
        </Link>
      )}
      {materials.length === 0 ? (
        <EmptyState icon={BookOpen} title="Nothing here yet" description="Your teacher hasn't added materials for this skill yet." />
      ) : (
        <div className="space-y-2">
          {materials.map((m) => (
            <MaterialItem key={m.id} material={m} fileUrl={m.file_path ? urls.get(m.file_path) : null} />
          ))}
        </div>
      )}
    </div>
  );
}
