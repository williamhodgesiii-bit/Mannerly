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

## ✅ Onboarding & Profile System (`To Do for Bill 2`)

Rebuilt onboarding as a **conversational, one-question-per-screen flow** — each screen
answers a single question, with a themed progress rail (the two Mannerly characters
converging) instead of "Step 2 of 9". Uses only the existing palette and components.

**Four entry paths** — "How will you use Mannerly?":

- **For myself** — age → home region → *Passport stamp* (Global Core + Home Region) →
  language → learning goals → **interactive starter scenario** (age-varied, with
  feedback) → Daily Manner opt-in → accessibility → account → "You're ready" → first lesson.
- **For my family** — household region/language → **add child profiles** (name, age,
  avatar; no email for kids) → Family Passport → account. Children are real learner
  profiles with independent progress; a **"Who's learning?" switcher** on the profile
  swaps the active learner.
- **I'm a teacher** — quick classroom setup → **generated join code** (`MANNER-####`).
- **I'm a student** — enter class code → pick avatar → straight into a lesson.

Supporting model:

- **`src/types.ts`** — `AccountType`, `LanguageCode`, `GoalId`, `Avatar`, `ChildProfile`,
  `Classroom`, `NotifyPref`, `A11yPrefs`. The **Account** (auth/billing) and **Learner
  Profile** (age, region, language, goals, progress) are separated per the plan.
- **`src/state/profiles.ts`** — household children, classroom, joined class, and
  learner-switching through the same sync vault (`learner_<id>`).
- Data: `src/data/languages.ts`, `goals.ts`, `avatars.ts`, `scenarios.ts`.
- **Accessibility** choices (larger text, reduced motion, higher contrast) and the
  **language** setting apply live and persist per profile.
- Free-tier promise shown up front: **"Global Manners + one Home Region"** — no later paywall.

Verified: `tsc` + build clean; headless browser run of **all four paths → first
lesson/home**, demo sign-in, and family learner-switching — **zero console errors**.

> ⚠️ Teacher/student classrooms and cross-device household sync are **local stand-ins**:
> real rosters, class SSO, and shared-device sync are backend features that plug into the
> same `SyncBackend` seam (`src/lib/sync.ts`). COPPA verifiable parental consent and the
> UK Children's Code age-assurance flow are **noted in the model but must be implemented
> with the backend** before collecting data from children under the age of digital consent.

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

1. **Provision the backend** (accounts DB, server-side auth, Google/Apple OAuth,
   household + classroom rosters) and wire it into `src/lib/sync.ts` for real
   cross-device / shared-device sync.
2. **Verifiable parental consent (COPPA)** and the **UK Children's Code age-assurance**
   flow for under-age-of-digital-consent children — the onboarding model flags where these
   gates belong; the verification itself is a backend + policy build.
3. **Server-controlled feature flags.**
4. **Complete the legal `[…]` items** and get counsel sign-off.
5. **Create store products** (App Store Connect / Play Console) and sign tax/banking agreements.
6. **Business/ops** from the plan: D-U-N-S, developer org accounts — outside the codebase.
