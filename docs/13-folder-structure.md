# 13 · Production Folder Structure

Target production monorepo. This repository ships the **frontend app** and **Prisma schema** as the runnable core; the `server/` tree below is the specified NestJS layout (scaffold seed in `server/`).

```
sprintdesk/
├── package.json                # frontend app (runnable now)
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
├── prisma/
│   └── schema.prisma           # validated data model
├── docs/                       # 01–14 deliverables
├── src/                        # Next.js frontend (see doc 09)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
└── server/                     # NestJS API (production)
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── common/             guards, interceptors, decorators, pipes
    │   │   ├── guards/         auth.guard.ts, roles.guard.ts
    │   │   ├── interceptors/   activity.interceptor.ts
    │   │   └── decorators/     roles.decorator.ts, current-user.decorator.ts
    │   ├── prisma/             prisma.module.ts, prisma.service.ts
    │   ├── auth/
    │   ├── workspace/
    │   ├── project/
    │   ├── sprint/
    │   ├── task/               task.controller.ts, task.service.ts, dto/
    │   ├── document/
    │   ├── review/
    │   ├── notification/
    │   ├── activity/
    │   ├── search/             meilisearch.service.ts, indexer.ts
    │   ├── upload/             s3.service.ts
    │   ├── realtime/           realtime.gateway.ts
    │   └── ai/                 (reserved)
    ├── test/                   e2e specs
    └── package.json
```

### Recommended monorepo tooling (production)
- **pnpm workspaces** or **Turborepo** for `web` + `server` + shared `packages/types`.
- Shared `packages/types` publishes the `types.ts` contracts consumed by both sides.
- `packages/config` centralizes ESLint/TS/Tailwind presets.

### Convention notes
- Feature-first folders (co-locate controller/service/dto/tests).
- `common/` holds cross-cutting Nest artifacts.
- Frontend mirrors domains under `components/` and `app/(app)/`.
- One source of truth for domain metadata (`lib/domain.ts`) and types (`lib/types.ts`).
