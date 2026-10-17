import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Accept both legacy JWT-style anon keys and newer sb_publishable_ format
function isValidAnonKey(key: string | undefined): boolean {
  if (!key || key.length < 20) return false;
  // Standard Supabase JWT anon key
  if (key.startsWith('eyJ')) return true;
  // Newer Supabase publishable key format
  if (key.startsWith('sb_publishable_')) return true;
  return false;
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder-project') &&
  !supabaseUrl.includes('your-project-id') &&
  isValidAnonKey(supabaseAnonKey)
);

// Fallback dummy client for when environment variables are not yet provided
// to avoid runtime errors while prompting developer with clear setup instructions.
const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'placeholder-key-please-configure-env';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured && supabaseUrl ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured && supabaseAnonKey ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'mindbridge_auth_session',
    },
  }
);

/**
 * Performs a lightweight live connection probe to Supabase.
 * Does NOT expose credentials or reveal any user data.
 * Returns: 'connected' | 'failed' | 'not-configured'
 */
export type SupabaseStatus = 'connected' | 'failed' | 'not-configured' | 'checking';

export async function probeSupabaseConnection(): Promise<{ status: SupabaseStatus; latencyMs?: number }> {
  if (!isSupabaseConfigured) {
    return { status: 'not-configured' };
  }

  const start = performance.now();
  try {
    // A getSession call reaches the Supabase Auth API — a real round-trip
    // that requires valid project URL and key. Returns immediately if no session.
    const { error } = await supabase.auth.getSession();

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // Auth errors like "Auth session missing" still mean we connected
      // Only network/400/401 errors mean misconfiguration
      const msg = error.message?.toLowerCase() ?? '';
      if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
        return { status: 'failed', latencyMs };
      }
    }

    return { status: 'connected', latencyMs };
  } catch {
    return { status: 'failed', latencyMs: Math.round(performance.now() - start) };
  }
}
