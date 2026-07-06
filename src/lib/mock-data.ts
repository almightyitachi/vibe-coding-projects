import type {
  Activity, DocPage, Milestone, Notification, Project, Review, Sprint, Tag, Task, User,
} from "./types";

// --- Users ---------------------------------------------------------------
export const CURRENT_USER_ID = "u_maya";

export const users: User[] = [
  { id: "u_maya", name: "Maya Chen", email: "maya@studio.design", role: "DESIGN_LEAD", title: "Design Lead", avatarColor: "#33684b" },
  { id: "u_arjun", name: "Arjun Rao", email: "arjun@studio.design", role: "DESIGNER", title: "Senior Product Designer", avatarColor: "#41729f" },
  { id: "u_lena", name: "Lena Fischer", email: "lena@studio.design", role: "DESIGNER", title: "UX Designer", avatarColor: "#3f8f7a" },
  { id: "u_theo", name: "Theo Martins", email: "theo@studio.design", role: "DESIGNER", title: "UX Researcher", avatarColor: "#c08a2e" },
  { id: "u_nadia", name: "Nadia Kaur", email: "nadia@studio.design", role: "ADMIN", title: "Design Ops", avatarColor: "#b3527d" },
  { id: "u_sam", name: "Sam Okafor", email: "sam@studio.design", role: "VIEWER", title: "PM (Stakeholder)", avatarColor: "#7d5ba6" },
];

export const userById = (id?: string) => users.find((u) => u.id === id);

// --- Tags ----------------------------------------------------------------
export const tags: Tag[] = [
  { id: "t_ux", label: "UX", color: "#41729f" },
  { id: "t_ui", label: "UI", color: "#33684b" },
  { id: "t_research", label: "Research", color: "#c26a2e" },
  { id: "t_a11y", label: "Accessibility", color: "#3f8f7a" },
  { id: "t_ds", label: "Design System", color: "#7d5ba6" },
  { id: "t_qa", label: "Design QA", color: "#bf4a2e" },
  { id: "t_handoff", label: "Handoff", color: "#35855b" },
];
export const tagById = (id: string) => tags.find((t) => t.id === id);

// --- Projects ------------------------------------------------------------
export const projects: Project[] = [
  {
    id: "p_mobile", key: "MOB", name: "Mobile App Redesign",
    description: "End-to-end redesign of the iOS & Android apps around a unified design system.",
    status: "ACTIVE", ownerId: "u_maya", memberIds: ["u_maya", "u_arjun", "u_lena", "u_theo"],
    startDate: "2026-05-01", targetDate: "2026-08-30", sprintCount: 6, progress: 62,
  },
  {
    id: "p_web", key: "WEB", name: "Marketing Site 2.0",
    description: "New marketing site with a refreshed brand system and a modular page builder.",
    status: "ACTIVE", ownerId: "u_arjun", memberIds: ["u_arjun", "u_lena", "u_maya"],
    startDate: "2026-06-01", targetDate: "2026-09-15", sprintCount: 4, progress: 34,
  },
  {
    id: "p_ds", key: "DS", name: "Design System Foundations",
    description: "Tokens, components and documentation for the shared design system.",
    status: "ACTIVE", ownerId: "u_maya", memberIds: ["u_maya", "u_lena", "u_nadia"],
    startDate: "2026-04-15", targetDate: "2026-10-01", sprintCount: 5, progress: 48,
  },
  {
    id: "p_research", key: "RES", name: "Onboarding Research",
    description: "Discovery research into first-run onboarding friction and activation.",
    status: "PLANNING", ownerId: "u_theo", memberIds: ["u_theo", "u_maya"],
    startDate: "2026-07-01", targetDate: "2026-08-15", sprintCount: 2, progress: 12,
  },
];
export const projectById = (id?: string) => projects.find((p) => p.id === id);

