import type { z } from 'zod';
import type { CollectionSchema, NoteSchema } from './schemas';

export type Collection = z.infer<typeof CollectionSchema>;
export type Note = z.infer<typeof NoteSchema>;

export interface ApiErrorResponse {
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
