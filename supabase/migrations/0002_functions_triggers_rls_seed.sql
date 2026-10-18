-- 0002 — functions, triggers, RLS policies, seeds
-- (Applied to Supabase project osidac 2026-10-17 via migration "functions_triggers_rls_seed")

-- ============ ONBOARDING TRIGGER ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referral_code text;
  v_username text;
  v_sponsor_id uuid;
  v_ancestor record;
begin
  v_username := coalesce(nullif(split_part(new.email, '@', 1), ''), 'user') || '_' || substr(new.id::text, 1, 4);
  if length(v_username) < 3 then
    v_username := 'user_' || substr(new.id::text, 1, 8);
  end if;
  v_referral_code := upper(substr(new.id::text, 1, 8));

  select id into v_sponsor_id from public.profiles
   where referral_code = upper(new.raw_user_meta_data->>'referral_code')
   limit 1;

  insert into public.profiles (id, username, display_name, referral_code, sponsor_id, locale)
  values (new.id, v_username, split_part(coalesce(new.email,'user'), '@', 1), v_referral_code, v_sponsor_id,
          coalesce(new.raw_user_meta_data->>'locale', 'en'));

  insert into public.wallets (user_id, currency) values
    (new.id, 'KOIN'), (new.id, 'IDR'), (new.id, 'USD');

  insert into public.virtual_stores (user_id) values (new.id);

  insert into public.referral_closure (ancestor_id, descendant_id, depth)
  values (new.id, new.id, 0);

  if v_sponsor_id is not null then
    for v_ancestor in
      select ancestor_id, depth from public.referral_closure where descendant_id = v_sponsor_id
    loop
      insert into public.referral_closure (ancestor_id, descendant_id, depth)
      values (v_ancestor.ancestor_id, new.id, v_ancestor.depth + 1)
      on conflict do nothing;
    end loop;
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id)
  values (new.id, 'user_created', 'auth.users', new.id::text);

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ CLAIM OMZET TOKO ============
create or replace function public.claim_store_omzet(p_user_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  store record;
  claim_interval_hours int := 8;
  base_rate numeric := 50;
  streak int;
  streak_mult numeric;
  league_mult numeric := 1;
  amount numeric;
  wl_id uuid;
  claim_id uuid;
  next_at timestamptz;
begin
  if auth.uid() is not null then
    uid := auth.uid();
    if p_user_id is not null and p_user_id <> uid then raise exception 'forbidden'; end if;
  else
    if current_user not in ('postgres','service_role') or p_user_id is null then raise exception 'forbidden'; end if;
    uid := p_user_id;
  end if;

  select * into store from public.virtual_stores where user_id = uid for update;
  if not found then raise exception 'store_not_found'; end if;

  if store.last_claim_at is not null and now() < store.last_claim_at + make_interval(hours => claim_interval_hours) then
    next_at := store.last_claim_at + make_interval(hours => claim_interval_hours);
    raise exception 'claim_not_ready:%', to_char(next_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
  end if;

  if store.last_claim_date = current_date then
    streak := store.streak_days;
  elsif store.last_claim_date = current_date - 1 then
    streak := store.streak_days + 1;
  else
    streak := 1;
  end if;
  if streak < 1 then streak := 1; end if;

  streak_mult := 1 + least(streak - 1, 30) * 0.02;
  case store.league
    when 'silver' then league_mult := 1.1;
    when 'gold' then league_mult := 1.2;
    when 'platinum' then league_mult := 1.3;
    when 'diamond' then league_mult := 1.5;
    else league_mult := 1;
  end case;

  amount := round(base_rate * store.level * store.speed_multiplier * streak_mult * league_mult, 2);
  next_at := now() + make_interval(hours => claim_interval_hours);

  insert into public.claim_events (user_id, amount, rate_snapshot)
  values (uid, amount, base_rate) returning id into claim_id;

  update public.virtual_stores
     set last_claim_at = now(), last_claim_date = current_date, streak_days = streak
   where user_id = uid;

  select id into wl_id from public.wallets where user_id = uid and currency = 'KOIN';
  update public.wallets set balance = balance + amount where id = wl_id;
  insert into public.ledger_entries (wallet_id, user_id, amount, currency, reference_type, reference_id, memo)
  values (wl_id, uid, amount, 'KOIN', 'claim_omzet', claim_id, 'Store revenue claim');

  return jsonb_build_object(
    'amount', amount,
    'streak', streak,
    'next_claim_at', to_char(next_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'balance', (select balance from public.wallets where id = wl_id)
  );
end $$;

-- ============ UPGRADE TOKO ============
create or replace function public.upgrade_store(p_user_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  store record;
  cost numeric;
  wl_id uuid;
  bal numeric;
begin
  if auth.uid() is not null then
    uid := auth.uid();
    if p_user_id is not null and p_user_id <> uid then raise exception 'forbidden'; end if;
  else
    if current_user not in ('postgres','service_role') or p_user_id is null then raise exception 'forbidden'; end if;
    uid := p_user_id;
  end if;

  select * into store from public.virtual_stores where user_id = uid for update;
  if not found then raise exception 'store_not_found'; end if;
  if store.level >= 10 then raise exception 'max_level'; end if;

  cost := round(500 * power(store.level, 1.6), 2);
  select id, balance into wl_id, bal from public.wallets where user_id = uid and currency = 'KOIN' for update;
  if bal < cost then raise exception 'insufficient_coins:%', cost; end if;

  update public.wallets set balance = balance - cost where id = wl_id;
  insert into public.ledger_entries (wallet_id, user_id, amount, currency, reference_type, memo)
  values (wl_id, uid, -cost, 'KOIN', 'store_upgrade', 'Store upgrade to level ' || (store.level + 1));

  update public.virtual_stores
     set level = level + 1,
         capacity = 500 * (level + 1) * speed_multiplier
   where user_id = uid;

  return jsonb_build_object(
    'level', store.level + 1,
    'cost', cost,
    'balance', bal - cost
  );
end $$;

-- ============ GRANTS ============
revoke all on function public.claim_store_omzet(uuid) from public, anon;
revoke all on function public.upgrade_store(uuid) from public, anon;
grant execute on function public.claim_store_omzet(uuid) to authenticated, service_role;
grant execute on function public.upgrade_store(uuid) to authenticated, service_role;

-- ============ RLS POLICIES ============
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists wallets_select_own on public.wallets;
create policy wallets_select_own on public.wallets for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists ledger_select_own on public.ledger_entries;
create policy ledger_select_own on public.ledger_entries for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists stores_select_own on public.virtual_stores;
create policy stores_select_own on public.virtual_stores for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists claims_select_own on public.claim_events;
create policy claims_select_own on public.claim_events for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists closure_select_tree on public.referral_closure;
create policy closure_select_tree on public.referral_closure for select to authenticated
  using ((select auth.uid()) = ancestor_id or (select auth.uid()) = descendant_id);

drop policy if exists packages_select_all on public.packages;
create policy packages_select_all on public.packages for select to authenticated using (active = true);

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists commissions_select_own on public.commissions;
create policy commissions_select_own on public.commissions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists withdrawals_select_own on public.withdrawals;
create policy withdrawals_select_own on public.withdrawals for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists settings_select_all on public.settings;
create policy settings_select_all on public.settings for select to authenticated using (true);

-- ============ SEEDS ============
insert into public.settings (key, value) values
  ('economy', '{"claim_interval_hours": 8, "base_rate": 50, "max_level": 10, "upgrade_cost_fn": "500 * level^1.6"}'::jsonb)
on conflict (key) do nothing;

insert into public.comp_plan_rules (version, package_commission, mission_margin_share, fast_start_pct, payout_cap_pct, holding_days)
values (1, '{"l1": 8, "l2": 3, "l3": 1}', '{"l1": 5, "l2": 2, "l3": 1}', 5, 40, 14)
on conflict (version) do nothing;

insert into public.packages (tier, name_en, name_id, price_usd, price_idr, store_level, mission_multiplier, voucher_value_usd) values
  ('starter','Starter Booth','Starter Booth',3.49,49000,2,1.2,2.50),
  ('kios','Kios Pro','Kios Pro',9.99,149000,4,1.4,7.50),
  ('gold','Warung Gold','Warung Gold',34.99,499000,6,1.6,25.00),
  ('elite','Franchise Elite','Franchise Elite',99.99,1490000,8,1.8,50.00),
  ('master','Empire Master','Empire Master',349.99,4900000,10,2.0,150.00)
on conflict (tier) do nothing;
