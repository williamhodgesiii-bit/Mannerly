/* ============================================================
   Account data sync.

   Plan ("One Mannerly Account Everywhere"): a learner signs in on
   any device and sees the same profile and progress. The backend
   owns learner profiles, entitlements and progress; the client just
   pulls and pushes a per-account snapshot.

   This module is the seam for that. Today it reads/writes a local
   "vault" (localStorage) keyed by account id, so switching accounts
   on one device already loads the right data. To make it truly
   cross-device, point `backend` at the real service (Supabase / REST)
   by implementing the same two calls — `pull` and `push`. No caller
   changes.
   ============================================================ */

import type {
  A11yPrefs,
  AccountType,
  AgeGroup,
  CountryCode,
  GoalId,
  LanguageCode,
  NotifyPref,
} from '@/types'
import { DEFAULT_A11Y } from '@/types'
import type { Entitlement } from '@/lib/entitlements'

/** The learner's progress + profile, as stored per account. */
export interface ProgressSnapshot {
  onboarded: boolean
  accountType: AccountType | null
  ageGroup: AgeGroup | null
  language: LanguageCode
  goals: GoalId[]
  avatarId: string | null
  notify: NotifyPref
  a11y: A11yPrefs
  xp: number
  streak: number
  lastActive: string | null
  completed: Record<string, true>
  /** which world (course) the learner is currently on */
  activeCourseId?: string
  /** energy/charge balance + the timestamp it was last spent */
  charge?: number
  chargeAt?: number
}

/** The learner's entitlements, as stored per account. */
export interface EntitlementSnapshot {
  homeRegion: CountryCode
  ledger: Entitlement[]
}

/** Everything that belongs to one account — the unit that syncs. */
export interface AccountSnapshot {
  progress: ProgressSnapshot
  entitlements: EntitlementSnapshot
  updatedAt: string
}

export const EMPTY_PROGRESS: ProgressSnapshot = {
  onboarded: false,
  accountType: null,
  ageGroup: null,
  language: 'en',
  goals: [],
  avatarId: null,
  notify: 'off',
  a11y: DEFAULT_A11Y,
  xp: 0,
  streak: 0,
  lastActive: null,
  completed: {},
  activeCourseId: 'core',
  charge: 5,
  chargeAt: 0,
}

export const EMPTY_ENTITLEMENTS: EntitlementSnapshot = {
  homeRegion: 'US',
  ledger: [],
}

/**
 * The sync backend. Swap the implementation for a real one and the
 * rest of the app is unchanged.
 *
 *   pull(accountId)  → the account's latest snapshot, or null if new
 *   push(accountId, snapshot) → save the account's snapshot
 *
 * A real implementation authenticates the request (the signed-in
 * user's token) and lets the server enforce that a learner can only
 * read/write their own — or their household's — data.
 */
export interface SyncBackend {
  pull(accountId: string): AccountSnapshot | null
  push(accountId: string, snapshot: AccountSnapshot): void
  remove(accountId: string): void
}

const VAULT_KEY = 'mannerly-vault-v1'

function readVault(): Record<string, AccountSnapshot> {
  try {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeVault(vault: Record<string, AccountSnapshot>): void {
  try {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault))
  } catch {
    /* storage full / unavailable — non-fatal for a local stand-in */
  }
}

/** Local, on-device backend. Replace with the real service for cross-device sync. */
export const localBackend: SyncBackend = {
  pull: (accountId) => readVault()[accountId] ?? null,
  push: (accountId, snapshot) => {
    const vault = readVault()
    vault[accountId] = snapshot
    writeVault(vault)
  },
  remove: (accountId) => {
    const vault = readVault()
    delete vault[accountId]
    writeVault(vault)
  },
}

/** The active backend. Point this at the real service when it exists. */
export const backend: SyncBackend = localBackend

export const loadSnapshot = (accountId: string): AccountSnapshot | null =>
  backend.pull(accountId)

export const saveSnapshot = (accountId: string, snapshot: AccountSnapshot): void =>
  backend.push(accountId, snapshot)

export const removeSnapshot = (accountId: string): void => backend.remove(accountId)
