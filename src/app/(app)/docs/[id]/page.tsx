"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Share2, MoreHorizontal, Clock, History, Paperclip } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Breadcrumb, Avatar, Badge, IconButton, Card } from "@/components/ui/primitives";
import { docById, docs, projectById, userById } from "@/lib/mock-data";
import { renderDoc } from "@/lib/markdown";
import { relativeTime } from "@/lib/utils";

export default function DocDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const doc = docById(id);
  if (!doc) return notFound();

  const project = projectById(doc.projectId);
  const author = userById(doc.authorId);
  const related = docs.filter((d) => d.id !== doc.id && d.projectId === doc.projectId).slice(0, 3);

  return (
    <>
      <Topbar
        left={
          <Breadcrumb
            items={[
              { label: "Documentation", href: "/docs" },
              ...(project ? [{ label: project.name, href: `/projects/${project.id}` }] : []),
              { label: doc.title },
            ]}
          />
        }
        right={
          <>
            <IconButton label="Favorite"><Star size={16} /></IconButton>
            <IconButton label="Share"><Share2 size={16} /></IconButton>
            <IconButton label="More"><MoreHorizontal size={16} /></IconButton>
          </>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_220px]">
          <article>
            <div className="mb-2 text-4xl">{doc.icon}</div>
            <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-fg-subtle">
              <Badge>{doc.template}</Badge>
              <span className="flex items-center gap-1.5"><Avatar userId={author?.id} size={18} /> {author?.name}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> Updated {relativeTime(doc.updatedAt)}</span>
            </div>
            <hr className="my-6 border-border" />
            {renderDoc(doc.body)}
          </article>

          <aside className="space-y-6 lg:pt-16">
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Attachments</h4>
              <Card className="divide-y divide-border">
                {["research-notes.pdf", "flows-v3.fig", "assets.zip"].map((f) => (
                  <div key={f} className="flex items-center gap-2 px-3 py-2 text-xs text-fg-muted">
                    <Paperclip size={12} /> <span className="truncate">{f}</span>
                  </div>
                ))}
              </Card>
            </div>

            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Version History</h4>
              <div className="space-y-2.5">
                {[["v3 · current", "now"], ["v2", "2d ago"], ["v1", "1w ago"]].map(([v, t]) => (
                  <div key={v} className="flex items-center gap-2 text-xs">
                    <History size={12} className="text-fg-subtle" />
                    <span className="flex-1 text-fg-muted">{v}</span>
                    <span className="text-fg-subtle">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Related</h4>
                <div className="space-y-1.5">
                  {related.map((r) => (
                    <Link key={r.id} href={`/docs/${r.id}`} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-fg-muted hover:bg-bg-hover hover:text-fg">
                      <span>{r.icon}</span> <span className="truncate">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
