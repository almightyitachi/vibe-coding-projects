# 10 · Backend Architecture

## Stack

| Concern | Choice |
| --- | --- |
| Runtime | Node.js 22 |
| Framework | **NestJS** (modular, DI, guards, interceptors) |
| ORM | **Prisma** → PostgreSQL |
| Auth | **Auth.js** (session/JWT) + Nest guards |
| Storage | **S3-compatible** (presigned uploads) |
| Search | **Meilisearch** |
| Real-time | **WebSockets** (Nest gateway) |
| Cache/queue | Redis (stats cache + BullMQ jobs) |

## Module map (NestJS)

```
AppModule
├── AuthModule            Auth.js bridge, session guard, role guard
├── WorkspaceModule       tenants, memberships, teams
├── ProjectModule         projects, modules, features, milestones
├── SprintModule          sprints, board grouping, burndown, velocity
├── TaskModule            tasks, comments, tags, bulk ops, board rank
├── DocumentModule        docs tree, versions, templates
├── ReviewModule          review state machine, threads, approvals
├── NotificationModule    inbox + fan-out
├── ActivityModule        append-only audit log
├── SearchModule          Meilisearch indexing + query
├── UploadModule          S3 presign + attachment records
├── RealtimeModule        WS gateway, rooms, event bus
└── AiModule (reserved)   summaries, generation, semantic search
```

Each feature module = `controller` (HTTP) + `service` (business logic) + `dto` (validation via `class-validator`) + Prisma access. Cross-cutting concerns are interceptors/guards.

## Request lifecycle

```
HTTP → AuthGuard (session) → RolesGuard (workspace membership role)
     → ValidationPipe (DTO) → Controller → Service (Prisma tx)
     → ActivityInterceptor (audit) → SearchIndexer (async)
     → NotificationFanout (async) → Realtime emit → Response
```

- **Transactions:** multi-write operations (e.g. move task + log activity + notify) run in a Prisma `$transaction`; side-effects (search, notify, WS) are enqueued after commit.
- **Authorization:** `RolesGuard` resolves the caller's `Membership.role` for the target workspace and checks the capability matrix (see permissions model). Row-level scoping filters every query by `workspaceId`.

## Sprint analytics computation

- **Completion %** = done+approved tasks / total.
- **Burndown** = remaining points per day vs. ideal line (materialized nightly + on-demand).
- **Velocity** = points completed per past sprint (rolling average).
- Results cached in Redis (60s TTL), invalidated on task mutations in the sprint.

## Search pipeline

On any create/update/delete of an indexable entity, an async job upserts a denormalized doc into Meilisearch. Query endpoint proxies to Meilisearch with workspace + permission filters, returning typed, grouped results for ⌘K.

## Real-time

Gateway authenticates the WS handshake, joins the socket to entity rooms it's authorized for, and emits minimal deltas. Presence and multiplayer editing are future extensions on the same rooms.

## Background jobs (BullMQ)

- Search indexing
- Notification fan-out + digest emails
- Nightly burndown snapshots
- Attachment virus-scan / thumbnailing (planned)
- AI summary generation (reserved)

## Security

- Session cookies HTTP-only + SameSite; CSRF on state-changing routes.
- Input validation on every DTO; output serialization strips internal fields.
- Signed, short-TTL S3 URLs; mime + size validation server-side.
- Rate limiting + idempotency keys on mutations.
- Full audit trail via `ActivityLog`.

## Deployment topology

Stateless Nest API (horizontal scale) · managed PostgreSQL · Redis · Meilisearch · S3 bucket · WS behind sticky-session/edge. CI runs migrations (`prisma migrate deploy`) then rolling deploy.
