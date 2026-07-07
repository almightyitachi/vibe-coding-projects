"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Share2, Pencil, Trash2, Clock, History, Paperclip, Check, X } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Breadcrumb, Avatar, Badge, IconButton, Card, Button } from "@/components/ui/primitives";
import { projectById, userById } from "@/lib/mock-data";
import { useWorkspace } from "@/hooks/useWorkspaceStore";
import { useUIStore } from "@/hooks/useUIStore";
import { renderDoc } from "@/lib/markdown";
import { relativeTime } from "@/lib/utils";
import type { DocPage } from "@/lib/types";

export default function DocDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { docs, hydrated } = useWorkspace();
  const doc = docs.find((d) => d.id === id);

  // New pages only exist in localStorage — wait for hydration before deciding.
  // A soft missing state (not notFound) also lets the delete flow navigate away
  // cleanly after the page disappears from the store.
  if (!doc) {
    if (!hydrated) return null;
    return (
      <>
        <Topbar left={<Breadcrumb items={[{ label: "Documentation", href: "/docs" }, { label: "Not found" }]} />} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium">This page doesn&apos;t exist anymore.</p>
          <Link href="/docs" className="text-xs font-medium text-brand hover:underline">Back to Documentation →</Link>
        </div>
      </>
    );
  }
  return <DocBody key={doc.id} doc={doc} related={docs.filter((d) => d.id !== doc.id && d.projectId === doc.projectId).slice(0, 3)} />;
}

function DocBody({ doc, related }: { doc: DocPage; related: DocPage[] }) {
  const { updateDoc, deleteDoc } = useWorkspace();
  const { pushToast } = useUIStore();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(doc.title);
  const [body, setBody] = useState(doc.body);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = projectById(doc.projectId);
  const author = userById(doc.authorId);

  const startEdit = () => {
    setTitle(doc.title);
    setBody(doc.body);
    setEditing(true);
  };

  const save = () => {
    updateDoc(doc.id, { title: title.trim() || doc.title, body });
    setEditing(false);
    pushToast("Page saved");
  };

  const remove = () => {
    pushToast(`“${doc.title}” deleted`);
    router.push("/docs");
    // Let navigation start before the page vanishes from the store.
    setTimeout(() => deleteDoc(doc.id), 150);
  };

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
          editing ? (
            <>
              <Button size="sm" onClick={() => setEditing(false)}><X size={13} /> Cancel</Button>
              <Button variant="primary" size="sm" onClick={save}><Check size={13} /> Save</Button>
            </>
          ) : (
            <>
              <IconButton label="Edit page" onClick={startEdit}><Pencil size={15} /></IconButton>
              <IconButton label="Favorite"><Star size={16} /></IconButton>
              <IconButton label="Share"><Share2 size={16} /></IconButton>
              {confirmDelete ? (
                <span className="flex items-center gap-1.5 text-xs">
                  <button onClick={remove} className="rounded-md bg-danger px-2 py-1 font-medium text-white hover:opacity-90">Delete</button>
                  <button onClick={() => setConfirmDelete(false)} className="rounded-md px-2 py-1 font-medium text-fg-muted hover:bg-bg-hover">Cancel</button>
                </span>
              ) : (
                <IconButton label="Delete page" onClick={() => setConfirmDelete(true)}><Trash2 size={15} /></IconButton>
              )}
            </>
          )
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_220px]">
          <article>
            <div className="mb-2 text-4xl">{doc.icon}</div>
            {editing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Page title"
                className="font-display w-full rounded-md bg-bg-hover px-2 py-1 text-[34px] font-semibold tracking-tight outline-none focus-ring -mx-2"
              />
            ) : (
              <h1 className="font-display text-[34px] font-semibold tracking-tight">{doc.title}</h1>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-fg-subtle">
              <Badge>{doc.template}</Badge>
              <span className="flex items-center gap-1.5"><Avatar userId={author?.id} size={18} /> {author?.name}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> Updated {relativeTime(doc.updatedAt)}</span>
            </div>
            <hr className="my-6 border-border" />
            {editing ? (
              <div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={Math.max(16, body.split("\n").length + 4)}
                  aria-label="Page content"
                  className="w-full resize-y rounded-lg border border-border bg-bg-elevated p-4 font-mono text-[13px] leading-relaxed text-fg outline-none focus-ring"
                />
                <p className="mt-2 text-xs text-fg-subtle">
                  Formatting: <code className="rounded bg-bg-inset px-1"># Heading</code>{" "}
                  <code className="rounded bg-bg-inset px-1">## Section</code>{" "}
                  <code className="rounded bg-bg-inset px-1">- list</code>{" "}
                  <code className="rounded bg-bg-inset px-1">&gt; decision</code>{" "}
                  <code className="rounded bg-bg-inset px-1">**bold**</code>{" "}
                  <code className="rounded bg-bg-inset px-1">`code`</code>
                </p>
                <div className="mt-6">
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Live preview</h4>
                  <Card className="p-5">{renderDoc(body)}</Card>
                </div>
              </div>
            ) : (
              renderDoc(doc.body)
            )}
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
                {[[`current`, relativeTime(doc.updatedAt)], ["v2", "2d ago"], ["v1", "1w ago"]].map(([v, t]) => (
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
