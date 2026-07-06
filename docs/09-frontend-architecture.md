# 09 · Frontend Architecture

## Stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 15** (App Router, RSC) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** (CSS-variable tokens, `@theme`) |
| UI system | **Shadcn-style** primitives, hand-built in `components/ui` |
| Server state | **TanStack Query** |
| Client state | **Zustand** (UI store) — mirrored here by a lightweight context |
| Icons | `lucide-react` + bespoke status/priority SVGs |
| Data (this repo) | Typed mock layer in `src/lib` (swap for the API client) |

## Rendering strategy

- **App Router** with a `(app)` route group that owns the shared shell (`Sidebar` + `main`).
- Server Components for static shells; Client Components (`"use client"`) for interactive views (board, palette, forms).
- Dynamic routes (`/projects/[id]`, `/sprints/[id]`, `/docs/[id]`) read params via React 19 `use(params)`.
- Theme is applied pre-paint by an inline `ThemeScript` to prevent flash.

## Directory structure (`src/`)

```
src/
├── app/
│   ├── layout.tsx            root: providers, palette, quick-create
│   ├── globals.css           design tokens + Tailwind v4
│   ├── page.tsx              → redirect to /home
│   └── (app)/
│       ├── layout.tsx        Sidebar + main shell
│       ├── home/             dashboard
│       ├── inbox/            notifications
│       ├── my-work/          assigned work
│       ├── projects/         + [id] (5 views)
│       ├── sprints/          + [id] (board/list/overview)
│       ├── docs/             + [id] (reader)
│       ├── reviews/          review board/list
│       ├── roadmap/          timeline
│       └── settings/         workspace/members/permissions
├── components/
│   ├── ui/                   primitives, indicators
│   ├── shell/                Sidebar, Topbar, CommandPalette, QuickCreate
│   ├── board/                Board, TaskCard, TaskRow, Burndown
│   └── theme/                ThemeProvider, ThemeScript
├── hooks/                    useUIStore (palette/create)
└── lib/                      types, domain enums-meta, utils, markdown, mock-data
```

## State management model

- **Server state → TanStack Query.** Queries keyed by resource + filters; mutations are optimistic with rollback; the WebSocket layer patches the cache so no refetch is needed for live boards.
- **UI/ephemeral state → Zustand store** (`useUIStore`): command-palette open, quick-create open, board drag state, filter/view toggles. Global keyboard shortcuts (`⌘K`, `c`) are registered once in the provider.
- **URL as state.** View tabs, filters and selected entities live in the route/query where shareable.

## Data layer swap

This repo ships a fully typed mock layer (`lib/mock-data.ts`) so the UI runs with zero backend. In production, `lib/api.ts` (TanStack Query hooks) replaces direct imports — component code is unchanged because both expose the same `types.ts` shapes.

## Component design conventions

- Semantic tokens only (`bg-bg-elevated`, `text-fg-muted`) — never raw hex.
- `cn()` (clsx + tailwind-merge) for conditional classes.
- Each primitive supports its full state matrix (see UX spec).
- Domain metadata (status/priority/stage colors + labels) is centralized in `lib/domain.ts` so board, cards, rows and palette stay consistent.

## Performance

- Route-level code splitting (App Router) keeps First Load JS ~100–126 kB.
- Optimistic mutations + WS patches remove navigation spinners.
- `line-clamp`, virtualization-ready lists, and memoized selectors on the board.
- Command palette filters in-memory over a projected index for instant results.

## Accessibility hooks

Focus-trapped overlays, `role="dialog"`, labelled icon buttons, `focus-ring` utility, `prefers-reduced-motion` fallback, and status conveyed by shape + text (not color alone).
