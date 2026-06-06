"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, TrendingUp, Menu as MenuIcon, type LucideIcon } from "lucide-react";
import { NAV, activeHref } from "@/lib/nav";
import { MenuDrawer } from "./menu-drawer";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BottomNav({ role, badges = {} }: { role: Role; badges?: Record<string, number> }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Students get a clean nav (tools live on Home + in the Menu drawer).
  if (role === "student") {
    return (
      <>
        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        <NavBar>
          <NavLink href="/dashboard" label="Asosiy" icon={LayoutDashboard} active={pathname === "/dashboard"} />
          <NavLink href="/progress" label="Progress" icon={TrendingUp} active={pathname.startsWith("/progress")} />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="relative flex flex-1 flex-col items-center gap-1 px-1 pt-2.5 pb-1.5 text-[11px] font-medium text-subtle transition hover:text-muted"
          >
            <MenuIcon className="h-[22px] w-[22px]" strokeWidth={2} />
            <span>Menyu</span>
          </button>
        </NavBar>
      </>
    );
  }

  // Staff / parents keep their role-specific management nav.
  const items = NAV[role];
  const active = activeHref(pathname, items);
  return (
    <NavBar>
      {items.map((item) => {
        const isActive = active === item.href;
        const count = badges[item.href] ?? 0;
        return (
          <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={isActive} badge={count} />
        );
      })}
    </NavBar>
  );
}

function NavBar({ children }: { children: React.ReactNode }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-lg">
      <div
        className="mx-auto flex max-w-3xl items-stretch justify-around px-1"
        style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))" }}
      >
        {children}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge = 0,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-1 flex-col items-center gap-1 px-1 pt-2.5 pb-1.5 text-[11px] font-medium transition",
        active ? "text-primary-soft" : "text-subtle hover:text-muted",
      )}
    >
      {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary-soft" />}
      <span className="relative">
        <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
        {badge > 0 && (
          <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      <span>{label}</span>
    </Link>
  );
}
