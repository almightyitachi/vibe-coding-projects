"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { List, Kanban, GanttChart, Calendar as CalIcon, FileText } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Breadcrumb, Card, AvatarStack, Badge, ProgressBar, Avatar } from "@/components/ui/primitives";
import { Board } from "@/components/board/Board";
import { TaskRow } from "@/components/board/TaskRow";
import { projectById, sprints, tasks, docs, userById } from "@/lib/mock-data";
import { PROJECT_STATUS_META, SPRINT_STATUS_META } from "@/lib/domain";
import { shortDate, relativeTime, cn } from "@/lib/utils";

const VIEWS = [
  { id: "list", label: "List", icon: List },
  { id: "board", label: "Board", icon: Kanban },
  { id: "timeline", label: "Timeline", icon: GanttChart },
  { id: "calendar", label: "Calendar", icon: CalIcon },
  { id: "docs", label: "Documentation", icon: FileText },
] as const;

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = projectById(id);
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("list");
  if (!project) return notFound();

  const owner = userById(project.ownerId);
  const meta = PROJECT_STATUS_META[project.status];
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectSprints = sprints.filter((s) => s.projectId === project.id);
  const projectDocs = docs.filter((d) => d.projectId === project.id);

  return (
    <>
      <Topbar
        left={
          <Breadcrumb items={[{ label: "Projects", href: "/projects" }, { label: project.name }]} />
        }
      />
      {/* Overview header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-fg-subtle">{project.key}</span>
              <Badge color={meta.color}>{meta.label}</Badge>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-fg-muted">{project.description}</p>
          </div>
          <div className="hidden shrink-0 grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid">
            <Meta label="Owner"><div className="flex items-center gap-1.5"><Avatar userId={owner?.id} size={18} /> {owner?.name}</div></Meta>
            <Meta label="Team"><AvatarStack userIds={project.memberIds} size={18} /></Meta>
            <Meta label="Timeline">{shortDate(project.startDate)} → {shortDate(project.targetDate)}</Meta>
            <Meta label="Sprints">{projectSprints.length}</Meta>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={project.progress} color={meta.color} className="max-w-xs" />
          <span className="text-xs font-medium text-fg-muted">{project.progress}%</span>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-1 border-b border-border px-4">
        {VIEWS.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-sm font-medium transition-colors",
                view === v.id ? "border-brand text-fg" : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              <Icon size={14} /> {v.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "list" && (
          <div className="h-full overflow-y-auto p-4">
            <Card className="overflow-hidden">
              {projectTasks.map((t) => <TaskRow key={t.id} task={t} />)}
            </Card>
          </div>
        )}
        {view === "board" && <Board initialTasks={projectTasks} />}
        {view === "timeline" && <TimelineView projectId={project.id} />}
        {view === "calendar" && <CalendarView projectId={project.id} />}
        {view === "docs" && (
          <div className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {projectDocs.map((d) => (
                <Link key={d.id} href={`/docs/${d.id}`}>
                  <Card hover className="flex h-full flex-col p-4">
                    <div className="mb-2 text-2xl">{d.icon}</div>
                    <h3 className="mb-1 text-sm font-medium">{d.title}</h3>
                    <p className="flex-1 text-xs text-fg-muted line-clamp-2">{d.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-subtle">
                      <Badge>{d.template}</Badge>
                      <span>{relativeTime(d.updatedAt)}</span>
                    </div>
                  </Card>
                </Link>
              ))}
              {projectDocs.length === 0 && <p className="text-sm text-fg-subtle">No documentation yet.</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TimelineView({ projectId }: { projectId: string }) {
  const projectSprints = sprints.filter((s) => s.projectId === projectId);
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-3">
        {projectSprints.map((s, i) => {
          const smeta = SPRINT_STATUS_META[s.status];
          const offset = i * 12;
          const width = 34 + (s.velocity % 20);
          return (
            <div key={s.id} className="flex items-center gap-3">
              <div className="w-40 shrink-0 truncate text-sm font-medium">{s.name}</div>
              <div className="relative h-8 flex-1 rounded-md bg-bg-subtle">
                <div
                  className="absolute top-1 flex h-6 items-center rounded-md px-2.5 text-[11px] font-medium text-white"
                  style={{ left: `${offset}%`, width: `${width}%`, background: smeta.color }}
                >
                  {shortDate(s.startDate)} → {shortDate(s.endDate)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarView({ projectId }: { projectId: string }) {
  const due = tasks.filter((t) => t.projectId === projectId && t.dueDate);
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="grid grid-cols-7 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="pb-1 text-center text-[11px] font-medium text-fg-subtle">{d}</div>
        ))}
        {days.map((day) => {
          const dayTasks = due.filter((t) => new Date(t.dueDate!).getDate() === day + 1);
          return (
            <div key={day} className="min-h-16 rounded-md border border-border bg-bg-elevated p-1.5">
              <div className="mb-1 text-[10px] text-fg-subtle">{day}</div>
              {dayTasks.map((t) => (
                <div key={t.id} className="mb-1 truncate rounded bg-brand-subtle px-1 py-0.5 text-[10px] text-fg">{t.id}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className="mt-0.5 text-fg">{children}</div>
    </div>
  );
}
