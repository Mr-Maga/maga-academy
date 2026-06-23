import { Wordmark } from "./wordmark";
import { StreakFlame } from "./streak-flame";
import { Avatar } from "./avatar";

/**
 * App header — wordmark + streak + avatar. Sticky, with a hairline base and
 * blur so content scrolls under it. Safe-area aware for the notch.
 */
export function Header({
  streakDays = 0,
  user,
  right,
}: {
  streakDays?: number;
  user?: { name?: string | null; avatar?: string | null };
  right?: React.ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-30 w-full"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 0px)",
        background: "linear-gradient(180deg, rgba(10,10,13,0.85), rgba(10,10,13,0.6))",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[520px] items-center justify-between px-4">
        <Wordmark size="md" />
        <div className="flex items-center gap-3">
          {right}
          <StreakFlame days={streakDays} size="sm" />
          <Avatar name={user?.name} src={user?.avatar} size={32} ring />
        </div>
      </div>
    </header>
  );
}
