import { createBrowserClient } from "@supabase/ssr";

// Browser (Client Component) Supabase client. Safe to call on every render —
// createBrowserClient memoises a singleton internally.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
