-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).

create table if not exists vehicles (
  id bigint generated always as identity primary key,
  featured boolean not null default false,
  featured_order integer,
  name text not null,
  meta text not null,
  year text not null,
  km text not null,
  fuel text not null,
  gearbox text not null,
  price text not null,
  tag text not null default 'Nouveauté',
  status text not null default 'Disponible',
  image text not null,
  gallery jsonb not null default '[]',
  description text,
  details jsonb not null default '[]',
  equipment jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table vehicles enable row level security;

-- Anyone (the public website) can read listings.
create policy "Public can read vehicles"
  on vehicles for select
  using (true);

-- No insert/update/delete policy is created for the anon role, so writes are only
-- possible via the service-role key (used server-side in the admin API route),
-- which bypasses RLS entirely.
