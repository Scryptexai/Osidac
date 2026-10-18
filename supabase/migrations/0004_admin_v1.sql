-- Fase 1 admin v1: review flags, operational feature switches, and read-only audit summaries.
-- Admin/owner membership is assigned only by a trusted project owner in Supabase SQL.

create table public.user_review_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  flagged_by uuid not null references auth.users (id) on delete restrict,
  reason text not null check (char_length(trim(reason)) between 5 and 500),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_by uuid references auth.users (id) on delete set null,
  resolved_at timestamptz
);
create index idx_user_review_flags_open on public.user_review_flags (status, created_at desc);
create index idx_user_review_flags_user on public.user_review_flags (user_id, created_at desc);

create table public.feature_flags (
  key text primary key check (key ~ '^[a-z][a-z0-9_]{1,63}$'),
  enabled boolean not null default false,
  description text not null,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.user_review_flags enable row level security;
alter table public.feature_flags enable row level security;
revoke all on public.user_review_flags from public, anon, authenticated;
revoke all on public.feature_flags from public, anon, authenticated;

insert into public.feature_flags (key, enabled, description) values
  ('daily_missions', true, 'Daily check-in and verified referral mission claims'),
  ('store_claims', true, 'Virtual store revenue claim action'),
  ('store_upgrades', true, 'Virtual store upgrade action')
on conflict (key) do nothing;

-- Daily missions return their switch state to the app and keep rewards server-controlled.
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
  v_enabled boolean := true;
begin
  if v_user_id is null then
    raise exception 'forbidden';
  end if;

  v_day_start := v_day::timestamp at time zone 'UTC';
  v_day_end := (v_day + 1)::timestamp at time zone 'UTC';
  select enabled into v_enabled from public.feature_flags where key = 'daily_missions';
  v_enabled := coalesce(v_enabled, true);

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
    'enabled', v_enabled,
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
  v_enabled boolean := true;
begin
  if v_user_id is null then
    raise exception 'forbidden';
  end if;

  select enabled into v_enabled from public.feature_flags where key = 'daily_missions';
  if not coalesce(v_enabled, true) then
    raise exception 'feature_disabled:daily_missions';
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

-- Enforce kill switches in the database so clients cannot bypass them.
create or replace function public.enforce_economy_feature_flags()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_enabled boolean;
begin
  if tg_table_name = 'claim_events' then
    v_key := 'store_claims';
  elsif tg_table_name = 'ledger_entries' and new.reference_type = 'store_upgrade' then
    v_key := 'store_upgrades';
  else
    return new;
  end if;

  select enabled into v_enabled from public.feature_flags where key = v_key;
  if not coalesce(v_enabled, true) then
    raise exception 'feature_disabled:%', v_key;
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_economy_feature_flags() from public, anon, authenticated;
drop trigger if exists trg_store_claims_feature_flag on public.claim_events;
create trigger trg_store_claims_feature_flag
  before insert on public.claim_events
  for each row execute function public.enforce_economy_feature_flags();
drop trigger if exists trg_store_upgrades_feature_flag on public.ledger_entries;
create trigger trg_store_upgrades_feature_flag
  before insert on public.ledger_entries
  for each row execute function public.enforce_economy_feature_flags();

create or replace function public.admin_get_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_day date := (now() at time zone 'UTC')::date;
  v_day_start timestamptz;
  v_day_end timestamptz;
begin
  if v_actor is null or not exists (
    select 1 from public.user_roles
    where user_id = v_actor and role in ('admin', 'owner')
  ) then
    raise exception 'admin_only';
  end if;

  v_day_start := v_day::timestamp at time zone 'UTC';
  v_day_end := (v_day + 1)::timestamp at time zone 'UTC';

  return jsonb_build_object(
    'metrics', jsonb_build_object(
      'users', (select count(*) from public.profiles),
      'claims_today', (
        select count(*) from public.claim_events
        where created_at >= v_day_start and created_at < v_day_end
      ),
      'coins_today', (
        select coalesce(sum(amount), 0) from public.claim_events
        where created_at >= v_day_start and created_at < v_day_end
      ),
      'open_flags', (
        select count(*) from public.user_review_flags where status = 'open'
      )
    ),
    'recent_users', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id,
        'username', p.username,
        'display_name', p.display_name,
        'email', au.email,
        'country', p.country,
        'rank', p.rank,
        'package_tier', p.package_tier,
        'coins', coalesce(w.balance, 0),
        'open_flags', coalesce(f.open_flags, 0),
        'created_at', p.created_at
      ) order by p.created_at desc), '[]'::jsonb)
      from (
        select * from public.profiles order by created_at desc limit 25
      ) p
      left join auth.users au on au.id = p.id
      left join public.wallets w on w.user_id = p.id and w.currency = 'KOIN'
      left join (
        select user_id, count(*) as open_flags
        from public.user_review_flags where status = 'open' group by user_id
      ) f on f.user_id = p.id
    ),
    'recent_claims', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', c.id,
        'user_id', c.user_id,
        'username', coalesce(p.username, 'unknown'),
        'amount', c.amount,
        'created_at', c.created_at
      ) order by c.created_at desc), '[]'::jsonb)
      from (
        select id, user_id, amount, created_at
        from public.claim_events order by created_at desc limit 25
      ) c
      left join public.profiles p on p.id = c.user_id
    ),
    'open_review_flags', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', f.id,
        'user_id', f.user_id,
        'username', coalesce(p.username, 'unknown'),
        'reason', f.reason,
        'created_at', f.created_at
      ) order by f.created_at desc), '[]'::jsonb)
      from (
        select id, user_id, reason, created_at
        from public.user_review_flags where status = 'open'
        order by created_at desc limit 25
      ) f
      left join public.profiles p on p.id = f.user_id
    ),
    'feature_flags', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'key', key,
        'enabled', enabled,
        'description', description,
        'updated_at', updated_at
      ) order by key), '[]'::jsonb)
      from public.feature_flags
    )
  );
