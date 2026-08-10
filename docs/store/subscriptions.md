# Subscription & purchase catalogue

Keep the catalogue simple. Every purchase maps onto an internal entitlement
permission (see `src/lib/entitlements.ts`); the storefront processes payment, the
Mannerly backend decides access.

## Products

| Product | Type | Indicative price | Stores | Grants permission |
|---------|------|------------------|--------|-------------------|
| Mannerly+ Monthly | Auto-renewable subscription | $6.99 / month | Apple, Google, Web | `MANNERLY_PLUS` |
| Mannerly+ Annual | Auto-renewable subscription | $49.99–$59.99 / year | Apple, Google, Web | `MANNERLY_PLUS` |
| Mannerly Family Annual | Auto-renewable subscription | $79.99 / year | Apple, Google, Web | `FAMILY` |
| Travel Pack (per country) | One-time (non-consumable) | $9.99 | Apple, Google, Web | `<CC>_TRAVEL_PACK` (e.g. `JP_TRAVEL_PACK`) |
| School / District licence | Institutional (invoice/web) | Custom | Mannerly web (not consumer IAP) | `SCHOOL_LICENSE` |

Free tier (no purchase): `GLOBAL_CORE` + `HOME_REGION_<CC>` for the learner's home
region, plus the first lesson of every pack as a preview.

## Proposed identifiers

- Bundle / package: `com.mannerly.app`
- Subscription group (Apple): `Mannerly Membership`
  - `com.mannerly.app.plus.monthly`
  - `com.mannerly.app.plus.annual`
  - `com.mannerly.app.family.annual`
- Travel Packs (non-consumable): `com.mannerly.app.travelpack.<cc>` (e.g. `.jp`, `.kr`, `.ae`, `.in`, `.mx`, `.br`, `.us`, `.gb`)

Use the same identifiers across Apple and Google where each console allows, so the
backend can map receipts to permissions with one table.

## Receipt → entitlement flow

1. Store completes the transaction and returns a receipt / purchase token.
2. Backend validates it with Apple / Google (or the web processor).
3. Backend records an entitlement in the ledger with its `source`
   (`apple` · `google` · `amazon` · `web` · `promo` · `school`) and a purchase reference.
4. The client reads permissions and unlocks content — never a raw `premium` flag.

This lets Apple, Google, web, promo codes, complimentary access, and school licences
all grant the same internal permissions. Restoring purchases re-syncs the ledger from
store receipts.

## Rules to respect

- Native apps use each store's billing for digital content; the web uses the web processor.
- Auto-renew, cancellation, and refund behaviour follow each store's policy plus
  non-waivable local consumer rights.
- Do not sell subscriptions to children without the applicable parental controls;
  keep purchase flows behind a parental gate in child-directed contexts.
