create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
  document_number text not null,
  phone text,
  email text,
  address text,
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_status_check check (status in ('active', 'inactive'))
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  case_number text not null,
  action_type text not null,
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
  updated_at timestamptz not null default now(),
  constraint cases_claim_value_non_negative check (claim_value_cents >= 0),
  constraint cases_status_check check (
    status in (
      'in_review',
      'in_progress',
      'waiting_hearing',
      'sentence',
      'execution',
      'agreement',
      'archived',
      'closed'
    )
  )
);

create table if not exists public.legal_fees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  contract_name text not null,
  total_value_cents integer not null default 0,
  entry_value_cents integer not null default 0,
  installments_count integer not null default 1,
  installment_value_cents integer not null default 0,
  first_due_date date,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint legal_fees_values_non_negative check (
    total_value_cents >= 0
    and entry_value_cents >= 0
    and installment_value_cents >= 0
  ),
  constraint legal_fees_installments_count_positive check (installments_count > 0),
  constraint legal_fees_status_check check (
    status in ('pending', 'paid', 'overdue', 'cancelled')
  )
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
  updated_at timestamptz not null default now(),
  constraint fee_installments_number_non_negative check (installment_number >= 0),
  constraint fee_installments_value_non_negative check (value_cents >= 0),
  constraint fee_installments_status_check check (
    status in ('pending', 'paid', 'overdue', 'cancelled')
  )
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
  updated_at timestamptz not null default now(),
  constraint condemnations_values_non_negative check (
    original_value_cents >= 0
    and updated_value_cents >= 0
    and interest_cents >= 0
    and fine_cents >= 0
  ),
  constraint condemnations_status_check check (
    status in ('open', 'installment', 'paid', 'execution')
  )
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
  updated_at timestamptz not null default now(),
  constraint condemnation_payments_value_positive check (value_cents > 0)
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
  due_day integer not null,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint debt_installments_values_non_negative check (
    total_value_cents >= 0
    and entry_value_cents >= 0
    and installment_value_cents >= 0
  ),
  constraint debt_installments_count_positive check (installments_count > 0),
  constraint debt_installments_due_day_check check (due_day between 1 and 31),
  constraint debt_installments_status_check check (
    status in ('active', 'paid', 'overdue', 'cancelled')
  )
);

