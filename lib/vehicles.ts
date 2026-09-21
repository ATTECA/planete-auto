import { supabase } from '@/lib/supabase'

export type EquipmentGroup = {
  category: string
  items: string[]
}

export type Vehicle = {
  id: number
  featured?: boolean
  featuredOrder?: number
  name: string
  meta: string
  year: string
  km: string
  fuel: string
  gearbox: string
  price: string
  tag: string
  status: string
  image: string
  gallery: string[]
  description?: string
  details: [string, string][]
  equipment?: EquipmentGroup[]
  archived: boolean
  createdAt: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Descriptive, SEO-friendly URL segment for a vehicle, e.g. "16-bmw-x5-e70-3-0-v6-tdi-245ch". */
export function vehicleSlug(vehicle: Pick<Vehicle, 'id' | 'name' | 'meta'>): string {
  const slug = slugify(`${vehicle.name} ${vehicle.meta}`)
  return slug ? `${vehicle.id}-${slug}` : String(vehicle.id)
}

/** Extracts the numeric id from a `[id]` route param, which may be a bare id or a full slug. */
export function parseVehicleIdParam(param: string): string | null {
  const match = param.match(/^(\d+)/)
  return match ? match[1] : null
}

const FACT_GROUPS: { title: string; labels: string[] }[] = [
  { title: 'Identité', labels: ['Marque', 'Modèle', 'Finition', 'Version', 'Type de véhicule'] },
  { title: 'Année & kilométrage', labels: ['Année modèle', 'Date de 1ère mise en circulation', 'Kilométrage'] },
  { title: 'Moteur & performances', labels: ['Énergie', 'Boîte de vitesse', 'Puissance DIN', 'Puissance fiscale', "Crit'Air", 'CO2'] },
  { title: 'Confort & dimensions', labels: ['Nombre de portes', 'Nombre de places', 'Couleur', 'Couleur intérieur', 'Longueur'] },
]

/** Common detail labels, for autocompletion in the admin form. */
export const COMMON_DETAIL_LABELS = FACT_GROUPS.flatMap((group) => group.labels)

/** Common equipment groups & items, for autocompletion in the admin form. */
export const COMMON_EQUIPMENT_GROUPS: { category: string; items: string[] }[] = [
  { category: 'Audio - Télécommunications', items: ['Kit mains-libres Bluetooth', 'GPS Cartographique', 'Prise USB'] },
  { category: 'Conduite', items: ['Régulateur de vitesse', 'Palettes changement vitesses au volant'] },
  { category: 'Extérieur', items: ['Jantes Alu', 'Rétroviseurs électriques', 'Feux de jour à LED'] },
  { category: 'Intérieur', items: ['Clim automatique bi-zones', 'Volant cuir', 'Sièges avant chauffants', 'Ordinateur de bord'] },
  { category: 'Sécurité', items: ['ABS', 'ESP', 'Airbags latéraux avant', 'Antipatinage'] },
]
export const COMMON_EQUIPMENT_CATEGORIES = COMMON_EQUIPMENT_GROUPS.map((g) => g.category)
export const COMMON_EQUIPMENT_ITEMS = COMMON_EQUIPMENT_GROUPS.flatMap((g) => g.items)

/** Items belonging to a known equipment category, for filtering the item dropdown in the admin form. */
export function equipmentItemsForCategory(category: string): string[] {
  return COMMON_EQUIPMENT_GROUPS.find((g) => g.category === category)?.items ?? COMMON_EQUIPMENT_ITEMS
}

/** Fuel types, for the admin form's "Énergie" dropdown. */
export const COMMON_FUELS = [
  'Essence',
  'Diesel',
  'Hybride',
  'Hybride rechargeable',
  'Électrique',
  'GPL',
  'Éthanol E85',
  'Hydrogène',
]

/** Gearbox types, for the admin form's "Boîte de vitesse" dropdown. */
export const COMMON_GEARBOXES = ['Manuelle', 'Automatique', 'Semi-automatique']

/** Badge color classes for a vehicle status, for the admin vehicle tables. Matches loosely (case/accent/whitespace-insensitive) so a stray old value never renders an unstyled, invisible badge. */
export function vehicleStatusBadgeClassName(status: string): string {
  const s = status.trim().toLowerCase()
  if (s.includes('disponible')) return 'border-transparent bg-green-600 text-white'
  if (s.includes('reserv') || s.includes('réserv')) return 'border-transparent bg-orange-400 text-white'
  if (s.includes('vendu')) return 'border-transparent bg-blue-600 text-white'
  if (s.includes('archiv')) return 'border-transparent bg-purple-600 text-white'
  return 'border-transparent bg-muted text-foreground'
}

/** Whether a status string means "archived" (hidden from the public site). */
export function isArchivedStatus(status: string): boolean {
  return status.trim().toLowerCase().includes('archiv')
}

export function groupVehicleFacts(details: [string, string][]) {
  const detailsMap = new Map(details)
  const used = new Set<string>()
  const groups = FACT_GROUPS.map((group) => ({
    title: group.title,
    facts: group.labels
      .filter((label) => detailsMap.has(label))
      .map((label) => {
        used.add(label)
        return [label, detailsMap.get(label) as string] as [string, string]
      }),
  })).filter((group) => group.facts.length > 0)

  const rest = details.filter(([label]) => !used.has(label))
  if (rest.length > 0) groups.push({ title: 'Autres informations', facts: rest })

  return groups
}

type VehicleRow = {
  id: number
  featured: boolean | null
  featured_order: number | null
  name: string
  meta: string
  year: string
  km: string
  fuel: string
  gearbox: string
  price: string
  tag: string
  status: string
  image: string
  gallery: string[] | null
  description: string | null
  details: [string, string][] | null
  equipment: EquipmentGroup[] | null
  archived: boolean | null
  created_at: string
}

function fromRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    featured: row.featured ?? undefined,
    featuredOrder: row.featured_order ?? undefined,
    name: row.name,
    meta: row.meta,
    year: row.year,
    km: row.km,
    fuel: row.fuel,
    gearbox: row.gearbox,
    price: row.price,
    tag: row.tag,
    status: row.status,
    image: row.image,
    gallery: row.gallery ?? [],
    description: row.description ?? undefined,
    details: row.details ?? [],
    equipment: row.equipment ?? undefined,
    archived: row.archived ?? false,
    createdAt: row.created_at,
  }
}

/** Public-facing: excludes archived vehicles. Used by the website itself. */
export async function getVehicles(): Promise<Vehicle[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('archived', false)
    .order('id', { ascending: false })
  if (error) {
    console.error('getVehicles failed:', error.message)
    return []
  }
  return (data as VehicleRow[]).map(fromRow)
}

/** Admin-only: includes archived vehicles. Used by the admin vehicle list. */
export async function getVehiclesAdmin(): Promise<Vehicle[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('vehicles').select('*').order('id', { ascending: false })
  if (error) {
    console.error('getVehiclesAdmin failed:', error.message)
    return []
  }
  return (data as VehicleRow[]).map(fromRow)
}

export async function getVehicle(id: string): Promise<Vehicle | undefined> {
  if (!supabase) return undefined
  const { data, error } = await supabase.from('vehicles').select('*').eq('id', Number(id)).maybeSingle()
  if (error || !data) return undefined
  return fromRow(data as VehicleRow)
}
