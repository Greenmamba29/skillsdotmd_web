// Authentication is handled by Neon Auth (@neondatabase/neon-js)
// Client-side: NeonAuthUIProvider wraps the app in layout.tsx
// Auth UI: AuthView, UserButton, SignedIn/SignedOut components
// Session: Managed by Neon Auth's built-in session management
//
// To access the current user on the client:
//   import { AuthUIContext } from '@neondatabase/neon-js/auth/react/ui';
//   const { hooks } = useContext(AuthUIContext);
//   const { data: session } = hooks.useSession();
//   const user = session?.user;

export {};