// --- Sprints -------------------------------------------------------------
export const sprints: Sprint[] = [
  { id: "s_mob_7", name: "Mobile Sprint 7", goal: "Ship the redesigned checkout & profile flows to review.", projectId: "p_mobile", status: "ACTIVE", ownerId: "u_maya", startDate: "2026-06-30", endDate: "2026-07-13", velocity: 34 },
  { id: "s_mob_6", name: "Mobile Sprint 6", goal: "Navigation model + home feed exploration.", projectId: "p_mobile", status: "COMPLETED", ownerId: "u_maya", startDate: "2026-06-16", endDate: "2026-06-29", velocity: 31 },
  { id: "s_web_3", name: "Web Sprint 3", goal: "Page builder blocks and responsive rules.", projectId: "p_web", status: "ACTIVE", ownerId: "u_arjun", startDate: "2026-06-30", endDate: "2026-07-13", velocity: 22 },
  { id: "s_ds_4", name: "DS Sprint 4", goal: "Form controls, overlays and motion tokens.", projectId: "p_ds", status: "PLANNING", ownerId: "u_maya", startDate: "2026-07-14", endDate: "2026-07-27", velocity: 26 },
];
export const sprintById = (id?: string) => sprints.find((s) => s.id === id);

// --- Tasks ---------------------------------------------------------------
export const tasks: Task[] = [
  mk("MOB-142", "Redesign checkout payment step", "REVIEW", "URGENT", "u_arjun", "p_mobile", "s_mob_7", { module: "Checkout", designStage: "VISUAL", tagIds: ["t_ui"], points: 5, figma: true, due: "2026-07-08", comments: 4, attachments: 2 }),
  mk("MOB-143", "Profile screen information architecture", "IN_PROGRESS", "HIGH", "u_lena", "p_mobile", "s_mob_7", { module: "Profile", designStage: "WIREFRAME", tagIds: ["t_ux"], points: 3, comments: 2 }),
  mk("MOB-144", "Empty states for order history", "TODO", "MEDIUM", "u_arjun", "p_mobile", "s_mob_7", { module: "Orders", designStage: "VISUAL", tagIds: ["t_ui"], points: 2 }),
  mk("MOB-145", "Accessibility audit — checkout", "TODO", "HIGH", "u_lena", "p_mobile", "s_mob_7", { module: "Checkout", designStage: "VISUAL", tagIds: ["t_a11y", "t_qa"], points: 3, due: "2026-07-10" }),
  mk("MOB-146", "Prototype the address entry flow", "BACKLOG", "MEDIUM", "u_arjun", "p_mobile", "s_mob_7", { module: "Checkout", designStage: "PROTOTYPE", tagIds: ["t_ux"], points: 5 }),
  mk("MOB-138", "Home feed card system", "APPROVED", "HIGH", "u_lena", "p_mobile", "s_mob_7", { module: "Home", designStage: "VISUAL", tagIds: ["t_ui", "t_ds"], points: 5, figma: true, comments: 6 }),
  mk("MOB-131", "New tab bar interaction model", "DONE", "MEDIUM", "u_arjun", "p_mobile", "s_mob_6", { module: "Navigation", designStage: "HANDOFF", tagIds: ["t_ux", "t_handoff"], points: 3, comments: 3 }),
  mk("MOB-147", "Research synthesis: checkout drop-off", "IN_PROGRESS", "MEDIUM", "u_theo", "p_mobile", "s_mob_7", { module: "Checkout", designStage: "DISCOVERY", tagIds: ["t_research"], points: 3 }),

  mk("WEB-51", "Hero block variants", "IN_PROGRESS", "HIGH", "u_arjun", "p_web", "s_web_3", { module: "Blocks", designStage: "VISUAL", tagIds: ["t_ui"], points: 3, figma: true }),
  mk("WEB-52", "Responsive grid rules", "TODO", "MEDIUM", "u_lena", "p_web", "s_web_3", { module: "Layout", designStage: "WIREFRAME", tagIds: ["t_ux"], points: 2 }),
  mk("WEB-53", "Pricing table design", "REVIEW", "HIGH", "u_arjun", "p_web", "s_web_3", { module: "Blocks", designStage: "VISUAL", tagIds: ["t_ui"], points: 3, comments: 2 }),
  mk("WEB-48", "Brand color exploration", "DONE", "MEDIUM", "u_arjun", "p_web", "s_web_3", { module: "Brand", designStage: "VISUAL", tagIds: ["t_ds"], points: 2 }),

  mk("DS-88", "Form control tokens", "TODO", "HIGH", "u_lena", "p_ds", "s_ds_4", { module: "Tokens", designStage: "VISUAL", tagIds: ["t_ds"], points: 3 }),
  mk("DS-89", "Overlay & popover components", "BACKLOG", "MEDIUM", "u_lena", "p_ds", "s_ds_4", { module: "Components", designStage: "VISUAL", tagIds: ["t_ds"], points: 5 }),
  mk("DS-84", "Motion & easing tokens", "IN_PROGRESS", "MEDIUM", "u_maya", "p_ds", "s_ds_4", { module: "Motion", designStage: "PROTOTYPE", tagIds: ["t_ds"], points: 3 }),

  mk("RES-12", "Recruit 8 onboarding participants", "TODO", "HIGH", "u_theo", "p_research", undefined, { module: "Recruiting", designStage: "DISCOVERY", tagIds: ["t_research"], points: 2, due: "2026-07-12" }),
  mk("RES-13", "Draft interview script", "IN_PROGRESS", "MEDIUM", "u_theo", "p_research", undefined, { module: "Method", designStage: "DISCOVERY", tagIds: ["t_research"], points: 2 }),
];

