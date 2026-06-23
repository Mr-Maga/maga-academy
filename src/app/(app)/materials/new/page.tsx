import type { Metadata } from "next";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/legacy-ui";
import type { Group } from "@/lib/types";
import { MaterialForm } from "./material-form";

export const metadata: Metadata = { title: "Add material" };

export default async function NewMaterialPage() {
  const profile = await requireRole("admin", "teacher");
  const supabase = await createClient();
  let query = supabase.from("groups").select("id, name, level").order("name");
  if (profile.role === "teacher") query = query.eq("teacher_id", profile.id);
  const { data } = await query;

  return (
    <div>
      <PageHeader title="Add material" subtitle="Upload a file to storage or paste a video link." />
      <Card>
        <MaterialForm groups={(data as Pick<Group, "id" | "name" | "level">[] | null) ?? []} />
      </Card>
    </div>
  );
}
