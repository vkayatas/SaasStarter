import Stripe from 'stripe';

let _stripe: Stripe | undefined;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Create a Stripe Checkout session for a given price.
 */
export async function createCheckoutSession(opts: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe is not configured');

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: opts.userEmail,
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: { userId: opts.userId },
  });
}

/**
 * Create a Stripe Customer Portal session for subscription management.
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe is not configured');

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Verify and parse a Stripe webhook event.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe is not configured');

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');

  return stripe.webhooks.constructEvent(payload, signature, secret);
}