function mk(
  id: string, title: string, status: Task["status"], priority: Task["priority"],
  assigneeId: string, projectId: string, sprintId: string | undefined,
  opts: {
    module?: string; designStage?: Task["designStage"]; tagIds?: string[]; points?: number;
    figma?: boolean; due?: string; comments?: number; attachments?: number;
  } = {},
): Task {
  const now = Date.parse("2026-07-06T09:00:00Z");
  const jitter = (id.charCodeAt(id.length - 1) % 20) + 1;
  return {
    id, title,
    description: "Design work item tracked in the current sprint. See linked Figma and documentation for full context, decisions and edge cases.",
    status, priority, assigneeId, reporterId: "u_maya", projectId, sprintId,
    module: opts.module, designStage: opts.designStage,
    figmaUrl: opts.figma ? "https://figma.com/file/example" : undefined,
    points: opts.points ?? 2, tagIds: opts.tagIds ?? [], dueDate: opts.due,
    createdAt: new Date(now - jitter * 86400000).toISOString(),
    updatedAt: new Date(now - jitter * 3600000).toISOString(),
    commentCount: opts.comments ?? 0, attachmentCount: opts.attachments ?? 0,
  };
}

export const taskById = (id: string) => tasks.find((t) => t.id === id);

// --- Documentation -------------------------------------------------------
export const docs: DocPage[] = [
  {
    id: "d_checkout_brief", title: "Checkout Redesign — Design Brief", icon: "📝", template: "Design Brief",
    projectId: "p_mobile", authorId: "u_maya", updatedAt: "2026-07-05T14:00:00Z",
    excerpt: "Why we are redesigning checkout, the goals, constraints and success metrics.",
    body: `## Overview
The current checkout has a 34% drop-off at the payment step. This project reworks the flow end to end.

## Problem Statement
Users abandon at payment because of unclear cost breakdowns and a lengthy address form.

## Goals
- Reduce payment-step drop-off by 15%
- Cut time-to-purchase to under 45 seconds
- Meet WCAG 2.2 AA on all screens

## Design Decisions
> We chose a single-scroll checkout over a multi-step wizard to reduce perceived length.

- Persistent order summary
- Inline validation on every field
- Express payment surfaced first

## Edge Cases
- Failed payment retry
- Partial stock during checkout
- Guest vs. authenticated flows`,
  },
  {
    id: "d_research_dropoff", title: "Research: Checkout Drop-off Synthesis", icon: "🔬", template: "Research",
    projectId: "p_mobile", authorId: "u_theo", updatedAt: "2026-07-04T10:30:00Z",
    excerpt: "Synthesis of 12 interviews and funnel analytics on checkout abandonment.",
    body: `## Method
12 moderated interviews + funnel analytics over 30 days.

## Key Findings
- **Cost surprise** at payment is the #1 abandonment driver
- Address entry feels "heavy" on mobile
- Trust signals are missing at the payment step

## Recommendations
- Show total cost earlier
- Autofill + map-assisted address
- Add security & returns messaging near CTA`,
  },
  {
    id: "d_ds_tokens", title: "Design Tokens Reference", icon: "🎨", template: "Feature Spec",
    projectId: "p_ds", authorId: "u_lena", updatedAt: "2026-07-02T09:00:00Z",
    excerpt: "The canonical list of color, spacing, radius and motion tokens.",
    body: `## Overview
Single source of truth for design tokens shared across web and mobile.

## Color
Semantic tokens map to primitives. Never hard-code hex values in components.

## Spacing
A 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64.

## Motion
Standard easing: cubic-bezier(0.16, 1, 0.3, 1). Durations 120–240ms.`,
  },
  {
    id: "d_retro_s6", title: "Mobile Sprint 6 — Retrospective", icon: "🔁", template: "Retrospective",
    projectId: "p_mobile", authorId: "u_maya", updatedAt: "2026-06-30T16:00:00Z",
    excerpt: "What went well, what to improve, and actions for Sprint 7.",
    body: `## What went well
- Navigation model landed with strong stakeholder buy-in
- Faster review turnaround (avg 1.2 days)

## What to improve
- Research handoff was late
- Too much WIP mid-sprint

## Actions
- Cap WIP at 3 per designer
- Schedule research sync on day 1`,
  },
  {
    id: "d_handoff_nav", title: "Handoff Notes — Tab Bar", icon: "📦", template: "Feature Spec",
    projectId: "p_mobile", authorId: "u_arjun", updatedAt: "2026-06-29T11:00:00Z",
    excerpt: "Engineering handoff for the new tab bar: specs, states and motion.",
    body: `## Overview
Handoff for the redesigned tab bar (MOB-131).

## Specs
- Height 56px, safe-area aware
- Active indicator: 240ms spring
- Icons: 24px, 2px stroke

## States
Default · Active · Pressed · Badge · Disabled`,
  },
];
export const docById = (id: string) => docs.find((d) => d.id === id);

