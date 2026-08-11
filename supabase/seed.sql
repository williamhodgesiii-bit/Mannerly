-- ============================================================
-- Mannerly — dev / sample accounts (Supabase)
--
-- Creates one ready-to-use login per account type. Run AFTER schema.sql.
-- Idempotent: it deletes any existing dev users first, so you can re-run it.
--
-- ⚠️ If sign-in still fails after this, use the Admin-API seeder instead —
-- it's immune to auth-schema differences between Supabase versions:
--     SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-users.mjs
--
--     Password:  Mannerly-Dev-2026
--     solo@mannerly.app    → individual
--     family@mannerly.app  → family (parent)
--     teacher@mannerly.app → teacher
--     student@mannerly.app → student
-- ============================================================

-- Clean slate (cascades to auth.identities + public.profiles).
delete from auth.users where email in (
  'solo@mannerly.app', 'family@mannerly.app', 'teacher@mannerly.app', 'student@mannerly.app'
);

do $$
declare
  r record;
  uid uuid;
  accounts jsonb := '[
    {"email":"solo@mannerly.app",    "name":"Alex Rivera","role":"learner","type":"individual"},
    {"email":"family@mannerly.app",  "name":"Jordan Lee", "role":"parent", "type":"family"},
    {"email":"teacher@mannerly.app", "name":"Ms. Carter", "role":"teacher","type":"teacher"},
    {"email":"student@mannerly.app", "name":"Sam",        "role":"student","type":"student"}
  ]';
begin
  for r in select * from jsonb_array_elements(accounts) as a(v)
  loop
    uid := gen_random_uuid();

    -- The empty-string token columns matter: GoTrue's login fails if these
    -- are NULL, which is the usual reason a hand-seeded account "won't log in".
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change,
      email_change_token_new, email_change_token_current, reauthentication_token
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      r.v ->> 'email', crypt('Mannerly-Dev-2026', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'display_name', r.v ->> 'name',
        'role', r.v ->> 'role',
        'account_type', r.v ->> 'type',
        'onboarded', true
      ),
      '', '', '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', r.v ->> 'email', 'email_verified', true),
      'email', now(), now(), now()
    );
  end loop;
end $$;
