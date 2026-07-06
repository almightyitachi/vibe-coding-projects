# 05 · UX Specifications

## Interaction model

- **Keyboard-first.** Every primary action has a shortcut; the mouse is optional.
- **Optimistic UI.** Mutations apply instantly and reconcile with the server; failures roll back with a toast.
- **Progressive disclosure.** Cards show essentials; detail lives one interaction away.
- **No blocking spinners** on navigation — skeletons only where data is unavailable.

## Keyboard shortcuts

| Key | Action | Scope |
| --- | --- | --- |
| `⌘K` / `Ctrl K` | Command palette / global search | Global |
| `c` | Quick-create task | Global (not while typing) |
| `↑ ↓` | Move selection | Palette / lists |
| `↵` | Open / run | Palette |
| `⌘↵` | Submit create | Modals |
| `Esc` | Close overlay | Modals / palette |
| `b / l / o` | Board / List / Overview | Sprint detail (planned) |
| `1–4` | Set priority | Task focus (planned) |

## Component behaviour specs

### Sprint board
- 6 fixed columns (`Backlog … Done`); horizontal scroll on narrow viewports.
- Drag-and-drop moves a card's `status`; drop target highlights with `--brand-subtle`.
- Column header shows status icon, label and live count; `+` opens quick-create pre-scoped to that status.
- Dragged card renders at 40% opacity; drop is optimistic.

### Task card
- Priority icon (Linear bars), Figma glyph, comment & attachment counts, points chip, assignee avatar.
- 2-line title clamp; design-stage badge; up to N tag chips.
- Hover elevates (`--shadow-md`) and strengthens border.

### Command palette
- Empty query shows **Actions** + **Navigate**; typing filters all six entity types.
- Results grouped by type with uppercase section labels; active row uses brand tint + `↵` affordance.
- Opens < 50 ms, focus-trapped, closes on `Esc` / overlay click.

### Quick-create
- Title autofocus; project + priority selectors; `⌘↵` to submit; inline "✓ Task created" confirmation.

### Documentation reader
- Two-column: article + meta rail (attachments, version history, related).
- Rich content: H1–H3, paragraphs, bullet lists, blockquotes (decision callouts), inline code, tables, images, embeds.

## States for every component

Each interactive component specifies: **default · hover · active/pressed · focus-visible · disabled · loading · empty · error**. Focus-visible always renders a 2px `--brand` ring at 2px offset.

## Empty states

Dashed-border container + muted icon + one-line title + optional hint (e.g. "Drop here", "You're all caught up", "No blockers 🎉").

## Motion

| Element | Duration | Easing |
| --- | --- | --- |
| Overlay fade | 150 ms | ease-out |
| Modal/palette pop | 160 ms | `cubic-bezier(0.16,1,0.3,1)` |
| List fade-in | 180 ms | ease-out |
| Progress fill | 500 ms | ease |
| Hover transitions | 150 ms | ease |

Respect `prefers-reduced-motion`: animations collapse to opacity-only.

## Accessibility (WCAG 2.2 AA)

- Semantic landmarks (`aside`, `main`, `header`, `nav`); dialogs use `role="dialog" aria-modal`.
- All icons that convey state carry `aria-label`/`title`; status is never color-only (shape + label).
- Text contrast ≥ 4.5:1 in both themes; focus indicators ≥ 3:1.
- Full keyboard reachability; logical tab order; visible focus.
- Design QA and Accessibility Review are first-class task tags/stages.

## Responsive rules

- ≥ 1024px: full sidebar + multi-column dashboards.
- 768–1024px: sidebar persists; grids collapse to 1–2 columns.
- < 768px: sidebar becomes a drawer; boards scroll horizontally; meta rails stack below content.
