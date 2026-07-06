"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Layers, Zap, FileText, GitPullRequestArrow, Home, Map as MapIcon,
  Plus, Moon, CircleUser, CornerDownLeft,
} from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";
import { useTheme } from "@/components/theme/ThemeProvider";
import { projects, sprints, docs, tasks, reviews } from "@/lib/mock-data";
import { Kbd } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<{ size?: number }>;
  run: () => void;
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setCreateOpen } = useUIStore();
  const { toggle } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (href: string) => { router.push(href); setPaletteOpen(false); };

  const items: Item[] = useMemo(() => {
    const actions: Item[] = [
      { id: "new-task", label: "Create task…", group: "Actions", icon: Plus, run: () => { setPaletteOpen(false); setCreateOpen(true); } },
      { id: "theme", label: "Toggle theme", group: "Actions", icon: Moon, run: () => { toggle(); } },
      { id: "home", label: "Go to Home", group: "Navigate", icon: Home, run: () => go("/home") },
      { id: "projects", label: "Go to Projects", group: "Navigate", icon: Layers, run: () => go("/projects") },
      { id: "sprints", label: "Go to Sprints", group: "Navigate", icon: Zap, run: () => go("/sprints") },
      { id: "docs", label: "Go to Documentation", group: "Navigate", icon: FileText, run: () => go("/docs") },
      { id: "reviews", label: "Go to Design Reviews", group: "Navigate", icon: GitPullRequestArrow, run: () => go("/reviews") },
      { id: "roadmap", label: "Go to Roadmap", group: "Navigate", icon: MapIcon, run: () => go("/roadmap") },
      { id: "mywork", label: "Go to My Work", group: "Navigate", icon: CircleUser, run: () => go("/my-work") },
    ];
    const proj: Item[] = projects.map((p) => ({ id: p.id, label: p.name, hint: p.key, group: "Projects", icon: Layers, run: () => go(`/projects/${p.id}`) }));
    const spr: Item[] = sprints.map((s) => ({ id: s.id, label: s.name, hint: "Sprint", group: "Sprints", icon: Zap, run: () => go(`/sprints/${s.id}`) }));
    const doc: Item[] = docs.map((d) => ({ id: d.id, label: d.title, hint: d.template, group: "Documentation", icon: FileText, run: () => go(`/docs/${d.id}`) }));
    const tsk: Item[] = tasks.map((t) => ({ id: t.id, label: t.title, hint: t.id, group: "Tasks", icon: CornerDownLeft, run: () => go(`/sprints/${t.sprintId ?? ""}`) }));
    const rev: Item[] = reviews.map((r) => ({ id: r.id, label: r.title, hint: "Review", group: "Reviews", icon: GitPullRequestArrow, run: () => go("/reviews") }));
    return [...actions, ...proj, ...spr, ...doc, ...tsk, ...rev];
  }, [router, setPaletteOpen, setCreateOpen, toggle]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.filter((i) => i.group === "Actions" || i.group === "Navigate");
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q));
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    filtered.forEach((i) => { if (!map.has(i.group)) map.set(i.group, []); map.get(i.group)!.push(i); });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => { if (paletteOpen) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 10); } }, [paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaletteOpen(false);
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); filtered[active]?.run(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, filtered, active, setPaletteOpen]);

  if (!paletteOpen) return null;

  let flatIndex = -1;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]" role="dialog" aria-modal="true">
      <div className="animate-overlay-in absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPaletteOpen(false)} />
      <div className="animate-pop-in relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-pop">
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search size={16} className="text-fg-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or run a command…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-subtle"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-1.5">
          {groups.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-fg-subtle">No results for “{query}”</div>
          )}
          {groups.map(([group, list]) => (
            <div key={group} className="mb-1">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{group}</div>
              {list.map((item) => {
                flatIndex++;
                const idx = flatIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => item.run()}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                      active === idx ? "bg-brand-subtle text-fg" : "text-fg-muted hover:bg-bg-hover",
                    )}
                  >
                    <Icon size={15} />
                    <span className="flex-1 truncate text-fg">{item.label}</span>
                    {item.hint && <span className="text-[11px] text-fg-subtle">{item.hint}</span>}
                    {active === idx && <CornerDownLeft size={13} className="text-fg-subtle" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
