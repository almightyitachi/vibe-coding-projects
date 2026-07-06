"use client";

import { MessageSquare, Figma } from "lucide-react";
import type { Task } from "@/lib/types";
import { Avatar, Badge } from "@/components/ui/primitives";
import { PriorityIcon, StatusIcon } from "@/components/ui/indicators";
import { DESIGN_STAGE_META } from "@/lib/domain";
import { shortDate } from "@/lib/utils";
import { projectById } from "@/lib/mock-data";
import { useUIStore } from "@/hooks/useUIStore";

export function TaskRow({ task, showProject }: { task: Task; showProject?: boolean }) {
  const { setSelectedTaskId } = useUIStore();
  const project = projectById(task.projectId);
  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className="group flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2 transition-colors last:border-b-0 hover:bg-bg-hover"
    >
      <PriorityIcon priority={task.priority} />
      <StatusIcon status={task.status} />
      <span className="w-16 shrink-0 truncate text-xs font-medium text-fg-subtle">{task.id}</span>
      <span className="flex-1 truncate text-sm text-fg">{task.title}</span>
      {task.figmaUrl && <Figma size={13} className="shrink-0 text-fg-subtle" />}
      {task.commentCount > 0 && (
        <span className="hidden shrink-0 items-center gap-0.5 text-[11px] text-fg-subtle sm:flex">
          <MessageSquare size={11} /> {task.commentCount}
        </span>
      )}
      {task.designStage && (
        <Badge color={DESIGN_STAGE_META[task.designStage].color} className="hidden !px-1.5 !py-0 !text-[10px] md:inline-flex">
          {DESIGN_STAGE_META[task.designStage].label}
        </Badge>
      )}
      {showProject && project && (
        <span className="hidden w-24 shrink-0 truncate text-xs text-fg-subtle lg:block">{project.name}</span>
      )}
      {task.dueDate && <span className="hidden w-12 shrink-0 text-xs text-fg-subtle md:block">{shortDate(task.dueDate)}</span>}
      <Avatar userId={task.assigneeId} size={22} />
    </div>
  );
}
