'use client';

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui';
import { createAuthClient } from '@neondatabase/neon-js/auth';
import '@neondatabase/neon-js/ui/css';
import { ReactNode, useMemo } from 'react';

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || '';

export default function NeonAuthProvider({ children }: { children: ReactNode }) {
  const authClient = useMemo(() => createAuthClient(NEON_AUTH_URL), []);

  return (
    <NeonAuthUIProvider authClient={authClient}>
      {children}
    </NeonAuthUIProvider>
  );
}
