import { z } from 'zod';

// --- Collection Schemas ---

export const CollectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
});

export const UpdateCollectionSchema = z.object({
  name: z.string().min(1).max(255).optional(),
});

// --- Note Schemas ---

export const NoteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  collectionId: z.string().uuid().nullable(),
  content: z.string().min(1),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateNoteSchema = z.object({
  collectionId: z.string().uuid().optional(),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  collectionId: z.string().uuid().nullable().optional(),
});

// --- Query Schemas ---

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});
