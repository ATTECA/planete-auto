-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).
-- Stores a copy of every contact / offer / reprise form submission so the
-- admin space can list them under "Prospects", in addition to the email
-- notification already sent for each one.

create table if not exists leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  type text not null, -- 'contact' | 'offer' | 'reprise'
  status text not null default 'Nouveau', -- 'Nouveau' | 'Traité'
  name text not null,
  email text,
  phone text,
  vehicle_id bigint references vehicles(id) on delete set null,
  vehicle_name text,
  offer_amount text,
  message text,
  details jsonb not null default '{}'
);

alter table leads enable row level security;

-- No select/insert/update/delete policy is created for the anon role, so all
-- access is via the service-role key (used server-side in the API routes and
-- the admin space), which bypasses RLS entirely.
