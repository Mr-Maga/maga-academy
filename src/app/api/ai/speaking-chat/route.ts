import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiConfigured, speakingChat } from "@/lib/gemini";

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
  if (!geminiConfigured()) return NextResponse.json({ reply: "AI hozircha sozlanmagan." });

  let body: { part?: number; question?: string; transcript?: string; evalSummary?: string; messages?: InMsg[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-10)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content ?? "").slice(0, 2000),
    }))
    .filter((m) => m.content);
  if (messages.length === 0) return NextResponse.json({ reply: "Savolingizni yozing 🙂" });

  try {
    const reply = await speakingChat({
      part: Number(body.part ?? 2),
      question: String(body.question ?? ""),
      transcript: String(body.transcript ?? ""),
      evalSummary: String(body.evalSummary ?? ""),
      messages,
    });
    return NextResponse.json({ reply });
  } catch (e) {
    const quota = e instanceof Error && e.message === "QUOTA";
    return NextResponse.json({
      reply: quota
        ? "Hozir AI biroz band (bepul limit). Bir daqiqadan keyin urinib ko‘ring 🙏"
        : "Kechirasiz, hozir javob bera olmadim.",
    });
  }
}
