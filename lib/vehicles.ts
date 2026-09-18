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
}

const FACT_GROUPS: { title: string; labels: string[] }[] = [
  { title: 'Identité', labels: ['Marque', 'Modèle', 'Finition', 'Version', 'Type de véhicule', 'Référence'] },
  { title: 'Année & kilométrage', labels: ['Année modèle', 'Date de 1ère mise en circulation', 'Kilométrage'] },
  { title: 'Moteur & performances', labels: ['Énergie', 'Boîte de vitesse', 'Puissance DIN', 'Puissance fiscale', "Crit'Air", 'CO2'] },
  { title: 'Confort & dimensions', labels: ['Nombre de portes', 'Nombre de places', 'Couleur', 'Couleur intérieur', 'Longueur'] },
]

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
