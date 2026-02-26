'use client';

import { AuthView } from '@neondatabase/neon-js/auth/react/ui';

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start aggregating and mastering AI agent skills</p>
        </div>
        <AuthView view="SIGN_UP" redirectTo="/dashboard" />
      </div>
    </div>
  );
}
