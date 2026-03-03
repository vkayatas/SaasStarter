export const ROLES = ['user', 'admin', 'owner'] as const;
export type Role = (typeof ROLES)[number];

export function canEdit(userRole: Role, resourceOwnerId: string, userId: string): boolean {
  if (userRole === 'admin' || userRole === 'owner') return true;
  return resourceOwnerId === userId;
}

export function canDelete(userRole: Role, resourceOwnerId: string, userId: string): boolean {
  if (userRole === 'admin' || userRole === 'owner') return true;
  return resourceOwnerId === userId;
}

export function canViewAdmin(userRole: Role): boolean {
  return userRole === 'admin' || userRole === 'owner';
}
