'use client';

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui';
import { createAuthClient } from '@neondatabase/neon-js/auth';
import '@neondatabase/neon-js/ui/css';
import { ReactNode, useMemo } from 'react';

import { isNeonAuthConfigured } from '@/lib/config';

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || '';

export default function NeonAuthProvider({ children }: { children: ReactNode }) {
  const authClient = useMemo(() => {
    if (!isNeonAuthConfigured) return null;
    try {
      return createAuthClient(NEON_AUTH_URL);
    } catch {
      console.warn('Neon Auth: Failed to create auth client. Auth features disabled.');
      return null;
    }
  }, []);

  if (!authClient) {
    return <>{children}</>;
  }

  return (
    <NeonAuthUIProvider authClient={authClient}>
      {children}
    </NeonAuthUIProvider>
  );
}
