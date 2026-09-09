// One-off migration: pushes the existing data/vehicles.json rows into Supabase.
// Run with: node scripts/seed-vehicles.mjs
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

const vehicles = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'vehicles.json'), 'utf8'))

const rows = vehicles.map((vehicle) => ({
  featured: vehicle.featured ?? false,
  featured_order: vehicle.featuredOrder ?? null,
  name: vehicle.name,
  meta: vehicle.meta,
  year: vehicle.year,
  km: vehicle.km,
  fuel: vehicle.fuel,
  gearbox: vehicle.gearbox,
  price: vehicle.price,
  tag: vehicle.tag,
  status: vehicle.status,
  image: vehicle.image,
  gallery: vehicle.gallery ?? [],
  description: vehicle.description ?? null,
  details: vehicle.details ?? [],
  equipment: vehicle.equipment ?? [],
}))

const { data, error } = await supabase.from('vehicles').insert(rows).select('id, name')

if (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
}

console.log(`Inserted ${data.length} vehicles:`)
for (const row of data) console.log(`  #${row.id} — ${row.name}`)
