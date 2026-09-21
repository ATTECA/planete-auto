'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import type { LeadStatus } from '@/lib/leads'

function revalidateLeadPaths() {
    revalidatePath('/admin/reprises')
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
}

export async function setLeadStatus(id: number, status: LeadStatus) {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin.from('leads').update({ status }).eq('id', id)

    if (error) {
        throw new Error(`Échec de la mise à jour: ${error.message}`)
    }

    revalidateLeadPaths()
}

export async function deleteLead(id: number) {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin.from('leads').delete().eq('id', id)

    if (error) {
        throw new Error(`Échec de la suppression: ${error.message}`)
    }

    revalidateLeadPaths()
}
