import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiConfigured, geminiGenerate, buildTutorSystem, type TutorContext } from "@/lib/gemini";
import { academyInfoForPrompt } from "@/lib/academy";
import { getAcademyInfo } from "@/lib/settings";
import { levelLabel, SKILL_MAP, ROLE_LABELS } from "@/lib/constants";
import type { LevelKey, Role, Skill, StudentProgress } from "@/lib/types";

interface InMsg {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!geminiConfigured()) {
    return NextResponse.json({
      reply:
        "AI hozircha sozlanmagan. Administrator GEMINI_API_KEY ni qo‘shganidan so‘ng men to‘liq ishlayman. 🙂",
    });
  }

  let messages: InMsg[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const safe = messages
    .slice(-12)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content ?? "").slice(0, 2000),
    }))
    .filter((m) => m.content);

  if (safe.length === 0) return NextResponse.json({ reply: "Savolingizni yozing 🙂" });

  // Build a personalised context from the learner's profile + progress.
  const ctx: TutorContext = {};
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, level")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) {
    ctx.name = (profile as { full_name: string | null }).full_name;
    const role = (profile as { role: Role | null }).role;
    ctx.role = role ? ROLE_LABELS[role] : null;
    const level = (profile as { level: LevelKey | null }).level;
    ctx.level = level ? levelLabel(level) : null;

    if (role === "student") {
      const { data: prog } = await supabase.rpc("student_progress");
      const p = prog as StudentProgress | null;
      if (p) {
        ctx.streak = p.current_streak;
        ctx.homeworkCompletion = p.homework_completion;
        ctx.weakestSkill = p.weakest_skill ? SKILL_MAP[p.weakest_skill as Skill].label : null;
      }
    }
  }

  try {
    const academy = await getAcademyInfo();
    const system = buildTutorSystem(ctx, academyInfoForPrompt(academy));
    const reply = await geminiGenerate({ system, messages: safe });
    return NextResponse.json({ reply });
  } catch (e) {
    const quota = e instanceof Error && e.message === "QUOTA";
    return NextResponse.json({
      reply: quota
        ? "Hozir AI biroz band (bepul limit to‘ldi). Bir daqiqadan keyin yana urinib ko‘ring 🙏"
        : "Kechirasiz, hozir javob bera olmadim. Birozdan keyin yana urinib ko‘ring.",
    });
  }
}