end;
$$;

create or replace function public.admin_flag_user(p_user_id uuid, p_reason text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_flag_id uuid;
begin
  if v_actor is null or not exists (
    select 1 from public.user_roles
    where user_id = v_actor and role in ('admin', 'owner')
  ) then
    raise exception 'admin_only';
  end if;
  if p_user_id is null or not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'user_not_found';
  end if;
  if char_length(trim(coalesce(p_reason, ''))) not between 5 and 500 then
    raise exception 'invalid_reason';
  end if;

  insert into public.user_review_flags (user_id, flagged_by, reason)
  values (p_user_id, v_actor, trim(p_reason))
  returning id into v_flag_id;

  insert into public.audit_log (actor_id, action, entity, entity_id, after)
  values (
    v_actor,
    'user_flagged_for_review',
    'profiles',
    p_user_id::text,
    jsonb_build_object('flag_id', v_flag_id, 'reason', trim(p_reason))
  );

  return v_flag_id;
end;
$$;

create or replace function public.admin_resolve_user_flag(p_flag_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_user_id uuid;
  v_reason text;
begin
  if v_actor is null or not exists (
    select 1 from public.user_roles
    where user_id = v_actor and role in ('admin', 'owner')
  ) then
    raise exception 'admin_only';
  end if;

  update public.user_review_flags
  set status = 'resolved', resolved_by = v_actor, resolved_at = now()
  where id = p_flag_id and status = 'open'
  returning user_id, reason into v_user_id, v_reason;

  if v_user_id is null then
    raise exception 'flag_not_found';
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, before, after)
  values (
    v_actor,
    'user_review_flag_resolved',
    'profiles',
    v_user_id::text,
    jsonb_build_object('flag_id', p_flag_id, 'status', 'open', 'reason', v_reason),
    jsonb_build_object('flag_id', p_flag_id, 'status', 'resolved')
  );

  return v_user_id;
end;
$$;

create or replace function public.admin_set_feature_flag(p_key text, p_enabled boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_before boolean;
  v_description text;
begin
  if v_actor is null or not exists (
    select 1 from public.user_roles
    where user_id = v_actor and role in ('admin', 'owner')
  ) then
    raise exception 'admin_only';
  end if;
  if p_enabled is null then
    raise exception 'invalid_feature_flag';
  end if;

  select enabled, description into v_before, v_description
  from public.feature_flags where key = p_key for update;
  if not found then
    raise exception 'feature_flag_not_found';
  end if;

  update public.feature_flags
  set enabled = p_enabled, updated_by = v_actor, updated_at = now()
  where key = p_key;

  insert into public.audit_log (actor_id, action, entity, entity_id, before, after)
  values (
    v_actor,
    'feature_flag_updated',
    'feature_flags',
    p_key,
    jsonb_build_object('enabled', v_before),
    jsonb_build_object('enabled', p_enabled, 'description', v_description)
  );

  return jsonb_build_object('key', p_key, 'enabled', p_enabled, 'description', v_description);
end;
$$;

revoke all on function public.admin_get_overview() from public, anon;
revoke all on function public.admin_flag_user(uuid, text) from public, anon;
revoke all on function public.admin_resolve_user_flag(uuid) from public, anon;
revoke all on function public.admin_set_feature_flag(text, boolean) from public, anon;
grant execute on function public.admin_get_overview() to authenticated;
grant execute on function public.admin_flag_user(uuid, text) to authenticated;
grant execute on function public.admin_resolve_user_flag(uuid) to authenticated;
grant execute on function public.admin_set_feature_flag(text, boolean) to authenticated;
