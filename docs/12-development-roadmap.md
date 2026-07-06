# 12 · Development Roadmap

Phased delivery from prototype (this repo) to production. Each phase ends shippable.

## Phase 0 — Design & Prototype ✅ (this repo)
- Product strategy, IA, flows, design system, wireframes, UX specs
- Prisma schema (validated), API + architecture specs, permissions model
- **Runnable Next.js frontend** with all core screens on a typed mock layer
- Verified: production build passes, all routes render

## Phase 1 — Foundations (Weeks 1–3)
- Monorepo (`web` + `server`), CI, linting, Prettier, commit hooks
- NestJS skeleton + Prisma migrate + seed
- Auth.js sign-in, workspace + membership, `RolesGuard`
- Replace mock layer with TanStack Query API client (contracts unchanged)

## Phase 2 — Core work management (Weeks 4–7)
- Projects CRUD + overview stats
- Sprints: board grouping, state machine, burndown, velocity
- Tasks: 6-state workflow, drag-reorder (LexoRank), comments, tags, bulk actions
- Optimistic mutations end-to-end

## Phase 3 — Documentation & reviews (Weeks 8–10)
- Tiptap rich editor, templates, autosave, versioning
- S3 presigned uploads + attachments
- Review state machine, pinned threads, per-reviewer approvals

## Phase 4 — Search, notifications, real-time (Weeks 11–13)
- Meilisearch indexing pipeline + ⌘K live search
- Notification fan-out + Inbox + email digests
- WebSocket gateway: live boards, docs, reviews, inbox

## Phase 5 — Roadmap, analytics, polish (Weeks 14–16)
- Roadmap timeline (quarter/month/custom) + milestones/releases
- Analytics dashboards: velocity, completion, workload, review turnaround, doc coverage, capacity
- Accessibility audit (WCAG 2.2 AA), performance pass, empty/error states

## Phase 6 — Hardening & launch (Weeks 17–18)
- Load testing, security review, rate limiting, backups/DR
- Observability (traces, metrics, logs), on-call runbooks
- Beta → GA

## Phase 7 — AI (post-GA)
- Sprint & review summaries, doc generation, tasks-from-notes
- Semantic/hybrid search, documentation recommendations

## Cross-cutting workstreams
- **Quality:** unit (services), integration (API), e2e (Playwright) on every phase.
- **Design QA:** every feature passes a design + accessibility review (dogfooded in-product).
- **Docs:** keep `/docs` in sync with shipped behavior.
