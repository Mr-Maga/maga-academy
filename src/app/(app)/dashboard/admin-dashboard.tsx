import Link from "next/link";
import {
  UserCheck,
  GraduationCap,
  Users,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Settings2,
  FolderPlus,
  ClipboardCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, LinkCard, StatCard } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Feedback, Profile } from "@/lib/types";

export async function AdminDashboard({ profile }: { profile: Profile }) {
  void profile;
  const supabase = await createClient();

  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    { count: pending },
    { count: activeStudents },
    { count: groupCount },
    { count: thisMonth },
    { count: lastMonth },
    { data: feedbackRaw },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("access_status", "pending")
      .in("role", ["student", "parent"]),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student")
      .eq("access_status", "active"),
    supabase.from("groups").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student")
      .gte("created_at", startThisMonth),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student")
      .gte("created_at", startLastMonth)
      .lt("created_at", startThisMonth),
    supabase
      .from("feedback")
      .select("*")
      .eq("handled", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const feedback = (feedbackRaw as Feedback[] | null) ?? [];
  const growth = (thisMonth ?? 0) - (lastMonth ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-muted">Approvals, groups, levels and feedback.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={UserCheck} tone="amber" label="Pending" value={pending ?? 0} hint="Awaiting approval" />
        <StatCard icon={GraduationCap} tone="teal" label="Active students" value={activeStudents ?? 0} hint="Active students" />
        <StatCard icon={Users} tone="primary" label="Groups" value={groupCount ?? 0} hint="Groups" />
        <StatCard
          icon={growth >= 0 ? TrendingUp : TrendingDown}
          tone={growth >= 0 ? "teal" : "danger"}
          label="Growth"
          value={`${growth >= 0 ? "+" : ""}${growth}`}
          hint="New students vs last month"
        />
      </div>

      {(pending ?? 0) > 0 && (
        <Link href="/admin/access" className="card flex items-center gap-3 border-amber/40 bg-amber/10 p-4">
          <UserCheck className="h-5 w-5 text-amber" />
          <div className="flex-1 text-sm">
            <span className="font-semibold text-amber">{pending} account(s)</span>{" "}
            <span className="text-muted">waiting for approval — tap to review.</span>
          </div>
        </Link>
      )}

      <section>
        <h2 className="mb-2 font-semibold">Manage</h2>
        <div className="grid gap-2">
          <LinkCard href="/admin/access" icon={UserCheck} title="Approvals & access" description="Approve, lock, set expiry" tone="amber" />
          <LinkCard href="/admin/groups" icon={Users} title="Groups" description="Create groups, assign teachers & students" tone="primary" />
          <LinkCard href="/admin/users" icon={GraduationCap} title="Users & levels" description="Set roles, levels and links" tone="teal" />
          <LinkCard href="/materials/new" icon={FolderPlus} title="Upload material" description="Add learning content" tone="primary" />
          <LinkCard href="/homework/new" icon={ClipboardCheck} title="Assign homework" description="By level or group" tone="danger" />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Recent feedback</h2>
          <Link href="/feedback" className="text-sm font-medium text-primary-soft">
            See all
          </Link>
        </div>
        {feedback.length === 0 ? (
          <Card className="flex items-center gap-3 text-sm text-muted">
            <MessageSquare className="h-4 w-4" /> No new complaints or feedback.
          </Card>
        ) : (
          <div className="space-y-2">
            {feedback.map((f) => (
              <div key={f.id} className="card p-3.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="chip bg-surface text-xs capitalize text-muted">{f.kind}</span>
                  <span className="text-[11px] text-subtle">{formatDate(f.created_at)}</span>
                </div>
                <p className="line-clamp-2 text-sm">{f.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
