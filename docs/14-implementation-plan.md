# 14 · Complete Implementation Plan

How to take this repository from runnable prototype to production, in concrete steps.

## What exists now (verified)
- ✅ Next.js 15 + TypeScript + Tailwind v4 frontend, **production build passes**, all 13 routes render.
- ✅ Full design system (Expo theme) with dark/light modes and semantic tokens.
- ✅ Every core screen: Home, Inbox, My Work, Projects (+detail/5 views), Sprints (+board/overview/burndown), Docs (+reader/versions), Reviews (board+list), Roadmap, Settings (+permissions matrix).
- ✅ Command palette (⌘K), quick-create (`c`), drag-and-drop board, theme toggle.
- ✅ Typed mock data layer mirroring the DB model.
- ✅ Validated Prisma schema; API/architecture/permissions specs.

## Step 1 — Stand up the backend
1. `cd server && nest new` (or use the seeded layout). Add Prisma, Auth.js bridge, Meilisearch, S3, Redis clients.
2. `prisma migrate dev` against the schema in `/prisma`; write `seed.ts` from `src/lib/mock-data.ts` (same shapes).
3. Implement `AuthModule` + `RolesGuard` using the capability matrix (doc 11).

## Step 2 — Replace the mock layer
1. Add `src/lib/api.ts`: a typed fetch client + TanStack Query hooks (`useTasks`, `useSprint`, `useDocs`, …) returning the **same** `types.ts` shapes.
2. Swap direct `mock-data` imports for hooks screen-by-screen. Because components depend only on `types.ts`, changes are localized.
3. Wrap the app in a `QueryClientProvider`.

## Step 3 — Wire mutations (optimistic)
- Task move/create/assign, doc autosave/publish, review transitions, notifications read.
- Each mutation: optimistic cache update → API call → reconcile/rollback + toast.

## Step 4 — Real-time
- Add a WS client; subscribe board/doc/review/inbox rooms; patch TanStack Query cache from deltas.
- Server: `RealtimeModule` gateway emits after transaction commit.

## Step 5 — Search & uploads
- Meilisearch indexer on write; point ⌘K search endpoint at it (keep local filter as fallback).
- Presigned S3 upload flow for attachments (doc 08).

## Step 6 — Analytics
- Implement the six dashboards (velocity, completion, workload, review turnaround, doc coverage, capacity) from `ActivityLog` + task/sprint aggregates; cache in Redis.

## Step 7 — Quality gates
- Unit (services), integration (supertest), e2e (Playwright: create task, run sprint, review approval, doc publish).
- Accessibility audit; performance budget (First Load JS, P95 latency); error/empty-state coverage.

## Step 8 — Ship
- CI: typecheck → lint → test → build → `prisma migrate deploy` → rolling deploy.
- Observability + backups + rate limiting + security review → Beta → GA.

## Running the prototype today
```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /home
npm run build    # production build (verified passing)
```
Prisma schema:
```bash
npx prisma@6 validate --schema prisma/schema.prisma
```

## Risk register
| Risk | Mitigation |
| --- | --- |
| Scope creep toward Jira complexity | Guard the 4 principles; Admin-only workflow config |
| Rich-text edge cases | Adopt battle-tested Tiptap; store portable JSON + versions |
| Real-time consistency | Server is source of truth; deltas patch cache; reconcile on reconnect |
| Search staleness | Async index + <2s SLA + local fallback filter |
| Permission leaks | Server-side guards + per-query workspace scoping; UI is secondary |
```
