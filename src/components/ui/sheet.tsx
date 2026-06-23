"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Bottom sheet for mobile actions. Spring entrance, backdrop blur, ESC to close. */
export function Sheet({
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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(5,5,8,0.6)", animation: "fade-up 0.2s ease both" }}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-[520px] rounded-t-2xl sm:rounded-2xl",
          "border-t sm:border",
          className,
        )}
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "0 -20px 60px -20px rgba(0,0,0,0.8)",
          animation: "sheet-up 0.36s var(--ease-out-quint) both",
          paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
        }}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full sm:hidden" style={{ background: "var(--color-border-strong)" }} />
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          {title && <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{title}</h3>}
          <button onClick={onClose} className="btn-subtle ml-auto h-9 w-9 p-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
      <style>{`@keyframes sheet-up{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}
