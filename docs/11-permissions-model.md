# 11 · Permissions Model

Role-based access control scoped to a workspace. A user's capabilities derive from their `Membership.role` for that workspace. Enforced server-side by `RolesGuard` + per-query workspace scoping; mirrored in the UI (Settings → Permissions) so affordances match authority.

## Roles

| Role | Summary |
| --- | --- |
| **Admin** | Owns the workspace: members, workflows, permissions, templates, billing. |
| **Design Lead** | Runs delivery: projects, sprints, roadmap, assignment, approvals. |
| **Designer** | Executes work: manages assigned tasks, uploads, docs, comments. |
| **Viewer** | Read-only across projects and documentation. |

Roles are cumulative in capability (Admin ⊇ Lead ⊇ Designer ⊇ Viewer) with a few Admin/Lead-exclusive powers.

## Capability matrix

| Capability | Admin | Lead | Designer | Viewer |
| --- | :--: | :--: | :--: | :--: |
| Manage workspace & billing | ✓ | — | — | — |
| Manage members & roles | ✓ | — | — | — |
| Configure workflows & templates | ✓ | — | — | — |
| Create projects & sprints | ✓ | ✓ | — | — |
| Manage roadmap | ✓ | ✓ | — | — |
| Assign tasks | ✓ | ✓ | — | — |
| Approve deliverables / reviews | ✓ | ✓ | — | — |
| Manage assigned work & status | ✓ | ✓ | ✓ | — |
| Upload files & create docs | ✓ | ✓ | ✓ | — |
| Add comments | ✓ | ✓ | ✓ | — |
| View projects & documentation | ✓ | ✓ | ✓ | ✓ |

This matrix is rendered live in the app at **Settings → Permissions** and encoded in code as a single source of truth.

## Enforcement layers

1. **Route guard** — `AuthGuard` requires a valid session.
2. **Role guard** — `@Roles(...)` decorator + `RolesGuard` resolves `Membership.role` for the request's workspace and checks the capability.
3. **Query scoping** — every Prisma query filters by `workspaceId` from the membership; no cross-tenant reads.
4. **Ownership rules** — a Designer may edit tasks they're assigned or reported; status transitions beyond `Review` (i.e. `Approved`) require Lead/Admin (approval gate).
5. **UI mirroring** — buttons/menus hidden or disabled when the capability is absent (defense-in-depth, not the primary control).

## Special rules

- **Approval gate:** moving a Review to `Approved` (or a task from `Review → Approved`) requires all assigned reviewers to approve, and at least one Lead/Admin approval.
- **Viewer boundaries:** Viewers can open docs and boards but cannot comment, upload, or change state; write endpoints return `403`.
- **Template & workflow config** is Admin-only to prevent process drift (a core anti-Jira principle).

## Extensibility

The model is capability-based under the hood, so future needs (per-project roles, guest reviewers, custom roles) map to additional `Membership`/`ProjectMembership` rows without rewriting call sites — guards check capabilities, not hard-coded role names.
