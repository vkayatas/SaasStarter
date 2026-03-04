import { db } from '@saas/db';
import { collections } from '@saas/db/schema';
import { eq, and, desc } from 'drizzle-orm';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ── List ──────────────────────────────────────────────────────
export async function listCollections(userId: string) {
  return db
    .select()
    .from(collections)
    .where(eq(collections.userId, userId))
    .orderBy(desc(collections.updatedAt));
}

// ── Get one ───────────────────────────────────────────────────
export async function getCollection(id: string, userId: string) {
  const [row] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .limit(1);
  return row ?? null;
}

// ── Create ────────────────────────────────────────────────────
export async function createCollection(
  userId: string,
  data: { name: string; slug?: string },
) {
  const slug = data.slug || slugify(data.name);
  const [row] = await db
    .insert(collections)
    .values({ userId, name: data.name, slug })
    .returning();
  return row;
}

// ── Update ────────────────────────────────────────────────────
export async function updateCollection(
  id: string,
  userId: string,
  data: { name?: string; slug?: string },
) {
  const [row] = await db
    .update(collections)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .returning();
  return row ?? null;
}

// ── Delete ────────────────────────────────────────────────────
export async function deleteCollection(id: string, userId: string) {
  const [row] = await db
    .delete(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .returning({ id: collections.id });
  return row ?? null;
}

// ── Count ─────────────────────────────────────────────────────
export async function countCollections(userId: string) {
  const rows = await db
    .select()
    .from(collections)
    .where(eq(collections.userId, userId));
  return rows.length;
}
