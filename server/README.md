# SprintDesk API (server)

NestJS scaffold seed for the SprintDesk backend. This directory demonstrates the
production module/guard/service patterns described in
[`docs/10-backend-architecture.md`](../docs/10-backend-architecture.md) and
[`docs/13-folder-structure.md`](../docs/13-folder-structure.md).

## What's here
- `src/main.ts` — bootstrap (validation pipe, CORS).
- `src/app.module.ts` — root module wiring the Task reference module + global `RolesGuard`.
- `src/common/permissions.ts` — the RBAC capability matrix (single source of truth, matches the UI).
- `src/common/guards/roles.guard.ts` — capability enforcement.
- `src/common/decorators/require-capability.decorator.ts` — `@RequireCapability(...)`.
- `src/prisma/prisma.service.ts` — Prisma lifecycle.
- `src/task/` — controller + service + DTO showing scoping, per-project numbering, transactional writes with audit logging, and transition rules.

## Bring it up (production path)
```bash
cd server
npm install
npm run prisma:generate          # uses ../prisma/schema.prisma
npm run prisma:migrate           # against $DATABASE_URL
npm run start:dev                # http://localhost:4000
```

The remaining feature modules (Workspace, Project, Sprint, Document, Review,
Notification, Activity, Search, Upload, Realtime, Ai) follow the same shape and
are enumerated in the folder-structure doc.
