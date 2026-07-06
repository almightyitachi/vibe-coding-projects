"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";
import { STATUS_META, STATUS_ORDER } from "@/lib/domain";
import { TaskCard } from "./TaskCard";
import { StatusIcon } from "@/components/ui/indicators";
import { useUIStore } from "@/hooks/useUIStore";
import { cn } from "@/lib/utils";

/** Kanban board with drag-and-drop between the six workflow columns. */
export function Board({ initialTasks, filter }: { initialTasks: Task[]; filter?: (t: Task) => boolean }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);
  const { setCreateOpen } = useUIStore();

  const byStatus = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    STATUS_ORDER.forEach((s) => map.set(s, []));
    tasks.forEach((t) => {
      if (filter && !filter(t)) return;
      map.get(t.status)?.push(t);
    });
    return map;
  }, [tasks, filter]);

  const drop = (status: TaskStatus) => {
    if (!dragId) return;
    setTasks((prev) => prev.map((t) => (t.id === dragId ? { ...t, status } : t)));
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className="flex h-full gap-3 overflow-x-auto p-4">
      {STATUS_ORDER.map((status) => {
        const list = byStatus.get(status) ?? [];
        const meta = STATUS_META[status];
        return (
          <div
            key={status}
            onDragOver={(e) => { e.preventDefault(); setOverCol(status); }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={() => drop(status)}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-xl transition-colors",
              overCol === status && dragId ? "bg-brand-subtle/40" : "bg-bg-subtle/60",
            )}
          >
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                <StatusIcon status={status} />
                <span className="text-sm font-medium">{meta.label}</span>
                <span className="text-xs text-fg-subtle">{list.length}</span>
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                className="flex h-6 w-6 items-center justify-center rounded text-fg-subtle hover:bg-bg-hover hover:text-fg"
                aria-label={`Add to ${meta.label}`}
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-3">
              {list.map((task) => (
                <div key={task.id} className={cn(dragId === task.id && "opacity-40")}>
                  <TaskCard task={task} onDragStart={() => setDragId(task.id)} />
                </div>
              ))}
              {list.length === 0 && (
                <div className={cn(
                  "rounded-lg py-6 text-center text-xs text-fg-subtle transition-colors",
                  dragId ? "border border-dashed border-border-strong" : "border border-dashed border-transparent",
                )}>
                  {dragId ? "Drop here" : "No tasks"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
