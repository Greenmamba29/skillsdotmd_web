// Shared configuration flags for checking service availability

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || '';
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUB_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const isNeonAuthConfigured =
  NEON_AUTH_URL.length > 0 && !NEON_AUTH_URL.includes('placeholder');

export const isStripeClientConfigured =
  STRIPE_PUB_KEY.startsWith('pk_') && !STRIPE_PUB_KEY.includes('placeholder');

export const isStripeServerConfigured =
  STRIPE_KEY.startsWith('sk_') && !STRIPE_KEY.includes('placeholder');
