-- ============================================================
-- Mannerly — Supabase schema (accounts)
--
-- Run this once in your Supabase project: SQL Editor → paste → Run.
-- It creates the account `profiles` table, locks it down with Row Level
-- Security, auto-creates a profile row on sign-up, and adds a function
-- so a user can delete their own account (App Store / Play requirement).
--
-- Scope is "just accounts" for now: identity + account type live here;
-- learning progress still syncs through the app's own vault seam.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'You',
  role         text not null default 'learner'
                 check (role in ('learner', 'parent', 'teacher', 'student')),
  account_type text not null default 'individual'
                 check (account_type in ('individual', 'family', 'teacher', 'student')),
  onboarded    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Each user can see and change only their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ---------- auto-create a profile on sign-up ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role, account_type, onboarded)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'learner'),
    coalesce(new.raw_user_meta_data ->> 'account_type', 'individual'),
    coalesce((new.raw_user_meta_data ->> 'onboarded')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- self-service account deletion ----------
-- The client calls: supabase.rpc('delete_account').
create or replace function public.delete_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_account() from public;
grant execute on function public.delete_account() to authenticated;
