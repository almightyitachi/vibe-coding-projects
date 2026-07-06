# 01 · Product Requirements Document (PRD)

**Product:** SprintDesk — the Design Operating System
**One-liner:** Linear for designers. Sprints, tasks, documentation, reviews and roadmap in one keyboard-first workspace.

---

## 1. Vision

Design work today is scattered across Jira (tracking), Figma (craft), Notion/Confluence (docs), Slack (reviews) and spreadsheets (roadmaps). Context is lost at every seam. SprintDesk is a **single source of truth** where design work is planned, prioritized, executed, reviewed, documented and archived — without the weight of enterprise PM tools.

We benchmark **UX against Linear**, **documentation against Notion**, and **visual craft against Vercel & Raycast**. We explicitly reject Jira's configuration sprawl.

## 2. Target Users & Jobs-to-be-Done

| Persona | Primary JTBD |
| --- | --- |
| **Individual designer** | "Know exactly what to work on next and update it in seconds." |
| **Design team** | "Run sprints, review each other's work, and keep decisions in one place." |
| **Product team** | "See what design is shipping and when, without a status meeting." |
| **Design leadership** | "Understand velocity, capacity and risk across every project." |

## 3. Core Principles

1. **Speed** — every primary action (create sprint/task, change status, add docs, search) completes in seconds and is keyboard-driven.
2. **Clarity** — reduce visual noise; surface only what's relevant to the current context.
3. **Documentation-first** — every project, module, feature, sprint and task can carry documentation that stays connected to execution.
4. **Designer-centric** — native support for UX, UI, research, design systems, accessibility, design QA and stakeholder reviews.

## 4. Scope

### In scope (v1)
- Home dashboard, Inbox, My Work
- Projects (List / Board / Timeline / Calendar / Docs views)
- Sprints (board, overview, burndown, velocity)
- Tasks (six-state workflow, design metadata, comments, attachments)
- Documentation (rich pages, templates, versioning, uploads)
- Design Reviews (state machine, threaded feedback, approvals)
- Roadmap (quarterly/monthly timeline with milestones)
- Global command palette (⌘K)
- Notifications & activity feed
- Roles & permissions (Admin, Design Lead, Designer, Viewer)
- Dark/light theme

### Out of scope (v1, planned)
- Native Figma plugin sync (webhook stub only)
- Real-time multiplayer cursors (WebSocket infra is provisioned)
- AI features (interfaces reserved — see §8)
- Billing & SSO/SCIM

## 5. Functional Requirements (abridged)

- **FR-1** Users can create a task from anywhere via `c` or ⌘K in < 3 seconds.
- **FR-2** A task moves through `Backlog → Todo → In Progress → Review → Approved → Done` via drag-and-drop or keyboard.
- **FR-3** Sprints compute completion %, remaining work, blockers, velocity and burndown automatically.
- **FR-4** Any project/module/feature/sprint/task can attach documentation; docs support text, headings, tables, checklists, images, video, embeds and file uploads (PDF/DOCX/PPT/PNG/JPG/SVG/ZIP).
- **FR-5** Reviews follow `Draft → Ready → Changes Requested → Approved → Closed` with per-reviewer approval and resolvable feedback threads.
- **FR-6** Global search (⌘K) spans tasks, projects, sprints, documents, comments and attachments.
- **FR-7** Notifications fire on assignment, mention, status change, sprint event and review request.
- **FR-8** Every mutation writes an immutable activity log entry.

## 6. Non-Functional Requirements

| Attribute | Target |
| --- | --- |
| Perceived interaction latency | < 100 ms (optimistic UI) |
| P95 API latency | < 250 ms |
| Command palette open | < 50 ms |
| Accessibility | WCAG 2.2 AA |
| Search freshness | < 2 s after write |
| Uptime | 99.9% |

## 7. Analytics & Metrics

Dashboards: **Sprint Velocity**, **Completion Rate**, **Workload Distribution**, **Review Turnaround Time**, **Documentation Coverage**, **Team Capacity**.

North-star: *weekly active design work items updated per member*. Guardrails: review turnaround time, blocker age.

## 8. AI Enhancements (future-ready)

Interfaces are reserved so these can ship without schema changes:
- Sprint summary generation (rollup of activity + status)
- Documentation generation from tasks/notes
- Design review summaries
- Task creation from meeting notes
- Semantic search (Meilisearch → vector hybrid)
- Documentation recommendations ("related pages")

## 9. Success Criteria

- A designer can run their day entirely from Home + ⌘K.
- A lead can answer "are we on track?" for any sprint in one glance.
- Zero design decisions live only in Slack.
