"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, activeHref } from "@/lib/nav";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV[role];
  const active = activeHref(pathname, items);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-lg">
      <div
        className="mx-auto flex max-w-3xl items-stretch justify-around px-1"
        style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))" }}
      >
        {items.map((item) => {
          const isActive = active === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 px-1 pt-2.5 pb-1.5 text-[11px] font-medium transition",
                isActive ? "text-primary-soft" : "text-subtle hover:text-muted",
              )}
            >
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary-soft" />
              )}
              <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
