"use client";

import { useState } from "react";
import { GitPullRequestArrow, CheckCircle2, MessageSquare, Figma } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Card, Badge, Avatar, AvatarStack, ProgressBar } from "@/components/ui/primitives";
import { reviews, projectById, userById, taskById } from "@/lib/mock-data";
import { REVIEW_STATUS_META } from "@/lib/domain";
import { relativeTime, cn } from "@/lib/utils";
import type { ReviewStatus } from "@/lib/types";

const COLS: { status: ReviewStatus; label: string }[] = [
  { status: "DRAFT", label: "Draft" },
  { status: "READY", label: "Ready for Review" },
  { status: "CHANGES_REQUESTED", label: "Changes Requested" },
  { status: "APPROVED", label: "Approved" },
  { status: "CLOSED", label: "Closed" },
];

export default function ReviewsPage() {
  const [layout, setLayout] = useState<"board" | "list">("board");

  return (
    <>
      <Topbar
        left={<span className="text-sm font-medium">Design Reviews</span>}
        right={
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
            <button onClick={() => setLayout("board")} className={cn("h-7 rounded px-2 text-xs font-medium", layout === "board" ? "bg-bg-active" : "text-fg-muted")}>Board</button>
            <button onClick={() => setLayout("list")} className={cn("h-7 rounded px-2 text-xs font-medium", layout === "list" ? "bg-bg-active" : "text-fg-muted")}>List</button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-6">
          <PageHeader title="Design Reviews" subtitle="Structured review and approval for every design deliverable." icon={<GitPullRequestArrow size={18} />} />
        </div>

        {layout === "board" ? (
          <div className="flex gap-3 overflow-x-auto px-6 pb-6">
            {COLS.map((col) => {
              const list = reviews.filter((r) => r.status === col.status);
              const meta = REVIEW_STATUS_META[col.status];
              return (
                <div key={col.status} className="flex w-72 shrink-0 flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                    <span className="text-sm font-medium">{col.label}</span>
                    <span className="text-xs text-fg-subtle">{list.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {list.map((r) => <ReviewCard key={r.id} id={r.id} />)}
                    {list.length === 0 && <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-fg-subtle">Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 pb-6">
            <Card className="divide-y divide-border">
              {reviews.map((r) => {
                const meta = REVIEW_STATUS_META[r.status];
                const author = userById(r.authorId);
                return (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover">
                    <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                    <span className="flex-1 truncate text-sm">{r.title}</span>
                    <Badge color={meta.color}>{meta.label}</Badge>
                    <span className="hidden text-xs text-fg-subtle sm:inline">{r.resolvedThreads}/{r.openThreads + r.resolvedThreads} resolved</span>
                    <AvatarStack userIds={[r.authorId, ...r.reviewerIds]} size={20} />
                    <span className="hidden w-16 text-right text-xs text-fg-subtle md:inline">{relativeTime(r.updatedAt)}</span>
                  </div>
                );
              })}
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

function ReviewCard({ id }: { id: string }) {
  const r = reviews.find((x) => x.id === id)!;
  const meta = REVIEW_STATUS_META[r.status];
  const project = projectById(r.projectId);
  const task = r.taskId ? taskById(r.taskId) : undefined;
  const total = r.openThreads + r.resolvedThreads;
  const resolvedPct = total ? (r.resolvedThreads / total) * 100 : 0;

  return (
    <Card hover className="p-3">
      {/* Preview surface */}
      <div className="mb-3 flex h-24 items-center justify-center rounded-md border border-border bg-gradient-to-br from-bg-inset to-bg-subtle">
        <Figma size={22} className="text-fg-subtle" />
      </div>
      <h4 className="mb-1 text-sm font-medium leading-snug line-clamp-2">{r.title}</h4>
      <div className="mb-2.5 flex items-center gap-2 text-[11px] text-fg-subtle">
        {task && <span>{task.id}</span>}
        <span>·</span>
        <span>{project?.key}</span>
        <span>·</span>
        <span>{relativeTime(r.updatedAt)}</span>
      </div>
      {total > 0 && (
        <>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-fg-muted">
              {r.openThreads > 0 ? <MessageSquare size={11} /> : <CheckCircle2 size={11} className="text-success" />}
              {r.openThreads} open · {r.resolvedThreads} resolved
            </span>
          </div>
          <ProgressBar value={resolvedPct} color={meta.color} />
        </>
      )}
      <div className="mt-3 flex items-center justify-between">
        <Badge color={meta.color}>{meta.label}</Badge>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-fg-subtle">Reviewers</span>
          <AvatarStack userIds={r.reviewerIds.length ? r.reviewerIds : [r.authorId]} size={18} />
        </div>
      </div>
    </Card>
  );
}
