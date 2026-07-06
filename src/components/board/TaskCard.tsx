"use client";

import { MessageSquare, Paperclip, Figma } from "lucide-react";
import type { Task } from "@/lib/types";
import { Avatar, Badge } from "@/components/ui/primitives";
import { PriorityIcon } from "@/components/ui/indicators";
import { DESIGN_STAGE_META } from "@/lib/domain";
import { tagById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/hooks/useUIStore";

export function TaskCard({
  task, onDragStart, dense,
}: { task: Task; onDragStart?: (e: React.DragEvent) => void; dense?: boolean }) {
  const { setSelectedTaskId } = useUIStore();
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        "group cursor-pointer rounded-lg border border-border bg-bg-elevated p-3 shadow-sm transition-all duration-150",
        "hover:border-border-strong hover:shadow-md active:cursor-grabbing",
      )}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-medium text-fg-subtle">{task.id}</span>
        {task.designStage && (
          <Badge color={DESIGN_STAGE_META[task.designStage].color} className="!px-1.5 !py-0 !text-[10px]">
            {DESIGN_STAGE_META[task.designStage].label}
          </Badge>
        )}
      </div>
      <p className="mb-2.5 text-sm font-medium leading-snug text-fg line-clamp-2">{task.title}</p>

      {!dense && task.tagIds.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1">
          {task.tagIds.map((tid) => {
            const t = tagById(tid);
            if (!t) return null;
            return <Badge key={tid} color={t.color} className="!px-1.5 !py-0 !text-[10px]">{t.label}</Badge>;
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-fg-subtle">
          <PriorityIcon priority={task.priority} />
          {task.figmaUrl && <Figma size={12} />}
          {task.commentCount > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]"><MessageSquare size={11} /> {task.commentCount}</span>
          )}
          {task.attachmentCount > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]"><Paperclip size={11} /> {task.attachmentCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-bg-inset px-1.5 text-[10px] font-medium text-fg-muted">{task.points}</span>
          <Avatar userId={task.assigneeId} size={20} />
        </div>
      </div>
    </div>
  );
}
