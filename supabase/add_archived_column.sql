-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).
-- Adds the "archived" flag used by the admin space to hide vehicles from the
-- public site without deleting them.

alter table vehicles
  add column if not exists archived boolean not null default false;
