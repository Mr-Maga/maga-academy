import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiConfigured, evaluateSpeakingAudio } from "@/lib/gemini";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!geminiConfigured()) return NextResponse.json({ error: "AI hozircha sozlanmagan." }, { status: 400 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const partRaw = Number(form.get("part") ?? 2);
  const part = (partRaw === 1 || partRaw === 3 ? partRaw : 2) as 1 | 2 | 3;
  const question = String(form.get("question") ?? "").trim();
  const file = form.get("audio");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Ovoz yozuvi topilmadi. Avval gapirib yozing." }, { status: 400 });
  }
  if (file.size > 18 * 1024 * 1024) {
    return NextResponse.json({ error: "Yozuv juda uzun — qisqaroq gapiring." }, { status: 400 });
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const result = await evaluateSpeakingAudio({
      part,
      question,
      audio: { data: buf.toString("base64"), mimeType: file.type || "audio/wav" },
    });

    await supabase.from("evaluations").insert({
      student_id: user.id,
      kind: "speaking",
      sub_type: `part${part}`,
      question: question || null,
      answer: result.transcript ?? null,
      overall_band: result.overall_band,
      result,
    });

    return NextResponse.json({ result });
  } catch (e) {
    const quota = e instanceof Error && e.message === "QUOTA";
    return NextResponse.json(
      {
        error: quota
          ? "AI biroz band (bepul limit). Bir daqiqadan keyin urinib ko‘ring."
          : "Baholashda xatolik. Birozdan keyin urinib ko‘ring.",
      },
      { status: 200 },
    );
  }
}
