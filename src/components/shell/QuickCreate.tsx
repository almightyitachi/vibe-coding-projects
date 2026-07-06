"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";
import { Button, Kbd } from "@/components/ui/primitives";
import { PriorityIcon } from "@/components/ui/indicators";
import { projects } from "@/lib/mock-data";
import type { Priority } from "@/lib/types";
import { PRIORITY_META } from "@/lib/domain";
import { cn } from "@/lib/utils";

const PRIORITIES: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

/**
 * Quick-create modal. In this demo it validates and closes with a toast-like
 * confirmation; wired to POST /tasks in production. Opens with `c`.
 */
export function QuickCreate() {
  const { createOpen, setCreateOpen, pushToast } = useUIStore();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0].id);
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createOpen) {
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [createOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && createOpen) setCreateOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createOpen, setCreateOpen]);

  if (!createOpen) return null;

  const submit = () => {
    if (!title.trim()) return;
    const project = projects.find((p) => p.id === projectId);
    setCreateOpen(false);
    pushToast(`Task created in ${project?.name ?? "project"}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh]" role="dialog" aria-modal="true">
      <div className="animate-overlay-in absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
      <div className="animate-pop-in relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-xs font-medium text-fg-muted">New task</span>
          <button onClick={() => setCreateOpen(false)} className="text-fg-subtle hover:text-fg"><X size={15} /></button>
        </div>
        <div className="p-4">
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            placeholder="Task title"
            className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-fg-subtle"
          />
          <textarea
            placeholder="Add description…"
            rows={2}
            className="mt-2 w-full resize-none bg-transparent text-sm text-fg-muted outline-none placeholder:text-fg-subtle"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-7 rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  title={PRIORITY_META[p].label}
                  className={cn("flex h-6 items-center gap-1 rounded px-1.5 text-xs transition-colors",
                    priority === p ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover")}
                >
                  <PriorityIcon priority={p} size={13} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-bg-subtle px-4 py-2.5">
          <span className="text-xs text-fg-subtle">
            Press <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to create
          </span>
          <Button variant="primary" size="sm" onClick={submit}>Create task</Button>
        </div>
      </div>
    </div>
  );
}
