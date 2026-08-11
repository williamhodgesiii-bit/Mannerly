import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* ============================================================
   Supabase client.

   Accounts run on real Supabase Auth when the project URL + anon key
   are present in the environment (.env → VITE_SUPABASE_URL /
   VITE_SUPABASE_ANON_KEY). When they're absent — local dev, CI, a
   reviewer's device — the app falls back to the on-device account
   stand-in with seeded dev logins, so every flow stays testable
   without a backend.

   Only auth + account identity live in Supabase for now ("just
   accounts"). Learning progress is still stored per-account on the
   device; syncing it is the next step and plugs into the same seam
   (src/lib/sync.ts).
   ============================================================ */

/**
 * Normalize the configured project URL to its clean origin.
 *
 * supabase-js builds every endpoint as `${url}/auth/v1/...`, `${url}/rest/v1/...`,
 * so the URL must be the bare project origin (`https://<ref>.supabase.co`) with
 * no trailing slash and no path. If it carries either, the request path becomes
 * malformed — e.g. a trailing slash yields `//auth/v1/token`, a stray path yields
 * `/rest/v1/auth/v1/...` — and Supabase's gateway rejects it with
 * "Invalid path specified in request URL", blocking sign-in. Reducing to
 * `URL.origin` makes auth resilient to a stray slash, path, or whitespace in the
 * env var. Anything unparseable falls back to the on-device stand-in.
 */
function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  const v = raw?.trim()
  if (!v) return undefined
  const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`
  try {
    return new URL(withProtocol).origin
  } catch {
    return undefined
  }
}

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/** Shape stored in Supabase user metadata + the `profiles` table. */
export interface ProfileMeta {
  display_name: string
  role: string
  account_type: string
  onboarded: boolean
}
