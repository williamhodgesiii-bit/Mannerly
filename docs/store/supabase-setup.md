# Accounts backend — Supabase setup

Mannerly accounts run on **Supabase Auth** when it's configured, and on an
on-device stand-in when it isn't (so the app always runs). This wires up the
real thing. Time: ~10 minutes. Scope: **accounts only** — sign up, sign in,
sessions, password reset, account deletion. Learning progress still lives
on-device for now and plugs into the same sync seam next.

## 1. Create the project

1. Go to <https://supabase.com> → **New project**. Pick a name and a strong
   database password; choose the region closest to your users.
2. When it finishes provisioning, open **Settings → API** and copy:
   - **Project URL**
   - **anon public** key (this is a client key — Row Level Security protects data)

## 2. Point the app at it

Copy `.env.example` to `.env` in the project root and fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Restart `npm run dev`. That's the switch — with these set, the app uses real
Supabase; blank, it uses the offline stand-in. (`.env` is git-ignored; never
commit real keys.)

## 3. Create the tables

Open **SQL Editor → New query**, paste all of [`supabase/schema.sql`](../../supabase/schema.sql),
and **Run**. This creates the `profiles` table, locks it with RLS, auto-creates
a profile on sign-up, and adds the `delete_account()` function the app calls
when a user deletes their account.

## 4. Turn off email confirmation for dev (optional)

**Authentication → Providers → Email** → turn **Confirm email** off while
developing, so new sign-ups get a session immediately. Turn it back on for
production (and set your **Site URL** + **Redirect URLs** under
**Authentication → URL Configuration** so email links and Google/Apple returns
land back in the app).

## 5. Seed the dev / sample accounts

All four share the password **`Mannerly-Dev-2026`**:

| Email | Type | What you'll see |
|---|---|---|
| `solo@mannerly.app` | Individual | Manners+ active, some progress + streak |
| `family@mannerly.app` | Family (parent) | Household with two child profiles |
| `teacher@mannerly.app` | Teacher | A class with a join code |
| `student@mannerly.app` | Student | Joined to a class |

**Recommended — the seeder script** (immune to Supabase auth-schema quirks):

1. Grab your **service_role** key: Settings → API → `service_role` **secret**.
   It's a secret — keep it in your shell only, never commit it.
2. From the project root:

   ```bash
   npm install                                    # if you haven't
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key npm run seed:users
   ```

   It prints `✓ created …` for each account and is safe to re-run (it updates).

**Alternative — SQL:** SQL Editor → New query → paste
[`supabase/seed.sql`](../../supabase/seed.sql) → Run. It deletes any existing dev
users first, so it's also re-runnable.

> **"The dev accounts won't let me log in."** Almost always one of two things:
> (a) email confirmation is still on — do step 4; or (b) an earlier hand-seed left
> the users in a broken state — re-run the **seeder script** above, which repairs
> them. The account's sample data (Manners+, children, class code) is applied by
> the app on sign-in.

## 6. Google / Apple (optional)

**Authentication → Providers** → enable **Google** and/or **Apple** and paste
their OAuth client credentials. The app's "Continue with Google/Apple" buttons
already call `signInWithOAuth`; no code change needed.

## What's real vs. next

- **Real now:** email/password accounts, sessions across devices, password
  reset, OAuth redirect, self-service account deletion, per-account identity.
- **Next (same seam):** syncing learning progress + entitlements to the account
  so a fresh device restores everything — implement `pull`/`push` against
  Supabase in `src/lib/sync.ts`; no UI changes required.
