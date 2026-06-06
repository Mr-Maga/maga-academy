import {
  LayoutDashboard,
  ClipboardList,
  Trophy,
  Users,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  Settings2,
  PenLine,
  Mic,
  Library,
  Brain,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Bottom-nav items per role (kept to ≤5 for a clean mobile bar).
export const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard", label: "Asosiy", icon: LayoutDashboard },
    { href: "/writing", label: "Writing", icon: PenLine },
    { href: "/speaking", label: "Speaking", icon: Mic },
    { href: "/vocab", label: "Lug‘at", icon: Library },
    { href: "/exercises", label: "Mashq", icon: Brain },
  ],
  parent: [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/feedback", label: "Message", icon: MessageSquare },
  ],
  teacher: [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/students", label: "Students", icon: Users },
    { href: "/materials", label: "Materials", icon: FolderOpen },
    { href: "/homework", label: "Homework", icon: ClipboardList },
    { href: "/ranking", label: "Ranking", icon: Trophy },
  ],
  admin: [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/admin", label: "Manage", icon: Settings2 },
    { href: "/materials", label: "Materials", icon: FolderOpen },
    { href: "/homework", label: "Homework", icon: ClipboardList },
    { href: "/feedback", label: "Feedback", icon: MessageSquare },
  ],
};

export function activeHref(pathname: string, items: NavItem[]): string | null {
  // Longest matching prefix wins (so /homework/123 highlights /homework).
  let best: string | null = null;
  for (const it of items) {
    if (pathname === it.href || pathname.startsWith(it.href + "/")) {
      if (!best || it.href.length > best.length) best = it.href;
    }
  }
  return best;
}
