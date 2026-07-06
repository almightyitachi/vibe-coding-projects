"use client";

import { CheckCircle2 } from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";

/** Bottom-center toast stack. Minimal, auto-dismissing, non-blocking. */
export function Toaster() {
  const { toasts } = useUIStore();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-pop-in flex items-center gap-2 rounded-lg border border-border bg-bg-elevated py-2 pl-3 pr-4 text-sm text-fg shadow-lg"
          role="status"
        >
          <CheckCircle2 size={15} className="text-success" />
          {t.text}
        </div>
      ))}
    </div>
  );
}
