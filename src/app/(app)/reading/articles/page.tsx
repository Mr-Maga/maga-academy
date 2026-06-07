import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/ui";
import { LibraryBrowser, type LibraryCard } from "@/components/reading/library-browser";
import { piecesByKind, readMinutes, wordCount } from "@/lib/reading-content";

export const metadata: Metadata = { title: "Articles" };

export default async function ArticlesPage() {
  await requireActiveProfile();
  const items: LibraryCard[] = piecesByKind("article").map((p) => ({
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
      <PageHeader title="Articles" subtitle="Pick your level and read about the real world." />
      <LibraryBrowser items={items} basePath="/reading/articles" />
    </div>
  );
}
