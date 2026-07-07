"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, FileText } from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";
import { useWorkspace } from "@/hooks/useWorkspaceStore";
import { Button, Kbd } from "@/components/ui/primitives";
import { projects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Template scaffolds — each new page starts from a real structure. */
export const DOC_TEMPLATES: Record<string, { icon: string; body: string }> = {
  "Design Brief": {
    icon: "📝",
    body: "## Overview\nWhat are we designing and why now?\n\n## Problem Statement\n\n## Goals\n- \n\n## Design Decisions\n> Record each decision and the reasoning behind it.\n\n## Edge Cases\n- ",
  },
  Research: {
    icon: "🔬",
    body: "## Method\nParticipants, format and timeframe.\n\n## Key Findings\n- \n\n## Recommendations\n- ",
  },
  "User Flow": {
    icon: "🧭",
    body: "## Entry Points\n- \n\n## Happy Path\n1. Step one\n\n## Alternate Paths\n- \n\n## Error States\n- ",
  },
  "Feature Spec": {
    icon: "📐",
    body: "## Overview\n\n## Requirements\n- \n\n## States\nDefault · Hover · Active · Disabled · Empty · Error\n\n## Handoff Notes\n- ",
  },
  "Design QA": {
    icon: "✅",
    body: "## Scope\n\n## Checklist\n- Spacing matches spec\n- Tokens used (no raw hex)\n- Focus states present\n- Contrast AA\n\n## Issues Found\n- ",
  },
  Retrospective: {
    icon: "🔁",
    body: "## What went well\n- \n\n## What to improve\n- \n\n## Actions\n- ",
  },
  "Meeting Notes": {
    icon: "🗒️",
    body: "## Attendees\n- \n\n## Notes\n- \n\n## Decisions\n> \n\n## Action Items\n- ",
  },
  "Release Notes": {
    icon: "🚀",
    body: "## Highlights\n- \n\n## Improvements\n- \n\n## Fixes\n- ",
  },
};

/** Create-documentation modal — picks a template, writes to the store, opens the editor. */
export function DocCreate() {
  const { docModalOpen, setDocModalOpen, pushToast } = useUIStore();
  const { createDoc } = useWorkspace();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("Design Brief");
  const [projectId, setProjectId] = useState<string>(projects[0].id);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (docModalOpen) {
      setTitle("");
      setTemplate("Design Brief");
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [docModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && docModalOpen) setDocModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [docModalOpen, setDocModalOpen]);

  if (!docModalOpen) return null;

  const submit = () => {
    if (!title.trim()) return;
    const t = DOC_TEMPLATES[template];
    const doc = createDoc({ title, template, projectId, body: t.body, icon: t.icon });
    setDocModalOpen(false);
    pushToast(`“${doc.title}” created`);
    router.push(`/docs/${doc.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]" role="dialog" aria-modal="true">
      <div className="animate-overlay-in absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDocModalOpen(false)} />
      <div className="animate-pop-in relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted"><FileText size={13} /> New documentation page</span>
          <button onClick={() => setDocModalOpen(false)} aria-label="Close" className="text-fg-subtle hover:text-fg"><X size={15} /></button>
        </div>
        <div className="p-4">
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            placeholder="Page title"
            className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-fg-subtle"
          />
          <div className="mt-4">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Template</div>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(DOC_TEMPLATES).map(([name, t]) => (
                <button
                  key={name}
                  onClick={() => setTemplate(name)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-center transition-colors",
                    template === name
                      ? "border-brand bg-brand-subtle"
                      : "border-border hover:border-border-strong hover:bg-bg-hover",
                  )}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              aria-label="Project"
              className="h-7 rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-bg-subtle px-4 py-2.5">
          <span className="text-xs text-fg-subtle">Opens in the editor · Press <Kbd>⌘</Kbd> <Kbd>↵</Kbd></span>
          <Button variant="primary" size="sm" onClick={submit}>Create page</Button>
        </div>
      </div>
    </div>
  );
}
