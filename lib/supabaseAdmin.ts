import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key.
// The service role bypasses RLS, so this MUST NEVER be imported into a
// client component. It is only used inside route handlers (server code).
// RLS stays deny-all for the browser; all writes flow through here.
//
// Built lazily on first use, not at import time, so `next build` succeeds
// without secrets (e.g. preview deployments). A missing config now fails at
// request time with a clear error the route turns into a 503.

let cached: SupabaseClient | null = null;

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  }
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new SupabaseNotConfiguredError();
  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
