import { createClient } from '@neondatabase/neon-js';

let _neonClient: ReturnType<typeof createClient> | null = null;

export function getNeonClient() {
  if (!_neonClient) {
    const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL || '';
    const dataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL || '';
    _neonClient = createClient({
      auth: { url: authUrl },
      dataApi: { url: dataApiUrl },
    });
  }
  return _neonClient;
}

export default getNeonClient;
