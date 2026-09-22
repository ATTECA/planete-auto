'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isArchivedStatus, type EquipmentGroup } from '@/lib/vehicles'

const BUCKET = 'vehicles'

export type VehicleFormState = { error: string } | undefined

async function uploadPhoto(file: File) {
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

type GalleryOrderEntry = { kind: 'existing'; url: string } | { kind: 'new' }

function readGalleryOrder(formData: FormData): GalleryOrderEntry[] {
    try {
        const raw = JSON.parse(String(formData.get('galleryOrder') ?? '[]')) as unknown
        if (!Array.isArray(raw)) return []
        return raw.filter(
            (entry): entry is GalleryOrderEntry =>
                !!entry &&
                typeof entry === 'object' &&
                (('kind' in entry && entry.kind === 'new') ||
                    ('kind' in entry && entry.kind === 'existing' && typeof (entry as { url?: unknown }).url === 'string')),
        )
    } catch {
        return []
    }
}

/** Uploads any new photos and returns the final, ordered list of photo URLs. */
async function resolveGallery(formData: FormData): Promise<string[]> {
    const order = readGalleryOrder(formData)
    const newPhotos = formData.getAll('newPhotos').filter((entry): entry is File => entry instanceof File)

    const gallery: string[] = []
    let newIndex = 0
    for (const entry of order) {
        if (entry.kind === 'existing') {
            gallery.push(entry.url)
        } else {
            const file = newPhotos[newIndex]
            newIndex += 1
            if (file && file.size > 0) {
                gallery.push(await uploadPhoto(file))
            }
        }
    }
    return gallery
}

function readDetails(formData: FormData): [string, string][] {
    try {
        const raw = JSON.parse(String(formData.get('details') ?? '[]')) as unknown
        if (!Array.isArray(raw)) return []
        return raw
            .filter((row): row is [string, string] => Array.isArray(row) && row.length === 2)
            .map(([label, value]) => [String(label).trim(), String(value).trim()] as [string, string])
            .filter(([label, value]) => label && value)
    } catch {
        return []
    }
}

function readEquipment(formData: FormData): EquipmentGroup[] {
    try {
        const raw = JSON.parse(String(formData.get('equipment') ?? '[]')) as unknown
        if (!Array.isArray(raw)) return []
        return raw
            .filter((group): group is EquipmentGroup => !!group && typeof group === 'object' && 'category' in group && 'items' in group)
            .map((group) => ({
                category: String(group.category).trim(),
                items: Array.isArray(group.items)
                    ? group.items.map((item) => String(item).trim()).filter(Boolean)
                    : [],
            }))
            .filter((group) => group.category && group.items.length > 0)
    } catch {
        return []
    }
}

/** Turns a plain number (or anything containing one) into "1 234", with a normal space every 3 digits. */
function withThousandsSeparator(raw: string) {
    const digits = raw.replace(/\D/g, '')
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function formatPrice(raw: string) {
    const digits = withThousandsSeparator(raw)
    return digits ? `${digits} €` : ''
}

function formatKm(raw: string) {
    const digits = withThousandsSeparator(raw)
    return digits ? `${digits} km` : ''
}

function readVehicleFields(formData: FormData) {
    const status = String(formData.get('status') ?? '').trim()
    return {
        name: String(formData.get('name') ?? '').trim(),
        meta: String(formData.get('meta') ?? '').trim(),
        year: String(formData.get('year') ?? '').trim(),
        km: formatKm(String(formData.get('km') ?? '')),
        fuel: String(formData.get('fuel') ?? '').trim(),
        gearbox: String(formData.get('gearbox') ?? '').trim(),
        carrosserie: String(formData.get('carrosserie') ?? '').trim(),
        price: formatPrice(String(formData.get('price') ?? '')),
        tag: String(formData.get('tag') ?? '').trim(),
        status,
        // Keeps the "archived" flag (what actually hides the car from the public site) in
        // sync with the Statut dropdown, so picking "Archivé" there really archives it.
        archived: isArchivedStatus(status),
        description: String(formData.get('description') ?? '').trim() || null,
        details: readDetails(formData),
        equipment: readEquipment(formData),
    }
}

export async function createVehicle(_prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    const supabaseAdmin = getSupabaseAdmin()

    try {
        const gallery = await resolveGallery(formData)
        if (gallery.length === 0) {
            return { error: 'Au moins une photo est obligatoire.' }
        }

        const row = {
            ...readVehicleFields(formData),
            image: gallery[0],
            gallery,
        }

        const { error } = await supabaseAdmin.from('vehicles').insert(row)

        if (error) {
            return { error: `Échec de l'enregistrement: ${error.message}` }
        }
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Une erreur est survenue.' }
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
    revalidatePath('/vehicules')
    revalidatePath('/vehicules/[id]', 'page')
    revalidatePath('/')
    redirect('/admin/vehicules')
}

export async function updateVehicle(_prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    const supabaseAdmin = getSupabaseAdmin()

    const id = Number(formData.get('id'))
    if (!id) {
        return { error: 'Identifiant de véhicule manquant.' }
    }

    try {
        const gallery = await resolveGallery(formData)
        if (gallery.length === 0) {
            return { error: 'Au moins une photo est obligatoire.' }
        }

        const row: Record<string, unknown> = {
            ...readVehicleFields(formData),
            image: gallery[0],
            gallery,
        }

        const { error } = await supabaseAdmin.from('vehicles').update(row).eq('id', id)

        if (error) {
            return { error: `Échec de la mise à jour: ${error.message}` }
        }
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Une erreur est survenue.' }
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
    revalidatePath('/vehicules')
    revalidatePath('/vehicules/[id]', 'page')
    revalidatePath('/')
    redirect('/admin/vehicules')
}

export async function deleteVehicle(id: number) {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin.from('vehicles').delete().eq('id', id)

    if (error) {
        throw new Error(`Échec de la suppression: ${error.message}`)
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
    revalidatePath('/vehicules')
    revalidatePath('/vehicules/[id]', 'page')
    revalidatePath('/')
}

export async function duplicateVehicle(id: number) {
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error: fetchError } = await supabaseAdmin.from('vehicles').select('*').eq('id', id).maybeSingle()

    if (fetchError || !data) {
        throw new Error(`Échec de la duplication: véhicule introuvable.`)
    }

    const { id: _id, created_at: _createdAt, ...rest } = data
    // A duplicate always starts as an active listing, even if the source was archived.
    const row = { ...rest, archived: false, status: isArchivedStatus(data.status) ? 'Disponible' : data.status }

    const { error: insertError } = await supabaseAdmin.from('vehicles').insert(row)

    if (insertError) {
        throw new Error(`Échec de la duplication: ${insertError.message}`)
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
    revalidatePath('/vehicules')
    revalidatePath('/vehicules/[id]', 'page')
    revalidatePath('/')
}

export async function setVehicleArchived(id: number, archived: boolean) {
    const supabaseAdmin = getSupabaseAdmin()

    // Keeps the Statut dropdown in sync with this quick toggle: archiving sets it to
    // "Archivé", restoring puts it back to "Disponible" (its only prior state, since
    // "archived" and "Archivé" are now always set together).
    const { error } = await supabaseAdmin
        .from('vehicles')
        .update({ archived, status: archived ? 'Archivé' : 'Disponible' })
        .eq('id', id)

    if (error) {
        throw new Error(`Échec de la mise à jour: ${error.message}`)
    }

    revalidatePath('/admin/vehicules')
    revalidatePath('/admin')
    revalidatePath('/vehicules')
    revalidatePath('/vehicules/[id]', 'page')
    revalidatePath('/')
}
