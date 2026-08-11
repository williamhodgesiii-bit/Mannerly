import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgeGroup, CountryCode, GoalId, LanguageCode } from '@/types'
import type { Permission } from '@/lib/entitlements'
import {
  type AccountSnapshot,
  EMPTY_ENTITLEMENTS,
  EMPTY_PROGRESS,
  type ProgressSnapshot,
  loadSnapshot,
  removeSnapshot,
  saveSnapshot,
} from '@/lib/sync'
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'
import { isSupabaseConfigured, type ProfileMeta, supabase } from '@/lib/supabase'

/* ============================================================
   Accounts.

   Plan ("One Mannerly Account Everywhere"): create an account on one
   device, sign in on another, and see the same profile.

   Auth runs on real Supabase when it's configured (see
   src/lib/supabase.ts); otherwise it falls back to an on-device
   stand-in so every flow is testable without a backend. Either way an
   account owns a data snapshot (progress + entitlements) kept in the
   sync vault; signing in loads it, signing out returns to guest.

   "Just accounts for now": Supabase holds the account + identity;
   learning progress is still stored per-account on the device and
   syncs through the same seam (src/lib/sync.ts) as a next step.
   ============================================================ */

export type AuthProvider = 'password' | 'google' | 'apple'
export type AccountRole = 'learner' | 'parent' | 'teacher' | 'student'

export interface Account {
  id: string
  provider: AuthProvider
  email?: string
  username?: string
  displayName: string
  role: AccountRole
  createdAt: string
}

const GUEST_ID = 'guest'
const now = () => new Date().toISOString()
const newId = () => `u_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`

/** Non-reversible obfuscation for the local stand-in only — NOT production security. */
function localHash(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0
  return (h >>> 0).toString(16)
}

interface StoredCred {
  accountId: string
  hash: string
}

/* ---------- profile seed carried out to useProfiles after sign-in ---------- */

export interface DevSeed {
  children?: { name: string; ageGroup: AgeGroup; avatarId: string }[]
  classroom?: { name: string; gradeAge: AgeGroup; language: LanguageCode; homeRegion: CountryCode }
  joinedClass?: string
}

/* ---------- dev / sample accounts (one per path; also App Store review) ---------- */

export const DEV_PASSWORD = 'Mannerly-Dev-2026'

interface DevSpec {
  account: Account
  password: string
  grants: Permission[]
  progress: Partial<ProgressSnapshot>
  homeRegion: CountryCode
  seed?: DevSeed
}

/** Keyed by email (lowercase). One ready-to-explore login per account type. */
const DEV_ACCOUNTS: Record<string, DevSpec> = {
  'solo@mannerly.app': {
    account: { id: 'dev-solo', provider: 'password', email: 'solo@mannerly.app', displayName: 'Alex Rivera', role: 'learner', createdAt: now() },
    password: DEV_PASSWORD,
    grants: ['MANNERLY_PLUS'],
    homeRegion: 'US',
    progress: {
      accountType: 'individual', ageGroup: 'adults', avatarId: 'compass',
      goals: ['work', 'travel', 'dining'] as GoalId[],
      xp: 60, streak: 4, lastActive: now().slice(0, 10),
      completed: { 'gc-greet': true, 'gc-please': true, 'gc-thanks': true, 'gc-introduce': true },
    },
  },
  'family@mannerly.app': {
    account: { id: 'dev-family', provider: 'password', email: 'family@mannerly.app', displayName: 'Jordan Lee', role: 'parent', createdAt: now() },
    password: DEV_PASSWORD,
    grants: ['FAMILY'],
    homeRegion: 'US',
    progress: { accountType: 'family', ageGroup: 'adults', avatarId: 'sprout' },
    seed: {
      children: [
        { name: 'Emma', ageGroup: 'kids', avatarId: 'star' },
        { name: 'Liam', ageGroup: 'tweens', avatarId: 'rocket' },
      ],
    },
  },
  'teacher@mannerly.app': {
    account: { id: 'dev-teacher', provider: 'password', email: 'teacher@mannerly.app', displayName: 'Ms. Carter', role: 'teacher', createdAt: now() },
    password: DEV_PASSWORD,
    grants: ['SCHOOL_LICENSE'],
    homeRegion: 'US',
    progress: { accountType: 'teacher', ageGroup: 'adults', avatarId: 'book' },
    seed: {
      classroom: { name: 'Grade 3 — Ms. Carter', gradeAge: 'tweens', language: 'en', homeRegion: 'US' },
    },
  },
  'student@mannerly.app': {
    account: { id: 'dev-student', provider: 'password', email: 'student@mannerly.app', displayName: 'Sam', role: 'student', createdAt: now() },
    password: DEV_PASSWORD,
    grants: ['SCHOOL_LICENSE'],
    homeRegion: 'US',
    progress: { accountType: 'student', ageGroup: 'teens', avatarId: 'smile', xp: 20, streak: 2, completed: { 'gc-greet': true } },
    seed: { joinedClass: 'MANNER-3207' },
  },
}

