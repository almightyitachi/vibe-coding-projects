"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Figma, Play, Send, CalendarDays, Hash } from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";
import { taskById, userById, projectById, sprintById, tagById } from "@/lib/mock-data";
import { STATUS_META, STATUS_ORDER, PRIORITY_META, DESIGN_STAGE_META } from "@/lib/domain";
import { StatusIcon, PriorityIcon } from "@/components/ui/indicators";
import { Avatar, Badge } from "@/components/ui/primitives";
import { cn, relativeTime, shortDate } from "@/lib/utils";
import type { Priority, Task, TaskStatus } from "@/lib/types";

const PRIORITIES: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

/** Linear-style slide-over with full task detail. Opens from any card or row. */
export function TaskPanel() {
  const { selectedTaskId, setSelectedTaskId } = useUIStore();
  const task = selectedTaskId ? taskById(selectedTaskId) : undefined;

  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTaskId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [task, setSelectedTaskId]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="animate-overlay-in absolute inset-0 bg-black/30" onClick={() => setSelectedTaskId(null)} />
      {/* key resets local state when switching tasks */}
      <PanelBody key={task.id} task={task} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

function PanelBody({ task, onClose }: { task: Task; onClose: () => void }) {
  const { pushToast } = useUIStore();
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [comment, setComment] = useState("");

  const project = projectById(task.projectId);
  const sprint = sprintById(task.sprintId);
  const assignee = userById(task.assigneeId);
  const reporter = userById(task.reporterId);

  const canned = task.commentCount > 0
    ? [
        { userId: "u_maya", body: "Let's keep this aligned with the checkout tokens — flagging for the review.", at: task.updatedAt },
        { userId: task.assigneeId ?? "u_arjun", body: "Updated the spacing and pushed a new Figma version.", at: task.updatedAt },
      ].slice(0, Math.min(2, task.commentCount))
    : [];

  const submitComment = () => {
    if (!comment.trim()) return;
    setComment("");
    pushToast("Comment added");
  };

  return (
    <aside className="animate-slide-in-right relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-bg-elevated shadow-pop">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2 text-xs text-fg-subtle">
          <Hash size={13} />
          <span className="font-medium text-fg-muted">{task.id}</span>
          {project && (
            <>
              <span>·</span>
              <Link href={`/projects/${project.id}`} onClick={onClose} className="transition-colors hover:text-fg">
                {project.name}
              </Link>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-bg-hover hover:text-fg focus-ring"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-lg font-semibold leading-snug tracking-tight">{task.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{task.description}</p>

        {/* Status */}
        <SectionLabel>Status</SectionLabel>
        <div className="flex flex-wrap gap-1">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); pushToast(`Moved to ${STATUS_META[s].label}`); }}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus-ring",
                status === s
                  ? "border-border-strong bg-bg-active text-fg"
                  : "border-transparent text-fg-muted hover:bg-bg-hover hover:text-fg",
              )}
            >
              <StatusIcon status={s} size={12} />
              {STATUS_META[s].label}
            </button>
          ))}
        </div>

        {/* Priority */}
        <SectionLabel>Priority</SectionLabel>
        <div className="flex flex-wrap gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => { setPriority(p); pushToast(`Priority set to ${PRIORITY_META[p].label}`); }}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus-ring",
                priority === p
                  ? "border-border-strong bg-bg-active text-fg"
                  : "border-transparent text-fg-muted hover:bg-bg-hover hover:text-fg",
              )}
            >
              <PriorityIcon priority={p} size={12} />
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>

        {/* Properties */}
        <SectionLabel>Properties</SectionLabel>
        <div className="space-y-2.5">
          <Prop label="Assignee">
            {assignee ? (
              <span className="flex items-center gap-1.5"><Avatar userId={assignee.id} size={18} /> {assignee.name}</span>
            ) : <span className="text-fg-subtle">Unassigned</span>}
          </Prop>
          <Prop label="Reporter">
            <span className="flex items-center gap-1.5"><Avatar userId={reporter?.id} size={18} /> {reporter?.name}</span>
          </Prop>
          {sprint && (
            <Prop label="Sprint">
              <Link href={`/sprints/${sprint.id}`} onClick={onClose} className="text-fg transition-colors hover:text-brand">
                {sprint.name}
              </Link>
            </Prop>
          )}
          {task.module && <Prop label="Module">{task.module}</Prop>}
          {task.designStage && (
            <Prop label="Design stage">
              <Badge color={DESIGN_STAGE_META[task.designStage].color}>{DESIGN_STAGE_META[task.designStage].label}</Badge>
            </Prop>
          )}
          <Prop label="Points">
            <span className="rounded bg-bg-inset px-1.5 py-0.5 text-xs font-medium tabular-nums">{task.points}</span>
          </Prop>
          {task.dueDate && (
            <Prop label="Due date">
              <span className="flex items-center gap-1.5 text-warning"><CalendarDays size={13} /> {shortDate(task.dueDate)}</span>
            </Prop>
          )}
          <Prop label="Updated">{relativeTime(task.updatedAt)}</Prop>
        </div>

        {/* Tags */}
        {task.tagIds.length > 0 && (
          <>
            <SectionLabel>Tags</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {task.tagIds.map((tid) => {
                const t = tagById(tid);
                return t ? <Badge key={tid} color={t.color}>{t.label}</Badge> : null;
              })}
            </div>
          </>
        )}

        {/* Design links */}
        {(task.figmaUrl || task.prototypeUrl) && (
          <>
            <SectionLabel>Design</SectionLabel>
            <div className="flex gap-2">
              {task.figmaUrl && (
                <a href={task.figmaUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-border-strong hover:bg-bg-hover">
                  <Figma size={13} /> Open in Figma
                </a>
              )}
              {task.prototypeUrl && (
                <a href={task.prototypeUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-border-strong hover:bg-bg-hover">
                  <Play size={13} /> Prototype
                </a>
              )}
            </div>
          </>
        )}

        {/* Comments */}
        <SectionLabel>Comments {task.commentCount > 0 && <span className="text-fg-subtle">{task.commentCount}</span>}</SectionLabel>
        <div className="space-y-3">
          {canned.map((c, i) => {
            const author = userById(c.userId);
            return (
              <div key={i} className="flex gap-2.5">
                <Avatar userId={c.userId} size={24} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium">{author?.name}</span>
                    <span className="text-[11px] text-fg-subtle">{relativeTime(c.at)}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">{c.body}</p>
                </div>
              </div>
            );
          })}
          {canned.length === 0 && <p className="text-xs text-fg-subtle">No comments yet.</p>}
        </div>
      </div>

      {/* Comment composer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-1.5 transition-colors focus-within:border-border-strong">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
            placeholder="Leave a comment…"
            className="h-7 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-subtle"
          />
          <button
            onClick={submitComment}
            aria-label="Send comment"
            className={cn("flex h-6 w-6 items-center justify-center rounded transition-colors",
              comment.trim() ? "text-brand hover:bg-brand-subtle" : "text-fg-subtle")}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 mt-6 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
      {children}
    </h4>
  );
}

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-xs text-fg-subtle">{label}</span>
      <span className="min-w-0 flex-1 truncate text-fg">{children}</span>
    </div>
  );
}
