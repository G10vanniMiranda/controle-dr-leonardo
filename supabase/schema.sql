create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  document_number text,
  phone text,
  email text,
  address text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  case_number text not null,
  action_type text,
  court text,
  district text,
  state text,
  opposing_party text,
  claim_value_cents integer not null default 0,
  status text not null default 'in_review',
  procedural_phase text,
  start_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_fees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  total_value_cents integer not null default 0,
  entry_value_cents integer not null default 0,
  installments_count integer not null default 1,
  installment_value_cents integer not null default 0,
  first_due_date date,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  legal_fee_id uuid not null references public.legal_fees(id) on delete cascade,
  installment_number integer not null,
  value_cents integer not null default 0,
  due_date date not null,
  paid_at date,
  payment_method text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.condemnations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references public.cases(id) on delete cascade,
  debtor_party text not null,
  creditor_party text not null,
  original_value_cents integer not null default 0,
  updated_value_cents integer not null default 0,
  interest_cents integer not null default 0,
  fine_cents integer not null default 0,
  decision_date date,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.condemnation_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  condemnation_id uuid not null references public.condemnations(id) on delete cascade,
  value_cents integer not null default 0,
  paid_at date not null,
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.debt_installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  description text not null,
  total_value_cents integer not null default 0,
  entry_value_cents integer not null default 0,
  installments_count integer not null default 1,
  installment_value_cents integer not null default 0,
  due_day integer,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.monthly_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  category text not null,
  value_cents integer not null default 0,
  due_date date not null,
  paid_at date,
  status text not null default 'pending',
  recurring boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  legal_fee_id uuid references public.legal_fees(id) on delete cascade,
  condemnation_id uuid references public.condemnations(id) on delete cascade,
  debt_installment_id uuid references public.debt_installments(id) on delete cascade,
  type text not null,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.cases enable row level security;
alter table public.legal_fees enable row level security;
alter table public.fee_installments enable row level security;
alter table public.condemnations enable row level security;
alter table public.condemnation_payments enable row level security;
alter table public.debt_installments enable row level security;
alter table public.monthly_bills enable row level security;
alter table public.documents enable row level security;
alter table public.activity_logs enable row level security;

create policy "Users can manage own profile" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can manage own clients" on public.clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own cases" on public.cases
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own legal fees" on public.legal_fees
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own fee installments" on public.fee_installments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own condemnations" on public.condemnations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own condemnation payments" on public.condemnation_payments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own debt installments" on public.debt_installments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own monthly bills" on public.monthly_bills
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can read own activity logs" on public.activity_logs
  for select using (auth.uid() = user_id);

create policy "Users can create own activity logs" on public.activity_logs
  for insert with check (auth.uid() = user_id);
