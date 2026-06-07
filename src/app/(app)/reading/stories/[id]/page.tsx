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
  return { title: piece?.title ?? "Story" };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireActiveProfile();
  const { id } = await params;
  const piece = pieceById(id);
  if (!piece || piece.kind !== "story") notFound();

  return <ReadingReader piece={piece} backHref="/reading/stories" backLabel="All stories" />;
}
