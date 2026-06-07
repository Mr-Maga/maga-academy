import Link from "next/link";
import { Logo } from "@/components/brand";
import { ProfileMenu } from "./profile-menu";
import type { Profile } from "@/lib/types";

export function TopBar({ profile }: { profile: Profile }) {
  const name = profile.full_name || profile.email || "there";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div
        className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9 text-lg" />
          <div className="text-base font-extrabold tracking-tight">Maga Academy</div>
        </Link>

        <ProfileMenu name={name} email={profile.email ?? ""} isStudent={profile.role === "student"} />
      </div>
    </header>
  );
}
