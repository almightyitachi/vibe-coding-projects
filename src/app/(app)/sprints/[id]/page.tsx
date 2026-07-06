"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Kanban, List, Activity as ActivityIcon } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Breadcrumb, Card, Badge, ProgressBar, Avatar, AvatarStack } from "@/components/ui/primitives";
import { Board } from "@/components/board/Board";
import { TaskRow } from "@/components/board/TaskRow";
import { Burndown } from "@/components/board/Burndown";
import { sprintById, projectById, tasks, userById } from "@/lib/mock-data";
import { SPRINT_STATUS_META } from "@/lib/domain";
import { shortDate, cn } from "@/lib/utils";

export default function SprintDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const sprint = sprintById(id);
  const [view, setView] = useState<"board" | "list" | "overview">("board");
  if (!sprint) return notFound();

  const project = projectById(sprint.projectId);
  const owner = userById(sprint.ownerId);
  const meta = SPRINT_STATUS_META[sprint.status];
  const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
  const done = sprintTasks.filter((t) => t.status === "DONE" || t.status === "APPROVED").length;
  const pct = sprintTasks.length ? Math.round((done / sprintTasks.length) * 100) : 0;
  const blockers = sprintTasks.filter((t) => t.priority === "URGENT" && t.status !== "DONE");
  const members = Array.from(new Set(sprintTasks.map((t) => t.assigneeId).filter(Boolean))) as string[];
  const totalPoints = sprintTasks.reduce((a, t) => a + t.points, 0);
  const donePoints = sprintTasks.filter((t) => t.status === "DONE" || t.status === "APPROVED").reduce((a, t) => a + t.points, 0);

  return (
    <>
      <Topbar
        left={<Breadcrumb items={[{ label: "Sprints", href: "/sprints" }, { label: sprint.name }]} />}
        right={
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            <TabBtn active={view === "board"} onClick={() => setView("board")} icon={<Kanban size={14} />} label="Board" />
            <TabBtn active={view === "list"} onClick={() => setView("list")} icon={<List size={14} />} label="List" />
            <TabBtn active={view === "overview"} onClick={() => setView("overview")} icon={<ActivityIcon size={14} />} label="Overview" />
          </div>
        }
      />

      {/* Sprint header */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold">{sprint.name}</h1>
            <Badge color={meta.color}>{meta.label}</Badge>
            <span className="text-xs text-fg-subtle">{project?.name}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-fg-muted">🎯 {sprint.goal}</p>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <div className="hidden text-right sm:block">
            <div className="text-xs text-fg-subtle">{shortDate(sprint.startDate)} → {shortDate(sprint.endDate)}</div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <ProgressBar value={pct} color={meta.color} className="w-24" />
              <span className="text-xs font-medium">{pct}%</span>
            </div>
          </div>
          <AvatarStack userIds={members} size={22} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "board" && <Board initialTasks={sprintTasks} />}
        {view === "list" && (
          <div className="h-full overflow-y-auto p-4">
            <Card className="overflow-hidden">{sprintTasks.map((t) => <TaskRow key={t.id} task={t} />)}</Card>
          </div>
        )}
        {view === "overview" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric label="Completion" value={`${pct}%`} />
                <Metric label="Points" value={`${donePoints}/${totalPoints}`} />
                <Metric label="Blockers" value={`${blockers.length}`} accent={blockers.length ? "#e5484d" : undefined} />
                <Metric label="Velocity" value={`${sprint.velocity}`} />
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Sprint Burndown</h3>
                  <Card className="p-4"><Burndown totalPoints={totalPoints} /></Card>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Risks & Blockers</h3>
                  <Card className="divide-y divide-border">
                    {blockers.length === 0 && <div className="px-4 py-6 text-center text-sm text-fg-subtle">No blockers 🎉</div>}
                    {blockers.map((t) => (
                      <div key={t.id} className="flex items-center gap-2.5 px-4 py-2.5">
                        <span className="h-2 w-2 rounded-full bg-danger" />
                        <span className="text-xs font-medium text-fg-subtle">{t.id}</span>
                        <span className="flex-1 truncate text-sm">{t.title}</span>
                        <Avatar userId={t.assigneeId} size={20} />
                      </div>
                    ))}
                  </Card>

                  <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Team Velocity</h3>
                  <Card className="p-4">
                    {members.map((m) => {
                      const mt = sprintTasks.filter((t) => t.assigneeId === m);
                      const mp = mt.reduce((a, t) => a + t.points, 0);
                      return (
                        <div key={m} className="mb-2.5 flex items-center gap-2.5 last:mb-0">
                          <Avatar userId={m} size={22} />
                          <span className="flex-1 text-sm">{userById(m)?.name}</span>
                          <ProgressBar value={(mp / totalPoints) * 100} className="w-24" />
                          <span className="w-10 text-right text-xs text-fg-subtle">{mp} pts</span>
                        </div>
                      );
                    })}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition-colors",
        active ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover")}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="text-2xl font-semibold tracking-tight" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="mt-1 text-xs text-fg-subtle">{label}</div>
    </Card>
  );
}
