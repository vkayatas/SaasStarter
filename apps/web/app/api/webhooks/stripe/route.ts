import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import type Stripe from 'stripe';

/**
 * Stripe webhook handler.
 *
 * To register this endpoint in Stripe:
 *   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
 *
 * Required events to subscribe to:
 *   - checkout.session.completed
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_failed
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error('[webhook/stripe] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`[webhook/stripe] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[webhook/stripe] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Event Handlers ──────────────────────────────────────────────
// Implement your business logic in these functions.
// Typically: update user subscription status in DB, send emails, etc.

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log(`[stripe] Checkout completed: user=${userId}, customer=${customerId}, subscription=${subscriptionId}`);

  // TODO: Update user record with customerId and subscriptionId
  // await db.update(user).set({ stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId }).where(eq(user.id, userId));
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const status = subscription.status;
  const customerId = subscription.customer as string;

  console.log(`[stripe] Subscription updated: customer=${customerId}, status=${status}`);

  // TODO: Update subscription status in DB
  // await db.update(user).set({ subscriptionStatus: status }).where(eq(user.stripeCustomerId, customerId));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  console.log(`[stripe] Subscription deleted: customer=${customerId}`);

  // TODO: Downgrade user to free plan
  // await db.update(user).set({ subscriptionStatus: 'canceled', plan: 'free' }).where(eq(user.stripeCustomerId, customerId));
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  console.log(`[stripe] Payment failed: customer=${customerId}`);

  // TODO: Notify user of failed payment, mark subscription as past_due
  // await db.update(user).set({ subscriptionStatus: 'past_due' }).where(eq(user.stripeCustomerId, customerId));
}
