# 06 · Design System — "Steep" theme

A warm, calm, tea-inspired visual language (steep.app-inspired): cream paper surfaces, deep tea-green brand, terracotta & amber accents, serif display headings. Implemented as CSS custom properties in `src/app/globals.css` and consumed through Tailwind v4 semantic utilities.

## Design principles

- **Warm & calm** — paper-cream neutrals instead of stark white/black; muted, earthy accents.
- **Spacious** — generous padding; 4px spacing scale.
- **Minimal borders** — 1px warm hairlines (`--border`) instead of heavy dividers.
- **Subtle depth** — soft, warm-tinted shadows; elevation communicates hierarchy, not decoration.
- **Motion with intent** — short, eased transitions; `prefers-reduced-motion` respected.
- **Light-first** — the warm paper light mode is the default; dark mode is a warm green-charcoal peer.

## Color tokens (semantic)

Tokens are defined for light and dark and mapped into Tailwind (`bg-bg`, `text-fg`, `border-border`, `bg-brand`, …).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#faf8f3` | `#121613` | App background (paper / green charcoal) |
| `--bg-subtle` | `#f3efe6` | `#161b17` | Sidebar, headers |
| `--bg-elevated` | `#fffdf8` | `#1b211c` | Cards, popovers |
| `--bg-inset` | `#ece6d9` | `#222923` | Chips, code |
| `--fg` | `#20281f` | `#efece2` | Primary text (green-charcoal / warm ivory) |
| `--fg-muted` | `#57624f` | `#a6ae9f` | Secondary text |
| `--fg-subtle` | `#8a927f` | `#78816f` | Tertiary/labels |
| `--border` | `#e5dfcf` | `#262e27` | Hairlines |
| `--brand` | `#33684b` | `#6cb58c` | Tea green — primary accent |
| `--success` | `#35855b` | `#5cb885` | Done/positive |
| `--warning` | `#b97f24` | `#d8a35a` | Amber — in-progress/at-risk |
| `--danger` | `#bf4a2e` | `#dd7a5b` | Terracotta — blockers/urgent |
| `--info` | `#41729f` | `#7fa8cf` | Slate blue — review/informational |

Each semantic color also has a `-subtle` background variant for badges/tints.

### Domain color mapping
- **Status:** Backlog sage-grey · Todo grey · In Progress amber · Review slate blue · Approved plum `#7d5ba6` · Done tea green.
- **Priority:** Urgent terracotta · High amber · Medium slate blue · Low sage-grey (Linear-style bars).
- **Design stage:** Discovery amber · Wireframe slate · Visual plum · Prototype sea green `#3f8f7a` · Handoff green.

## Typography

- **UI family:** Inter (`--font-sans`); monospace for code (`--font-mono`).
- **Display family:** `--font-display` — Iowan Old Style / Palatino / Georgia serif stack, used for page titles, the Home greeting, and documentation headings. This serif-over-sans pairing is the signature Steep trait.
- **Scale:** 11 (labels) · 12 (meta) · 13 (body-sm) · 14 (body) · 16 (subtitle) · 22 (page title, serif) · 28–34 (hero/doc title, serif).
- **Numerals:** `tabular-nums` on all stats and counts.
- **Weight:** 400 body · 500 medium · 600 semibold.

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
