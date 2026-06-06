"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/dal";
import { ACCESS_DEFAULT_DAYS } from "@/lib/constants";
import type { LevelKey, Role } from "@/lib/types";

async function adminGuard() {
  await requireRole("admin");
  return createClient();
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/access");
  revalidatePath("/admin/groups");
  revalidatePath("/admin/users");
}

/** Approve (or renew) access for +N days from now. */
export async function approveAccess(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("user_id") ?? "");
  const days = Number(formData.get("days") ?? ACCESS_DEFAULT_DAYS) || ACCESS_DEFAULT_DAYS;
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  if (id) {
    await supabase
      .from("profiles")
      .update({ access_status: "active", access_expires_at: expires })
      .eq("id", id);
  }
  refresh();
}

export async function lockAccess(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("user_id") ?? "");
  if (id) {
    await supabase.from("profiles").update({ access_status: "locked" }).eq("id", id);
  }
  refresh();
}

export async function setLevel(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("user_id") ?? "");
  const level = String(formData.get("level") ?? "") as LevelKey | "";
  if (id) {
    await supabase
      .from("profiles")
      .update({ level: level === "" ? null : level })
      .eq("id", id);
  }
  refresh();
}

export async function setRole(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  if (id && ["admin", "teacher", "student", "parent"].includes(role)) {
    await supabase.from("profiles").update({ role, code_claimed: true }).eq("id", id);
  }
  refresh();
}

export async function assignGroup(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("user_id") ?? "");
  const groupId = String(formData.get("group_id") ?? "");
  if (id) {
    await supabase
      .from("profiles")
      .update({ group_id: groupId === "" ? null : groupId })
      .eq("id", id);
  }
  refresh();
}

export async function createGroup(formData: FormData) {
  const supabase = await adminGuard();
  const name = String(formData.get("name") ?? "").trim();
  const level = String(formData.get("level") ?? "") as LevelKey;
  const teacherId = String(formData.get("teacher_id") ?? "");
  const schedule = String(formData.get("schedule") ?? "").trim();
  if (name && level) {
    await supabase.from("groups").insert({
      name,
      level,
      teacher_id: teacherId === "" ? null : teacherId,
      schedule: schedule || null,
    });
  }
  refresh();
}

export async function updateGroup(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("group_id") ?? "");
  const teacherId = String(formData.get("teacher_id") ?? "");
  const schedule = String(formData.get("schedule") ?? "").trim();
  if (id) {
    await supabase
      .from("groups")
      .update({ teacher_id: teacherId === "" ? null : teacherId, schedule: schedule || null })
      .eq("id", id);
  }
  refresh();
}

export async function deleteGroup(formData: FormData) {
  const supabase = await adminGuard();
  const id = String(formData.get("group_id") ?? "");
  if (id) await supabase.from("groups").delete().eq("id", id);
  refresh();
}

/** Link a parent to a student. If the child is already active, the parent is
 * activated to mirror the child's access window. */
export async function linkParent(formData: FormData) {
  const supabase = await adminGuard();
  const parentId = String(formData.get("parent_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!parentId || !studentId) {
    refresh();
    return;
  }
  await supabase.from("parent_links").insert({ parent_id: parentId, student_id: studentId });

  const { data: child } = await supabase
    .from("profiles")
    .select("access_status, access_expires_at")
    .eq("id", studentId)
    .maybeSingle();
  if (child?.access_status === "active") {
    await supabase
      .from("profiles")
      .update({ access_status: "active", access_expires_at: child.access_expires_at })
      .eq("id", parentId);
  }
  refresh();
}

export async function unlinkParent(formData: FormData) {
  const supabase = await adminGuard();
  const linkId = String(formData.get("link_id") ?? "");
  if (linkId) await supabase.from("parent_links").delete().eq("id", linkId);
  refresh();
}

/** Edit academy info (name, about, contact, schedule, prices) — used by the AI
 * tutor and shown to learners. */
export async function updateAcademy(formData: FormData) {
  const supabase = await adminGuard();
  const data = {
    name: String(formData.get("name") ?? "").trim() || "Maga Academy",
    about: String(formData.get("about") ?? "").trim(),
    contactTelegram: String(formData.get("contactTelegram") ?? "").trim(),
    schedule: String(formData.get("schedule") ?? "").trim(),
    prices: [
      { plan: "IELTS", price: String(formData.get("price_ielts") ?? "").trim() },
      { plan: "CEFR", price: String(formData.get("price_cefr") ?? "").trim() },
      { plan: "General English (A1–B2)", price: String(formData.get("price_general") ?? "").trim() },
    ],
  };
  await supabase.from("app_settings").update({ data, updated_at: new Date().toISOString() }).eq("id", 1);
  revalidatePath("/admin/academy");
  revalidatePath("/admin");
}
