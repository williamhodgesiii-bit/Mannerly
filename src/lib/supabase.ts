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

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
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
