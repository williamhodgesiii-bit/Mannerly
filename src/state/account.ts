import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgeGroup, CountryCode } from '@/types'
import type { Permission } from '@/lib/entitlements'
import {
  type AccountSnapshot,
  EMPTY_ENTITLEMENTS,
  EMPTY_PROGRESS,
  loadSnapshot,
  removeSnapshot,
  saveSnapshot,
} from '@/lib/sync'
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'

/* ============================================================
   Accounts.

   Plan ("One Mannerly Account Everywhere"): create an account on one
   device, sign in on another, and see the same profile and progress.

   An account owns a data snapshot (progress + entitlements). Signing
   in loads that account's snapshot; signing out returns to the guest
   snapshot. Every change is pushed to the sync backend, so with the
   real backend wired in (`src/lib/sync.ts`) the same account follows
   the learner across devices.

   IMPORTANT: password/OAuth handling here is a LOCAL DEVELOPMENT
   STAND-IN so the flows are testable without a server. Real
   authentication (password hashing, Google / Apple OAuth, sessions)
   must run server-side before launch — see docs/store.
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

/* ---------- reviewer / demo accounts (App Store & Play review) ---------- */

const DEMO_PASSWORD = 'Mannerly-Review-2026'

interface DemoSpec {
  account: Account
  password: string
  grants: Permission[]
  ageGroup: AgeGroup
  homeRegion: CountryCode
}

const DEMO_ACCOUNTS: Record<string, DemoSpec> = {
  'reviewer.plus@mannerly.com': {
    account: { id: 'demo-plus', provider: 'password', email: 'reviewer.plus@mannerly.com', displayName: 'Review · Adult (Manners+)', role: 'learner', createdAt: now() },
    password: DEMO_PASSWORD, grants: ['MANNERLY_PLUS'], ageGroup: 'adults', homeRegion: 'US',
  },
  'reviewer.family@mannerly.com': {
    account: { id: 'demo-family', provider: 'password', email: 'reviewer.family@mannerly.com', displayName: 'Review · Parent (Family)', role: 'parent', createdAt: now() },
    password: DEMO_PASSWORD, grants: ['FAMILY'], ageGroup: 'adults', homeRegion: 'US',
  },
  'reviewer.teacher@mannerly.com': {
    account: { id: 'demo-teacher', provider: 'password', email: 'reviewer.teacher@mannerly.com', displayName: 'Review · Teacher (School)', role: 'teacher', createdAt: now() },
    password: DEMO_PASSWORD, grants: ['SCHOOL_LICENSE'], ageGroup: 'adults', homeRegion: 'US',
  },
  'reviewer.student@mannerly.com': {
    account: { id: 'demo-student', provider: 'password', email: 'reviewer.student@mannerly.com', displayName: 'Review · Student', role: 'student', createdAt: now() },
    password: DEMO_PASSWORD, grants: ['SCHOOL_LICENSE'], ageGroup: 'teens', homeRegion: 'US',
  },
}

function demoSnapshot(spec: DemoSpec): AccountSnapshot {
  return {
    progress: { ...EMPTY_PROGRESS, onboarded: true, ageGroup: spec.ageGroup },
    entitlements: {
      homeRegion: spec.homeRegion,
      ledger: spec.grants.map((permission) => ({ permission, source: 'promo' as const, grantedAt: now() })),
    },
    updatedAt: now(),
  }
}

/* ---------- active-data helpers ---------- */

function currentSnapshot(): AccountSnapshot {
  return {
    progress: useProgress.getState().exportSnapshot(),
    entitlements: useEntitlements.getState().exportSnapshot(),
    updatedAt: now(),
  }
}

function hydrateActive(snap: AccountSnapshot | null): void {
  useProgress.getState().hydrate(snap?.progress ?? { ...EMPTY_PROGRESS })
  useEntitlements.getState().hydrate(snap?.entitlements ?? { ...EMPTY_ENTITLEMENTS })
}

export type AuthResult = { ok: true } | { ok: false; error: string }

