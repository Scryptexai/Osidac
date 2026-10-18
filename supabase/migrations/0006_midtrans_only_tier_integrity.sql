-- Enforce the owner's provider choice in the schema and keep package tiers
-- server-controlled so a future tier-mission gate cannot be bypassed by clients.

begin;

do $$
begin
  if exists (
    select 1 from public.orders
    where payment_provider is not null and payment_provider <> 'midtrans'
  ) then
    raise exception 'non-Midtrans order provider exists; review rows before applying provider lock';
  end if;
end;
$$;

alter table public.orders
  alter column payment_provider set default 'midtrans';

alter table public.orders drop constraint if exists orders_payment_provider_midtrans_only;
alter table public.orders
  add constraint orders_payment_provider_midtrans_only
  check (payment_provider is null or payment_provider = 'midtrans');

do $$
begin
  if exists (
    select 1 from public.withdrawals
    where method not in ('gopay', 'bank_transfer')
  ) then
    raise exception 'non-Midtrans payout channel exists; review rows before applying channel lock';
  end if;
end;
$$;

alter table public.withdrawals drop constraint if exists withdrawals_method_check;
alter table public.withdrawals
  add constraint withdrawals_method_midtrans_channels_only
  check (method in ('gopay', 'bank_transfer'));

alter table public.withdrawals
  add column if not exists payment_provider text;

update public.withdrawals
set payment_provider = 'midtrans'
where payment_provider is null;

do $$
begin
  if exists (
    select 1 from public.withdrawals
    where payment_provider <> 'midtrans'
  ) then
    raise exception 'non-Midtrans withdrawal provider exists; review rows before applying provider lock';
  end if;
end;
$$;

alter table public.withdrawals
  alter column payment_provider set default 'midtrans',
  alter column payment_provider set not null;

alter table public.withdrawals drop constraint if exists withdrawals_payment_provider_midtrans_only;
alter table public.withdrawals
  add constraint withdrawals_payment_provider_midtrans_only
  check (payment_provider = 'midtrans');

-- Prevent authenticated clients from changing the trust-bearing package tier.
-- Profile fields intended for member editing retain column-level UPDATE access.
revoke update on table public.profiles from public, anon, authenticated;
grant update (display_name, avatar_url, country, locale)
  on table public.profiles to authenticated;

commit;
