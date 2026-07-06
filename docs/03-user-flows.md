# 03 · User Flows & Journeys

Notation: `→` step, `⌘K` command palette, `[keys]` shortcut.

## Flow 1 — Create a task (Speed principle)

```
Any screen → press [c] (or ⌘K → "Create task")
  → Quick-create modal opens, title focused
  → type title → optionally set project + priority
  → [⌘↵] submit → optimistic insert → toast "Task created"
```
Target: < 3 seconds, zero navigation.

## Flow 2 — Plan & run a sprint (Design Lead)

```
Sprints → + New sprint → name, goal, dates, owner (status: Planning)
  → drag backlog tasks into the sprint
  → set status Active
  → daily: open /sprints/[id] Board → drag cards across columns
  → Overview tab → watch burndown, blockers, velocity
  → end of cycle → status Review → Completed → Archived
```

## Flow 3 — Execute a design task (Designer)

```
Home → My Tasks (In Progress) → open task
  → attach Figma link + design stage (Wireframe→Visual)
  → upload exploration files
  → move Todo → In Progress
  → request review (creates Review, status Ready)
  → address feedback → move Review → Approved → Done
```

## Flow 4 — Design review (author + reviewers)

```
Author: task → "Request review" → Review created (Draft)
  → add design preview (Figma) + reviewers → set Ready for Review
Reviewer: Inbox → review request → open Review
  → pin feedback threads on the preview
  → Approve  OR  Request Changes
Author: resolve threads → re-request → all reviewers Approve → Approved → Closed
```

## Flow 5 — Documentation-first (any role that can edit)

```
Docs → + New page → pick template (Research / Brief / Spec / Retro…)
  → write (headings, tables, checklists, images, embeds)
  → attach files (PDF/DOCX/PPT/PNG/JPG/SVG/ZIP)
  → link to project/module/feature → publish → version snapshot saved
```

## Flow 6 — Find anything (⌘K)

```
[⌘K] → type query → grouped results (Tasks/Projects/Sprints/Docs/Reviews)
  → [↑/↓] navigate → [↵] open   (or run an Action)
```

## Journey map — "A designer's Tuesday"

| Time | Touchpoint | Emotion goal |
| --- | --- | --- |
| 9:00 | Home: greeting, priorities, blockers | Oriented, calm |
| 9:05 | Inbox: clear review request + mention | In control |
| 10:00 | Sprint board: move 2 cards, add 1 task via `c` | Fast, frictionless |
| 13:00 | Docs: write research synthesis from template | Supported |
| 15:00 | Review: address feedback, re-request | Confident |
| 17:30 | Home: sprint health green | Accomplished |

## Journey map — "A lead's Monday"

| Step | Screen | Signal |
| --- | --- | --- |
| Standup prep | Sprint Overview | completion %, blockers, velocity |
| Reprioritize | Board (bulk actions) | drag/urgent tags |
| Roadmap check | Roadmap | milestones vs. dates |
| Capacity | Analytics: Workload Distribution | who's overloaded |
