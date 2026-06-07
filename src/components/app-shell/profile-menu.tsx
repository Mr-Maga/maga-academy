"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GraduationCap, History, User, Crown, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-actions";

export function ProfileMenu({
  name,
  email,
  isStudent,
}: {
  name: string;
  email: string;
  isStudent: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name || email || "?").charAt(0).toUpperCase();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const studentItems = [
    { href: "/dashboard", label: "My Learning", icon: GraduationCap },
    { href: "/history", label: "Test History", icon: History },
    { href: "/account", label: "My Profile", icon: User },
  ];
  const items = isStudent ? studentItems : [{ href: "/account", label: "My Profile", icon: User }];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Profile"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-bg shadow-md shadow-primary/30 transition active:scale-95"
        style={{ backgroundImage: "linear-gradient(135deg, #2dd4bf, #14b8a6)" }}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-border bg-elevated shadow-2xl" style={{ animation: "var(--animate-pop)" }}>
          <div className="border-b border-border p-4">
            <div className="truncate font-semibold">{name}</div>
            <div className="truncate text-xs text-muted">{email}</div>
          </div>
          <div className="p-1.5">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-card"
              >
                <it.icon className="h-4 w-4 text-muted" /> {it.label}
              </Link>
            ))}
            {isStudent && (
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-amber transition hover:bg-card"
              >
                <Crown className="h-4 w-4" /> Upgrade to Premium
              </Link>
            )}
          </div>
          <form action={signOut} className="border-t border-border p-1.5">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger transition hover:bg-card"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
