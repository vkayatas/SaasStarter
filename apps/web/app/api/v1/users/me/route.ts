import { NextResponse } from 'next/server';

// GET /api/v1/users/me — Get the current user's profile
export async function GET() {
  // TODO: Authenticate user, return profile from session
  return NextResponse.json({
    data: {
      id: null,
      email: null,
      name: null,
      role: 'user',
    },
  });
}
