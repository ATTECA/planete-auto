-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).
-- Enables Realtime on the "leads" table, so the admin space auto-refreshes
-- when a new message/reprise/offer/essai comes in or its status changes,
-- without the admin reloading.
--
-- Realtime enforces the same RLS as a normal select, and the browser-side
-- subscription runs as the logged-in admin (the "authenticated" role, via
-- Supabase Auth) — not the public anon key. Since the only people who can log
-- in are admins (no public signup), it's safe to let any authenticated user
-- read leads.

create policy "Authenticated admins can read leads"
  on leads for select
  to authenticated
  using (true);

alter publication supabase_realtime add table leads;
