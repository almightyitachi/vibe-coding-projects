# 06 · Design System — "Expo" theme

A premium SaaS visual language inspired by Linear, Notion, Vercel and Raycast. Implemented as CSS custom properties in `src/app/globals.css` and consumed through Tailwind v4 semantic utilities.

> Design theme lineage: `npx getdesign@latest add expo` — a token-driven, dark-first system emphasizing spacious layouts, subtle shadows, minimal borders and smooth motion.

## Design principles

- **Spacious** — generous padding; 4px spacing scale.
- **Minimal borders** — 1px hairlines (`--border`) instead of heavy dividers.
- **Subtle depth** — soft, layered shadows; elevation communicates hierarchy, not decoration.
- **Motion with intent** — short, eased transitions; nothing bounces without reason.
- **Dark-first** — dark mode is the default and designed first; light mode is a first-class peer.

## Color tokens (semantic)

Tokens are defined for light and dark and mapped into Tailwind (`bg-bg`, `text-fg`, `border-border`, `bg-brand`, …).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#0b0b0e` | App background |
| `--bg-subtle` | `#fafafa` | `#101014` | Sidebar, headers |
| `--bg-elevated` | `#ffffff` | `#16161b` | Cards, popovers |
| `--bg-inset` | `#f4f4f5` | `#1b1b21` | Chips, code |
| `--bg-hover` / `--bg-active` | greys | greys | Interactive states |
| `--fg` | `#18181b` | `#f4f4f5` | Primary text |
| `--fg-muted` | `#52525b` | `#a1a1aa` | Secondary text |
| `--fg-subtle` | `#8b8b93` | `#71717a` | Tertiary/labels |
| `--border` | `#ececef` | `#23232a` | Hairlines |
| `--brand` | `#5b5bd6` | `#7c7cf0` | Primary accent |
| `--success` | `#16a34a` | `#4ade80` | Done/positive |
| `--warning` | `#d97706` | `#fbbf24` | In-progress/at-risk |
| `--danger` | `#dc2626` | `#f87171` | Blockers/urgent |
| `--info` | `#2563eb` | `#60a5fa` | Review/informational |

Each semantic color also has a `-subtle` background variant for badges/tints.

### Domain color mapping
- **Status:** Backlog grey · Todo grey · In Progress `warning` · Review `info` · Approved purple · Done `success`.
- **Priority:** Urgent red · High amber · Medium blue · Low grey (Linear-style bars).
- **Design stage:** Discovery amber · Wireframe blue · Visual purple · Prototype teal · Handoff green.

## Typography

- **Family:** Inter (`--font-sans`), monospace fallback for code (`--font-mono`).
- **Scale:** 11 (labels) · 12 (meta) · 13 (body-sm) · 14 (body) · 16 (subtitle) · 20 (page title) · 24–30 (hero).
- **Tracking:** tighten headings (`-0.01em … -0.02em`); OpenType features `cv02/03/04/11` for a refined Inter.
- **Weight:** 400 body · 500 medium · 600 semibold · 700 bold.

## Spacing, radius, shadow

- **Spacing:** 4px base → 4, 8, 12, 16, 24, 32, 48, 64.
- **Radius:** `xs 4 · sm 6 · md 8 · lg 12 · xl 16` (px).
- **Shadow:** `sm` (cards) · `md` (hover) · `lg` (dropdowns) · `pop` (modals/palette). Softer/deeper in dark mode.

## Component inventory (built in code)

Buttons (primary/secondary/ghost/danger), IconButton, Inputs, Select, Textarea, Dropdown/Select, Modal, Tabs, Table, Card, Badge/Tag, Avatar & AvatarStack, Kanban board & TaskCard, TaskRow, Timeline (roadmap/Gantt), Calendar, Rich-text reader, Burndown chart, Activity feed, Command palette, Breadcrumbs, ProgressBar, StatusIcon, PriorityIcon, EmptyState, Toast (create confirmation), File-upload list.

## Theming implementation

- `data-theme="light|dark"` on `<html>`; an inline `ThemeScript` sets it pre-paint to avoid flash.
- `@media (prefers-color-scheme: dark)` provides the system default when unset.
- Tailwind v4 `@theme inline` maps CSS variables to color utilities so components never hard-code hex.

## Iconography

`lucide-react` at 14–18px in chrome, 12px inline. Status/priority are bespoke SVGs for pixel-accurate Linear parity.
