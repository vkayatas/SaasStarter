import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { markAsRead } from '@/lib/queries/notifications';

// PATCH /api/v1/notifications/[id] - Mark single notification as read
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { id } = await params;
  const notification = await markAsRead(id, session.user.id);
  if (!notification) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: notification });
}
