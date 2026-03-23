import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { createPortalSession } from '@/lib/stripe';
import { z } from 'zod';

const schema = z.object({
  customerId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const portalSession = await createPortalSession(
      parsed.data.customerId,
      `${baseUrl}/dashboard/settings`,
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error('[billing/portal] Error:', err);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
