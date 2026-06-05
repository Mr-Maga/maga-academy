import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader, LevelChip } from "@/components/ui";
import { SKILLS, isStaff, levelLabel } from "@/lib/constants";

export const metadata: Metadata = { title: "Skills" };

export default async function SkillsPage() {
  const profile = await requireActiveProfile();
  if (isStaff(profile.role)) redirect("/materials");

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle={`Materials for your level — ${levelLabel(profile.level)}`}
        action={<LevelChip level={profile.level} />}
      />
      <div className="grid grid-cols-2 gap-3">
        {SKILLS.map((s) => (
          <Link
            key={s.key}
            href={`/skills/${s.key}`}
            className="card flex flex-col gap-2 p-5 transition hover:bg-elevated active:scale-[0.98]"
          >
            <span className="text-3xl">{s.emoji}</span>
            <span className="font-semibold">{s.label}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs text-primary-soft">
              Open <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
