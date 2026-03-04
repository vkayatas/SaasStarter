import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { getNote, updateNote, deleteNote } from '@/lib/queries/notes';
import { updateNoteSchema } from '@/lib/validations/notes';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string; noteId: string }>;
}

// GET /api/v1/collections/:id/notes/:noteId
export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { noteId } = await params;
  const data = await getNote(noteId, session.user.id);
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data });
}

// PATCH /api/v1/collections/:id/notes/:noteId
export async function PATCH(request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { noteId } = await params;
  const body = await request.json();
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = await updateNote(noteId, session.user.id, parsed.data);
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data });
}

// DELETE /api/v1/collections/:id/notes/:noteId
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { noteId } = await params;
  const deleted = await deleteNote(noteId, session.user.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { id: deleted.id } });
}
