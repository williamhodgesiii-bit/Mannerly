/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Supabase project URL — set in .env to enable real accounts. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon/public key. Safe for the client; RLS protects the data. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
