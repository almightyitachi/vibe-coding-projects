# 07 · Database Schema & ERD

PostgreSQL via Prisma. Canonical source: [`prisma/schema.prisma`](../prisma/schema.prisma) (validated ✓).

## Entity-relationship diagram

```
Workspace 1─* Membership *─1 User
Workspace 1─* Team       *─* User (via TeamMember)
Workspace 1─* Project
Workspace 1─* Tag
Workspace 1─* Template
Workspace 1─* Document

Project 1─* Module
Project 1─* Feature
Project 1─* Sprint
Project 1─* Task
Project 1─* Milestone
Project 1─* Document
Project 1─* Review
Project *─1 User (owner)
Project *─1 Team (optional)

Module 1─* Feature      Module 1─* Task      Module 1─* Document
Feature 1─* Task        Feature 1─* Document
Sprint 1─* Task         Sprint *─1 User (owner)
Milestone 1─* Task

Task *─1 User (assignee?)   Task *─1 User (reporter)
Task 1─* Comment           Task 1─* Attachment
Task *─* Tag (via TaskTag) Task 1─* Review

Document 1─* DocumentVersion   Document 1─* Attachment
Document *─1 Template          Document 1─* Document (parent/children tree)

Review 1─* ReviewAssignment *─1 User
Review 1─* ReviewThread     1─* Comment

User 1─* Notification
User 1─* ActivityLog (actor)
```

## Table summary

| Model | Purpose | Key relations |
| --- | --- | --- |
| `Workspace` | Tenant root | members, projects, docs, tags, templates |
| `User` | Identity | memberships, assigned/reported tasks |
| `Membership` | Workspace role (**permissions**) | user ↔ workspace + `Role` |
| `Team` / `TeamMember` | Grouping | users, projects |
| `Project` | Top-level container | modules, features, sprints, tasks, docs |
| `Module` | Area within a project | features, tasks, docs |
| `Feature` | Spec unit (overview/problem/goals) | tasks, docs |
| `Sprint` | Time-boxed cycle + velocity | tasks, owner |
| `Task` | Core work item (6-state) | assignee, comments, tags, reviews |
| `Milestone` | Roadmap marker | project, tasks |
| `Document` | Rich page (Tiptap JSON) tree | versions, attachments, template |
| `DocumentVersion` | Immutable snapshots | document |
| `Template` | Reusable doc scaffolds | documents |
| `Review` | Review state machine | assignments, threads, task |
| `ReviewAssignment` | Per-reviewer approval | review, user |
| `ReviewThread` | Pinned, resolvable feedback | comments |
| `Comment` | On tasks or review threads | author |
| `Attachment` | S3 object metadata | task or document |
| `Tag` / `TaskTag` | Labels (UX, UI, A11y…) | tasks |
| `Notification` | Inbox items | recipient |
| `ActivityLog` | Immutable audit trail | actor, entity |

## Design decisions

- **Multi-tenancy** is workspace-scoped; every root query filters on `workspaceId`. Row-level authorization sits in the service layer (see permissions model).
- **Task identifiers**: `Task.number` is sequential per project; the display id `MOB-142` = `project.key + "-" + number`. `@@unique([projectId, number])`.
- **Board ordering**: `Task.boardRank` stores a fractional index (LexoRank-style) so drag-reorder is O(1) and avoids renumbering.
- **Rich text as JSON**: `Document.body` and `Template.body` store portable ProseMirror/Tiptap JSON — renderable, diffable, and safe (no raw HTML).
- **Versioning**: publishing snapshots the body into `DocumentVersion` (`@@unique([documentId, version])`).
- **Polymorphic-ish attachments/comments**: nullable FKs to `task`/`document`/`thread` keep referential integrity while allowing reuse.
- **Auditability**: `ActivityLog` is append-only; `(entityType, entityId)` and `(actorId, createdAt)` are indexed for feeds.

## Indexing strategy

Hot paths are indexed: `Task(sprintId,status)`, `Task(assigneeId,status)`, `Project(workspaceId,status)`, `Review(projectId,status)`, `Notification(recipientId,read)`, `ActivityLog(entityType,entityId)`. Uniqueness enforces integrity: `Membership(userId,workspaceId)`, `Project(workspaceId,key)`, `Task(projectId,number)`, `Tag(workspaceId,label)`.

## Search projection (Meilisearch)

On write, entities are projected into a denormalized index: `{ id, type, title, body, projectKey, status, updatedAt }` across Tasks, Projects, Sprints, Documents, Reviews — enabling the < 2s-fresh ⌘K search.
