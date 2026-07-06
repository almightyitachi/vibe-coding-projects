"use client";

import { Moon, Sun, SlidersHorizontal, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { IconButton, Button } from "@/components/ui/primitives";
import { useUIStore } from "@/hooks/useUIStore";

export function Topbar({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  const { theme, toggle } = useTheme();
  const { setCreateOpen } = useUIStore();
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">{left}</div>
      <div className="flex items-center gap-1.5">
        {right}
        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> New
        </Button>
        <IconButton label="Toggle theme" onClick={toggle}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>
      </div>
    </header>
  );
}

export function ViewFilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-10 items-center gap-2 border-b border-border px-4 text-sm">
      <SlidersHorizontal size={14} className="text-fg-subtle" />
      {children}
    </div>
  );
}
