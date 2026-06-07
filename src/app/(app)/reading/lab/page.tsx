import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { ReadingClient } from "../reading-client";

export const metadata: Metadata = { title: "AI Reading Test" };

export default async function ReadingLabPage() {
  await requireActiveProfile();
  return (
    <div>
      <PageHeader
        title="AI Reading Test"
        subtitle="Maga generates a fresh passage + questions — instant band & explanations."
      />
      <ReadingClient />
    </div>
  );
}
