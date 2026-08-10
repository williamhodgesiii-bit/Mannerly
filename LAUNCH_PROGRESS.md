# Mannerly — Launch Roadmap Progress

Tracks work against **`To Do for Bill`** (the distribution / store / web launch plan).
Updated as items are started and completed.

## ✅ Started — Central Entitlement System

> Plan: _"Do not build subscription access as a simple Boolean such as
> `premium=true`. Build a real entitlement system from the beginning."_

The app previously gated every country pack on a single `course.free` boolean.
That has been replaced with a real entitlement layer:

- **`src/lib/entitlements.ts`** — internal permissions (`GLOBAL_CORE`,
  `MANNERLY_PLUS`, `FAMILY`, `SCHOOL_LICENSE`, `HOME_REGION_<CC>`,
  `<CC>_TRAVEL_PACK`), the storefront **source** each grant came from
  (`apple` · `google` · `amazon` · `web` · `promo` · `school` · `home` · `free`),
  and pure resolvers (`computeHeld`, `courseUnlocked`, `activePlan`).
- **`src/state/entitlements.ts`** — a persisted **entitlement ledger**
  (home region + grants with source & timestamp) with `grant` / `revoke` /
  `setHomeRegion` and a `useHeldPermissions()` selector. This is the local
  stand-in for the central backend layer; `grant`/`revoke` become the sync
  points when the backend lands.
- **Gating** in `Explore` and `CourseDetail` now asks the entitlement layer,
  not `course.free`. Free tier = **Global Core + your Home Region + first
  lesson of every pack**; Manners+ / Family / School / a Travel Pack unlock
  the rest.
- **Profile** shows the active plan, changing Home Region unlocks that pack,
  and "Try 7 days free" writes a `MANNERLY_PLUS` grant (source `web`) into the
  ledger — modelling a real purchase reconciling into central entitlements.

## ✅ Started — Account Deletion (store requirement)

> Plan: Apple & Google both require an in-app path to delete an account and its
> data (Settings → Account → Delete Account), plus a web deletion resource.

- Profile now has a **Delete account** action that erases progress,
  entitlements and preferences from the device. The web `/account/delete`
  resource is still to be built alongside the backend.

## ▶️ Next up (from the plan, roughly in order)

1. **Home Region in onboarding** — pick it during signup (today it defaults to
   US and is changed in Profile).
2. **Server-controlled feature flags** — `Travel Mode`, `Teacher Dashboard beta`,
   new onboarding, etc., so releases don't require a store update.
3. **Central Mannerly backend** — accounts, households, classrooms, and syncing
   the entitlement ledger across web / iOS / Android.
4. **Web resources** — `mannerly.com/account/delete`, `/help`, `/privacy`,
   `/terms`.
5. **App Store / Play foundations** — Data Safety & App Privacy disclosures,
   subscription products, reviewer demo accounts.

_Business setup in the plan (D-U-N-S, developer org accounts, banking/tax,
store enrolment) is operational work outside this codebase and is tracked
separately._
