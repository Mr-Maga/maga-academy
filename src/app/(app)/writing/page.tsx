import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { WritingClient } from "./writing-client";
import { EvaluationHistory } from "@/components/evaluation-history";

export const metadata: Metadata = { title: "AI Writing check" };

export default async function WritingPage() {
  await requireActiveProfile();
  return (
    <div>
      <PageHeader
        title="✍️ AI Writing check"
        subtitle="Get an instant IELTS band score with examiner-style feedback."
      />
      <WritingClient />
      <EvaluationHistory kind="writing" />
    </div>
  );
}
