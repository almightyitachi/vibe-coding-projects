<div align="center">

# SprintDesk

### The Design Operating System

**Linear for designers** — sprints, tasks, documentation, reviews and roadmap in one keyboard-first workspace.

Combines the project management of Jira, the speed and elegance of Linear, and lightweight docs like Confluence — without Jira's complexity.

</div>

---

## What this is

A production-grade blueprint **and** a runnable prototype for an internal Design Sprint Management Platform. It ships:

- 🎨 A polished **Next.js + TypeScript + Tailwind v4** frontend implementing every core screen on a typed mock-data layer (runs with zero backend).
- 🗄️ A **validated Prisma / PostgreSQL** schema for the full domain model.
- 🧩 A **NestJS** backend scaffold seed (guards, RBAC, reference module).
- 📚 A complete **documentation set** (15 deliverables) in [`docs/`](./docs).

## Quick start

```bash
npm install
npm run dev        # → http://localhost:3000  (redirects to /home)
```

```bash
npm run build      # production build (verified passing)
npx prisma@6 validate --schema prisma/schema.prisma   # schema is valid ✓
```

## Feature tour

| Area | Route | Highlights |
| --- | --- | --- |
| **Home** | `/home` | Greeting, priorities, sprint health, burndown-ready stats, quick actions, activity feed |
| **Inbox** | `/inbox` | Linear-style notifications: assignments, mentions, reviews, sprint events |
| **My Work** | `/my-work` | Everything assigned to you, grouped by status/priority |
| **Projects** | `/projects` · `/projects/[id]` | Grid + **List / Board / Timeline / Calendar / Docs** views |
| **Sprints** | `/sprints` · `/sprints/[id]` | Kanban board (drag-and-drop), overview, **burndown**, team velocity |
| **Documentation** | `/docs` · `/docs/[id]` | Template library, rich reader, versions, attachments, related pages |
| **Design Reviews** | `/reviews` | State-machine board (Draft → Ready → Changes → Approved → Closed) |
| **Roadmap** | `/roadmap` | Quarter/month timeline with milestones |
| **Settings** | `/settings` | Workspace, members, live **permissions matrix**, templates, theme |
| **⌘K** | anywhere | Command palette: search tasks/projects/sprints/docs/reviews + run actions |

Keyboard: `⌘K` search · `c` create task · `↑↓/↵` navigate · `⌘↵` submit · `Esc` close.

## Design system — "Expo" theme

Premium SaaS visual language inspired by Linear, Notion, Vercel and Raycast: spacious layouts, subtle shadows, minimal borders, smooth motion, and a first-class **dark mode** (default). All colors are semantic CSS-variable tokens mapped into Tailwind — see [`docs/06-design-system.md`](./docs/06-design-system.md).

## Tech stack

**Frontend:** Next.js 15 · TypeScript · Tailwind v4 · Shadcn-style primitives · TanStack Query · Zustand
**Backend:** Node.js · NestJS · Prisma · PostgreSQL · Auth.js · S3 · Meilisearch · WebSockets

## Documentation (deliverables)

| # | Doc |
| --- | --- |
| 01 | [Product Requirements](./docs/01-product-requirements.md) |
| 02 | [Information Architecture](./docs/02-information-architecture.md) |
| 03 | [User Flows & Journeys](./docs/03-user-flows.md) |
| 04 | [Wireframes](./docs/04-wireframes.md) |
| 05 | [UX Specifications](./docs/05-ux-specifications.md) |
| 06 | [Design System](./docs/06-design-system.md) |
| 07 | [Database Schema & ERD](./docs/07-database-schema.md) |
| 08 | [API Design](./docs/08-api-design.md) |
| 09 | [Frontend Architecture](./docs/09-frontend-architecture.md) |
| 10 | [Backend Architecture](./docs/10-backend-architecture.md) |
| 11 | [Permissions Model](./docs/11-permissions-model.md) |
| 12 | [Development Roadmap](./docs/12-development-roadmap.md) |
| 13 | [Production Folder Structure](./docs/13-folder-structure.md) |
| 14 | [Complete Implementation Plan](./docs/14-implementation-plan.md) |

## Project layout

```
├── src/                 Next.js frontend (app router, components, lib)
├── prisma/schema.prisma Validated PostgreSQL data model
├── server/              NestJS API scaffold seed (RBAC, reference module)
└── docs/                15 deliverables
```

## Roles

**Admin** (workspace/members/workflows) · **Design Lead** (projects/sprints/roadmap/approvals) · **Designer** (assigned work/docs/uploads) · **Viewer** (read-only). Full matrix in [`docs/11`](./docs/11-permissions-model.md) and live in **Settings → Permissions**.
