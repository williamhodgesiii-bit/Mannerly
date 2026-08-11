# Reviewer notes (App Store & Play)

Give store reviewers a clear path through gated functionality. Paste the relevant
parts into App Store Connect ("App Review Information" → notes) and Play Console
("App access" → provide demo credentials).

## Demo / dev accounts

Sign in from **Me → Sign in / Create account**, or during onboarding. One login
per account type; all share the same password.

**Password:** `Mannerly-Dev-2026`

| Email | Type | What it shows |
|-------|------|---------------|
| `solo@mannerly.app` | Individual | Manners+ active, progress + streak |
| `family@mannerly.app` | Family (parent) | Household with two child profiles + learner switcher |
| `teacher@mannerly.app` | Teacher | A class with a join code |
| `student@mannerly.app` | Student | Joined to a class |

> Seeded in `src/state/account.ts` (`DEV_ACCOUNTS`) so offline/review builds work
> without a backend. For a real Supabase project, run `supabase/seed.sql` to create
> the same logins (see `docs/store/supabase-setup.md`). Rotate or remove standing
> credentials before production.

## How to reach each feature

- **Free lesson (no account):** Onboarding → pick an age → pick a home region →
  "Maybe later" → the Learn path. Tap the START node.
- **First-lesson-free preview:** Explore → any locked country → open the first lesson.
- **Paid content unlocked:** sign in as `solo@mannerly.app` → Explore → open
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
