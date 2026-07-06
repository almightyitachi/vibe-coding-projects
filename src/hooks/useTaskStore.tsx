"use client";

import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import type { DesignStage, Priority, Task, TaskStatus } from "@/lib/types";
import { tasks as seedTasks, projectById, sprints, CURRENT_USER_ID } from "@/lib/mock-data";

// Central client-side task store: the single source of truth for every screen.
// Seeded from demo data, persisted to localStorage so create/edit/move/delete
// survive reloads. In production this becomes TanStack Query mutations against
// the API — the action signatures map 1:1 onto POST/PATCH/DELETE /tasks.

const STORAGE_KEY = "sd-tasks-v1";

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  sprintId?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  designStage?: DesignStage;
  points?: number;
  dueDate?: string;
}

interface TaskStore {
  tasks: Task[];
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  resetDemo: () => void;
}

const Ctx = createContext<TaskStore | null>(null);

function isTaskArray(v: unknown): v is Task[] {
  return Array.isArray(v) && v.every(
    (t) => t && typeof t.id === "string" && typeof t.title === "string" && typeof t.status === "string",
  );
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const hydrated = useRef(false);
  // Ref mirror so createTask can read/return the fresh list synchronously.
  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  // Load persisted tasks after mount (SSR renders the seed, so markup matches).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isTaskArray(parsed)) setTasks(parsed);
      }
    } catch {
      /* corrupted storage → keep seed */
    }
    hydrated.current = true;
  }, []);

  // Persist every change after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage full/unavailable → in-memory only */
    }
  }, [tasks]);

  const createTask = useCallback((input: CreateTaskInput): Task => {
    const key = projectById(input.projectId)?.key ?? "TSK";
    const now = new Date().toISOString();
    const prev = tasksRef.current;
    const nums = prev
      .filter((t) => t.id.startsWith(`${key}-`))
      .map((t) => parseInt(t.id.slice(key.length + 1), 10))
      .filter((n) => !Number.isNaN(n));
    const nextNum = (nums.length ? Math.max(...nums) : 0) + 1;
    // Default the sprint to the project's active sprint so the task lands on a board.
    const sprintId =
      input.sprintId ??
      sprints.find((s) => s.projectId === input.projectId && s.status === "ACTIVE")?.id;
    const created: Task = {
      id: `${key}-${nextNum}`,
      title: input.title.trim(),
      description: input.description?.trim() || "",
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
      assigneeId: input.assigneeId,
      reporterId: CURRENT_USER_ID,
      projectId: input.projectId,
      sprintId,
      designStage: input.designStage,
      points: input.points ?? 2,
      tagIds: [],
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
      commentCount: 0,
      attachmentCount: 0,
    };
    const next = [created, ...prev];
    tasksRef.current = next;
    setTasks(next);
    return created;
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)),
    );
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    updateTask(id, { status });
  }, [updateTask]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetDemo = useCallback(() => {
    setTasks(seedTasks);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }, []);

  return (
    <Ctx.Provider value={{ tasks, createTask, updateTask, moveTask, deleteTask, resetDemo }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
