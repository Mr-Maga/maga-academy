import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { ReadingClient } from "./reading-client";

export const metadata: Metadata = { title: "Reading" };

export default async function ReadingPage() {
  await requireActiveProfile();
  return (
    <div>
      <PageHeader title="Reading Lab" subtitle="AI IELTS reading tests — instant band & explanations." />
      <ReadingClient />
    </div>
  );
}
