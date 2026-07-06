# 02 · Information Architecture

## Navigation model

Linear-inspired persistent left sidebar. Three zones: **Personal**, **Workspace**, **Projects**.

```
SprintDesk (workspace switcher)
├── Search…                     ⌘K   ┐ global command palette
├── + Create                     c   ┘ quick-create
│
│  PERSONAL
├── Home            /home              Personal dashboard
├── Inbox           /inbox             Notifications & mentions
├── My Work         /my-work           Everything assigned to me
│
│  WORKSPACE
├── Projects        /projects          All projects
├── Sprints         /sprints           Sprint management
├── Documentation   /docs              Knowledge base
├── Design Reviews  /reviews           Review hub
├── Roadmap         /roadmap           Timeline view
│
│  PROJECTS (pinned)
├── ● Mobile App Redesign   /projects/p_mobile
├── ● Marketing Site 2.0    /projects/p_web
├── ● Design System         /projects/p_ds
└── …
│
└── Settings        /settings          Workspace, members, permissions
```

## Content hierarchy

```
Workspace
└── Project                    (top-level container)
    ├── Module                 (e.g. Checkout, Profile)
    │   └── Feature            (Overview, Problem, Goals, Flows, Decisions…)
    ├── Sprint                 (time-boxed cycle)
    │   └── Task               (the core work item)
    │       ├── Comment
    │       ├── Attachment
    │       └── Review
    ├── Document               (page tree; can attach at any level)
    ├── Milestone
    └── Design Asset
```

## Documentation tree

`Workspace → Project → Module → Feature → Page`. Pages nest arbitrarily (`Document.parentId`), so a Feature Spec can own child pages (Edge Cases, QA notes) while still rolling up to its project.

## URL map

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/home` | Personal dashboard | Static shell + client data |
| `/inbox` | Notifications | Client |
| `/my-work` | Assigned work, grouped | Client |
| `/projects` | Project grid | Client |
| `/projects/[id]` | Project overview + 5 views | Dynamic |
| `/sprints` | Sprint list | Client |
| `/sprints/[id]` | Board / List / Overview | Dynamic |
| `/docs` | Doc library + template filter | Client |
| `/docs/[id]` | Doc reader + versions/attachments | Dynamic |
| `/reviews` | Review board/list | Client |
| `/roadmap` | Timeline + milestones | Client |
| `/settings` | Workspace / Members / Permissions / Templates / Appearance | Client |

## Global search taxonomy

Command palette indexes six entity types with typed results and grouped display: **Tasks, Projects, Sprints, Documentation, Reviews, Comments/Attachments**, plus **Actions** (create task, toggle theme) and **Navigate** shortcuts.

## Cross-linking rules

- Tasks link to their Sprint, Project, Module, Feature, Figma/prototype URLs, and any Review.
- Documents link to their Project/Module/Feature and expose "Related" pages.
- Reviews link back to the originating Task and its design preview.
- Activity entries deep-link to the affected entity.
