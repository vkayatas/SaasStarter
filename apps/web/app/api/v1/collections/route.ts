import { NextResponse } from 'next/server';

// GET /api/v1/collections — List all collections for the user
export async function GET() {
  // TODO: Authenticate user, query DB
  return NextResponse.json({ data: [], meta: { total: 0, cursor: null } });
}

// POST /api/v1/collections — Create a new collection
export async function POST(request: Request) {
  // TODO: Authenticate user, validate input with Zod, insert into DB
  const body = await request.json();
  return NextResponse.json({ data: body }, { status: 201 });
}
