import Link from "next/link";
import { UserRound } from "lucide-react";
import { Logo } from "@/components/brand";
import { LevelChip } from "@/components/ui";
import { ROLE_LABELS } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export function TopBar({ profile }: { profile: Profile }) {
  const name = profile.full_name || profile.email || "there";
  const first = name.split(/[ @]/)[0];
  const isStudent = profile.role === "student";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div
        className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9 text-lg" />
          <div className="leading-tight">
            <div className="text-[13px] text-muted">Hi, {first} 👋</div>
            <div className="text-sm font-bold">
              {profile.role ? ROLE_LABELS[profile.role] : "Maga Academy"}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isStudent && <LevelChip level={profile.level} />}
          <Link
            href="/account"
            aria-label="Account"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition hover:text-fg"
          >
            <UserRound className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
