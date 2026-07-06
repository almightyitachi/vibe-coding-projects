# 08 · API Design

REST-first JSON API served by NestJS. Versioned under `/api/v1`. Auth via Auth.js session (JWT/session cookie) → `Authorization: Bearer` or HTTP-only cookie. All list endpoints are cursor-paginated and workspace-scoped by the authenticated membership.

## Conventions

- **Base:** `/api/v1`
- **Pagination:** `?cursor=<id>&limit=50` → `{ data, nextCursor }`
- **Filtering:** typed query params (`?status=IN_PROGRESS&assigneeId=...&sprintId=...`)
- **Errors:** RFC-7807-ish `{ statusCode, error, message, details? }`
- **Idempotency:** mutating POSTs accept `Idempotency-Key`
- **Rate limit:** per-user token bucket; `429` with `Retry-After`

## Resource endpoints

### Auth & identity
```
GET    /api/v1/me
GET    /api/v1/workspaces
POST   /api/v1/workspaces
GET    /api/v1/workspaces/:id/members
POST   /api/v1/workspaces/:id/members        (Admin) invite
PATCH  /api/v1/members/:id                    (Admin) change role
```

### Projects
```
GET    /api/v1/projects
POST   /api/v1/projects                       (Admin, Lead)
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id                    (Admin, Lead)
GET    /api/v1/projects/:id/overview           computed stats
GET    /api/v1/projects/:id/tasks
GET    /api/v1/projects/:id/documents
```

### Sprints
```
GET    /api/v1/sprints?projectId=
POST   /api/v1/sprints                         (Admin, Lead)
GET    /api/v1/sprints/:id
PATCH  /api/v1/sprints/:id                      state transitions
GET    /api/v1/sprints/:id/board               tasks grouped by status
GET    /api/v1/sprints/:id/burndown            time-series
GET    /api/v1/sprints/:id/velocity
```

### Tasks
```
GET    /api/v1/tasks?sprintId=&assigneeId=&status=&priority=
POST   /api/v1/tasks                           (Designer+)
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id                        status/priority/assignee/rank
POST   /api/v1/tasks/:id/comments
POST   /api/v1/tasks/:id/attachments           → presigned S3 flow
POST   /api/v1/tasks/bulk                       bulk status/assignee/sprint
```

### Documentation
```
GET    /api/v1/documents?projectId=&template=
POST   /api/v1/documents                        (Designer+)
GET    /api/v1/documents/:id
PATCH  /api/v1/documents/:id                     autosave body (Tiptap JSON)
POST   /api/v1/documents/:id/publish             snapshot → DocumentVersion
GET    /api/v1/documents/:id/versions
GET    /api/v1/templates
```

### Reviews
```
GET    /api/v1/reviews?projectId=&status=
POST   /api/v1/reviews                           from a task
PATCH  /api/v1/reviews/:id                        transition state
POST   /api/v1/reviews/:id/reviewers
POST   /api/v1/reviews/:id/threads
PATCH  /api/v1/threads/:id                         resolve/reopen
POST   /api/v1/reviews/:id/approve                 per-reviewer approval
```

### Roadmap, search, notifications, activity, uploads
```
GET    /api/v1/roadmap?range=quarter&from=&to=
GET    /api/v1/search?q=                          Meilisearch-backed
GET    /api/v1/notifications?read=
PATCH  /api/v1/notifications/read-all
GET    /api/v1/activity?entityType=&entityId=
POST   /api/v1/uploads/presign                    { filename, mimeType } → { url, key }
```

## File upload flow (S3-compatible)

```
1. POST /uploads/presign  → { url, fields, key }
2. Client PUT/POST directly to S3 with the presigned URL
3. POST /tasks/:id/attachments { key, filename, mimeType, sizeBytes }
```
Accepted types: PDF, DOCX, PPT(X), PNG, JPG, SVG, ZIP. Server validates mime + size cap.

## Real-time (WebSockets)

`wss://…/realtime` — NestJS gateway. Rooms per entity: `board:{sprintId}`, `doc:{docId}`, `review:{reviewId}`, `inbox:{userId}`.

Events: `task.updated`, `task.moved`, `comment.created`, `review.stateChanged`, `notification.created`, `doc.updated`. Payloads are minimal deltas; clients reconcile against TanStack Query cache.

## Caching & data fetching

- Server: per-request Prisma query batching; computed sprint stats cached in Redis (60s) and invalidated on task mutation.
- Client: **TanStack Query** with optimistic mutations, `staleTime` tuned per resource, and WebSocket-driven cache patches.

## AI endpoints (reserved)

```
POST /api/v1/ai/sprint-summary        { sprintId }
POST /api/v1/ai/doc-generate          { context }
POST /api/v1/ai/review-summary        { reviewId }
POST /api/v1/ai/tasks-from-notes      { text } → Task[]
GET  /api/v1/ai/semantic-search?q=
```
