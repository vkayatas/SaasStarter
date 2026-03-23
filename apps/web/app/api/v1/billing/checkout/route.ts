import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { createCheckoutSession } from '@/lib/stripe';
import { z } from 'zod';

const schema = z.object({
  priceId: z.string().min(1),
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
    const checkoutSession = await createCheckoutSession({
      priceId: parsed.data.priceId,
      userId: session.user.id,
      userEmail: session.user.email,
      successUrl: `${baseUrl}/dashboard?billing=success`,
      cancelUrl: `${baseUrl}/pricing?billing=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('[billing/checkout] Error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
