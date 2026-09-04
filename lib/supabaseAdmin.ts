import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key.
// The service role bypasses RLS, so this MUST NEVER be imported into a
// client component. It is only used inside route handlers (server code).
// RLS stays deny-all for the browser; all writes flow through here.

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
