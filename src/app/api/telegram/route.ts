import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTelegramMessage, sendTelegramTo, escapeHtml } from "@/lib/telegram";
import type { FeedbackKind } from "@/lib/types";

// Telegram webhook. Set it with:
//   https://api.telegram.org/bot<TOKEN>/setWebhook?url=<SITE>/api/telegram&secret_token=<SECRET>
// Telegram then sends the secret back in this header on every update.
export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = request.headers.get("x-telegram-bot-api-secret-token");
  if (secret && got !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: {
    message?: { text?: string; chat?: { id?: number }; from?: { username?: string; first_name?: string } };
  };
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = update.message;
  const text = (msg?.text ?? "").trim();
  const chatId = msg?.chat?.id;
  const username = msg?.from?.username ?? msg?.from?.first_name ?? null;

  if (!text || !chatId) return NextResponse.json({ ok: true });

  // /start — greet, don't store.
  if (text === "/start" || text.startsWith("/start ")) {
    await sendTelegramTo(
      String(chatId),
      "Assalomu alaykum! Maga Academy botiga xush kelibsiz. 📚\n\nShikoyat yoki taklif yuborish uchun shunchaki yozing. Ota-onalar shikoyat, o‘quvchilar haftalik fikr yuborishi mumkin.",
    );
    return NextResponse.json({ ok: true });
  }

  // Determine kind from an optional command prefix.
  let kind: FeedbackKind = "feedback";
  let body = text;
  if (text.toLowerCase().startsWith("/complaint")) {
    kind = "complaint";
    body = text.replace(/^\/complaint\s*/i, "").trim() || "(no details)";
  } else if (text.toLowerCase().startsWith("/feedback")) {
    kind = "feedback";
    body = text.replace(/^\/feedback\s*/i, "").trim() || "(no details)";
  }

  // Store with the service-role client (no user session on the webhook).
  const supabase = createAdminClient();
  await supabase.from("feedback").insert({
    user_id: null,
    kind,
    source: "telegram",
    message: body,
    telegram_username: username,
  });

  // Forward a copy to the centre chat and acknowledge the sender.
  await sendTelegramMessage(
    `📨 <b>Telegram ${kind}</b>${username ? ` from @${escapeHtml(username)}` : ""}\n\n${escapeHtml(body)}`,
  );
  await sendTelegramTo(String(chatId), "Rahmat! Xabaringiz qabul qilindi. ✅");

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "maga-academy telegram webhook" });
}
