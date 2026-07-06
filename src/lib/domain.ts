import type { Priority, ProjectStatus, ReviewStatus, SprintStatus, TaskStatus } from "./types";

// Accent hues follow the warm "Steep" palette: tea green, terracotta, amber,
// slate blue, plum — muted and paper-friendly in both themes.

export const STATUS_ORDER: TaskStatus[] = [
  "BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "APPROVED", "DONE",
];

export const STATUS_META: Record<TaskStatus, { label: string; color: string; dot: string }> = {
  BACKLOG: { label: "Backlog", color: "var(--fg-subtle)", dot: "#8a927f" },
  TODO: { label: "Todo", color: "var(--fg-muted)", dot: "#a6ae9f" },
  IN_PROGRESS: { label: "In Progress", color: "var(--warning)", dot: "#c08a2e" },
  REVIEW: { label: "Review", color: "var(--info)", dot: "#41729f" },
  APPROVED: { label: "Approved", color: "#7d5ba6", dot: "#7d5ba6" },
  DONE: { label: "Done", color: "var(--success)", dot: "#35855b" },
};

export const PRIORITY_META: Record<Priority, { label: string; color: string; rank: number }> = {
  URGENT: { label: "Urgent", color: "#bf4a2e", rank: 0 },
  HIGH: { label: "High", color: "#c08a2e", rank: 1 },
  MEDIUM: { label: "Medium", color: "#41729f", rank: 2 },
  LOW: { label: "Low", color: "#8a927f", rank: 3 },
};

export const DESIGN_STAGE_META: Record<string, { label: string; color: string }> = {
  DISCOVERY: { label: "Discovery", color: "#c08a2e" },
  WIREFRAME: { label: "Wireframe", color: "#41729f" },
  VISUAL: { label: "Visual", color: "#7d5ba6" },
  PROTOTYPE: { label: "Prototype", color: "#3f8f7a" },
  HANDOFF: { label: "Handoff", color: "#35855b" },
};

export const SPRINT_STATUS_META: Record<SprintStatus, { label: string; color: string }> = {
  PLANNING: { label: "Planning", color: "#8a927f" },
  ACTIVE: { label: "Active", color: "#35855b" },
  REVIEW: { label: "Review", color: "#41729f" },
  COMPLETED: { label: "Completed", color: "#7d5ba6" },
  ARCHIVED: { label: "Archived", color: "#78816f" },
};

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; color: string }> = {
  PLANNING: { label: "Planning", color: "#8a927f" },
  ACTIVE: { label: "Active", color: "#35855b" },
  PAUSED: { label: "Paused", color: "#c08a2e" },
  COMPLETED: { label: "Completed", color: "#7d5ba6" },
};

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "#8a927f" },
  READY: { label: "Ready for Review", color: "#41729f" },
  CHANGES_REQUESTED: { label: "Changes Requested", color: "#c08a2e" },
  APPROVED: { label: "Approved", color: "#35855b" },
  CLOSED: { label: "Closed", color: "#78816f" },
};
