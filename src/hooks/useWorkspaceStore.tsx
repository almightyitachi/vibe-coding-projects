"use client";

import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import type { DocPage, Review, ReviewStatus, Sprint, SprintStatus } from "@/lib/types";
import {
  sprints as seedSprints, docs as seedDocs, reviews as seedReviews, CURRENT_USER_ID,
} from "@/lib/mock-data";

// Workspace store: sprints, documentation and reviews — the non-task pillars.
// Same pattern as the task store: seeded from demo data, persisted to
// localStorage, action signatures mapping 1:1 onto the production API.

const STORAGE_KEY = "sd-workspace-v1";

export interface CreateSprintInput {
  name: string;
  goal?: string;
  projectId: string;
  startDate: string;
  endDate: string;
}

export interface CreateDocInput {
  title: string;
  template: string;
  projectId?: string;
  body: string;
  icon: string;
}

interface WorkspaceStore {
  hydrated: boolean;
  sprints: Sprint[];
  createSprint: (input: CreateSprintInput) => Sprint;
  updateSprint: (id: string, patch: Partial<Sprint>) => void;
  docs: DocPage[];
  createDoc: (input: CreateDocInput) => DocPage;
  updateDoc: (id: string, patch: Partial<DocPage>) => void;
  deleteDoc: (id: string) => void;
  reviews: Review[];
  updateReview: (id: string, patch: Partial<Review>) => void;
  resetWorkspace: () => void;
}

const Ctx = createContext<WorkspaceStore | null>(null);

interface Persisted {
  sprints: Sprint[];
  docs: DocPage[];
  reviews: Review[];
}

function isPersisted(v: unknown): v is Persisted {
  const p = v as Persisted;
  return !!p && Array.isArray(p.sprints) && Array.isArray(p.docs) && Array.isArray(p.reviews);
}

const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>(seedSprints);
  const [docs, setDocs] = useState<DocPage[]>(seedDocs);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [hydrated, setHydrated] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isPersisted(parsed)) {
          setSprints(parsed.sprints);
          setDocs(parsed.docs);
          setReviews(parsed.reviews);
        }
      }
    } catch { /* corrupted storage → keep seed */ }
    ready.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sprints, docs, reviews }));
    } catch { /* storage unavailable → in-memory only */ }
  }, [sprints, docs, reviews]);

  const createSprint = useCallback((input: CreateSprintInput): Sprint => {
    const sprint: Sprint = {
      id: uid("s"),
      name: input.name.trim(),
      goal: input.goal?.trim() ?? "",
      projectId: input.projectId,
      status: "PLANNING",
      ownerId: CURRENT_USER_ID,
      startDate: input.startDate,
      endDate: input.endDate,
      velocity: 0,
    };
    setSprints((prev) => [sprint, ...prev]);
    return sprint;
  }, []);

  const updateSprint = useCallback((id: string, patch: Partial<Sprint>) => {
    setSprints((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const createDoc = useCallback((input: CreateDocInput): DocPage => {
    const firstLine = input.body.split("\n").find((l) => l.trim() && !l.startsWith("#"));
    const doc: DocPage = {
      id: uid("d"),
      title: input.title.trim(),
      icon: input.icon,
      template: input.template,
      projectId: input.projectId,
      authorId: CURRENT_USER_ID,
      updatedAt: new Date().toISOString(),
      excerpt: (firstLine ?? "").slice(0, 120),
      body: input.body,
    };
    setDocs((prev) => [doc, ...prev]);
    return doc;
  }, []);

  const updateDoc = useCallback((id: string, patch: Partial<DocPage>) => {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = { ...d, ...patch, updatedAt: new Date().toISOString() };
        if (patch.body !== undefined) {
          const firstLine = patch.body.split("\n").find((l) => l.trim() && !l.startsWith("#"));
          next.excerpt = (firstLine ?? "").slice(0, 120);
        }
        return next;
      }),
    );
  }, []);

  const deleteDoc = useCallback((id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateReview = useCallback((id: string, patch: Partial<Review>) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r)),
    );
  }, []);

  const resetWorkspace = useCallback(() => {
    setSprints(seedSprints);
    setDocs(seedDocs);
    setReviews(seedReviews);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }, []);

  return (
    <Ctx.Provider
      value={{
        hydrated,
        sprints, createSprint, updateSprint,
        docs, createDoc, updateDoc, deleteDoc,
        reviews, updateReview,
        resetWorkspace,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

export type { SprintStatus, ReviewStatus };
