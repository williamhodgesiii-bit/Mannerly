/* ============================================================
   Central entitlement model.

   From the launch plan ("Central Entitlement System"):
     "The storefront processes the transaction, but the Mannerly
      backend determines what the authenticated user can access."
     "Do not build subscription access as a simple Boolean such as
      `premium=true`. Build a real entitlement system from the
      beginning."

   So the app never checks a raw `premium` flag. Every storefront
   (Apple / Google / Amazon / web / promo / school) is *translated*
   into common internal permissions, and access is decided purely
   from the set of permissions a learner holds.

   This module is pure (no state, no storage). The persisted ledger
   lives in `src/state/entitlements.ts`.
   ============================================================ */

import type { CountryCode, Course } from '@/types'

/**
 * Common internal permissions. Payment sources map onto these; the UI
 * only ever asks "does the learner hold permission X?".
 *
 *  - GLOBAL_CORE ........ the free-forever Global Manners Core
 *  - HOME_REGION_<CC> ... the learner's chosen home country pack (free tier)
 *  - MANNERLY_PLUS ...... the consumer subscription (all countries)
 *  - FAMILY ............. the family plan (all countries, several profiles)
 *  - SCHOOL_LICENSE ..... classroom / district license
 *  - <CC>_TRAVEL_PACK ... a one-time regional unlock for one country
 */
export type Permission =
  | 'GLOBAL_CORE'
  | 'MANNERLY_PLUS'
  | 'FAMILY'
  | 'SCHOOL_LICENSE'
  | `HOME_REGION_${CountryCode}`
  | `${CountryCode}_TRAVEL_PACK`

/**
 * Where a permission came from. The plan calls for reconciling store
 * receipts with account access, so every grant records its source.
 */
export type EntitlementSource =
  | 'free' // baseline, granted to everyone
  | 'home' // home-region selection
  | 'apple' // App Store in-app purchase
  | 'google' // Google Play Billing
  | 'amazon' // Amazon Appstore IAP
  | 'web' // web checkout
  | 'promo' // promo code / complimentary
  | 'school' // school / district license

/** A single line in the entitlement ledger. */
export interface Entitlement {
  permission: Permission
  source: EntitlementSource
  grantedAt: string // ISO timestamp
}

export const homeRegionPermission = (c: CountryCode): Permission =>
  `HOME_REGION_${c}` as Permission

export const travelPackPermission = (c: CountryCode): Permission =>
  `${c}_TRAVEL_PACK` as Permission

/**
 * The set of permissions a learner currently holds:
 * the persisted ledger, plus the always-on baseline
 * (Global Core + the current home-region pack).
 */
export function computeHeld(
  ledger: Entitlement[],
  homeRegion: CountryCode,
): Set<Permission> {
  const held = new Set<Permission>(['GLOBAL_CORE', homeRegionPermission(homeRegion)])
  for (const e of ledger) held.add(e.permission)
  return held
}

/**
 * Which permissions would unlock a course. A learner needs *any one*
 * of them. Free courses (Global Core + anything flagged free) return
 * GLOBAL_CORE, which everyone always holds.
 */
export function courseRequirement(course: Course): Permission[] {
  if (course.free || course.kind === 'core') return ['GLOBAL_CORE']
  if (course.country) {
    return [
      'MANNERLY_PLUS',
      'FAMILY',
      'SCHOOL_LICENSE',
      homeRegionPermission(course.country),
      travelPackPermission(course.country),
    ]
  }
  return ['MANNERLY_PLUS']
}

/** True if the learner holds any permission that unlocks the course. */
export function courseUnlocked(course: Course, held: Set<Permission>): boolean {
  if (course.free || course.kind === 'core') return true
  return courseRequirement(course).some((p) => held.has(p))
}

/** Human-friendly hint for a locked course, e.g. for an upsell row. */
export function unlockHint(course: Course): string {
  if (course.country) {
    return `Unlock with Manners+ or the ${course.title} Travel Pack`
  }
  return 'Unlock with Manners+'
}

export interface Plan {
  id: 'school' | 'family' | 'plus' | 'free'
  label: string
  /** icon name from the brand set (src/components/Icon.tsx) */
  icon: 'school' | 'people' | 'star' | 'sprout'
}

/** The learner's highest active plan, for display. */
export function activePlan(held: Set<Permission>): Plan {
  if (held.has('SCHOOL_LICENSE')) return { id: 'school', label: 'School', icon: 'school' }
  if (held.has('FAMILY')) return { id: 'family', label: 'Family', icon: 'people' }
  if (held.has('MANNERLY_PLUS')) return { id: 'plus', label: 'Manners+', icon: 'star' }
  return { id: 'free', label: 'Free', icon: 'sprout' }
}
