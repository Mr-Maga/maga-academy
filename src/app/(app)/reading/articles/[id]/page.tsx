import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireActiveProfile } from "@/lib/dal";
import { ReadingReader } from "@/components/reading/reader";
import { pieceById } from "@/lib/reading-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const piece = pieceById(id);
  return { title: piece?.title ?? "Article" };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireActiveProfile();
  const { id } = await params;
  const piece = pieceById(id);
  if (!piece || piece.kind !== "article") notFound();

  return <ReadingReader piece={piece} backHref="/reading/articles" backLabel="All articles" />;
}
