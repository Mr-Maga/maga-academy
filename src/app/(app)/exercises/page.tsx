import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/legacy-ui";
import { ExercisesClient } from "./exercises-client";

export const metadata: Metadata = { title: "AI Practice" };

export default async function ExercisesPage() {
  await requireActiveProfile();
  return (
    <div>
      <PageHeader
        title="🧠 AI Practice"
        subtitle="Endless reading, grammar & vocabulary — generated for your level, graded instantly."
      />
      <ExercisesClient />
    </div>
  );
}
