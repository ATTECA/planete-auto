-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).
-- Stores the public URLs of photos attached to a "reprise" (sell/trade-in) form
-- submission, so the admin space can display them (they were only emailed before).

alter table leads
  add column if not exists photos jsonb not null default '[]';
