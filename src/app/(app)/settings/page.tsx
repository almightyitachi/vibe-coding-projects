"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Check, Moon, Sun } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { PageHeader, Card, Avatar, Badge, Button } from "@/components/ui/primitives";
import { users } from "@/lib/mock-data";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTasks } from "@/hooks/useTaskStore";
import { useUIStore } from "@/hooks/useUIStore";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const TABS = ["Workspace", "Members", "Permissions", "Templates", "Appearance"] as const;
type Tab = (typeof TABS)[number];

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin", DESIGN_LEAD: "Design Lead", DESIGNER: "Designer", VIEWER: "Viewer",
};
const ROLE_COLOR: Record<Role, string> = {
  ADMIN: "#bf4a2e", DESIGN_LEAD: "#33684b", DESIGNER: "#3f8f7a", VIEWER: "#8a927f",
};

const CAPABILITIES = [
  { cap: "Manage workspace & billing", roles: ["ADMIN"] },
  { cap: "Manage members & roles", roles: ["ADMIN"] },
  { cap: "Configure workflows & templates", roles: ["ADMIN"] },
  { cap: "Create projects & sprints", roles: ["ADMIN", "DESIGN_LEAD"] },
  { cap: "Manage roadmap", roles: ["ADMIN", "DESIGN_LEAD"] },
  { cap: "Assign tasks", roles: ["ADMIN", "DESIGN_LEAD"] },
  { cap: "Approve deliverables / reviews", roles: ["ADMIN", "DESIGN_LEAD"] },
  { cap: "Manage assigned work & status", roles: ["ADMIN", "DESIGN_LEAD", "DESIGNER"] },
  { cap: "Upload files & create docs", roles: ["ADMIN", "DESIGN_LEAD", "DESIGNER"] },
  { cap: "Add comments", roles: ["ADMIN", "DESIGN_LEAD", "DESIGNER"] },
  { cap: "View projects & documentation", roles: ["ADMIN", "DESIGN_LEAD", "DESIGNER", "VIEWER"] },
] as const;

const TEMPLATES = ["Research", "Design Brief", "User Flow", "Feature Spec", "Design QA", "Retrospective", "Meeting Notes", "Release Notes"];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Workspace");
  const { theme, toggle } = useTheme();
  const { resetDemo } = useTasks();
  const { pushToast } = useUIStore();
  const roles: Role[] = ["ADMIN", "DESIGN_LEAD", "DESIGNER", "VIEWER"];

  return (
    <>
      <Topbar left={<span className="text-sm font-medium">Settings</span>} />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader title="Settings" subtitle="Workspace configuration, members and permissions." icon={<SettingsIcon size={18} />} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr]">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors whitespace-nowrap",
                  tab === t ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover hover:text-fg")}>
                {t}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {tab === "Workspace" && (
              <Card className="p-5">
                <h3 className="mb-4 text-sm font-semibold">Workspace</h3>
                <Field label="Name" value="Studio Design" />
                <Field label="URL" value="studio.sprintdesk.app" />
                <Field label="Plan" value="Team · 6 seats" />
                <div className="mt-4"><Button variant="primary" size="sm">Save changes</Button></div>
                <div className="mt-6 flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">Demo data</div>
                    <div className="text-xs text-fg-subtle">Restore the original sample tasks (discards your local changes).</div>
                  </div>
                  <Button size="sm" onClick={() => { resetDemo(); pushToast("Demo data restored"); }}>Reset tasks</Button>
                </div>
              </Card>
            )}

            {tab === "Members" && (
              <Card className="overflow-hidden">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
                    <Avatar userId={u.id} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{u.name}</div>
                      <div className="truncate text-xs text-fg-subtle">{u.email}</div>
                    </div>
                    <Badge color={ROLE_COLOR[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                  </div>
                ))}
              </Card>
            )}

            {tab === "Permissions" && (
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-fg-subtle">Capability</th>
                      {roles.map((r) => (
                        <th key={r} className="px-3 py-2.5 text-center text-xs font-semibold" style={{ color: ROLE_COLOR[r] }}>{ROLE_LABEL[r]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CAPABILITIES.map((row) => (
                      <tr key={row.cap} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-2.5 text-fg-muted">{row.cap}</td>
                        {roles.map((r) => (
                          <td key={r} className="px-3 py-2.5 text-center">
                            {(row.roles as readonly string[]).includes(r) ? <Check size={15} className="mx-auto text-success" /> : <span className="text-fg-subtle">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {tab === "Templates" && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {TEMPLATES.map((t) => (
                  <Card key={t} hover className="flex items-center justify-between p-3.5">
                    <span className="text-sm font-medium">{t}</span>
                    <Badge>Doc</Badge>
                  </Card>
                ))}
              </div>
            )}

            {tab === "Appearance" && (
              <Card className="p-5">
                <h3 className="mb-4 text-sm font-semibold">Appearance</h3>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">Theme</div>
                    <div className="text-xs text-fg-subtle">Currently using {theme} mode</div>
                  </div>
                  <button onClick={toggle} className="flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm hover:bg-bg-hover">
                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                    Switch to {theme === "dark" ? "light" : "dark"}
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-medium text-fg-muted">{label}</label>
      <input defaultValue={value} className="h-8 w-full max-w-sm rounded-md border border-border bg-bg-elevated px-2.5 text-sm outline-none focus-ring" />
    </div>
  );
}
