'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

const BUCKET = 'vehicles'

export type VehicleFormState = { success: true } | { error: string } | undefined

async function uploadMainPhoto(file: File) {
    const supabaseAdmin = getSupabaseAdmin()
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || 'image/jpeg',
    })

    if (uploadError) {
        throw new Error(`Échec de l'envoi de la photo: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
    return publicUrlData.publicUrl
}

function readVehicleFields(formData: FormData) {
    return {
        name: String(formData.get('name') ?? '').trim(),
        meta: String(formData.get('meta') ?? '').trim(),
        year: String(formData.get('year') ?? '').trim(),
        km: String(formData.get('km') ?? '').trim(),
        fuel: String(formData.get('fuel') ?? '').trim(),
        gearbox: String(formData.get('gearbox') ?? '').trim(),
        price: String(formData.get('price') ?? '').trim(),
        tag: String(formData.get('tag') ?? '').trim(),
        status: String(formData.get('status') ?? '').trim(),
        description: String(formData.get('description') ?? '').trim() || null,
    }
}

export async function createVehicle(_prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    try {
        const supabaseAdmin = getSupabaseAdmin()

        const mainPhoto = formData.get('mainPhoto')
        if (!(mainPhoto instanceof File) || mainPhoto.size === 0) {
            return { error: 'Une photo principale est obligatoire.' }
        }

        const imageUrl = await uploadMainPhoto(mainPhoto)

        const row = {
            ...readVehicleFields(formData),
            image: imageUrl,
            gallery: [imageUrl],
        }

        const { error } = await supabaseAdmin.from('vehicles').insert(row)

        if (error) {
            return { error: `Échec de l'enregistrement: ${error.message}` }
        }

        revalidatePath('/admin/vehicules')
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Une erreur est survenue.' }
    }
}

export async function updateVehicle(_prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    try {
        const supabaseAdmin = getSupabaseAdmin()

        const id = Number(formData.get('id'))
        if (!id) {
            return { error: 'Identifiant de véhicule manquant.' }
        }

        const row: Record<string, unknown> = readVehicleFields(formData)

        const mainPhoto = formData.get('mainPhoto')
        if (mainPhoto instanceof File && mainPhoto.size > 0) {
            const imageUrl = await uploadMainPhoto(mainPhoto)
            row.image = imageUrl
            row.gallery = [imageUrl]
        }

        const { error } = await supabaseAdmin.from('vehicles').update(row).eq('id', id)

        if (error) {
            return { error: `Échec de la mise à jour: ${error.message}` }
        }

        revalidatePath('/admin/vehicules')
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Une erreur est survenue.' }
    }
}

export async function deleteVehicle(id: number) {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id)

    if (error) {
        throw new Error(`Échec de la suppression: ${error.message}`)
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
}

export async function setVehicleArchived(id: number, archived: boolean) {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin.from('vehicles').update({ archived }).eq('id', id)

    if (error) {
        throw new Error(`Échec de la mise à jour: ${error.message}`)
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
}
