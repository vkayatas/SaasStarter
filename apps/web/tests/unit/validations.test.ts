import { describe, it, expect } from 'vitest';
import {
  createCollectionSchema,
  updateCollectionSchema,
} from '@/lib/validations/collections';
import { createNoteSchema, updateNoteSchema } from '@/lib/validations/notes';

describe('createCollectionSchema', () => {
  it('accepts a valid name', () => {
    const result = createCollectionSchema.safeParse({ name: 'My Collection' });
    expect(result.success).toBe(true);
  });

  it('accepts name with optional slug', () => {
    const result = createCollectionSchema.safeParse({
      name: 'My Collection',
      slug: 'my-collection',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createCollectionSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name exceeding 255 chars', () => {
    const result = createCollectionSchema.safeParse({ name: 'x'.repeat(256) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid slug format', () => {
    const result = createCollectionSchema.safeParse({
      name: 'Test',
      slug: 'Invalid Slug!',
    });
    expect(result.success).toBe(false);
  });

  it('accepts slug with hyphens', () => {
    const result = createCollectionSchema.safeParse({
      name: 'Test',
      slug: 'my-cool-collection',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateCollectionSchema', () => {
  it('accepts partial update with just name', () => {
    const result = updateCollectionSchema.safeParse({ name: 'Updated' });
    expect(result.success).toBe(true);
  });

  it('accepts empty object (all fields optional)', () => {
    const result = updateCollectionSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('createNoteSchema', () => {
  it('accepts valid content', () => {
    const result = createNoteSchema.safeParse({ content: 'Hello world' });
    expect(result.success).toBe(true);
  });

  it('accepts content with collection and tags', () => {
    const result = createNoteSchema.safeParse({
      content: 'Hello',
      collectionId: '550e8400-e29b-41d4-a716-446655440000',
      tags: ['tag1', 'tag2'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = createNoteSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for collectionId', () => {
    const result = createNoteSchema.safeParse({
      content: 'Hello',
      collectionId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects more than 20 tags', () => {
    const tags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
    const result = createNoteSchema.safeParse({ content: 'Hello', tags });
    expect(result.success).toBe(false);
  });

  it('rejects tags longer than 50 chars', () => {
    const result = createNoteSchema.safeParse({
      content: 'Hello',
      tags: ['x'.repeat(51)],
    });
    expect(result.success).toBe(false);
  });
});

describe('updateNoteSchema', () => {
  it('accepts partial update', () => {
    const result = updateNoteSchema.safeParse({ tags: ['updated'] });
    expect(result.success).toBe(true);
  });

  it('accepts null collectionId (unassign from collection)', () => {
    const result = updateNoteSchema.safeParse({ collectionId: null });
    expect(result.success).toBe(true);
  });
});
