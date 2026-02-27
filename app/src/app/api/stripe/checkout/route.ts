import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Add your STRIPE_SECRET_KEY to environment variables.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { plan, email } = body;

    if (!plan || !email) {
      return NextResponse.json(
        { error: 'Missing plan or email' },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];
    if (!planConfig || !('priceId' in planConfig)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
