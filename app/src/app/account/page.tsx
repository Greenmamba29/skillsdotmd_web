'use client';

import {
  AccountView,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@neondatabase/neon-js/auth/react/ui';
import { isNeonAuthConfigured } from '@/lib/config';

export default function AccountPage() {
  if (!isNeonAuthConfigured) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-500">Configure Neon Auth to access account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SignedIn>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>
        <AccountView />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
