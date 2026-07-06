"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, Flag } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { projects, milestones } from "@/lib/mock-data";
import { PROJECT_STATUS_META } from "@/lib/domain";
import { shortDate, cn } from "@/lib/utils";

// Quarter grid: Q3 2026 (Jul-Sep) → months for the timeline header.
const MONTHS = ["Jul", "Aug", "Sep", "Oct"];
const RANGE_START = new Date("2026-07-01").getTime();
const RANGE_END = new Date("2026-10-31").getTime();

function pct(dateIso: string) {
  const t = new Date(dateIso).getTime();
  return Math.max(0, Math.min(100, ((t - RANGE_START) / (RANGE_END - RANGE_START)) * 100));
}

export default function RoadmapPage() {
  const [zoom, setZoom] = useState<"Quarterly" | "Monthly" | "Custom">("Quarterly");

  return (
    <>
      <Topbar left={<span className="text-sm font-medium">Roadmap</span>} />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Roadmap"
          subtitle="Timeline planning across projects, milestones and releases."
          icon={<Map size={18} />}
          actions={
            <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
              {(["Quarterly", "Monthly", "Custom"] as const).map((z) => (
                <button key={z} onClick={() => setZoom(z)}
                  className={cn("h-7 rounded px-2.5 text-xs font-medium", zoom === z ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover")}>
                  {z}
                </button>
              ))}
            </div>
          }
        />

        {/* Month header */}
        <div className="mb-2 flex border-b border-border pb-2 pl-48">
          {MONTHS.map((m) => (
            <div key={m} className="flex-1 text-xs font-medium text-fg-subtle">{m} 2026</div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {projects.map((p) => {
            const meta = PROJECT_STATUS_META[p.status];
            const start = pct(p.startDate);
            const end = pct(p.targetDate);
            const width = Math.max(6, end - start);
            const projectMilestones = milestones.filter((m) => m.projectId === p.id);
            return (
              <div key={p.id} className="group flex items-center py-2">
                <Link href={`/projects/${p.id}`} className="flex w-48 shrink-0 items-center gap-2 pr-3">
                  <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: meta.color }} />
                  <span className="truncate text-sm font-medium group-hover:text-brand">{p.name}</span>
                </Link>
                <div className="relative h-9 flex-1">
                  {/* Grid lines */}
                  {[25, 50, 75].map((g) => (
                    <div key={g} className="absolute top-0 h-full border-l border-border/60" style={{ left: `${g}%` }} />
                  ))}
                  {/* Bar */}
                  <div
                    className="absolute top-1.5 flex h-6 items-center rounded-md px-2 text-[11px] font-medium text-white shadow-sm"
                    style={{ left: `${start}%`, width: `${width}%`, background: meta.color }}
                    title={`${shortDate(p.startDate)} → ${shortDate(p.targetDate)}`}
                  >
                    <span className="truncate">{p.progress}%</span>
                  </div>
                  {/* Milestones */}
                  {projectMilestones.map((m) => (
                    <div key={m.id} className="absolute top-0.5" style={{ left: `${pct(m.date)}%` }} title={`${m.name} · ${shortDate(m.date)}`}>
                      <Flag size={12} className="text-fg" fill="var(--warning)" stroke="var(--warning)" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestones list */}
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">Upcoming Milestones</h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((m) => {
              const project = projects.find((p) => p.id === m.projectId);
              return (
                <div key={m.id} className="rounded-lg border border-border bg-bg-elevated p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-medium"><Flag size={13} className="text-warning" /> {m.name}</span>
                    <Badge>{shortDate(m.date)}</Badge>
                  </div>
                  <div className="mb-2 text-xs text-fg-subtle">{project?.name}</div>
                  <ProgressBar value={m.progress} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
