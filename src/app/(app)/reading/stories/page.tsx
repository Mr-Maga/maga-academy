import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/legacy-ui";
import { LibraryBrowser, type LibraryCard } from "@/components/reading/library-browser";
import { piecesByKind, readMinutes, wordCount } from "@/lib/reading-content";

export const metadata: Metadata = { title: "Short Stories" };

export default async function StoriesPage() {
  await requireActiveProfile();
  const items: LibraryCard[] = piecesByKind("story").map((p) => ({
    id: p.id,
    level: p.level,
    title: p.title,
    subtitle: p.subtitle,
    topic: p.topic,
    minutes: readMinutes(p.body),
    words: wordCount(p.body),
  }));

  return (
    <div>
      <PageHeader title="Short Stories" subtitle="Read for pleasure — stories for every level." />
      <LibraryBrowser items={items} basePath="/reading/stories" />
    </div>
  );
}
