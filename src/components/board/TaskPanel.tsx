"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Figma, Play, Send, Hash, Trash2 } from "lucide-react";
import { useUIStore } from "@/hooks/useUIStore";
import { useTasks } from "@/hooks/useTaskStore";
import { userById, projectById, sprintById, tagById, users } from "@/lib/mock-data";
import { STATUS_META, STATUS_ORDER, PRIORITY_META, DESIGN_STAGE_META } from "@/lib/domain";
import { StatusIcon, PriorityIcon } from "@/components/ui/indicators";
import { Avatar, Badge } from "@/components/ui/primitives";
import { cn, relativeTime } from "@/lib/utils";
import type { Priority, Task } from "@/lib/types";

const PRIORITIES: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

/**
 * Slide-over task editor. Every control writes through the shared task store,
 * so edits persist across the app (and reloads, via localStorage).
 */
export function TaskPanel() {
  const { selectedTaskId, setSelectedTaskId } = useUIStore();
  const { tasks } = useTasks();
  const task = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) : undefined;

  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
      if (e.key === "Escape" && !typing) setSelectedTaskId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [task, setSelectedTaskId]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="animate-overlay-in absolute inset-0 bg-black/25" onClick={() => setSelectedTaskId(null)} />
      {/* key resets local edit buffers when switching tasks */}
      <PanelBody key={task.id} task={task} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

function PanelBody({ task, onClose }: { task: Task; onClose: () => void }) {
  const { pushToast } = useUIStore();
  const { updateTask, deleteTask } = useTasks();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [comment, setComment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = projectById(task.projectId);
  const sprint = sprintById(task.sprintId);
  const reporter = userById(task.reporterId);

  const commitTitle = () => {
    const next = title.trim();
    if (!next) { setTitle(task.title); return; }
    if (next !== task.title) {
      updateTask(task.id, { title: next });
      pushToast("Title updated");
    }
  };

  const commitDescription = () => {
    if (description !== task.description) {
      updateTask(task.id, { description });
      pushToast("Description saved");
    }
  };

  const removeTask = () => {
    deleteTask(task.id);
    onClose();
    pushToast(`${task.id} deleted`);
  };

  const canned = task.commentCount > 0
    ? [
        { userId: "u_maya", body: "Let's keep this aligned with the checkout tokens — flagging for the review.", at: task.updatedAt },
        { userId: task.assigneeId ?? "u_arjun", body: "Updated the spacing and pushed a new Figma version.", at: task.updatedAt },
      ].slice(0, Math.min(2, task.commentCount))
    : [];

  const submitComment = () => {
    if (!comment.trim()) return;
    updateTask(task.id, { commentCount: task.commentCount + 1 });
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
        <div className="flex items-center gap-1">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-fg-muted">Delete task?</span>
              <button onClick={removeTask} className="rounded-md bg-danger px-2 py-1 font-medium text-white transition-opacity hover:opacity-90">
                Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="rounded-md px-2 py-1 font-medium text-fg-muted hover:bg-bg-hover">
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              aria-label="Delete task"
              title="Delete task"
              className="flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-danger-subtle hover:text-danger focus-ring"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-bg-hover hover:text-fg focus-ring"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Editable title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          aria-label="Task title"
          className="w-full rounded-md bg-transparent text-lg font-semibold leading-snug tracking-tight outline-none transition-colors hover:bg-bg-hover focus:bg-bg-hover px-1 -mx-1"
        />
        {/* Editable description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={commitDescription}
          placeholder="Add a description…"
          rows={3}
          aria-label="Task description"
          className="mt-2 w-full resize-none rounded-md bg-transparent text-sm leading-relaxed text-fg-muted outline-none transition-colors hover:bg-bg-hover focus:bg-bg-hover px-1 -mx-1"
        />

        {/* Status */}
        <SectionLabel>Status</SectionLabel>
        <div className="flex flex-wrap gap-1">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => {
                if (task.status !== s) {
                  updateTask(task.id, { status: s });
                  pushToast(`Moved to ${STATUS_META[s].label}`);
                }
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus-ring",
                task.status === s
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
              onClick={() => {
                if (task.priority !== p) {
                  updateTask(task.id, { priority: p });
                  pushToast(`Priority set to ${PRIORITY_META[p].label}`);
                }
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus-ring",
                task.priority === p
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
            <select
              value={task.assigneeId ?? ""}
              onChange={(e) => {
                updateTask(task.id, { assigneeId: e.target.value || undefined });
                pushToast(e.target.value ? `Assigned to ${userById(e.target.value)?.name}` : "Unassigned");
              }}
              aria-label="Assignee"
              className="h-7 w-full max-w-[200px] rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            >
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
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
            <input
              type="number"
              min={0}
              max={21}
              value={task.points}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v)) updateTask(task.id, { points: Math.max(0, Math.min(21, v)) });
              }}
              aria-label="Story points"
              className="h-7 w-16 rounded-md border border-border bg-bg-elevated px-2 text-xs tabular-nums text-fg outline-none focus-ring"
            />
          </Prop>
          <Prop label="Due date">
            <input
              type="date"
              value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
              onChange={(e) => {
                updateTask(task.id, { dueDate: e.target.value || undefined });
                pushToast(e.target.value ? "Due date set" : "Due date cleared");
              }}
              aria-label="Due date"
              className="h-7 rounded-md border border-border bg-bg-elevated px-2 text-xs text-fg outline-none focus-ring"
            />
          </Prop>
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
        <SectionLabel>Comments {task.commentCount > 0 && <span className="text-fg-subtle tabular-nums">{task.commentCount}</span>}</SectionLabel>
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
