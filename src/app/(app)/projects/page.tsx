"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Card, AvatarStack, Badge, ProgressBar } from "@/components/ui/primitives";
import { projects, sprints, tasks } from "@/lib/mock-data";
import { PROJECT_STATUS_META } from "@/lib/domain";
import { shortDate } from "@/lib/utils";

export default function ProjectsPage() {
  return (
    <>
      <Topbar left={<span className="text-sm font-medium">Projects</span>} />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader title="Projects" subtitle="Top-level containers for features, sprints and documentation." icon={<Layers size={18} />} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const meta = PROJECT_STATUS_META[p.status];
            const projectSprints = sprints.filter((s) => s.projectId === p.id);
            const openTasks = tasks.filter((t) => t.projectId === p.id && t.status !== "DONE").length;
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="block h-full">
                <Card hover className="flex h-full flex-col p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: meta.color }} />
                      <span className="text-xs font-semibold text-fg-subtle">{p.key}</span>
                    </div>
                    <Badge color={meta.color}>{meta.label}</Badge>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{p.name}</h3>
                  <p className="mb-4 flex-1 text-xs text-fg-muted line-clamp-2">{p.description}</p>

                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-fg-muted">Progress</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} color={meta.color} />

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-fg-subtle">
                      <span>{projectSprints.length} sprints</span>
                      <span>{openTasks} open</span>
                      <span>Due {shortDate(p.targetDate)}</span>
                    </div>
                    <AvatarStack userIds={p.memberIds} size={20} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
