"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/dal";
import type { LevelKey, Skill } from "@/lib/types";

export type MaterialState = { error?: string } | undefined;

export async function createMaterial(_prev: MaterialState, formData: FormData): Promise<MaterialState> {
  const profile = await requireRole("admin", "teacher");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const level = String(formData.get("level") ?? "") as LevelKey | "";
  const skill = String(formData.get("skill") ?? "") as Skill | "";
  const groupId = String(formData.get("group_id") ?? "");
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const file = formData.get("file");

  if (!title || !level || !skill) return { error: "Title, level and skill are required." };

  const supabase = await createClient();
  let filePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > 50 * 1024 * 1024) return { error: "File too large (max 50MB)." };
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    filePath = `${level}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage.from("materials").upload(filePath, file);
    if (upErr) return { error: `Upload failed: ${upErr.message}` };
  }

  if (!filePath && !videoUrl) return { error: "Attach a file or paste a video link." };

  const { error } = await supabase.from("materials").insert({
    title,
    description: description || null,
    level,
    skill,
    group_id: groupId === "" ? null : groupId,
    file_path: filePath,
    video_url: videoUrl || null,
    created_by: profile.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/materials");
  redirect("/materials");
}

export async function deleteMaterial(formData: FormData) {
  await requireRole("admin", "teacher");
  const id = String(formData.get("material_id") ?? "");
  const path = String(formData.get("file_path") ?? "");
  const supabase = await createClient();
  if (path) await supabase.storage.from("materials").remove([path]);
  if (id) await supabase.from("materials").delete().eq("id", id);
  revalidatePath("/materials");
}
