# Mannerly — Launch Roadmap Progress

Tracks work against **`To Do for Bill`** (the distribution / store / web launch plan).

## ✅ Central Entitlement System

Replaced the single `course.free` gating boolean with a real entitlement layer.

- **`src/lib/entitlements.ts`** — internal permissions (`GLOBAL_CORE`,
  `MANNERLY_PLUS`, `FAMILY`, `SCHOOL_LICENSE`, `HOME_REGION_<CC>`,
  `<CC>_TRAVEL_PACK`), the storefront **source** of each grant, and pure resolvers.
- **`src/state/entitlements.ts`** — a persisted entitlement **ledger**.
- Gating in `Explore` / `CourseDetail` asks the entitlement layer.
- Free tier = **Global Core + Home Region + first lesson of every pack**.

## ✅ Accounts + cross-device sync foundation

> Plan: "create an account on one device, sign in on another, see the same profile."

- **`src/state/account.ts`** — email/password + **Continue with Google/Apple**
  sign-in, per-account data (progress + entitlements swap on sign-in/out), and
  account deletion.
- **`src/lib/sync.ts`** — a per-account snapshot **vault** behind a `SyncBackend`
  interface (`pull` / `push` / `remove`). Local today; **point `backend` at the real
  service (Supabase / REST) to get true cross-device sync — no caller changes.**
- **`src/screens/Auth.tsx`** — on-brand sign in / create account at `/account`.
- App pushes the live snapshot through the sync seam on every change.

> ⚠️ Password + OAuth here are a **local development stand-in** so flows are testable
> without a server. Real auth (server-side hashing, Google/Apple OAuth, sessions) and
> the sync backend must be provisioned before cross-device works in production.

## ✅ Onboarding — home region

Onboarding now asks age → **home region** → account (create / sign in / continue as
guest). Home region unlocks that country's pack on the free tier.

## ✅ Legal / web resources (store requirements)

Public pages, reachable without signing in:

- `/privacy` — Privacy Policy (COPPA, GDPR + UK Children's Code, CCPA/CPRA, FERPA, transfers, rights).
- `/terms` — Terms of Service (subscriptions, billing, disputes).
- `/help` — Help & Support centre.
- `/account/delete` — account & data deletion (in-app + the web resource Google requires).

> Legal copy is a **pre-launch draft**: bracketed `[…]` items (entity, addresses, DPO,
> jurisdiction, effective dates) must be completed and the text reviewed by counsel
> before publishing or submitting.

## ✅ Store submission pack — `docs/store/`

- `app-store-privacy.md` — Apple App Privacy answers.
- `play-data-safety.md` — Google Data Safety answers.
- `subscriptions.md` — product catalogue mapped to entitlement permissions.
- `reviewer-notes.md` — seeded demo accounts + how to reach gated features.
- `README.md` — data-collection source of truth + submission checklist.

## ▶️ Still to do (needs infrastructure / business action)

1. **Provision the backend** (accounts DB, server-side auth, Google/Apple OAuth) and
   wire it into `src/lib/sync.ts` for real cross-device sync.
2. **Server-controlled feature flags.**
3. **Complete the legal `[…]` items** and get counsel sign-off.
4. **Create store products** (App Store Connect / Play Console) and sign tax/banking agreements.
5. **Business/ops** from the plan: D-U-N-S, developer org accounts — outside the codebase.
