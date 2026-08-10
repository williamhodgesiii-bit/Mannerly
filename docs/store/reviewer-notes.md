# Reviewer notes (App Store & Play)

Give store reviewers a clear path through gated functionality. Paste the relevant
parts into App Store Connect ("App Review Information" → notes) and Play Console
("App access" → provide demo credentials).

## Demo accounts

Sign in from **Me → Sign in / Create account**, or during onboarding. All demo
accounts use the same password.

**Password:** `Mannerly-Review-2026`

| Email | Role | Unlocks |
|-------|------|---------|
| `reviewer.plus@mannerly.com` | Adult, Manners+ | Every country pack, travel content |
| `reviewer.family@mannerly.com` | Parent, Family plan | Every country pack (family) |
| `reviewer.teacher@mannerly.com` | Teacher, School licence | Every country pack (school) |
| `reviewer.student@mannerly.com` | Student | School-licensed access |

> These are seeded in `src/state/account.ts` (`DEMO_ACCOUNTS`) so review builds work
> without a live backend. Remove or rotate them once real auth is in place — do not
> ship standing demo credentials to production unchanged.

## How to reach each feature

- **Free lesson (no account):** Onboarding → pick an age → pick a home region →
  "Maybe later" → the Learn path. Tap the START node.
- **First-lesson-free preview:** Explore → any locked country → open the first lesson.
- **Paid content unlocked:** sign in as `reviewer.plus@mannerly.com` → Explore → open
  any country pack fully.
- **Home region (free pack):** Me → Settings → Home region → pick a country; that
  pack unlocks at no cost.
- **Subscription upsell:** Me → the Manners+ card → "Try 7 days free" (writes an
  entitlement; in production this is a store purchase).
- **Account deletion:** Me → Settings → Delete account, or open `/#/account/delete`.
- **Legal / support pages:** `/#/help`, `/#/privacy`, `/#/terms`, `/#/account/delete`
  (reachable without signing in).

## Notes for the reviewer

- Mannerly serves children, teens, adults, families, and schools — it is not only a
  children's app. The screenshots and demo cover family and classroom use.
- No ads and no third-party ad SDKs.
- "Continue with Google/Apple" is wired to real OAuth in production; in review builds
  without the backend it uses a local stand-in, so prefer the email demo accounts above.