// --- Reviews -------------------------------------------------------------
export const reviews: Review[] = [
  { id: "r_checkout", title: "Checkout payment step — visual review", status: "CHANGES_REQUESTED", projectId: "p_mobile", authorId: "u_arjun", reviewerIds: ["u_maya", "u_lena"], taskId: "MOB-142", figmaUrl: "https://figma.com/file/example", openThreads: 3, resolvedThreads: 5, updatedAt: "2026-07-05T15:00:00Z" },
  { id: "r_home", title: "Home feed card system", status: "APPROVED", projectId: "p_mobile", authorId: "u_lena", reviewerIds: ["u_maya"], taskId: "MOB-138", figmaUrl: "https://figma.com/file/example", openThreads: 0, resolvedThreads: 7, updatedAt: "2026-07-03T12:00:00Z" },
  { id: "r_pricing", title: "Pricing table design", status: "READY", projectId: "p_web", authorId: "u_arjun", reviewerIds: ["u_maya", "u_lena"], taskId: "WEB-53", openThreads: 0, resolvedThreads: 0, updatedAt: "2026-07-05T09:00:00Z" },
  { id: "r_tabbar", title: "Tab bar interaction model", status: "CLOSED", projectId: "p_mobile", authorId: "u_arjun", reviewerIds: ["u_maya"], taskId: "MOB-131", openThreads: 0, resolvedThreads: 4, updatedAt: "2026-06-28T10:00:00Z" },
  { id: "r_hero", title: "Hero block variants", status: "DRAFT", projectId: "p_web", authorId: "u_arjun", reviewerIds: [], taskId: "WEB-51", openThreads: 0, resolvedThreads: 0, updatedAt: "2026-07-06T08:00:00Z" },
];
export const reviewById = (id: string) => reviews.find((r) => r.id === id);

