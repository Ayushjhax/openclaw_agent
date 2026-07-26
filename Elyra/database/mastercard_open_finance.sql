-- Mastercard Open Finance schema for Elyra.
-- Identifiers are encrypted by the application before they are written here.

create table if not exists mastercard_customers (
  id uuid primary key default gen_random_uuid(),
  app_user_id text not null unique,
  customer_id_encrypted text not null,
  customer_id_hash text not null unique,
  username text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists linked_accounts (
  id uuid primary key default gen_random_uuid(),
  app_user_id text not null,
  customer_id_hash text not null references mastercard_customers(customer_id_hash) on delete cascade,
  account_id_encrypted text not null,
  account_id_hash text not null,
  institution_id_encrypted text,
  institution_id_hash text,
  name text not null,
  type text not null,
  status text not null,
  currency text not null default 'USD',
  mask text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (app_user_id, account_id_hash)
);

create index if not exists linked_accounts_app_user_id_idx
  on linked_accounts(app_user_id);

create table if not exists account_balances (
  id uuid primary key default gen_random_uuid(),
  app_user_id text not null,
  account_id_hash text not null,
  current_balance numeric(18, 2) not null,
  available_balance numeric(18, 2),
  currency text not null default 'USD',
  as_of timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (app_user_id, account_id_hash)
);

create index if not exists account_balances_app_user_id_idx
  on account_balances(app_user_id);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  app_user_id text not null,
  account_id_hash text not null,
  transaction_id_hash text not null,
  amount numeric(18, 2) not null,
  description text not null,
  normalized_payee text,
  posted_at timestamptz not null,
  transacted_at timestamptz,
  category text not null default 'Uncategorized',
  type text not null check (type in ('credit', 'debit', 'unknown')),
  status text not null default 'posted',
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  unique (app_user_id, transaction_id_hash)
);

create index if not exists transactions_app_user_posted_idx
  on transactions(app_user_id, posted_at desc);

create index if not exists transactions_account_id_hash_idx
  on transactions(account_id_hash);

create table if not exists mastercard_audit_logs (
  id uuid primary key default gen_random_uuid(),
  app_user_id text,
  action text not null,
  status text not null check (status in ('success', 'failure', 'info')),
  detail text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mastercard_audit_logs_app_user_created_idx
  on mastercard_audit_logs(app_user_id, created_at desc);

