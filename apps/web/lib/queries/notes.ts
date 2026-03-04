import { db } from '@saas/db';
import { notes } from '@saas/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// ── List all notes for a user ──────────────────────────────────
export async function listNotes(userId: string, collectionId?: string) {
  const conditions = [eq(notes.userId, userId)];
  if (collectionId) {
    conditions.push(eq(notes.collectionId, collectionId));
  }
  return db
    .select()
    .from(notes)
    .where(and(...conditions))
    .orderBy(desc(notes.updatedAt));
}

// ── Get one note ───────────────────────────────────────────────
export async function getNote(id: string, userId: string) {
  const [row] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .limit(1);
  return row ?? null;
}

// ── Create ─────────────────────────────────────────────────────
export async function createNote(
  userId: string,
  data: { content: string; collectionId?: string; tags?: string[] },
) {
  const [row] = await db
    .insert(notes)
    .values({
      userId,
      content: data.content,
      collectionId: data.collectionId ?? null,
      tags: data.tags ?? [],
    })
    .returning();
  return row;
}

// ── Update ─────────────────────────────────────────────────────
export async function updateNote(
  id: string,
  userId: string,
  data: { content?: string; collectionId?: string | null; tags?: string[] },
) {
  const [row] = await db
    .update(notes)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning();
  return row ?? null;
}

// ── Delete ─────────────────────────────────────────────────────
export async function deleteNote(id: string, userId: string) {
  const [row] = await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning({ id: notes.id });
  return row ?? null;
}

// ── Count notes for a user (optionally scoped to collection) ──
export async function countNotes(userId: string, collectionId?: string) {
  const conditions = [eq(notes.userId, userId)];
  if (collectionId) {
    conditions.push(eq(notes.collectionId, collectionId));
  }
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notes)
    .where(and(...conditions));
  return result?.count ?? 0;
}
