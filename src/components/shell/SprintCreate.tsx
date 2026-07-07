"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Zap } from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";
import { useWorkspace } from "@/hooks/useWorkspaceStore";
import { Button, Kbd } from "@/components/ui/primitives";
import { projects } from "@/lib/mock-data";

const DAY = 86400000;
const toDateInput = (d: Date) => d.toISOString().slice(0, 10);

/** Create-sprint modal — writes to the workspace store and opens the new sprint. */
export function SprintCreate() {
  const { sprintModalOpen, setSprintModalOpen, pushToast } = useUIStore();
  const { createSprint } = useWorkspace();
  const router = useRouter();

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [projectId, setProjectId] = useState(projects[0].id);
  const [startDate, setStartDate] = useState(toDateInput(new Date()));
  const [endDate, setEndDate] = useState(toDateInput(new Date(Date.now() + 13 * DAY)));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sprintModalOpen) {
      setName("");
      setGoal("");
      setStartDate(toDateInput(new Date()));
      setEndDate(toDateInput(new Date(Date.now() + 13 * DAY)));
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [sprintModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && sprintModalOpen) setSprintModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sprintModalOpen, setSprintModalOpen]);

  if (!sprintModalOpen) return null;

  const submit = () => {
    if (!name.trim()) return;
    const sprint = createSprint({ name, goal, projectId, startDate, endDate });
    setSprintModalOpen(false);
    pushToast(`${sprint.name} created`);
    router.push(`/sprints/${sprint.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh]" role="dialog" aria-modal="true">
      <div className="animate-overlay-in absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSprintModalOpen(false)} />
      <div className="animate-pop-in relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted"><Zap size={13} /> New sprint</span>
          <button onClick={() => setSprintModalOpen(false)} aria-label="Close" className="text-fg-subtle hover:text-fg"><X size={15} /></button>
        </div>
        <div className="p-4">
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            placeholder="Sprint name"
            className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-fg-subtle"
          />
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Sprint goal — what should be true when this sprint ends?"
            rows={2}
            className="mt-2 w-full resize-none bg-transparent text-sm text-fg-muted outline-none placeholder:text-fg-subtle"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              aria-label="Project"
              className="h-7 rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input
              type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              aria-label="Start date"
              className="h-7 rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            />
            <span className="text-xs text-fg-subtle">→</span>
            <input
              type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              aria-label="End date"
              className="h-7 rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-bg-subtle px-4 py-2.5">
          <span className="text-xs text-fg-subtle">Starts in <span className="text-fg">Planning</span> · Press <Kbd>⌘</Kbd> <Kbd>↵</Kbd></span>
          <Button variant="primary" size="sm" onClick={submit}>Create sprint</Button>
        </div>
      </div>
    </div>
  );
}
