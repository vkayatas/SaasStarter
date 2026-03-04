import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { listNotes, createNote } from '@/lib/queries/notes';
import { getCollection } from '@/lib/queries/collections';
import { createNoteSchema } from '@/lib/validations/notes';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/collections/:id/notes — List notes in a collection
export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { id } = await params;

  // Verify user owns this collection
  const collection = await getCollection(id, session.user.id);
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const data = await listNotes(session.user.id, id);
  return NextResponse.json({ data, meta: { total: data.length } });
}

// POST /api/v1/collections/:id/notes — Create a note in a collection
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { id } = await params;

  // Verify user owns this collection
  const collection = await getCollection(id, session.user.id);
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = await createNote(session.user.id, {
    ...parsed.data,
    collectionId: id,
  });
  return NextResponse.json({ data }, { status: 201 });
}
