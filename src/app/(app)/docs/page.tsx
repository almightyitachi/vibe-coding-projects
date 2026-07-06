"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Card, Badge, Avatar } from "@/components/ui/primitives";
import { docs, projectById, userById } from "@/lib/mock-data";
import { relativeTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui/primitives";
import { useUIStore } from "@/hooks/useUIStore";

const TEMPLATES = ["All", "Design Brief", "Research", "Feature Spec", "Retrospective"];

export default function DocsPage() {
  const [filter, setFilter] = useState("All");
  const { setCreateOpen } = useUIStore();
  const filtered = filter === "All" ? docs : docs.filter((d) => d.template === filter);

  return (
    <>
      <Topbar left={<span className="text-sm font-medium">Documentation</span>} />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Documentation"
          subtitle="The design knowledge base — briefs, research, specs and retros."
          icon={<FileText size={18} />}
          actions={<Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> New page</Button>}
        />

        <div className="mb-4 flex flex-wrap gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn("rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filter === t ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => {
            const project = projectById(d.projectId);
            const author = userById(d.authorId);
            return (
              <Link key={d.id} href={`/docs/${d.id}`}>
                <Card hover className="flex h-full flex-col p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="text-2xl">{d.icon}</span>
                    <Badge>{d.template}</Badge>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold leading-snug">{d.title}</h3>
                  <p className="mb-3 flex-1 text-xs text-fg-muted line-clamp-2">{d.excerpt}</p>
                  <div className="flex items-center gap-2 text-[11px] text-fg-subtle">
                    <Avatar userId={author?.id} size={18} />
                    <span>{author?.name.split(" ")[0]}</span>
                    <span>·</span>
                    <span>{relativeTime(d.updatedAt)}</span>
                    {project && <><span>·</span><span>{project.key}</span></>}
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
