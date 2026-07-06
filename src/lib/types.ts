// Domain model for SprintDesk. Mirrors the Prisma schema in /prisma/schema.prisma.

export type Role = "ADMIN" | "DESIGN_LEAD" | "DESIGNER" | "VIEWER";

export type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "APPROVED"
  | "DONE";

export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";

export type DesignStage =
  | "DISCOVERY"
  | "WIREFRAME"
  | "VISUAL"
  | "PROTOTYPE"
  | "HANDOFF";

export type SprintStatus =
  | "PLANNING"
  | "ACTIVE"
  | "REVIEW"
  | "COMPLETED"
  | "ARCHIVED";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "COMPLETED";

export type ReviewStatus =
  | "DRAFT"
  | "READY"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "CLOSED";

export type NotificationKind =
  | "ASSIGNMENT"
  | "MENTION"
  | "STATUS_CHANGE"
  | "SPRINT_EVENT"
  | "REVIEW_REQUEST"
  | "COMMENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatarColor?: string;
}

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface Project {
  id: string;
  key: string; // e.g. "MOB"
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  targetDate: string;
  sprintCount: number;
  progress: number; // 0..100
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  projectId: string;
  status: SprintStatus;
  ownerId: string;
  startDate: string;
  endDate: string;
  velocity: number;
}

export interface Task {
  id: string; // e.g. "MOB-142"
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  reporterId: string;
  projectId: string;
  sprintId?: string;
  module?: string;
  designStage?: DesignStage;
  figmaUrl?: string;
  prototypeUrl?: string;
  points: number;
  tagIds: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  attachmentCount: number;
}

export interface DocPage {
  id: string;
  title: string;
  icon: string;
  template: string;
  projectId?: string;
  parentId?: string;
  authorId: string;
  updatedAt: string;
  excerpt: string;
  body: string; // lightweight markdown-ish
}

export interface Review {
  id: string;
  title: string;
  status: ReviewStatus;
  projectId: string;
  authorId: string;
  reviewerIds: string[];
  taskId?: string;
  figmaUrl?: string;
  openThreads: number;
  resolvedThreads: number;
  updatedAt: string;
}

export interface Activity {
  id: string;
  actorId: string;
  verb: string;
  target: string;
  targetHref?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  kind: NotificationKind;
  actorId: string;
  text: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export interface Milestone {
  id: string;
  name: string;
  projectId: string;
  date: string;
  progress: number;
}
