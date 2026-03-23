import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import {
  getCollection,
  updateCollection,
  deleteCollection,
} from '@/lib/queries/collections';
import { updateCollectionSchema } from '@/lib/validations/collections';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/collections/:id - Get a single collection
export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { id } = await params;
  const data = await getCollection(id, session.user.id);
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data });
}

// PATCH /api/v1/collections/:id - Update a collection
export async function PATCH(request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateCollectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = await updateCollection(id, session.user.id, parsed.data);
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data });
}

// DELETE /api/v1/collections/:id - Delete a collection
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireSession();
  if (error) return error;

  const { id } = await params;
  const deleted = await deleteCollection(id, session.user.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { id, deleted: true } });
}
