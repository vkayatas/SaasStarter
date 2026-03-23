import { db } from '@saas/db';
import { notifications } from '@saas/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function listNotifications(userId: string, limit = 20) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: string) {
  const rows = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  return rows.length;
}

export async function markAsRead(id: string, userId: string) {
  const [row] = await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning();
  return row ?? null;
}

export async function markAllAsRead(userId: string) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
}) {
  const [row] = await db.insert(notifications).values(data).returning();
  return row;
}
