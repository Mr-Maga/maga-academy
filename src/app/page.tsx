import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";
import { Landing } from "@/components/marketing/landing";

// Root: signed-in users go straight to the app; everyone else sees the
// marketing landing (the "entry" experience). CTAs route to Google sign-in.
export default async function Home() {
  // Tolerate a missing/misconfigured Supabase env (e.g. a fresh deploy with no
  // env vars yet) so the public landing always renders. Auth wiring comes later.
  let user = null;
  try {
    user = await getUser();
  } catch {
    user = null;
  }
  if (user) redirect("/dashboard");
  return <Landing />;
}
