'use client';

import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { isNeonAuthConfigured } from '@/lib/config';
import {
  AuthUIContext,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@neondatabase/neon-js/auth/react/ui';

const planDetails: Record<string, { name: string; price: number; features: string[] }> = {
  pro: {
    name: 'Pro',
    price: 19,
    features: [
      'Unlimited validations',
      'Unlimited sync sources',
      'Advanced quizzes & analytics',
      'Demo video generation',
      'Priority support',
      'Weavy collaboration',
      'Spline 3D editor',
    ],
  },
  team: {
    name: 'Team',
    price: 49,
    features: [
      'Everything in Pro',
      'Team collaboration spaces',
      'Custom skill repositories',
      'API access',
      'SSO integration',
      'Dedicated support',
    ],
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { hooks } = useContext(AuthUIContext);
  const { data: session } = hooks.useSession();
  const userEmail = (session as { user?: { email?: string } })?.user?.email || '';
  const plan = searchParams.get('plan') || 'pro';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const details = planDetails[plan];

  useEffect(() => {
    const sid = searchParams.get('session_id');
    if (sid) {
      setSessionId(sid);
    }
  }, [searchParams]);

  async function handleCheckout() {
    if (!userEmail) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: userEmail }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  if (sessionId) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">&#x2705;</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to {details?.name || 'Pro'}!
        </h2>
        <p className="text-gray-500 mb-6">
          Your subscription is now active. You have access to all {details?.name} features.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Invalid plan. Please select from the <a href="/pricing" className="text-brand-600 hover:underline">pricing page</a>.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Subscribe to {details.name}
      </h1>
      <p className="text-gray-500 mb-8">
        Signed in as <span className="font-medium text-gray-700 dark:text-gray-300">{userEmail}</span>
      </p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">{details.name} Plan</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">${details.price}/mo</span>
        </div>
        <hr className="border-gray-200 dark:border-gray-800 mb-4" />
        <ul className="space-y-2">
          {details.features.map((f) => (
            <li key={f} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span className="text-green-500">&#x2713;</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !userEmail}
        className="w-full py-3 px-4 bg-brand-600 text-white rounded-lg text-base font-medium hover:bg-brand-700 disabled:opacity-50 shadow-lg shadow-brand-500/25"
      >
        {loading ? 'Redirecting to Stripe...' : `Subscribe — $${details.price}/month`}
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        Secure checkout powered by Stripe. Cancel anytime.
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  if (!isNeonAuthConfigured) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-500">Configure Neon Auth to enable checkout. Set NEXT_PUBLIC_NEON_AUTH_URL in your environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SignedIn>
        <CheckoutContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