create table if not exists public.debt_installment_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  debt_installment_id uuid not null references public.debt_installments(id) on delete cascade,
  installment_number integer not null,
  value_cents integer not null default 0,
  due_date date not null,
  paid_at date,
  receipt_name text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint debt_installment_payments_number_non_negative check (installment_number >= 0),
  constraint debt_installment_payments_value_non_negative check (value_cents >= 0),
  constraint debt_installment_payments_status_check check (
    status in ('pending', 'paid', 'overdue')
  )
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
  updated_at timestamptz not null default now(),
  constraint monthly_bills_value_non_negative check (value_cents >= 0),
  constraint monthly_bills_status_check check (status in ('pending', 'paid', 'overdue')),
  constraint monthly_bills_category_check check (
    category in (
      'office',
      'personal',
      'employee',
      'system',
      'marketing',
      'court_costs',
      'taxes',
      'card',
      'other'
    )
  )
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null,
  type text not null,
  linked_entity_label text not null,
  client_id uuid references public.clients(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  legal_fee_id uuid references public.legal_fees(id) on delete cascade,
  condemnation_id uuid references public.condemnations(id) on delete cascade,
  debt_installment_id uuid references public.debt_installments(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_size_non_negative check (size_bytes is null or size_bytes >= 0),
  constraint documents_module_check check (
    module in ('client', 'case', 'legal_fee', 'condemnation', 'debt_installment')
  ),
  constraint documents_type_check check (
    type in (
      'contract',
      'power_of_attorney',
      'identity',
      'payment_receipt',
      'petition',
      'sentence',
      'agreement',
      'other'
    )
  )
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  entity_label text,
  action text not null,
  actor text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists clients_user_id_idx on public.clients(user_id);
create index if not exists clients_user_status_idx on public.clients(user_id, status);
create unique index if not exists clients_user_document_unique_idx
  on public.clients(user_id, document_number);

create index if not exists cases_user_id_idx on public.cases(user_id);
create index if not exists cases_client_id_idx on public.cases(client_id);
create index if not exists cases_user_status_idx on public.cases(user_id, status);
create unique index if not exists cases_user_case_number_unique_idx
  on public.cases(user_id, case_number);

create index if not exists legal_fees_user_id_idx on public.legal_fees(user_id);
create index if not exists legal_fees_client_id_idx on public.legal_fees(client_id);
create index if not exists legal_fees_case_id_idx on public.legal_fees(case_id);
create index if not exists fee_installments_legal_fee_id_idx
  on public.fee_installments(legal_fee_id);
create index if not exists fee_installments_user_due_status_idx
  on public.fee_installments(user_id, due_date, status);

create index if not exists condemnations_user_id_idx on public.condemnations(user_id);
create index if not exists condemnations_case_id_idx on public.condemnations(case_id);
create index if not exists condemnation_payments_condemnation_id_idx
  on public.condemnation_payments(condemnation_id);

create index if not exists debt_installments_user_id_idx on public.debt_installments(user_id);
create index if not exists debt_installments_client_id_idx on public.debt_installments(client_id);
create index if not exists debt_installment_payments_plan_id_idx
  on public.debt_installment_payments(debt_installment_id);
create index if not exists debt_installment_payments_user_due_status_idx
  on public.debt_installment_payments(user_id, due_date, status);

create index if not exists monthly_bills_user_due_status_idx
  on public.monthly_bills(user_id, due_date, status);
create index if not exists monthly_bills_user_category_idx
  on public.monthly_bills(user_id, category);

create index if not exists documents_user_module_idx on public.documents(user_id, module);
create index if not exists documents_client_id_idx on public.documents(client_id);
create index if not exists documents_case_id_idx on public.documents(case_id);

create index if not exists activity_logs_user_created_idx
  on public.activity_logs(user_id, created_at desc);

do $$
declare
  table_name text;
  trigger_name text;
begin
  foreach table_name in array array[
    'users',
    'clients',
    'cases',
    'legal_fees',
    'fee_installments',
    'condemnations',
    'condemnation_payments',
    'debt_installments',
    'debt_installment_payments',
    'monthly_bills',
    'documents'
  ]
  loop
    trigger_name := 'set_' || table_name || '_updated_at';

    execute format(
      'drop trigger if exists %I on public.%I',
      trigger_name,
      table_name
    );
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      trigger_name,
      table_name
    );
  end loop;
end;
$$;

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.cases enable row level security;
alter table public.legal_fees enable row level security;
alter table public.fee_installments enable row level security;
alter table public.condemnations enable row level security;
alter table public.condemnation_payments enable row level security;
alter table public.debt_installments enable row level security;
alter table public.debt_installment_payments enable row level security;
alter table public.monthly_bills enable row level security;
alter table public.documents enable row level security;
alter table public.activity_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'users_manage_own_profile'
  ) then
    create policy users_manage_own_profile on public.users
      for all using (auth.uid() = id) with check (auth.uid() = id);
  end if;
end;
$$;

do $$
declare
  target_table text;
  policy_name text;
begin
  foreach target_table in array array[
    'clients',
    'cases',
    'legal_fees',
    'fee_installments',
    'condemnations',
    'condemnation_payments',
    'debt_installments',
    'debt_installment_payments',
    'monthly_bills',
    'documents'
  ]
  loop
    policy_name := target_table || '_manage_own_rows';

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = target_table
        and policyname = policy_name
    ) then
      execute format(
        'create policy %I on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
        policy_name,
        target_table
      );
    end if;
  end loop;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'activity_logs' and policyname = 'activity_logs_read_own_rows'
  ) then
    create policy activity_logs_read_own_rows on public.activity_logs
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'activity_logs' and policyname = 'activity_logs_create_own_rows'
  ) then
    create policy activity_logs_create_own_rows on public.activity_logs
      for insert with check (auth.uid() = user_id);
  end if;
end;
$$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'legal-documents',
  'legal-documents',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'legal_documents_read_own_folder'
  ) then
    create policy legal_documents_read_own_folder on storage.objects
      for select using (
        bucket_id = 'legal-documents'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'legal_documents_insert_own_folder'
  ) then
    create policy legal_documents_insert_own_folder on storage.objects
      for insert with check (
        bucket_id = 'legal-documents'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'legal_documents_update_own_folder'
  ) then
    create policy legal_documents_update_own_folder on storage.objects
      for update using (
        bucket_id = 'legal-documents'
        and auth.uid()::text = (storage.foldername(name))[1]
      ) with check (
        bucket_id = 'legal-documents'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'legal_documents_delete_own_folder'
  ) then
    create policy legal_documents_delete_own_folder on storage.objects
      for delete using (
        bucket_id = 'legal-documents'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;
end;
$$;
