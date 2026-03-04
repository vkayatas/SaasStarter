import { z } from 'zod';

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  collectionId: z.string().uuid().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
  collectionId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
