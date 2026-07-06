"use client";

import Link from "next/link";
import { Zap, Plus, FileText, Upload, Calendar } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Card, Avatar, Badge, ProgressBar, SectionTitle } from "@/components/ui/primitives";
import { StatusIcon } from "@/components/ui/indicators";
import { TaskRow } from "@/components/board/TaskRow";
import {
  sprints, activity, userById, CURRENT_USER_ID,
} from "@/lib/mock-data";
import { STATUS_META } from "@/lib/domain";
import { relativeTime, shortDate } from "@/lib/utils";
import { useUIStore } from "@/hooks/useUIStore";
import { useTasks } from "@/hooks/useTaskStore";
import type { Task, TaskStatus } from "@/lib/types";

export default function HomePage() {
  const { setCreateOpen } = useUIStore();
  const { tasks } = useTasks();
  const user = userById(CURRENT_USER_ID)!;
  const myTasks = tasks.filter((t) => t.assigneeId === CURRENT_USER_ID);
  const activeSprint = sprints.find((s) => s.status === "ACTIVE")!;
  const sprintTasks = tasks.filter((t) => t.sprintId === activeSprint.id);
  const done = sprintTasks.filter((t) => t.status === "DONE" || t.status === "APPROVED").length;
  const completion = Math.round((done / sprintTasks.length) * 100);
  const blockers = sprintTasks.filter((t) => t.priority === "URGENT" && t.status !== "DONE");

  const upcoming = tasks
    .filter((t) => t.dueDate)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 4);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <Topbar left={<span className="text-sm font-medium">Home</span>} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-6">
          {/* Welcome */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle" suppressHydrationWarning>{today}</p>
            <h1 className="font-display mt-1 text-[28px] font-semibold tracking-tight" suppressHydrationWarning>{greeting}, {user.name.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-fg-muted">
              You have <span className="font-medium text-fg">{myTasks.filter((t) => t.status !== "DONE").length} open tasks</span> and{" "}
              <span className="font-medium text-fg">{blockers.length} blocker{blockers.length !== 1 ? "s" : ""}</span> in {activeSprint.name}.
            </p>
          </div>

          {/* Quick actions */}
          <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <QuickAction icon={<Plus size={16} />} label="Create Task" onClick={() => setCreateOpen(true)} />
            <QuickAction icon={<Zap size={16} />} label="Create Sprint" href="/sprints" />
            <QuickAction icon={<FileText size={16} />} label="Add Documentation" href="/docs" />
            <QuickAction icon={<Upload size={16} />} label="Upload File" href="/docs" />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* My tasks */}
            <div className="lg:col-span-2">
              <SectionTitle action={<Link href="/my-work" className="text-xs text-brand hover:underline">View all</Link>}>My Tasks</SectionTitle>
              <MyTasksGrouped tasks={tasks} />
            </div>

            {/* Right rail */}
            <div className="space-y-5">
              {/* Sprint health */}
              <div>
                <SectionTitle>Sprint Health</SectionTitle>
                <Card className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <Link href={`/sprints/${activeSprint.id}`} className="text-sm font-medium hover:text-brand">{activeSprint.name}</Link>
                    <Badge color="#30a46c">Active</Badge>
                  </div>
                  <p className="mb-3 text-xs text-fg-muted line-clamp-2">{activeSprint.goal}</p>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-fg-muted">Completion</span>
                    <span className="font-medium">{completion}%</span>
                  </div>
                  <ProgressBar value={completion} color="#30a46c" />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <Stat label="Remaining" value={`${sprintTasks.length - done}`} />
                    <Stat label="Blockers" value={`${blockers.length}`} accent={blockers.length ? "#e5484d" : undefined} />
                    <Stat label="Velocity" value={`${activeSprint.velocity}`} />
                  </div>
                </Card>
              </div>

              {/* Upcoming deadlines */}
              <div>
                <SectionTitle>Upcoming Deadlines</SectionTitle>
                <Card className="divide-y divide-border">
                  {upcoming.map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5 px-3 py-2">
                      <Calendar size={14} className="shrink-0 text-fg-subtle" />
                      <span className="flex-1 truncate text-xs text-fg">{t.title}</span>
                      <span className="shrink-0 text-[11px] font-medium text-warning">{shortDate(t.dueDate!)}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="mt-6">
            <SectionTitle>Recent Activity</SectionTitle>
            <Card className="p-1">
              {activity.map((a) => {
                const actor = userById(a.actorId);
                return (
                  <Link key={a.id} href={a.targetHref ?? "#"} className="flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-bg-hover">
                    <Avatar userId={a.actorId} size={22} />
                    <p className="flex-1 truncate text-sm text-fg-muted">
                      <span className="font-medium text-fg">{actor?.name.split(" ")[0]}</span> {a.verb}{" "}
                      <span className="text-fg">{a.target}</span>
                    </p>
                    <span className="shrink-0 text-xs text-fg-subtle">{relativeTime(a.createdAt)}</span>
                  </Link>
                );
              })}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function MyTasksGrouped({ tasks }: { tasks: Task[] }) {
  const cols: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
  const mine = tasks.filter((t) => t.assigneeId === CURRENT_USER_ID);
  return (
    <Card className="overflow-hidden">
      {cols.map((status) => {
        const list = mine.filter((t) => t.status === status);
        if (list.length === 0) return null;
        return (
          <div key={status}>
            <div className="flex items-center gap-2 bg-bg-subtle px-3 py-1.5">
              <StatusIcon status={status} />
              <span className="text-xs font-medium text-fg-muted">{STATUS_META[status].label}</span>
              <span className="text-xs text-fg-subtle">{list.length}</span>
            </div>
            {list.map((t) => <TaskRow key={t.id} task={t} showProject />)}
          </div>
        );
      })}
    </Card>
  );
}

function QuickAction({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const inner = (
    <div className="group flex items-center gap-2.5 rounded-lg border border-border bg-bg-elevated px-3.5 py-3 transition-all hover:border-border-strong hover:shadow-sm">
      <span className="text-fg-muted transition-colors group-hover:text-brand">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return <button onClick={onClick} className="text-left">{inner}</button>;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md bg-bg-subtle py-2">
      <div className="text-base font-semibold tabular-nums" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
    </div>
  );
}
