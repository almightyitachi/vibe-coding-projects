"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Inbox, CircleUser, Layers, Zap, FileText, GitPullRequestArrow,
  Map, Settings, Search, Plus, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, Kbd } from "@/components/ui/primitives";
import { userById, CURRENT_USER_ID, projects } from "@/lib/mock-data";
import { PROJECT_STATUS_META } from "@/lib/domain";
import { useUIStore } from "@/hooks/useUIStore";

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/inbox", label: "Inbox", icon: Inbox, badge: 3 },
  { href: "/my-work", label: "My Work", icon: CircleUser },
];

const WORKSPACE = [
  { href: "/projects", label: "Projects", icon: Layers },
  { href: "/sprints", label: "Sprints", icon: Zap },
  { href: "/docs", label: "Documentation", icon: FileText },
  { href: "/reviews", label: "Design Reviews", icon: GitPullRequestArrow },
  { href: "/roadmap", label: "Roadmap", icon: Map },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setPaletteOpen, setCreateOpen } = useUIStore();
  const user = userById(CURRENT_USER_ID)!;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-bg-subtle">
      {/* Workspace switcher */}
      <div className="flex items-center gap-2.5 px-3 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-sm font-bold text-white shadow-sm">S</div>
        <div className="flex-1 leading-tight">
          <div className="text-sm font-semibold">SprintDesk</div>
          <div className="text-[11px] text-fg-subtle">Studio Design</div>
        </div>
        <ChevronRight size={14} className="text-fg-subtle" />
      </div>

      {/* Search + create */}
      <div className="flex items-center gap-2 px-3 pb-2">
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex h-8 flex-1 items-center gap-2 rounded-md border border-border bg-bg-elevated px-2.5 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:bg-bg-hover focus-ring"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search…</span>
          <Kbd>⌘K</Kbd>
        </button>
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Create"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition-colors hover:border-border-strong hover:bg-bg-hover hover:text-fg focus-ring"
        >
          <Plus size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-0.5">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>

        <div className="mt-5">
          <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Workspace</div>
          <div className="space-y-0.5">
            {WORKSPACE.map((item) => (
              <NavLink key={item.href} {...item} active={isActive(item.href)} />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Projects</div>
          <div className="space-y-0.5">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive(`/projects/${p.id}`) ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover hover:text-fg",
                )}
              >
                <span className="h-2 w-2 shrink-0 rounded-[3px]" style={{ background: PROJECT_STATUS_META[p.status].color }} />
                <span className="flex-1 truncate">{p.name}</span>
                <span className="text-[10px] font-medium text-fg-subtle">{p.key}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <Link href="/settings" className="flex items-center gap-2.5 border-t border-border px-3 py-2.5 transition-colors hover:bg-bg-hover">
        <Avatar userId={user.id} size={26} />
        <div className="flex-1 leading-tight">
          <div className="text-[13px] font-medium">{user.name}</div>
          <div className="text-[11px] text-fg-subtle">{user.title}</div>
        </div>
        <Settings size={15} className="text-fg-subtle" />
      </Link>
    </aside>
  );
}

function NavLink({
  href, label, icon: Icon, badge, active,
}: { href: string; label: string; icon: React.ComponentType<{ size?: number }>; badge?: number; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover hover:text-fg",
      )}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">{badge}</span>
      ) : null}
    </Link>
  );
}
