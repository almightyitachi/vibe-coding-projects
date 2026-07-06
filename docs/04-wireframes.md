# 04 · Wireframes (described)

ASCII wireframes for the primary screens. All share the persistent sidebar (`S`) and a 48px top bar.

## Home dashboard

```
┌────────────┬───────────────────────────────────────────────────────────┐
│ S SprintDesk│ Home                                       [+ New] [☾]     │
│ ⌕ Search ⌘K │───────────────────────────────────────────────────────────│
│ + Create    │ Good morning, Maya                                         │
│             │ You have 3 open tasks and 1 blocker in Mobile Sprint 7.    │
│ Home        │ ┌──────────┬──────────┬──────────────┬──────────────┐      │
│ Inbox   (3) │ │+ Task    │⚡ Sprint  │📄 Docs        │⬆ Upload      │     │
│ My Work     │ └──────────┴──────────┴──────────────┴──────────────┘      │
│             │ MY TASKS                    View all │ SPRINT HEALTH        │
│ WORKSPACE   │ ◍ In Progress                        │ ┌──────────────────┐ │
│ Projects    │  ▮◑ MOB-143 Profile IA        [LF]   │ │ Mobile Sprint 7  │ │
│ Sprints     │ ◔ Review                             │ │ ▓▓▓░░ 62%        │ │
│ Docs        │  ▮◔ MOB-142 Checkout          [AR]   │ │ 6 rem · 1 blk    │ │
│ Reviews     │                                      │ └──────────────────┘ │
│ Roadmap     │ RECENT ACTIVITY                      │ UPCOMING DEADLINES   │
│             │  [AR] Arjun moved MOB-142 → Review   │  ▤ Checkout   Jul 8  │
│ PROJECTS    │  [MC] Maya approved Home cards       │  ▤ A11y audit Jul 10 │
│ ● Mobile    │                                      │                      │
│ …           │                                      │                      │
│ [MC] Maya ⚙ │                                      │                      │
└────────────┴───────────────────────────────────────────────────────────┘
```

## Sprint board (Kanban)

```
│ Sprints / Mobile Sprint 7      [Board][List][Overview]  [+ New] [☾]      │
│ Mobile Sprint 7  ·Active·  🎯 Ship checkout & profile   Jun30→Jul13  62% │
├──────────┬──────────┬────────────┬──────────┬──────────┬────────────────┤
│ ◌Backlog1│ ○Todo 2  │ ◑In Prog 2 │ ◔Review 1│ ●Apprv 1 │ ✓Done 1        │
│ ┌──────┐ │ ┌──────┐ │ ┌────────┐ │ ┌──────┐ │ ┌──────┐ │ ┌──────┐       │
│ │MOB146│ │ │MOB144│ │ │MOB143  │ │ │MOB142│ │ │MOB138│ │ │MOB131│       │
│ │Proto │ │ │Visual│ │ │Wire UX │ │ │Visual│ │ │ UI   │ │ │Handof│       │
│ │▮  5 AR│ │ │▮ 2 AR│ │ │▮ 💬2 LF│ │ │▮❗🔗4 │ │ │▮ 5 LF│ │ │✓ 3 AR│       │
│ └──────┘ │ └──────┘ │ └────────┘ │ └──────┘ │ └──────┘ │ └──────┘       │
└──────────┴──────────┴────────────┴──────────┴──────────┴────────────────┘
   drag-and-drop between columns · [+ ] per column · bulk select
```

## Task card anatomy

```
┌─────────────────────────────┐
│ MOB-142   [Visual]          │  id + design-stage badge
│ Redesign checkout payment   │  title (2-line clamp)
│ [UI]                        │  tags
│ ❗ 🔗 💬4 📎2      5  [AR]   │  priority·figma·comments·attach · points · assignee
└─────────────────────────────┘
```

## Documentation reader

```
│ Docs / Mobile / Checkout Brief          [★][⇪][⋯]                        │
│  📝                                          ┌ Attachments ─────┐        │
│  Checkout Redesign — Design Brief            │ 📎 research.pdf   │        │
│  [Design Brief] [MC] Maya · updated 1d       │ 📎 flows.fig      │        │
│  ─────────────────────────────────────       └──────────────────┘        │
│  ## Overview …                                ┌ Version History ─┐        │
│  ## Problem Statement …                       │ v3 · current  now │       │
│  > Design decision blockquote                 │ v2            2d  │       │
│  ## Goals · bullet list                       └──────────────────┘        │
```

## Command palette (⌘K)

```
        ┌────────────────────────────────────────────┐
        │ ⌕  checkout│                          [Esc] │
        ├────────────────────────────────────────────┤
        │ TASKS                                       │
        │  ↵ Redesign checkout payment      MOB-142   │
        │ DOCUMENTATION                               │
        │  ▤ Checkout Redesign — Brief   Design Brief │
        │ REVIEWS                                     │
        │  ⌥ Checkout payment step         Review     │
        └────────────────────────────────────────────┘
```

## Roadmap (timeline)

```
│ Roadmap            [Quarterly][Monthly][Custom]   [+ New] [☾]            │
│                     Jul 2026 │ Aug 2026 │ Sep 2026 │ Oct 2026           │
│ ● Mobile App    ▐▬▬▬▬▬▬▬⚑▬▬▬⚑▬▌ 62%                                     │
│ ● Marketing        ▐▬▬▬▬▬▬▬▬▬⚑▌ 34%                                     │
│ ● Design System ▐▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚑▌ 48%                                   │
│                                     ⚑ = milestone                        │
```
