-- Fase 1 daily missions: fixed, auditable internal-coin rewards.
-- Day boundaries use UTC; all rewards are non-cash OSID Coins in this MVP.

create table public.daily_mission_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mission_key text not null check (mission_key in ('check_in', 'invite_friend')),
  mission_day date not null,
  reward numeric(20,2) not null check (reward > 0),
  created_at timestamptz not null default now(),
  unique (user_id, mission_key, mission_day)
);

create index idx_daily_mission_user_day
  on public.daily_mission_claims (user_id, mission_day desc);

alter table public.daily_mission_claims enable row level security;
revoke all on public.daily_mission_claims from public, anon, authenticated;

create or replace function public.get_daily_mission_status()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_day date := (now() at time zone 'UTC')::date;
  v_day_start timestamptz;
  v_day_end timestamptz;
  v_check_in_claimed boolean := false;
  v_invite_claimed boolean := false;
  v_invite_available boolean := false;
  v_store_claimed boolean := false;
  v_balance numeric(20,2) := 0;
begin
  if v_user_id is null then
    raise exception 'forbidden';
  end if;

  v_day_start := v_day::timestamp at time zone 'UTC';
  v_day_end := (v_day + 1)::timestamp at time zone 'UTC';

  select exists (
    select 1 from public.daily_mission_claims
    where user_id = v_user_id and mission_key = 'check_in' and mission_day = v_day
  ) into v_check_in_claimed;

  select exists (
    select 1 from public.daily_mission_claims
    where user_id = v_user_id and mission_key = 'invite_friend' and mission_day = v_day
  ) into v_invite_claimed;

  select exists (
    select 1 from public.profiles
    where sponsor_id = v_user_id and created_at >= v_day_start and created_at < v_day_end
  ) into v_invite_available;

  select exists (
    select 1 from public.claim_events
    where user_id = v_user_id and created_at >= v_day_start and created_at < v_day_end
  ) into v_store_claimed;

  select balance into v_balance
  from public.wallets
  where user_id = v_user_id and currency = 'KOIN';

  return jsonb_build_object(
    'mission_day', v_day,
    'check_in_claimed', v_check_in_claimed,
    'invite_claimed', v_invite_claimed,
    'invite_available', v_invite_available,
    'store_claimed', v_store_claimed,
    'balance', coalesce(v_balance, 0)
  );
end;
$$;

create or replace function public.claim_daily_mission(p_mission_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_day date := (now() at time zone 'UTC')::date;
  v_day_start timestamptz;
  v_day_end timestamptz;
  v_reward numeric(20,2);
  v_wallet_id uuid;
  v_claim_id uuid;
  v_balance numeric(20,2);
  v_memo text;
begin
  if v_user_id is null then
    raise exception 'forbidden';
  end if;

  if p_mission_key is null or p_mission_key not in ('check_in', 'invite_friend') then
    raise exception 'invalid_mission';
  end if;

  v_day_start := v_day::timestamp at time zone 'UTC';
  v_day_end := (v_day + 1)::timestamp at time zone 'UTC';

  if p_mission_key = 'check_in' then
    v_reward := 25;
    v_memo := 'Daily check-in mission';
  else
    v_reward := 50;
    v_memo := 'New referral mission';
    if not exists (
      select 1 from public.profiles
      where sponsor_id = v_user_id and created_at >= v_day_start and created_at < v_day_end
    ) then
      raise exception 'mission_not_ready';
    end if;
  end if;

  select id into v_wallet_id
  from public.wallets
  where user_id = v_user_id and currency = 'KOIN'
  for update;

  if v_wallet_id is null then
    raise exception 'wallet_not_found';
  end if;

  insert into public.daily_mission_claims (user_id, mission_key, mission_day, reward)
  values (v_user_id, p_mission_key, v_day, v_reward)
  on conflict (user_id, mission_key, mission_day) do nothing
  returning id into v_claim_id;

  if v_claim_id is null then
    raise exception 'mission_already_claimed';
  end if;

  update public.wallets
  set balance = balance + v_reward
  where id = v_wallet_id
  returning balance into v_balance;

  insert into public.ledger_entries (
    wallet_id, user_id, amount, currency, reference_type, reference_id, memo
  ) values (
    v_wallet_id, v_user_id, v_reward, 'KOIN', 'bonus', v_claim_id, v_memo
  );

  return jsonb_build_object(
    'mission_key', p_mission_key,
    'mission_day', v_day,
    'reward', v_reward,
    'balance', v_balance
  );
end;
$$;

revoke all on function public.get_daily_mission_status() from public, anon;
revoke all on function public.claim_daily_mission(text) from public, anon;
grant execute on function public.get_daily_mission_status() to authenticated;
grant execute on function public.claim_daily_mission(text) to authenticated;
