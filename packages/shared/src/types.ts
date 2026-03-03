import type { Role } from './permissions';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  collectionId: string | null;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    cursor: string | null;
  };
}
