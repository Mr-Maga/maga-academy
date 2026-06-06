"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LearningPath } from "@/lib/types";

/** Save the student's chosen track (IELTS vs General) and enter the app. */
export async function chooseLearningPath(path: LearningPath) {
  if (path !== "ielts" && path !== "general") return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("profiles").update({ learning_path: path }).eq("id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
