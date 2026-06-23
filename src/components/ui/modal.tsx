"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Centered modal dialog. Pop entrance, backdrop blur, ESC to close. */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(5,5,8,0.6)", animation: "fade-up 0.2s ease both" }}
        onClick={onClose}
      />
      <div
        className={cn("glass relative z-10 w-full max-w-sm p-5", className)}
        style={{ animation: "pop 0.35s var(--ease-spring) both" }}
      >
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{title}</h3>}
          <button onClick={onClose} className="btn-subtle ml-auto h-9 w-9 p-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
