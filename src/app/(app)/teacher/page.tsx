import type { Metadata } from "next";
import { requireActiveProfile } from "@/lib/dal";
import { PageHeader } from "@/components/legacy-ui";
import { TeacherChat } from "./teacher-chat";

export const metadata: Metadata = { title: "AI Teacher" };

export default async function TeacherPage() {
  await requireActiveProfile();
  return (
    <div>
      <PageHeader title="👨‍🏫 AI Teacher" subtitle="Ask anything — concepts, grammar, IELTS strategy, band tips." />
      <TeacherChat />
    </div>
  );
}
