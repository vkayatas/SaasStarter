import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { listCollections, createCollection } from '@/lib/queries/collections';
import { createCollectionSchema } from '@/lib/validations/collections';

export const dynamic = 'force-dynamic';

// GET /api/v1/collections - List all collections for the user
export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const data = await listCollections(session.user.id);
  return NextResponse.json({ data, meta: { total: data.length } });
}

// POST /api/v1/collections - Create a new collection
export async function POST(request: Request) {
  const { session, error } = await requireSession();
  if (error) return error;

  const body = await request.json();
  const parsed = createCollectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const data = await createCollection(session.user.id, parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    // Duplicate slug
    if (err instanceof Error && err.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A collection with that slug already exists' },
        { status: 409 },
      );
    }
    throw err;
  }
}
