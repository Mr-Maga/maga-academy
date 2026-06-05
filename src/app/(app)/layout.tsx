import { BottomNav } from "@/components/app-shell/bottom-nav";
import { TopBar } from "@/components/app-shell/top-bar";
import { AiTutorLauncher } from "@/components/ai/ai-tutor-launcher";
import { requireActiveProfile } from "@/lib/dal";

// Gated app shell: ensures signed-in + role claimed + active access, then
// renders the mobile-first chrome (top bar + bottom nav).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireActiveProfile();
  const role = profile.role!;
  const showTutor = role === "student" || role === "parent";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col">
      <TopBar profile={profile} />
      <main className="flex-1 px-4 pt-5 pb-28">{children}</main>
      <BottomNav role={role} />
      {showTutor && <AiTutorLauncher />}
    </div>
  );
}
