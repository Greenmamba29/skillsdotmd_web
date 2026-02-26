'use client';

import {
  AccountView,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@neondatabase/neon-js/auth/react/ui';

export default function AccountPage() {
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
