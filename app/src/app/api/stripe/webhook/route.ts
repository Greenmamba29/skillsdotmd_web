import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email;
      const subscriptionId = session.subscription as string;
      const plan = session.metadata?.plan || 'pro';

      if (email && subscriptionId) {
        const sub = await getStripe().subscriptions.retrieve(subscriptionId) as unknown as {
          items: { data: { price: { id: string } }[] };
          current_period_end: number;
        };
        const user = await prisma.user.upsert({
          where: { email },
          create: { email, plan, stripeCustomerId: session.customer as string },
          update: { plan, stripeCustomerId: session.customer as string },
        });

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0].price.id,
            status: 'active',
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
          update: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0].price.id,
            status: 'active',
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as unknown as {
        id: string;
        status: string;
        current_period_end: number;
      };
      const existing = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: sub.id },
      });
      if (existing) {
        await prisma.subscription.update({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        if (sub.status === 'canceled' || sub.status === 'unpaid') {
          await prisma.user.update({
            where: { id: existing.userId },
            data: { plan: 'free' },
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
