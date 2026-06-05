import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { StudentDashboard } from "./student-dashboard";
import { TeacherDashboard } from "./teacher-dashboard";
import { AdminDashboard } from "./admin-dashboard";
import { ParentDashboard } from "./parent-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await requireActiveProfile();

  switch (profile.role) {
    case "admin":
      return <AdminDashboard profile={profile} />;
    case "teacher":
      return <TeacherDashboard profile={profile} />;
    case "parent":
      return <ParentDashboard profile={profile} />;
    default:
      return <StudentDashboard profile={profile} />;
  }
}
