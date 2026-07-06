"use client";

import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";

// Lightweight global UI store (command palette, quick-create, task panel, toasts).
// In production this role is filled by Zustand; the same shape ports over directly.

export interface Toast {
  id: number;
  text: string;
}

interface UIState {
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  toasts: Toast[];
  pushToast: (text: string) => void;
}

const Ctx = createContext<UIState | null>(null);

export function UIStoreProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const pushToast = useCallback((text: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "c" && !e.metaKey && !e.ctrlKey && !isTyping(e)) {
        e.preventDefault();
        setCreateOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider
      value={{
        paletteOpen, setPaletteOpen,
        createOpen, setCreateOpen,
        selectedTaskId, setSelectedTaskId,
        toasts, pushToast,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
}

export function useUIStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUIStore must be used within UIStoreProvider");
  return ctx;
}
