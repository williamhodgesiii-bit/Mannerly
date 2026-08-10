import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CountryCode } from '@/types'
import {
  computeHeld,
  type Entitlement,
  type EntitlementSource,
  type Permission,
} from '@/lib/entitlements'
import { EMPTY_ENTITLEMENTS, type EntitlementSnapshot } from '@/lib/sync'

/**
 * The persisted entitlement ledger.
 *
 * The plan ("Backups and Recovery"): "The internal entitlement ledger
 * should maintain enough information to reconcile store receipts with
 * Mannerly account access." So we keep an append-only-ish list of
 * grants, each tagged with its source, rather than a bag of booleans.
 *
 * This is the local stand-in for the central backend entitlement layer;
 * when the real backend lands, `grant`/`revoke` become sync points, and
 * the resolver logic stays identical.
 */

const DEFAULT_HOME_REGION: CountryCode = 'US'

interface EntitlementState {
  /** The learner's home country — grants that country pack for free. */
  homeRegion: CountryCode
  /** Every entitlement the learner has been granted. */
  ledger: Entitlement[]

  setHomeRegion: (c: CountryCode) => void
  /** Record a permission grant from a storefront/source (idempotent). */
  grant: (permission: Permission, source: EntitlementSource) => void
  /** Remove a permission (e.g. a cancelled subscription). */
  revoke: (permission: Permission) => void
  has: (permission: Permission) => boolean
  /** Wipe all entitlements and reset the home region (account deletion). */
  clearEntitlements: () => void

  /** Snapshot for the account sync layer. */
  exportSnapshot: () => EntitlementSnapshot
  /** Replace entitlements with an account's snapshot (on sign-in / sign-out). */
  hydrate: (s: EntitlementSnapshot) => void
}

export const useEntitlements = create<EntitlementState>()(
  persist(
    (set, get) => ({
      homeRegion: DEFAULT_HOME_REGION,
      ledger: [],

      setHomeRegion: (c) => set({ homeRegion: c }),

      grant: (permission, source) => {
        const ledger = get().ledger
        if (ledger.some((e) => e.permission === permission)) return
        set({
          ledger: [...ledger, { permission, source, grantedAt: new Date().toISOString() }],
        })
      },

      revoke: (permission) =>
        set({ ledger: get().ledger.filter((e) => e.permission !== permission) }),

      has: (permission) =>
        computeHeld(get().ledger, get().homeRegion).has(permission),

      clearEntitlements: () => set({ ...EMPTY_ENTITLEMENTS }),

      exportSnapshot: () => {
        const { homeRegion, ledger } = get()
        return { homeRegion, ledger }
      },

      hydrate: (s) => set({ homeRegion: s.homeRegion, ledger: s.ledger }),
    }),
    { name: 'mannerly-entitlements-v1' },
  ),
)

/**
 * The learner's full permission set (ledger + always-on baseline),
 * memoized so components only re-render when it actually changes.
 */
export function useHeldPermissions(): Set<Permission> {
  const ledger = useEntitlements((s) => s.ledger)
  const homeRegion = useEntitlements((s) => s.homeRegion)
  return useMemo(() => computeHeld(ledger, homeRegion), [ledger, homeRegion])
}
