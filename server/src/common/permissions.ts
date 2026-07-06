/**
 * Single source of truth for the RBAC capability matrix (see docs/11-permissions-model.md).
 * The frontend Settings → Permissions table renders the same data.
 */
export type Role = 'ADMIN' | 'DESIGN_LEAD' | 'DESIGNER' | 'VIEWER';

export type Capability =
  | 'workspace.manage'
  | 'members.manage'
  | 'workflows.configure'
  | 'projects.create'
  | 'roadmap.manage'
  | 'tasks.assign'
  | 'reviews.approve'
  | 'work.manage'
  | 'files.upload'
  | 'comments.create'
  | 'content.view';

export const CAPABILITIES: Record<Capability, Role[]> = {
  'workspace.manage': ['ADMIN'],
  'members.manage': ['ADMIN'],
  'workflows.configure': ['ADMIN'],
  'projects.create': ['ADMIN', 'DESIGN_LEAD'],
  'roadmap.manage': ['ADMIN', 'DESIGN_LEAD'],
  'tasks.assign': ['ADMIN', 'DESIGN_LEAD'],
  'reviews.approve': ['ADMIN', 'DESIGN_LEAD'],
  'work.manage': ['ADMIN', 'DESIGN_LEAD', 'DESIGNER'],
  'files.upload': ['ADMIN', 'DESIGN_LEAD', 'DESIGNER'],
  'comments.create': ['ADMIN', 'DESIGN_LEAD', 'DESIGNER'],
  'content.view': ['ADMIN', 'DESIGN_LEAD', 'DESIGNER', 'VIEWER'],
};

export function can(role: Role, capability: Capability): boolean {
  return CAPABILITIES[capability].includes(role);
}
