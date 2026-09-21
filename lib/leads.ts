import { getSupabaseAdmin } from '@/lib/supabase'

export type LeadType = 'contact' | 'offer' | 'reprise' | 'essai'
export type LeadStatus = 'Nouveau' | 'En cours' | 'Traité'
export const LEAD_STATUSES: LeadStatus[] = ['Nouveau', 'En cours', 'Traité']

export type Lead = {
  id: number
  createdAt: string
  type: LeadType
  status: LeadStatus
  name: string
  email: string | null
  phone: string | null
  vehicleId: number | null
  vehicleName: string | null
  offerAmount: string | null
  message: string | null
  details: Record<string, string>
  photos: string[]
}

type LeadRow = {
  id: number
  created_at: string
  type: string
  status: string
  name: string
  email: string | null
  phone: string | null
  vehicle_id: number | null
  vehicle_name: string | null
  offer_amount: string | null
  message: string | null
  details: Record<string, string> | null
  photos: string[] | null
}

function fromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    type: row.type as LeadType,
    status: row.status as LeadStatus,
    name: row.name,
    email: row.email,
    phone: row.phone,
    vehicleId: row.vehicle_id,
    vehicleName: row.vehicle_name,
    offerAmount: row.offer_amount,
    message: row.message,
    details: row.details ?? {},
    photos: row.photos ?? [],
  }
}

/** Best-effort: logs and swallows failures rather than breaking the public form's email send. */
export async function createLead(input: {
  type: LeadType
  name: string
  email?: string | null
  phone?: string | null
  vehicleId?: number | null
  vehicleName?: string | null
  offerAmount?: string | null
  message?: string | null
  details?: Record<string, string>
  photos?: string[]
}) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from('leads').insert({
      type: input.type,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      vehicle_id: input.vehicleId ?? null,
      vehicle_name: input.vehicleName ?? null,
      offer_amount: input.offerAmount ?? null,
      message: input.message ?? null,
      details: input.details ?? {},
      photos: input.photos ?? [],
    })
    if (error) console.error('createLead failed:', error.message)
  } catch (err) {
    console.error('createLead failed:', err instanceof Error ? err.message : err)
  }
}

export async function getLeads(types?: LeadType[]): Promise<Lead[]> {
  const supabaseAdmin = getSupabaseAdmin()
  let query = supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false })
  if (types) query = query.in('type', types)
  const { data, error } = await query
  if (error) {
    console.error('getLeads failed:', error.message)
    return []
  }
  return (data as LeadRow[]).map(fromRow)
}

export async function countNewLeads(types?: LeadType[]): Promise<number> {
  const supabaseAdmin = getSupabaseAdmin()
  let query = supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Nouveau')
  if (types) query = query.in('type', types)
  const { count, error } = await query
  if (error) {
    console.error('countNewLeads failed:', error.message)
    return 0
  }
  return count ?? 0
}
