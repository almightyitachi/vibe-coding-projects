"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox as InboxIcon, AtSign, UserPlus, RefreshCw, Zap, GitPullRequestArrow, MessageSquare, Check,
} from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Avatar } from "@/components/ui/primitives";
import { notifications as seed, userById } from "@/lib/mock-data";
import { relativeTime, cn } from "@/lib/utils";
import type { NotificationKind } from "@/lib/types";

const ICONS: Record<NotificationKind, React.ComponentType<{ size?: number }>> = {
  MENTION: AtSign,
  ASSIGNMENT: UserPlus,
  STATUS_CHANGE: RefreshCw,
  SPRINT_EVENT: Zap,
  REVIEW_REQUEST: GitPullRequestArrow,
  COMMENT: MessageSquare,
};

const READ_KEY = "sd-inbox-read-v1";

export default function InboxPage() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<"all" | "unread">("all");

  // Persist read state across reloads.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      if (raw) {
        const readIds: string[] = JSON.parse(raw);
        setItems((prev) => prev.map((n) => (readIds.includes(n.id) ? { ...n, read: true } : n)));
      }
    } catch { /* keep seed */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(items.filter((n) => n.read).map((n) => n.id)));
    } catch { /* noop */ }
  }, [items]);
  const shown = tab === "unread" ? items.filter((n) => !n.read) : items;
  const unread = items.filter((n) => !n.read).length;

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <>
      <Topbar
        left={<span className="text-sm font-medium">Inbox</span>}
        right={
          <button onClick={markAll} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-fg-muted hover:bg-bg-hover hover:text-fg">
            <Check size={14} /> Mark all read
          </button>
        }
      />
      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-4 flex items-center gap-1">
          {(["all", "unread"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("rounded-md px-2.5 py-1 text-sm font-medium capitalize transition-colors",
                tab === t ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover")}>
              {t} {t === "unread" && unread > 0 && <span className="ml-1 text-brand">{unread}</span>}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <InboxIcon size={28} className="text-fg-subtle" />
            <p className="text-sm font-medium">You&apos;re all caught up</p>
            <p className="text-xs text-fg-subtle">No unread notifications.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            {shown.map((n) => {
              const Icon = ICONS[n.kind];
              const actor = userById(n.actorId);
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                  className={cn(
                    "flex items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-bg-hover",
                    !n.read && "bg-brand-subtle/30",
                  )}
                >
                  {!n.read ? <span className="h-2 w-2 shrink-0 rounded-full bg-brand" /> : <span className="h-2 w-2 shrink-0" />}
                  <div className="relative">
                    <Avatar userId={n.actorId} size={30} />
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-bg-elevated text-fg-muted ring-1 ring-border">
                      <Icon size={9} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-fg-muted">
                      <span className="font-medium text-fg">{actor?.name.split(" ")[0]}</span> {n.text}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-fg-subtle">{relativeTime(n.createdAt)}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
