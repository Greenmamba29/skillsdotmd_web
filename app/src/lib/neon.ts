import { createClient } from '@neondatabase/neon-js';

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || '';
const NEON_DATA_API_URL = process.env.NEXT_PUBLIC_NEON_DATA_API_URL || '';

export const neonClient = createClient({
  auth: { url: NEON_AUTH_URL },
  dataApi: { url: NEON_DATA_API_URL },
});

export default neonClient;
