import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { SpeakingClient } from "./speaking-client";
import { EvaluationHistory } from "@/components/evaluation-history";

export const metadata: Metadata = { title: "AI Speaking examiner" };

export default async function SpeakingPage() {
  await requireActiveProfile();
  return (
    <div>
      <PageHeader
        title="🎙️ AI Speaking examiner"
        subtitle="Practice Part 1–3, get a band score and a model answer."
      />
      <SpeakingClient />
      <EvaluationHistory kind="speaking" />
    </div>
  );
}
