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

## ✅ Accounts — real Supabase auth (with offline fallback)

> Plan: "create an account on one device, sign in on another, see the same profile."

- **`src/lib/supabase.ts`** — the Supabase client. Real accounts turn on when
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set (`.env`); with them blank the
  app uses the on-device stand-in, so every flow still runs offline.
- **`src/state/account.ts`** — async auth that branches on config: **Supabase**
  (sign up / sign in / sessions / password reset / OAuth / self-service deletion) or the
  local stand-in. Session is restored on launch (`initAuth`).
- **`supabase/schema.sql`** — `profiles` table + Row Level Security + a sign-up trigger
  + a `delete_account()` RPC. **`supabase/seed.sql`** — the four dev logins.
- **`docs/store/supabase-setup.md`** — ~10-minute setup: create project → add keys →
  run schema → seed accounts.
- **Dev / sample accounts**, one per path (password `Mannerly-Dev-2026`):
  `solo@` (individual, Manners+), `family@` (parent + two kids),
  `teacher@` (class + join code), `student@` (joined class).

> Scope is **accounts only** for now. Learning progress still stores per-account on the
> device and syncs through the same `SyncBackend` seam (`src/lib/sync.ts`) next — one
> `pull`/`push` implementation against Supabase, no UI changes.

## ✅ Brand visual system — de-emoji'd chrome

The app's chrome no longer reads as a tray of stock emoji.

- **`src/components/Icon.tsx`** — a hand-built brand icon set (nav, stats, gamify,
  account types, goals, notify/accessibility) on a 24×24 grid, inheriting brand colour.
- **`src/components/Avatar.tsx`** + `src/data/avatars.ts` — avatars are now coloured
  "sticker" glyphs (star, rocket, sprout, compass…), not animal emoji. No photos.
- Wired through the tab bar, header stats, level + plan badges, Home path, Explore /
  Course locks, Profile, Passport, Lesson feedback, and the whole onboarding flow.
- **Kept as content:** country flags and per-lesson scene marks.

## ✅ Uniform app height

`.app-frame` is pinned to the viewport (`100dvh` with a `100vh` fallback) with internal
scrolling, and onboarding now renders inside the same shell as every other screen (a
route + redirect, not a separate mount) — so the frame is the same height everywhere and
tall steps scroll instead of running off-page.

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

1. **Stand up the Supabase project** (create it, add keys, run `supabase/schema.sql`
   + `supabase/seed.sql`, enable Google/Apple) per `docs/store/supabase-setup.md` —
   accounts are wired; this activates them. Then extend the seam to **sync learning
   progress + household/classroom rosters** across devices (`src/lib/sync.ts`).
2. **Verifiable parental consent (COPPA)** and the **UK Children's Code age-assurance**
   flow for under-age-of-digital-consent children — the onboarding model flags where these
   gates belong; the verification itself is a backend + policy build.
3. **Server-controlled feature flags.**
4. **Complete the legal `[…]` items** and get counsel sign-off.
5. **Create store products** (App Store Connect / Play Console) and sign tax/banking agreements.
6. **Business/ops** from the plan: D-U-N-S, developer org accounts — outside the codebase.
