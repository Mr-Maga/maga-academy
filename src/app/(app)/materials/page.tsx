import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/ui";
import { MaterialItem } from "@/components/material-item";
import { signedUrls } from "@/lib/storage";
import type { Material } from "@/lib/types";

export const metadata: Metadata = { title: "Materials" };

export default async function MaterialsPage() {
  await requireRole("admin", "teacher");
  const supabase = await createClient();
  const { data } = await supabase.from("materials").select("*").order("created_at", { ascending: false });
  const materials = (data as Material[] | null) ?? [];
  const urls = await signedUrls("materials", materials.map((m) => m.file_path));

  return (
    <div>
      <PageHeader
        title="Materials"
        subtitle="Everything you've shared, newest first."
        action={
          <Link href="/materials/new" className="btn-primary px-3 py-2 text-sm">
            <Plus className="h-4 w-4" /> Add
          </Link>
        }
      />
      {materials.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No materials yet" description="Tap Add to upload your first file or video." />
      ) : (
        <div className="space-y-2">
          {materials.map((m) => (
            <MaterialItem key={m.id} material={m} fileUrl={m.file_path ? urls.get(m.file_path) : null} canManage showLevel />
          ))}
        </div>
      )}
    </div>
  );
}
