-- Mindleaf Phase 1 schema: profiles, day logs and highlights.
-- Every table has row-level security so each person can only read and write their own rows.
-- Run once in Supabase → SQL Editor (or `supabase db push`).

-- Profiles --------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  goals text[] not null default '{}',
  reading_time text not null default 'morning' check (reading_time in ('morning', 'noon', 'night')),
  minutes smallint not null default 10 check (minutes in (5, 10, 15)),
  current_plan text not null default 'atomic' check (char_length(current_plan) <= 40),
  reading_mode text not null default 'app' check (reading_mode in ('app', 'own')),
  reminders boolean not null default true,
  plus_waitlist boolean not null default false,
  clubs_waitlist boolean not null default false,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_max_three check (cardinality(goals) <= 3)
);

-- Create a profile automatically when someone signs up (email code or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Day logs: one row per finished day of a plan -------------------------------
create table if not exists public.day_logs (
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null check (char_length(plan_id) <= 40),
  day smallint not null check (day between 1 and 60),
  completed_on date not null,
  actions jsonb not null default '{}'::jsonb,
  reflection text check (char_length(reflection) <= 4000),
  created_at timestamptz not null default now(),
  primary key (user_id, plan_id, day)
);
create index if not exists day_logs_user_date on public.day_logs (user_id, completed_on desc);

-- Highlights saved while reading ------------------------------------------------
create table if not exists public.highlights (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null check (char_length(plan_id) <= 40),
  day smallint not null check (day between 1 and 60),
  text text not null check (char_length(text) between 1 and 1000),
  created_at timestamptz not null default now(),
  unique (user_id, plan_id, day, text)
);
create index if not exists highlights_user on public.highlights (user_id, created_at desc);

-- Row-level security ---------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.day_logs enable row level security;
alter table public.highlights enable row level security;

drop policy if exists "own profile: read" on public.profiles;
drop policy if exists "own profile: update" on public.profiles;
create policy "own profile: read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "own profile: update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "own logs: read" on public.day_logs;
drop policy if exists "own logs: write" on public.day_logs;
drop policy if exists "own logs: update" on public.day_logs;
create policy "own logs: read" on public.day_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "own logs: write" on public.day_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own logs: update" on public.day_logs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "own highlights: read" on public.highlights;
drop policy if exists "own highlights: write" on public.highlights;
drop policy if exists "own highlights: delete" on public.highlights;
create policy "own highlights: read" on public.highlights for select to authenticated using ((select auth.uid()) = user_id);
create policy "own highlights: write" on public.highlights for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own highlights: delete" on public.highlights for delete to authenticated using ((select auth.uid()) = user_id);
