-- ============================================================
-- Mannerly — dev / sample accounts (Supabase)
--
-- Creates one ready-to-use login per account type. Run AFTER schema.sql,
-- in the Supabase SQL Editor. All four share the same password:
--
--     Password:  Mannerly-Dev-2026
--
--     solo@mannerly.app      → individual
--     family@mannerly.app    → family (parent)
--     teacher@mannerly.app   → teacher
--     student@mannerly.app   → student
--
-- These insert directly into auth.users with a bcrypt password and a
-- confirmed email, plus a matching auth.identities row so email/password
-- sign-in works. The profiles trigger fills public.profiles automatically.
--
-- Prefer clicking? Authentication → Users → "Add user" works too; then set
-- the user's metadata to match (display_name, role, account_type, onboarded).
-- ============================================================

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
    -- Skip if the email already exists.
    if exists (select 1 from auth.users where email = (r.v ->> 'email')) then
      continue;
    end if;

    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data
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
      )
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', r.v ->> 'email', 'email_verified', true),
      'email', now(), now(), now()
    );
  end loop;
end $$;
