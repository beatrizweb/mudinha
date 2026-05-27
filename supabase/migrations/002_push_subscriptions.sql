-- ════════════════════════════════════════════════════════════════
-- MUDINHA — Migration 002: push subscriptions
-- ════════════════════════════════════════════════════════════════
-- Como rodar:
--   1) Abre https://supabase.com/dashboard/project/kxoyowqpsdsxkhbybrrl/sql/new
--   2) Cola este arquivo inteiro
--   3) Clica em "Run"
-- ════════════════════════════════════════════════════════════════

create table public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now()
);

create index push_subscriptions_user_idx on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "push_select_own" on public.push_subscriptions
  for select using (auth.uid() = user_id);

create policy "push_insert_own" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);

create policy "push_delete_own" on public.push_subscriptions
  for delete using (auth.uid() = user_id);
