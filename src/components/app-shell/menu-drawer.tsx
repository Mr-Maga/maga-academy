"use client";

import Link from "next/link";
import {
  X,
  PenLine,
  Mic,
  Library,
  Brain,
  Bot,
  Headphones,
  BookOpenText,
  ClipboardList,
  TrendingUp,
  UserRound,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: "New" | "Soon";
};

const TOOLS: Item[] = [
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/vocab", label: "Vocabulary", icon: Library },
  { href: "/exercises", label: "Practice", icon: Brain },
  { href: "/teacher", label: "AI Tutor", icon: Bot },
];

const SOON: Item[] = [
  { href: "#", label: "Listening", icon: Headphones, badge: "Soon" },
  { href: "#", label: "Reading", icon: BookOpenText, badge: "Soon" },
  { href: "#", label: "Mock Exam", icon: ClipboardList, badge: "Soon" },
];

const ACCOUNT: Item[] = [
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/account", label: "Account", icon: UserRound },
];

export function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-sm flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10 text-lg" />
            <div className="leading-tight">
              <div className="font-extrabold">Menyu</div>
              <div className="text-xs text-muted">IELTS resurslari</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-8">
          <Section title="Tools" items={TOOLS} onNav={onClose} />
          <Section title="Tez kunda" items={SOON} onNav={onClose} />
          <Section title="Hisob" items={ACCOUNT} onNav={onClose} />
        </nav>
      </aside>
    </>
  );
}

function Section({ title, items, onNav }: { title: string; items: Item[]; onNav: () => void }) {
  return (
    <div>
      <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">{title}</div>
      <div className="space-y-0.5">
        {items.map((it) => {
          const Icon = it.icon;
          const soon = it.badge === "Soon";
          const body = (
            <>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card text-primary-soft">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 font-medium">{it.label}</span>
              {it.badge && (
                <span className={cn("chip", soon ? "bg-amber/15 text-amber" : "bg-teal/15 text-teal")}>
                  {soon ? "Tez kunda" : "Yangi"}
                </span>
              )}
              {!soon && <ChevronRight className="h-4 w-4 text-subtle" />}
            </>
          );
          return soon ? (
            <div key={it.label} className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 opacity-55">
              {body}
            </div>
          ) : (
            <Link
              key={it.label}
              href={it.href}
              onClick={onNav}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-elevated active:scale-[0.99]"
            >
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
