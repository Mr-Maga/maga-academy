"use client";

import { Home, BookOpen, PenLine, Trophy, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: PenLine },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "account", label: "Account", icon: User },
];

/**
 * Bottom navigation — 5 items, active = primary, big tap targets (≥44px),
 * safe-area aware. Presentational: pass active + onSelect to wire it.
 */
export function BottomNav({
  items = DEFAULT_NAV,
  active,
  onSelect,
}: {
  items?: NavItem[];
  active?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[520px]"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 0.4rem)",
        background: "linear-gradient(0deg, rgba(10,10,13,0.92), rgba(10,10,13,0.7))",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-stretch justify-around px-2 pt-1.5">
        {items.map((it) => {
          const on = it.id === active;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => onSelect?.(it.id)}
              aria-current={on ? "page" : undefined}
              className={cn(
                "focus-ring relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 transition-colors active:scale-[0.95]",
                on ? "text-primary-soft" : "text-subtle hover:text-muted",
              )}
            >
              {on && (
                <span
                  aria-hidden
                  className="absolute top-0 h-0.5 w-8 rounded-full"
                  style={{ background: "var(--color-primary)", boxShadow: "0 0 10px var(--color-primary)" }}
                />
              )}
              <Icon size={20} strokeWidth={on ? 2.2 : 1.7} />
              <span className="text-[10px] font-medium">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
