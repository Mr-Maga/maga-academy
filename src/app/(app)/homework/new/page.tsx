import type { Metadata } from "next";
import { requireRole } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/ui";
import type { Group } from "@/lib/types";
import { HomeworkForm } from "./homework-form";

export const metadata: Metadata = { title: "Assign homework" };

export default async function NewHomeworkPage() {
  const profile = await requireRole("admin", "teacher");
  const supabase = await createClient();

  // Teachers see their own groups; admins see all.
  let query = supabase.from("groups").select("id, name, level").order("name");
  if (profile.role === "teacher") query = query.eq("teacher_id", profile.id);
  const { data } = await query;

  return (
    <div>
      <PageHeader title="Assign homework" subtitle="Set a deadline and target a level or a specific group." />
      <Card>
        <HomeworkForm groups={(data as Pick<Group, "id" | "name" | "level">[] | null) ?? []} />
      </Card>
    </div>
  );
}
