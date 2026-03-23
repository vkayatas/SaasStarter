import { describe, it, expect } from 'vitest';
import { canEdit, canDelete, canViewAdmin, ROLES } from '../src/permissions';

describe('canEdit', () => {
  it('allows admin to edit any resource', () => {
    expect(canEdit('admin', 'other-user-id', 'current-user-id')).toBe(true);
  });

  it('allows owner to edit any resource', () => {
    expect(canEdit('owner', 'other-user-id', 'current-user-id')).toBe(true);
  });

  it('allows user to edit their own resource', () => {
    expect(canEdit('user', 'user-123', 'user-123')).toBe(true);
  });

  it('denies user from editing another user resource', () => {
    expect(canEdit('user', 'other-user', 'user-123')).toBe(false);
  });
});

describe('canDelete', () => {
  it('allows admin to delete any resource', () => {
    expect(canDelete('admin', 'other-user-id', 'current-user-id')).toBe(true);
  });

  it('allows owner to delete any resource', () => {
    expect(canDelete('owner', 'other-user-id', 'current-user-id')).toBe(true);
  });

  it('allows user to delete their own resource', () => {
    expect(canDelete('user', 'user-123', 'user-123')).toBe(true);
  });

  it('denies user from deleting another user resource', () => {
    expect(canDelete('user', 'other-user', 'user-123')).toBe(false);
  });
});

describe('canViewAdmin', () => {
  it('allows admin', () => {
    expect(canViewAdmin('admin')).toBe(true);
  });

  it('allows owner', () => {
    expect(canViewAdmin('owner')).toBe(true);
  });

  it('denies regular user', () => {
    expect(canViewAdmin('user')).toBe(false);
  });
});

describe('ROLES', () => {
  it('contains exactly user, admin, owner', () => {
    expect(ROLES).toEqual(['user', 'admin', 'owner']);
  });
});
