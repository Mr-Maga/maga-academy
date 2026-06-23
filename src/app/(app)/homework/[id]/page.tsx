import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2, FileDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { requireActiveProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { Card, Badge, LevelChip } from "@/components/legacy-ui";
import { SubmitButton } from "@/components/form-controls";
import { isStaff, levelLabel, SKILL_MAP } from "@/lib/constants";
import { relativeDue, formatDateTime } from "@/lib/utils";
import type { Homework, Profile, Submission } from "@/lib/types";
import { deleteHomework } from "../actions";
import { SubmitForm } from "./submit-form";
import { GradeForm } from "./grade-form";
import { TeacherAiOpinion } from "./teacher-ai-opinion";

export const metadata: Metadata = { title: "Homework" };

type RosterStudent = Pick<Profile, "id" | "full_name" | "email" | "group_id">;

export default async function HomeworkDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireActiveProfile();
  const supabase = await createClient();

  const { data: hwRaw } = await supabase.from("homework").select("*").eq("id", id).maybeSingle();
  if (!hwRaw) notFound();
  const hw = hwRaw as Homework;
  const staff = isStaff(profile.role);
  const overdue = hw.due_at ? new Date(hw.due_at).getTime() < Date.now() : false;

  return (
    <div className="space-y-5">
      <Link href="/homework" className="inline-flex items-center gap-1 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" /> Homework
      </Link>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold">{hw.title}</h1>
          {staff && (
            <form action={deleteHomework}>
              <input type="hidden" name="homework_id" value={hw.id} />
              <SubmitButton className="text-danger" pendingLabel="…">
                <Trash2 className="h-4 w-4" />
              </SubmitButton>
            </form>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <LevelChip level={hw.level} />
          {hw.skill && <Badge tone="primary">{SKILL_MAP[hw.skill].label}</Badge>}
          <span className={overdue ? "text-danger" : ""}>
            <Clock className="mr-1 inline h-3 w-3" />
            {relativeDue(hw.due_at)}
          </span>
        </div>
        {hw.description && <p className="mt-3 whitespace-pre-wrap text-sm text-fg/90">{hw.description}</p>}
      </Card>

      {staff ? (
        <StaffView hw={hw} />
      ) : (
        <StudentView hw={hw} studentId={profile.id} />
      )}
    </div>
  );
}

async function StudentView({ hw, studentId }: { hw: Homework; studentId: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("homework_id", hw.id)
    .eq("student_id", studentId)
    .maybeSingle();
  const sub = (data as Submission | null) ?? null;

  let fileUrl: string | null = null;
  if (sub?.file_path) {
    const { data: signed } = await supabase.storage.from("submissions").createSignedUrl(sub.file_path, 3600);
    fileUrl = signed?.signedUrl ?? null;
  }

  return (
    <>
      {sub?.status === "graded" && (
        <Card className="border-teal/40 bg-teal/10">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-teal">
              <CheckCircle2 className="h-5 w-5" /> Graded
            </span>
            <span className="text-2xl font-bold text-teal">
              {sub.score}
              <span className="text-base text-muted">/{sub.max_score}</span>
            </span>
          </div>
          {sub.comment && <p className="mt-2 text-sm text-fg/90">“{sub.comment}”</p>}
        </Card>
      )}

      <Card>
        <h2 className="mb-3 font-semibold">Your submission</h2>
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mb-3 w-full text-sm">
            <FileDown className="h-4 w-4" /> View attached file
          </a>
        )}
        <SubmitForm homeworkId={hw.id} defaultBody={sub?.body} graded={sub?.status === "graded"} />
      </Card>
    </>
  );
}

async function StaffView({ hw }: { hw: Homework }) {
  const supabase = await createClient();

  let rosterQuery = supabase
    .from("profiles")
    .select("id, full_name, email, group_id")
    .eq("role", "student")
    .eq("level", hw.level);
  if (hw.group_id) rosterQuery = rosterQuery.eq("group_id", hw.group_id);

  const [{ data: rosterRaw }, { data: subsRaw }] = await Promise.all([
    rosterQuery.order("full_name"),
    supabase.from("submissions").select("*").eq("homework_id", hw.id),
  ]);

  const roster = (rosterRaw as RosterStudent[] | null) ?? [];
  const subs = (subsRaw as Submission[] | null) ?? [];
  const subByStudent = new Map(subs.map((s) => [s.student_id, s]));

  // Signed URLs for any attached files.
  const paths = subs.filter((s) => s.file_path).map((s) => s.file_path!) as string[];
  const urlMap = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("submissions").createSignedUrls(paths, 3600);
    for (const s of signed ?? []) if (s.signedUrl && s.path) urlMap.set(s.path, s.signedUrl);
  }

  const overdue = hw.due_at ? new Date(hw.due_at).getTime() < Date.now() : false;
  const done = roster.filter((r) => subByStudent.has(r.id)).length;
  const missing = roster.length - done;

  return (
    <div>
      <div className="mb-3 flex gap-2 text-sm">
        <Badge tone="teal">{done} submitted</Badge>
        <Badge tone={missing > 0 && overdue ? "danger" : "muted"}>{missing} not done</Badge>
        <span className="ml-auto text-muted">{levelLabel(hw.level)}</span>
      </div>

      {roster.length === 0 ? (
        <Card className="text-center text-sm text-muted">No students match this level/group yet.</Card>
      ) : (
        <div className="space-y-2">
          {roster.map((r) => {
            const sub = subByStudent.get(r.id);
            const fileUrl = sub?.file_path ? urlMap.get(sub.file_path) : null;
            return (
              <Card key={r.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{r.full_name || r.email}</span>
                  {!sub ? (
                    <Badge tone={overdue ? "danger" : "amber"}>
                      {overdue && <AlertTriangle className="h-3 w-3" />}
                      {overdue ? "Did not do homework" : "Waiting"}
                    </Badge>
                  ) : sub.status === "graded" ? (
                    <Badge tone="teal">
                      <CheckCircle2 className="h-3 w-3" /> {sub.score}/{sub.max_score}
                    </Badge>
                  ) : (
                    <Badge tone="primary">Submitted</Badge>
                  )}
                </div>

                {sub && (
                  <>
                    {sub.body && (
                      <p className="mt-2 whitespace-pre-wrap rounded-lg bg-surface px-3 py-2 text-sm">{sub.body}</p>
                    )}
                    {fileUrl && (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary-soft">
                        <FileDown className="h-4 w-4" /> Attached file
                      </a>
                    )}
                    <p className="mt-1 text-[11px] text-subtle">Submitted {formatDateTime(sub.submitted_at)}</p>
                    <GradeForm
                      submissionId={sub.id}
                      homeworkId={hw.id}
                      studentId={r.id}
                      score={sub.score}
                      maxScore={sub.max_score}
                      comment={sub.comment}
                    />
                    {sub.body && <TeacherAiOpinion submissionId={sub.id} />}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
