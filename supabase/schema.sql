-- ════════════════════════════════════════════════════════════════
-- MUDINHA — Schema MVP A (hábitos + checkins)
-- ════════════════════════════════════════════════════════════════
-- Como rodar:
--   1) Abre https://supabase.com/dashboard/project/kxoyowqpsdsxkhbybrrl/sql/new
--   2) Cola este arquivo inteiro
--   3) Clica em "Run" (canto superior direito)
--   4) Confirma a execução
-- ════════════════════════════════════════════════════════════════


-- ────────────────────────────────────────────────────────
-- 1) TABELA: habits (hábitos do usuário)
-- ────────────────────────────────────────────────────────
create table public.habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,

  -- Identidade do hábito
  name         text not null,
  icon         text not null default '🌱',
  species      text not null default 'costela-de-adao',

  -- Frequência
  -- "daily"  = todo dia
  -- "custom" = só nos dias listados em days_of_week
  frequency    text not null default 'daily',
  days_of_week integer[] not null default array[0,1,2,3,4,5,6], -- 0=domingo, 6=sábado

  -- Lembrete opcional
  reminder_time time,

  -- Estado do hábito
  paused       boolean not null default false,
  archived     boolean not null default false,   -- "arrancado" / soft delete

  -- Auditoria
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Índice pra buscar rápido os hábitos ativos de um usuário
create index habits_user_id_active_idx
  on public.habits(user_id)
  where archived = false;


-- ────────────────────────────────────────────────────────
-- 2) TABELA: checkins (cada vez que o usuário "regou")
-- ────────────────────────────────────────────────────────
create table public.checkins (
  id           uuid primary key default gen_random_uuid(),
  habit_id     uuid not null references public.habits(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  date         date not null default current_date,
  created_at   timestamptz not null default now(),

  -- Não pode haver 2 checkins do mesmo hábito no mesmo dia
  unique (habit_id, date)
);

-- Índices pra cálculo rápido de streak
create index checkins_habit_date_idx on public.checkins(habit_id, date desc);
create index checkins_user_date_idx  on public.checkins(user_id, date desc);


-- ────────────────────────────────────────────────────────
-- 3) ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────
-- Sem RLS, qualquer usuário logado veria/modificaria hábitos
-- de qualquer outro usuário. Com RLS, cada um só vê o seu.

alter table public.habits   enable row level security;
alter table public.checkins enable row level security;

-- ▸ HÁBITOS: usuário só vê/edita os seus
create policy "habits_select_own" on public.habits
  for select using (auth.uid() = user_id);

create policy "habits_insert_own" on public.habits
  for insert with check (auth.uid() = user_id);

create policy "habits_update_own" on public.habits
  for update using (auth.uid() = user_id)
              with check (auth.uid() = user_id);

create policy "habits_delete_own" on public.habits
  for delete using (auth.uid() = user_id);

-- ▸ CHECKINS: usuário só vê/edita os seus
create policy "checkins_select_own" on public.checkins
  for select using (auth.uid() = user_id);

create policy "checkins_insert_own" on public.checkins
  for insert with check (auth.uid() = user_id);

create policy "checkins_update_own" on public.checkins
  for update using (auth.uid() = user_id)
              with check (auth.uid() = user_id);

create policy "checkins_delete_own" on public.checkins
  for delete using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────
-- 4) TRIGGER: atualiza updated_at automaticamente
-- ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger habits_set_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();
