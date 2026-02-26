import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Browse all skills',
      '5 skill validations/day',
      'Basic quizzes',
      'Community access',
    ],
    limits: { validationsPerDay: 5, syncSources: 2, quizzesPerDay: 10 },
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    price: 19,
    features: [
      'Unlimited validations',
      'Unlimited sync sources',
      'Advanced quizzes & analytics',
      'Demo video generation',
      'Priority support',
      'Weavy collaboration',
    ],
    limits: { validationsPerDay: -1, syncSources: -1, quizzesPerDay: -1 },
  },
  team: {
    name: 'Team',
    priceId: process.env.STRIPE_TEAM_PRICE_ID || 'price_team',
    price: 49,
    features: [
      'Everything in Pro',
      'Team collaboration spaces',
      'Custom skill repositories',
      'API access',
      'SSO integration',
      'Dedicated support',
    ],
    limits: { validationsPerDay: -1, syncSources: -1, quizzesPerDay: -1 },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
