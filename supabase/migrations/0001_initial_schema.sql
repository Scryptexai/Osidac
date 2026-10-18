-- OSIDAC — initial schema draft (Fase 0)
-- Design docs: docs/02-BRAINSTORM-ARSITEKTUR.md §4
-- Principles: double-entry ledger, referral closure table, RLS everywhere.

-- ============================================================
-- 1. PROFILES & ROLES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 24),
  display_name text,
  avatar_url text,
  country char(2) default 'ID',
  locale text default 'en' check (locale in ('en', 'id')),
  referral_code text unique not null,
  sponsor_id uuid references public.profiles (id),
  rank text not null default 'starter' check (rank in ('starter','builder','leader','director')),
  kyc_status text not null default 'none' check (kyc_status in ('none','pending','verified','rejected')),
  package_tier text check (package_tier in ('starter','kios','gold','elite','master')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('member','support','admin','owner')),
  granted_at timestamptz not null default now()
);

-- ============================================================
-- 2. REFERRAL TREE (materialized path + closure table)
-- ============================================================
create table public.referral_closure (
  ancestor_id uuid not null references public.profiles (id) on delete cascade,
  descendant_id uuid not null references public.profiles (id) on delete cascade,
  depth int not null check (depth >= 0),
  primary key (ancestor_id, descendant_id)
);
create index idx_referral_closure_descendant on public.referral_closure (descendant_id, depth);

-- ============================================================
-- 3. WALLETS & LEDGER (double entry — append only)
-- ============================================================
create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  currency text not null check (currency in ('KOIN','IDR','USD')),
  balance numeric(20,2) not null default 0 check (balance >= 0),
  unique (user_id, currency)
);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets (id),
  user_id uuid not null references public.profiles (id),
  amount numeric(20,2) not null, -- signed
  currency text not null check (currency in ('KOIN','IDR','USD')),
  reference_type text not null check (reference_type in (
    'claim_omzet','mission_reward','playtime_reward','ad_reward','package_purchase',
    'commission','fast_start','rank_bonus','withdrawal','bonus','penalty','clawback','adjustment','store_upgrade'
  )),
  reference_id uuid,
  memo text,
  created_at timestamptz not null default now()
);
create index idx_ledger_user on public.ledger_entries (user_id, created_at desc);

-- Prevent mutation of ledger (audit integrity)
create or replace function public.prevent_ledger_mutation() returns trigger
language plpgsql as $$
begin
  raise exception 'ledger_entries is append-only';
end $$;
create trigger trg_ledger_append_only
  before update or delete on public.ledger_entries
  for each row execute function public.prevent_ledger_mutation();

-- ============================================================
-- 4. VIRTUAL STORE (game loop)
-- ============================================================
create table public.virtual_stores (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  level int not null default 1 check (level between 1 and 10),
  speed_multiplier numeric(4,2) not null default 1.0,
  capacity numeric(20,2) not null default 1000,
  skin text not null default 'default',
  last_claim_at timestamptz,
  last_claim_date date,
  streak_days int not null default 0,
  league text not null default 'bronze' check (league in ('bronze','silver','gold','platinum','diamond')),
  created_at timestamptz not null default now()
);

create table public.claim_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(20,2) not null check (amount >= 0),
  rate_snapshot numeric(10,6) not null,
  created_at timestamptz not null default now()
);
create index idx_claim_events_user on public.claim_events (user_id, created_at desc);

-- ============================================================
-- 5. PACKAGES & ORDERS
-- ============================================================
create table public.packages (
  tier text primary key check (tier in ('starter','kios','gold','elite','master')),
  name_en text not null,
  name_id text not null,
  price_usd numeric(10,2) not null,
  price_idr numeric(12,0) not null,
  store_level int not null,
  mission_multiplier numeric(4,2) not null,
  voucher_value_usd numeric(10,2) not null default 0,
  active boolean not null default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  package_tier text not null references public.packages (tier),
  amount numeric(12,2) not null,
  currency text not null check (currency in ('IDR','USD')),
  payment_provider text, -- 'midtrans' | 'xendit' | 'paddle' | ...
  payment_ref text unique,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_orders_user on public.orders (user_id, created_at desc);

-- ============================================================
-- 6. MISSIONS (offerwall / playtime postbacks)
-- ============================================================
create table public.mission_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  network text not null, -- 'adgem' | 'revu' | 'torox' | 'adjoe' | ...
  external_id text not null,
  payout_gross numeric(12,4) not null, -- from advertiser, USD
  payout_user numeric(12,4) not null,  -- credited to user
  status text not null default 'pending' check (status in ('pending','verified','reversed')),
  created_at timestamptz not null default now(),
  unique (network, external_id)
);
create index idx_mission_user on public.mission_completions (user_id, created_at desc);

-- ============================================================
-- 7. COMPENSATION
-- ============================================================
create table public.comp_plan_rules (
  id uuid primary key default gen_random_uuid(),
  version int not null unique,
  package_commission jsonb not null,      -- {"l1": 8, "l2": 3, "l3": 1}
  mission_margin_share jsonb not null,    -- {"l1": 5, "l2": 2, "l3": 1}
  fast_start_pct numeric(5,2) not null default 5,
  payout_cap_pct numeric(5,2) not null default 40,
  holding_days int not null default 14,
  effective_from timestamptz not null default now(),
  active boolean not null default true
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  source_type text not null check (source_type in ('package','mission_share','fast_start','rank_bonus')),
  source_id uuid not null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null check (currency in ('IDR','USD','KOIN')),
  level int check (level between 1 and 3),
  status text not null default 'pending' check (status in ('pending','payable','paid','cancelled')),
  payable_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_commissions_user on public.commissions (user_id, status);

-- ============================================================
-- 8. WITHDRAWALS
-- ============================================================
create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null check (currency in ('IDR','USD')),
  method text not null check (method in ('dana','gopay','ovo','paypal','bank_transfer')),
  destination text not null,
  status text not null default 'pending' check (status in ('pending','approved','processing','paid','rejected')),
  provider_ref text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index idx_withdrawals_user on public.withdrawals (user_id, created_at desc);

-- ============================================================
-- 9. ECONOMY CONTROLS ("rem tangan")
-- ============================================================
create table public.reward_pool_daily (
  day date primary key,
  revenue_total numeric(12,2) not null default 0,
  distribution_budget numeric(12,2) not null default 0,
  claim_budget numeric(12,2) not null default 0,
  dynamic_rate numeric(10,6) not null default 0,
  distributed numeric(12,2) not null default 0
);

create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 10. RLS — enable on every table; policies added in next migration
-- ============================================================
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.referral_closure enable row level security;
alter table public.wallets enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.virtual_stores enable row level security;
alter table public.claim_events enable row level security;
alter table public.packages enable row level security;
alter table public.orders enable row level security;
alter table public.mission_completions enable row level security;
alter table public.comp_plan_rules enable row level security;
alter table public.commissions enable row level security;
alter table public.withdrawals enable row level security;
alter table public.reward_pool_daily enable row level security;
alter table public.settings enable row level security;
alter table public.audit_log enable row level security;
