-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).
-- Adds an "updated_at" column, auto-maintained by a trigger, used by the admin
-- dashboard's recent activity table to show which vehicles were touched last
-- (added, modified, or archived) and when.

alter table vehicles
  add column if not exists updated_at timestamptz not null default now();

create or replace function set_vehicles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists vehicles_set_updated_at on vehicles;

create trigger vehicles_set_updated_at
  before update on vehicles
  for each row
  execute function set_vehicles_updated_at();
