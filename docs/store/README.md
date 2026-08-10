# Store submission pack

Working documents for getting Mannerly into the Apple App Store and Google Play.
Keep these in sync with what the app actually collects and sells — the store
disclosures must match the code.

Bracketed `[…]` items are business details to fill in before submission.

## Contents

- **[app-store-privacy.md](./app-store-privacy.md)** — Apple App Privacy ("nutrition label") answers.
- **[play-data-safety.md](./play-data-safety.md)** — Google Play Data safety form answers.
- **[subscriptions.md](./subscriptions.md)** — product catalogue and how each maps to entitlement permissions.
- **[reviewer-notes.md](./reviewer-notes.md)** — demo accounts and how to reach gated features.

## What the app collects today (source of truth for the disclosures)

Derived from the code (`src/state/account.ts`, `src/state/store.ts`,
`src/state/entitlements.ts`, `src/lib/sync.ts`):

| Data | Purpose | Linked to user | Tracking |
|------|---------|----------------|----------|
| Email, display name, hashed password (or Google/Apple id) | Account, sign-in | Yes | No |
| Age band, home region, language | Tailor lessons | Yes | No |
| Progress (XP, streak, completed, stamps) | Provide the service, sync | Yes | No |
| Entitlements + storefront source, purchase reference | Grant access, reconcile receipts | Yes | No |
| Household / classroom links | Family & school features | Yes | No |
| Device type, app version, diagnostics | Reliability, crash fixes | Yes | No |
| Support messages, content reports | Support, content review | Yes | No |

Not collected: precise or coarse location, contacts, photos/media, microphone,
biometrics, browsing history, advertising identifiers. No third-party ads SDKs.
No sale or "sharing" (CCPA/CPRA) of personal data. No behavioural advertising to
anyone, and none to children.

## Pre-submission checklist

- [ ] Replace all `[bracketed]` items in the legal pages and these docs (entity, addresses, DPO, effective dates, jurisdiction).
- [ ] Legal review of Privacy Policy and Terms, with special attention to COPPA, GDPR/UK Children's Code, CCPA/CPRA, and FERPA (schools).
- [ ] Backend live: real auth (server-side password hashing, Google/Apple OAuth), and the sync backend wired in `src/lib/sync.ts` so accounts sync across devices.
- [ ] Account deletion reachable in-app (Me → Settings → Delete account) and on the public web (`mannerly.com/account/delete`).
- [ ] Public URLs live: `/help`, `/privacy`, `/terms`, `/account/delete`, and a support email.
- [ ] Subscription products created in App Store Connect and Play Console; tax/banking agreements signed.
- [ ] Apple: decide Kids Category vs. all-ages positioning; complete App Privacy; set age rating.
- [ ] Google: complete Data safety; set target audience (includes children ⇒ Families policy); add privacy policy URL.
- [ ] Reviewer demo accounts seeded and documented (see reviewer-notes.md).
- [ ] Crash/operational monitoring in place with child-privacy limits.