function devSnapshot(spec: DevSpec): AccountSnapshot {
  return {
    progress: { ...EMPTY_PROGRESS, onboarded: true, ...spec.progress },
    entitlements: {
      homeRegion: spec.homeRegion,
      ledger: spec.grants.map((permission) => ({ permission, source: 'promo' as const, grantedAt: now() })),
    },
    updatedAt: now(),
  }
}

/* ---------- active-data helpers ---------- */

/** Snapshot the live stores (progress + entitlements) for the active learner. */
export function snapshotLive(): AccountSnapshot {
  return {
    progress: useProgress.getState().exportSnapshot(),
    entitlements: useEntitlements.getState().exportSnapshot(),
    updatedAt: now(),
  }
}

/** Replace the live stores with a snapshot (or empty for a fresh learner). */
export function applyLive(snap: AccountSnapshot | null): void {
  useProgress.getState().hydrate(snap?.progress ?? { ...EMPTY_PROGRESS })
  useEntitlements.getState().hydrate(snap?.entitlements ?? { ...EMPTY_ENTITLEMENTS })
}

/* ---------- Supabase helpers (only used when configured) ---------- */

type SbUser = { id: string; email?: string; created_at?: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }

function providerOf(user: SbUser): AuthProvider {
  const p = (user.app_metadata?.provider as string) ?? 'email'
  return p === 'google' ? 'google' : p === 'apple' ? 'apple' : 'password'
}

function accountFromUser(user: SbUser): Account {
  const m = (user.user_metadata ?? {}) as Partial<ProfileMeta>
  return {
    id: user.id,
    provider: providerOf(user),
    email: user.email,
    displayName: m.display_name || user.email?.split('@')[0] || 'You',
    role: (m.role as AccountRole) || 'learner',
    createdAt: user.created_at || now(),
  }
}

/** What to load on Supabase sign-in: the device snapshot, or a minimal
 *  onboarded profile from the account's metadata so a returning user on a
 *  fresh device isn't sent back through onboarding. */
function incomingForUser(user: SbUser): AccountSnapshot | null {
  const local = loadSnapshot(user.id)
  if (local) return local
  const m = (user.user_metadata ?? {}) as Partial<ProfileMeta>
  if (!m.onboarded) return null
  return {
    progress: {
      ...EMPTY_PROGRESS,
      onboarded: true,
      accountType: (m.account_type as ProgressSnapshot['accountType']) ?? 'individual',
      ageGroup: 'adults',
      avatarId: 'smile',
    },
    entitlements: { ...EMPTY_ENTITLEMENTS },
    updatedAt: now(),
  }
}

export type AuthResult = { ok: true; seed?: DevSeed } | { ok: false; error: string }

interface AccountState {
  account: Account | null
  users: Record<string, Account>
  creds: Record<string, StoredCred> // email(lower) → credential (local mode)
  authReady: boolean

  activeId: () => string
  /** Push the live snapshot to the sync backend under the active account. */
  persistActive: () => void
  /** Restore an existing session (Supabase) on app start. */
  initAuth: () => Promise<void>

  signUpPassword: (email: string, username: string, password: string) => Promise<AuthResult>
  signInPassword: (email: string, password: string) => Promise<AuthResult>
  signInWithProvider: (provider: 'google' | 'apple') => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  /** Delete the signed-in account and its data (store requirement). */
  deleteAccount: () => Promise<void>
}

