import type { Priority, ProjectStatus, ReviewStatus, SprintStatus, TaskStatus } from "./types";

export const STATUS_ORDER: TaskStatus[] = [
  "BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "APPROVED", "DONE",
];

export const STATUS_META: Record<TaskStatus, { label: string; color: string; dot: string }> = {
  BACKLOG: { label: "Backlog", color: "var(--fg-subtle)", dot: "#8b8b93" },
  TODO: { label: "Todo", color: "var(--fg-muted)", dot: "#a1a1aa" },
  IN_PROGRESS: { label: "In Progress", color: "var(--warning)", dot: "#f5a623" },
  REVIEW: { label: "Review", color: "var(--info)", dot: "#3b82f6" },
  APPROVED: { label: "Approved", color: "#8e4ec6", dot: "#8e4ec6" },
  DONE: { label: "Done", color: "var(--success)", dot: "#30a46c" },
};

export const PRIORITY_META: Record<Priority, { label: string; color: string; rank: number }> = {
  URGENT: { label: "Urgent", color: "#e5484d", rank: 0 },
  HIGH: { label: "High", color: "#f5a623", rank: 1 },
  MEDIUM: { label: "Medium", color: "#3b82f6", rank: 2 },
  LOW: { label: "Low", color: "#8b8b93", rank: 3 },
};

export const DESIGN_STAGE_META: Record<string, { label: string; color: string }> = {
  DISCOVERY: { label: "Discovery", color: "#f5a623" },
  WIREFRAME: { label: "Wireframe", color: "#3b82f6" },
  VISUAL: { label: "Visual", color: "#8e4ec6" },
  PROTOTYPE: { label: "Prototype", color: "#12a594" },
  HANDOFF: { label: "Handoff", color: "#30a46c" },
};

export const SPRINT_STATUS_META: Record<SprintStatus, { label: string; color: string }> = {
  PLANNING: { label: "Planning", color: "#8b8b93" },
  ACTIVE: { label: "Active", color: "#30a46c" },
  REVIEW: { label: "Review", color: "#3b82f6" },
  COMPLETED: { label: "Completed", color: "#8e4ec6" },
  ARCHIVED: { label: "Archived", color: "#71717a" },
};

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; color: string }> = {
  PLANNING: { label: "Planning", color: "#8b8b93" },
  ACTIVE: { label: "Active", color: "#30a46c" },
  PAUSED: { label: "Paused", color: "#f5a623" },
  COMPLETED: { label: "Completed", color: "#8e4ec6" },
};

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "#8b8b93" },
  READY: { label: "Ready for Review", color: "#3b82f6" },
  CHANGES_REQUESTED: { label: "Changes Requested", color: "#f5a623" },
  APPROVED: { label: "Approved", color: "#30a46c" },
  CLOSED: { label: "Closed", color: "#71717a" },
};
