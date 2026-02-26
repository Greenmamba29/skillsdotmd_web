'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with skill discovery',
    features: [
      'Browse all skills',
      '5 skill validations/day',
      'Basic quizzes',
      'Community access',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 19,
    description: 'For power users and skill authors',
    features: [
      'Unlimited validations',
      'Unlimited sync sources',
      'Advanced quizzes & analytics',
      'Demo video generation',
      'Priority support',
      'Weavy collaboration',
      'Spline 3D editor',
    ],
    cta: 'Subscribe to Pro',
    highlight: true,
  },
  {
    key: 'team',
    name: 'Team',
    price: 49,
    description: 'For teams building with skills',
    features: [
      'Everything in Pro',
      'Team collaboration spaces',
      'Custom skill repositories',
      'API access',
      'SSO integration',
      'Dedicated support',
    ],
    cta: 'Subscribe to Team',
    highlight: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  function handleSubscribe(planKey: string) {
    if (planKey === 'free') {
      router.push('/signup');
      return;
    }
    setLoading(planKey);
    router.push(`/checkout?plan=${planKey}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Start free. Upgrade when you need more power.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`rounded-2xl p-8 ${
              plan.highlight
                ? 'bg-brand-600 text-white ring-2 ring-brand-600 shadow-xl shadow-brand-500/25'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
            }`}
          >
            <h3 className={`text-lg font-semibold ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {plan.name}
            </h3>
            <p className={`text-sm mt-1 ${plan.highlight ? 'text-brand-100' : 'text-gray-500'}`}>
              {plan.description}
            </p>
            <div className="mt-6 mb-8">
              <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                ${plan.price}
              </span>
              <span className={`text-sm ${plan.highlight ? 'text-brand-200' : 'text-gray-500'}`}>/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className={`text-sm flex items-center gap-2 ${plan.highlight ? 'text-brand-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  <span className={plan.highlight ? 'text-white' : 'text-green-500'}>&#x2713;</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading === plan.key}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                plan.highlight
                  ? 'bg-white text-brand-600 hover:bg-brand-50'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              } disabled:opacity-50`}
            >
              {loading === plan.key ? 'Loading...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">FAQ</h2>
        <div className="space-y-6">
          <FAQ q="What is Skills.md?" a="Skills.md is an open standard for packaging AI agent capabilities. Each skill is a folder with a SKILL.md file containing YAML metadata and Markdown instructions that AI agents can discover and use on demand." />
          <FAQ q="Which agents are supported?" a="We support skills for Claude (Anthropic), Codex CLI (OpenAI), GitHub Copilot, Cursor, Kilo Code, and Google Antigravity. Skills are cross-platform by design." />
          <FAQ q="Can I import my own skills?" a="Yes! Place your SKILL.md folders in the .agents/skills/ directory and click Sync. You can also connect GitHub repos and Skills.sh as sync sources." />
          <FAQ q="How does the one-click deploy work?" a="The app is built with Next.js and configured for Vercel. Click the Deploy button or run 'vercel' in the terminal — your skillsdotmd instance will be live in seconds." />
        </div>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{q}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{a}</p>
    </div>
  );
}