export const useAccount = create<AccountState>()(
  persist(
    (set, get) => {
      /** Save the outgoing account's data, then load the incoming account's data. */
      const switchTo = (next: Account | null, incoming: AccountSnapshot | null) => {
        saveSnapshot(get().activeId(), snapshotLive())
        set({ account: next })
        applyLive(incoming)
      }

      return {
        account: null,
        users: {},
        creds: {},
        authReady: !isSupabaseConfigured, // local mode is ready immediately

        activeId: () => get().account?.id ?? GUEST_ID,

        persistActive: () => saveSnapshot(get().activeId(), snapshotLive()),

        initAuth: async () => {
          if (!isSupabaseConfigured || !supabase) {
            set({ authReady: true })
            return
          }
          const { data } = await supabase.auth.getSession()
          const user = data.session?.user as SbUser | undefined
          if (user) {
            set({ account: accountFromUser(user) })
            applyLive(incomingForUser(user))
          } else {
            set({ account: null })
          }
          set({ authReady: true })
          // Keep the store in step with token refresh / OAuth return / sign-out.
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
              set({ account: null })
              applyLive(loadSnapshot(GUEST_ID))
            } else if (session?.user && event === 'SIGNED_IN') {
              const u = session.user as SbUser
              if (u.id !== get().account?.id) switchTo(accountFromUser(u), incomingForUser(u))
            }
          })
        },

        signUpPassword: async (emailRaw, username, password) => {
          const email = emailRaw.trim().toLowerCase()
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Enter a valid email address.' }
          if (password.length < 8) return { ok: false, error: 'Use at least 8 characters for your password.' }

          if (isSupabaseConfigured && supabase) {
            const displayName = username.trim() || email.split('@')[0]
            const meta: ProfileMeta = {
              display_name: displayName,
              role: 'learner',
              account_type: useProgress.getState().accountType ?? 'individual',
              onboarded: useProgress.getState().onboarded,
            }
            const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta } })
            if (error) return { ok: false, error: error.message }
            const user = data.user as SbUser | null
            if (data.session && user) {
              // Attach the current (guest) progress to the new account.
              set({ account: accountFromUser(user) })
              saveSnapshot(user.id, snapshotLive())
              return { ok: true }
            }
            return { ok: false, error: 'Account created. Check your email to confirm, then sign in.' }
          }

          // local stand-in
          if (DEV_ACCOUNTS[email] || get().creds[email]) return { ok: false, error: 'An account with that email already exists.' }
          const id = newId()
          const account: Account = {
            id, provider: 'password', email,
            username: username.trim() || undefined,
            displayName: username.trim() || email.split('@')[0],
            role: 'learner', createdAt: now(),
          }
          set({
            users: { ...get().users, [id]: account },
            creds: { ...get().creds, [email]: { accountId: id, hash: localHash(password) } },
            account,
          })
          saveSnapshot(id, snapshotLive())
          return { ok: true }
        },

        signInPassword: async (emailRaw, password) => {
          const email = emailRaw.trim().toLowerCase()

          if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
              const m = error.message || ''
              if (/not confirmed/i.test(m)) {
                return { ok: false, error: 'Email not confirmed — in Supabase, turn off Authentication → Providers → Email → “Confirm email” for testing.' }
              }
              // surface the real reason (Supabase already returns a generic
              // "Invalid login credentials" for wrong email/password)
              return { ok: false, error: m || 'Incorrect email or password.' }
            }
            const user = data.user as SbUser
            // Dev/sample accounts sign in with real Supabase identity but get their
            // rich sample data (plan, progress, household) applied on the device.
            const dev = DEV_ACCOUNTS[email]
            switchTo(accountFromUser(user), dev ? devSnapshot(dev) : incomingForUser(user))
            return dev ? { ok: true, seed: dev.seed } : { ok: true }
          }

          // local stand-in — dev/sample accounts first
          const dev = DEV_ACCOUNTS[email]
          if (dev) {
            if (password !== dev.password) return { ok: false, error: 'Incorrect email or password.' }
            switchTo(dev.account, devSnapshot(dev))
            return { ok: true, seed: dev.seed }
          }
          const cred = get().creds[email]
          if (!cred || cred.hash !== localHash(password)) return { ok: false, error: 'Incorrect email or password.' }
          const account = get().users[cred.accountId]
          if (!account) return { ok: false, error: 'Account data is missing. Please sign up again.' }
          switchTo(account, loadSnapshot(account.id))
          return { ok: true }
        },

        signInWithProvider: async (provider) => {
          if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.signInWithOAuth({
              provider,
              options: { redirectTo: window.location.origin + window.location.pathname },
            })
            if (error) return { ok: false, error: error.message }
            // Browser redirects to the provider; the session is restored on return
            // via detectSessionInUrl + onAuthStateChange.
            return { ok: true }
          }

          // local stand-in for the OAuth handshake
          const id = `${provider}-user`
          const existing = get().users[id]
          const account: Account =
            existing ?? {
              id, provider,
              displayName: provider === 'google' ? 'Google account' : 'Apple account',
              role: 'learner', createdAt: now(),
            }
          if (!existing) set({ users: { ...get().users, [id]: account } })
          switchTo(account, loadSnapshot(id))
          return { ok: true }
        },

        resetPassword: async (emailRaw) => {
          const email = emailRaw.trim().toLowerCase()
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Enter a valid email address.' }
          if (isSupabaseConfigured && supabase) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: window.location.origin + window.location.pathname,
            })
            if (error) return { ok: false, error: error.message }
            return { ok: true }
          }
          // local stand-in: nothing to email, just acknowledge
          return { ok: true }
        },

        signOut: async () => {
          if (isSupabaseConfigured && supabase) await supabase.auth.signOut()
          switchTo(null, loadSnapshot(GUEST_ID))
        },

        deleteAccount: async () => {
          const acct = get().account
          if (isSupabaseConfigured && supabase) {
            // Server-side deletion via the security-definer RPC in schema.sql.
            try { await supabase.rpc('delete_account') } catch { /* best-effort */ }
            await supabase.auth.signOut()
          } else if (acct && !DEV_ACCOUNTS[acct.email ?? '']) {
            removeSnapshot(acct.id)
            const users = { ...get().users }
            delete users[acct.id]
            const creds = { ...get().creds }
            if (acct.email) delete creds[acct.email]
            set({ users, creds })
          }
          set({ account: null })
          applyLive(null) // fresh guest → back to onboarding
        },
      }
    },
    {
      name: 'mannerly-account-v1',
      // In Supabase mode the session is the source of truth, so don't persist a
      // stale account; keep local creds only for the on-device stand-in.
      partialize: (s) =>
        isSupabaseConfigured
          ? { users: {}, creds: {} }
          : { account: s.account, users: s.users, creds: s.creds },
    },
  ),
)