interface AccountState {
  account: Account | null
  users: Record<string, Account>
  creds: Record<string, StoredCred> // email(lower) → credential

  activeId: () => string
  /** Push the live snapshot to the sync backend under the active account. */
  persistActive: () => void

  signUpPassword: (email: string, username: string, password: string) => AuthResult
  signInPassword: (email: string, password: string) => AuthResult
  signInWithProvider: (provider: 'google' | 'apple') => AuthResult
  signOut: () => void
  /** Delete the signed-in account and its data (store requirement). */
  deleteAccount: () => void
}

export const useAccount = create<AccountState>()(
  persist(
    (set, get) => {
      /** Save the outgoing account's data, then load the incoming account's data. */
      const switchTo = (next: Account | null, incoming: AccountSnapshot | null) => {
        saveSnapshot(get().activeId(), currentSnapshot())
        set({ account: next })
        hydrateActive(incoming)
      }

      return {
        account: null,
        users: {},
        creds: {},

        activeId: () => get().account?.id ?? GUEST_ID,

        persistActive: () => saveSnapshot(get().activeId(), currentSnapshot()),

        signUpPassword: (emailRaw, username, password) => {
          const email = emailRaw.trim().toLowerCase()
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Enter a valid email address.' }
          if (password.length < 8) return { ok: false, error: 'Use at least 8 characters for your password.' }
          if (DEMO_ACCOUNTS[email] || get().creds[email]) return { ok: false, error: 'An account with that email already exists.' }

          const id = newId()
          const account: Account = {
            id,
            provider: 'password',
            email,
            username: username.trim() || undefined,
            displayName: username.trim() || email.split('@')[0],
            role: 'learner',
            createdAt: now(),
          }
          // Keep the current (guest) progress and attach it to the new account.
          set({
            users: { ...get().users, [id]: account },
            creds: { ...get().creds, [email]: { accountId: id, hash: localHash(password) } },
            account,
          })
          saveSnapshot(id, currentSnapshot())
          return { ok: true }
        },

        signInPassword: (emailRaw, password) => {
          const email = emailRaw.trim().toLowerCase()

          const demo = DEMO_ACCOUNTS[email]
          if (demo) {
            if (password !== demo.password) return { ok: false, error: 'Incorrect email or password.' }
            switchTo(demo.account, demoSnapshot(demo))
            return { ok: true }
          }

          const cred = get().creds[email]
          if (!cred || cred.hash !== localHash(password)) return { ok: false, error: 'Incorrect email or password.' }
          const account = get().users[cred.accountId]
          if (!account) return { ok: false, error: 'Account data is missing. Please sign up again.' }
          switchTo(account, loadSnapshot(account.id))
          return { ok: true }
        },

        signInWithProvider: (provider) => {
          // Local stand-in for the OAuth handshake. Real Google/Apple sign-in
          // is a backend concern (verified tokens, account linking).
          const id = `${provider}-user`
          const existing = get().users[id]
          const account: Account =
            existing ?? {
              id,
              provider,
              displayName: provider === 'google' ? 'Google account' : 'Apple account',
              role: 'learner',
              createdAt: now(),
            }
          if (!existing) set({ users: { ...get().users, [id]: account } })
          switchTo(account, loadSnapshot(id))
          return { ok: true }
        },

        signOut: () => switchTo(null, loadSnapshot(GUEST_ID)),

        deleteAccount: () => {
          const acct = get().account
          if (acct && !DEMO_ACCOUNTS[acct.email ?? '']) {
            removeSnapshot(acct.id)
            const users = { ...get().users }
            delete users[acct.id]
            const creds = { ...get().creds }
            if (acct.email) delete creds[acct.email]
            set({ users, creds })
          }
          set({ account: null })
          hydrateActive(null) // fresh guest → back to onboarding
        },
      }
    },
    {
      name: 'mannerly-account-v1',
      partialize: (s) => ({ account: s.account, users: s.users, creds: s.creds }),
    },
  ),
)
