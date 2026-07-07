"use client";

import Link from "next/link";
import { Zap, ArrowRight, Plus } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Card, Badge, ProgressBar, Avatar, Button } from "@/components/ui/primitives";
import { projectById, userById } from "@/lib/mock-data";
import { useTasks } from "@/hooks/useTaskStore";
import { useWorkspace } from "@/hooks/useWorkspaceStore";
import { useUIStore } from "@/hooks/useUIStore";
import { SPRINT_STATUS_META } from "@/lib/domain";
import { shortDate } from "@/lib/utils";

export default function SprintsPage() {
  const { tasks } = useTasks();
  const { sprints } = useWorkspace();
  const { setSprintModalOpen } = useUIStore();
  return (
    <>
      <Topbar left={<span className="text-sm font-medium">Sprints</span>} />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Sprints"
          subtitle="Time-boxed design cycles across all projects."
          icon={<Zap size={18} />}
          actions={<Button variant="primary" size="sm" onClick={() => setSprintModalOpen(true)}><Plus size={14} /> New sprint</Button>}
        />
        <div className="space-y-2.5">
          {sprints.map((s) => {
            const project = projectById(s.projectId);
            const owner = userById(s.ownerId);
            const meta = SPRINT_STATUS_META[s.status];
            const sprintTasks = tasks.filter((t) => t.sprintId === s.id);
            const done = sprintTasks.filter((t) => t.status === "DONE" || t.status === "APPROVED").length;
            const pct = sprintTasks.length ? Math.round((done / sprintTasks.length) * 100) : 0;
            return (
              <Link key={s.id} href={`/sprints/${s.id}`}>
                <Card hover className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${meta.color} 15%, transparent)`, color: meta.color }}>
                    <Zap size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">{s.name}</h3>
                      <Badge color={meta.color}>{meta.label}</Badge>
                      <span className="text-xs text-fg-subtle">{project?.key}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-fg-muted">{s.goal}</p>
                  </div>
                  <div className="hidden w-40 shrink-0 md:block">
                    <div className="mb-1 flex justify-between text-[11px] text-fg-subtle">
                      <span>{done}/{sprintTasks.length} done</span>
                      <span>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} color={meta.color} />
                  </div>
                  <div className="hidden shrink-0 text-right text-xs text-fg-subtle lg:block">
                    <div>{shortDate(s.startDate)} → {shortDate(s.endDate)}</div>
                    <div className="mt-1 flex items-center justify-end gap-1"><Avatar userId={owner?.id} size={16} /> {owner?.name.split(" ")[0]}</div>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-fg-subtle" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
