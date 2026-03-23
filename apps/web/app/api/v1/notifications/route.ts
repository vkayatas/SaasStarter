import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { listNotifications, getUnreadCount, markAllAsRead } from '@/lib/queries/notifications';

export const dynamic = 'force-dynamic';

// GET /api/v1/notifications - List notifications for the user
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const [data, unreadCount] = await Promise.all([
    listNotifications(session.user.id),
    getUnreadCount(session.user.id),
  ]);

  return NextResponse.json({ data, meta: { total: data.length, unreadCount } });
}

// PATCH /api/v1/notifications - Mark all as read
export async function PATCH() {
  const { session, error } = await requireSession();
  if (error) return error;

  await markAllAsRead(session.user.id);
  return NextResponse.json({ success: true });
}
