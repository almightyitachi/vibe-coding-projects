"use client";

import { useState } from "react";
import { CircleUser } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Card } from "@/components/ui/primitives";
import { StatusIcon } from "@/components/ui/indicators";
import { TaskRow } from "@/components/board/TaskRow";
import { tasks, CURRENT_USER_ID } from "@/lib/mock-data";
import { STATUS_META, STATUS_ORDER } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

export default function MyWorkPage() {
  const [group, setGroup] = useState<"status" | "priority">("status");
  const mine = tasks.filter((t) => t.assigneeId === CURRENT_USER_ID);

  return (
    <>
      <Topbar
        left={<span className="text-sm font-medium">My Work</span>}
        right={
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            {(["status", "priority"] as const).map((g) => (
              <button key={g} onClick={() => setGroup(g)}
                className={cn("h-7 rounded px-2 text-xs font-medium capitalize", group === g ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover")}>
                {g}
              </button>
            ))}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader title="My Work" subtitle={`${mine.length} tasks assigned to you across all projects.`} icon={<CircleUser size={18} />} />

        {group === "status" ? (
          <div className="space-y-4">
            {STATUS_ORDER.map((status) => {
              const list = mine.filter((t) => t.status === status);
              if (list.length === 0) return null;
              return <Group key={status} status={status} count={list.length}><Card className="overflow-hidden">{list.map((t) => <TaskRow key={t.id} task={t} showProject />)}</Card></Group>;
            })}
          </div>
        ) : (
          <Card className="overflow-hidden">
            {[...mine].sort((a, b) => a.priority.localeCompare(b.priority)).map((t) => <TaskRow key={t.id} task={t} showProject />)}
          </Card>
        )}
      </div>
    </>
  );
}

function Group({ status, count, children }: { status: TaskStatus; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <StatusIcon status={status} />
        <span className="text-sm font-medium">{STATUS_META[status].label}</span>
        <span className="text-xs text-fg-subtle">{count}</span>
      </div>
      {children}
    </div>
  );
}
