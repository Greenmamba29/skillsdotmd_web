import { createClient } from '@neondatabase/neon-js';

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || '';
const NEON_DATA_API_URL = process.env.NEXT_PUBLIC_NEON_DATA_API_URL || '';

function createNeonClient() {
  if (!NEON_AUTH_URL && !NEON_DATA_API_URL) return null;
  try {
    return createClient({
      auth: { url: NEON_AUTH_URL },
      dataApi: { url: NEON_DATA_API_URL },
    });
  } catch {
    console.warn('Neon client: Failed to create client. Neon features disabled.');
    return null;
  }
}

export const neonClient = createNeonClient();
export default neonClient;