// --- Milestones (roadmap) ------------------------------------------------
export const milestones: Milestone[] = [
  { id: "m_mob_beta", name: "Mobile Beta", projectId: "p_mobile", date: "2026-08-01", progress: 62 },
  { id: "m_mob_ga", name: "Mobile GA", projectId: "p_mobile", date: "2026-08-30", progress: 30 },
  { id: "m_web_launch", name: "Site Launch", projectId: "p_web", date: "2026-09-15", progress: 34 },
  { id: "m_ds_v1", name: "Design System v1", projectId: "p_ds", date: "2026-10-01", progress: 48 },
  { id: "m_res_report", name: "Research Report", projectId: "p_research", date: "2026-08-15", progress: 12 },
];

// --- Activity ------------------------------------------------------------
export const activity: Activity[] = [
  { id: "a1", actorId: "u_arjun", verb: "moved", target: "MOB-142 to Review", targetHref: "/sprints/s_mob_7", createdAt: "2026-07-06T08:30:00Z" },
  { id: "a2", actorId: "u_maya", verb: "requested changes on", target: "Checkout payment review", targetHref: "/reviews", createdAt: "2026-07-06T08:05:00Z" },
  { id: "a3", actorId: "u_lena", verb: "updated", target: "Design Tokens Reference", targetHref: "/docs", createdAt: "2026-07-05T18:20:00Z" },
  { id: "a4", actorId: "u_theo", verb: "published", target: "Checkout Drop-off Synthesis", targetHref: "/docs", createdAt: "2026-07-05T16:40:00Z" },
  { id: "a5", actorId: "u_maya", verb: "approved", target: "Home feed card system", targetHref: "/reviews", createdAt: "2026-07-05T14:10:00Z" },
  { id: "a6", actorId: "u_arjun", verb: "commented on", target: "MOB-138", targetHref: "/sprints/s_mob_7", createdAt: "2026-07-05T11:00:00Z" },
];

// --- Notifications -------------------------------------------------------
export const notifications: Notification[] = [
  { id: "n1", kind: "REVIEW_REQUEST", actorId: "u_arjun", text: "requested your review on Checkout payment step", href: "/reviews", read: false, createdAt: "2026-07-06T08:35:00Z" },
  { id: "n2", kind: "MENTION", actorId: "u_lena", text: "mentioned you in Design Tokens Reference", href: "/docs", read: false, createdAt: "2026-07-06T07:50:00Z" },
  { id: "n3", kind: "ASSIGNMENT", actorId: "u_maya", text: "assigned you MOB-145 · Accessibility audit", href: "/sprints/s_mob_7", read: false, createdAt: "2026-07-05T17:20:00Z" },
  { id: "n4", kind: "STATUS_CHANGE", actorId: "u_arjun", text: "moved MOB-142 to Review", href: "/sprints/s_mob_7", read: true, createdAt: "2026-07-05T16:00:00Z" },
  { id: "n5", kind: "SPRINT_EVENT", actorId: "u_maya", text: "started Mobile Sprint 7", href: "/sprints/s_mob_7", read: true, createdAt: "2026-06-30T09:00:00Z" },
];
