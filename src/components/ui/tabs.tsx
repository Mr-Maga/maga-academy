"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
}

/** Segmented tabs with a sliding active pill. */
export function Tabs({
  items,
  defaultId,
  onChange,
  className,
}: {
  items: TabItem[];
  defaultId?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const activeItem = items.find((i) => i.id === active);

  return (
    <div className={className}>
      <div
        className="inline-flex rounded-full p-1"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)" }}
        role="tablist"
      >
        {items.map((i) => {
          const on = i.id === active;
          return (
            <button
              key={i.id}
              role="tab"
              aria-selected={on}
              onClick={() => { setActive(i.id); onChange?.(i.id); }}
              className={cn(
                "focus-ring relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                on ? "text-primary-fg" : "text-muted hover:text-fg",
              )}
            >
              {on && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundImage: "linear-gradient(135deg,#7B61FF,#9D7BFF 50%,#C084FC)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                />
              )}
              <span className="relative">{i.label}</span>
            </button>
          );
        })}
      </div>
      {activeItem?.content && <div className="mt-4">{activeItem.content}</div>}
    </div>
  );
}
