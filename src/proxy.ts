import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: this file replaces the old `middleware.ts`. It runs on the
// Node.js runtime, which is exactly what Supabase SSR needs.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run on every page request except Next internals, static assets and API
  // routes (those handle their own auth). This keeps the auth session fresh.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
