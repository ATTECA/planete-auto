-- Run this once in the Supabase project's SQL editor (Database > SQL Editor).
-- Enables Realtime (Postgres change notifications over websocket) on the
-- "vehicles" table, so the site can auto-refresh open pages when a car is
-- added, modified, archived or deleted, without the visitor reloading.

alter publication supabase_realtime add table vehicles;
