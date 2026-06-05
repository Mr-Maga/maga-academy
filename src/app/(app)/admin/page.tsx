import type { Metadata } from "next";
import { UserCheck, Users, GraduationCap, MessageSquare, FolderPlus, ClipboardCheck } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { PageHeader, LinkCard } from "@/components/ui";

export const metadata: Metadata = { title: "Manage" };

export default async function AdminHub() {
  await requireRole("admin");
  return (
    <div>
      <PageHeader title="Manage" subtitle="Run the academy from here." />
      <div className="grid gap-2">
        <LinkCard href="/admin/access" icon={UserCheck} title="Approvals & access" description="Approve students/parents, set 30-day expiry, lock" tone="amber" />
        <LinkCard href="/admin/groups" icon={Users} title="Groups & schedule" description="Create groups, assign a teacher, add students" tone="primary" />
        <LinkCard href="/admin/users" icon={GraduationCap} title="Users, levels & links" description="Set level/role, link parents to children" tone="teal" />
        <LinkCard href="/feedback" icon={MessageSquare} title="Complaints & feedback" description="Read messages from Telegram & the app" tone="danger" />
        <LinkCard href="/materials/new" icon={FolderPlus} title="Upload material" description="Add content for a level" tone="primary" />
        <LinkCard href="/homework/new" icon={ClipboardCheck} title="Assign homework" description="By level or group" tone="teal" />
      </div>
    </div>
  );
}
