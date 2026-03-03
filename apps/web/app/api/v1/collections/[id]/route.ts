import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/v1/collections/:id — Get a single collection
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Authenticate user, query DB
  return NextResponse.json({ data: { id } });
}

// PATCH /api/v1/collections/:id — Update a collection
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  // TODO: Authenticate user, validate input, update DB
  return NextResponse.json({ data: { id, ...body } });
}

// DELETE /api/v1/collections/:id — Delete a collection
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Authenticate user, delete from DB
  return NextResponse.json({ data: { id, deleted: true } });
}
