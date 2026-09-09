import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const BUCKET = 'vehicles'
const MAX_PHOTO_SIZE = 10 * 1024 * 1024

async function uploadPhoto(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>, file: File) {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (error) throw new Error(`Échec de l'envoi de ${file.name}: ${error.message}`)
  return supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const passcode = String(form.get('passcode') ?? '')

    const expected = process.env.ADMIN_PASSCODE
    if (!expected) {
      return NextResponse.json({ error: 'ADMIN_PASSCODE non configuré côté serveur.' }, { status: 500 })
    }
    if (passcode !== expected) {
      return NextResponse.json({ error: 'Code incorrect.' }, { status: 401 })
    }

    const name = String(form.get('name') ?? '').trim()
    const meta = String(form.get('meta') ?? '').trim()
    const mainPhoto = form.get('mainPhoto')
    const galleryPhotos = form.getAll('galleryPhotos').filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (!name || !meta || !(mainPhoto instanceof File) || mainPhoto.size === 0) {
      return NextResponse.json({ error: 'Nom, version et photo principale sont obligatoires.' }, { status: 400 })
    }

    for (const photo of [mainPhoto, ...galleryPhotos]) {
      if (photo instanceof File && photo.size > MAX_PHOTO_SIZE) {
        return NextResponse.json({ error: `${photo.name} dépasse 10 Mo.` }, { status: 400 })
      }
    }

    const featured = form.get('featured') === 'true'
    const detailsRaw = String(form.get('details') ?? '[]')
    const equipmentRaw = String(form.get('equipment') ?? '[]')
    let details: unknown
    let equipment: unknown
    try {
      details = JSON.parse(detailsRaw)
      equipment = JSON.parse(equipmentRaw)
    } catch {
      return NextResponse.json({ error: 'Données de fiche technique invalides.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const image = await uploadPhoto(supabaseAdmin, mainPhoto)
    const gallery = [image]
    for (const photo of galleryPhotos) gallery.push(await uploadPhoto(supabaseAdmin, photo))

    const row = {
      featured,
      featured_order: featured ? Number(form.get('featuredOrder')) || null : null,
      name,
      meta,
      year: String(form.get('year') ?? '').trim(),
      km: String(form.get('km') ?? '').trim(),
      fuel: String(form.get('fuel') ?? '').trim(),
      gearbox: String(form.get('gearbox') ?? '').trim(),
      price: String(form.get('price') ?? '').trim(),
      tag: String(form.get('tag') ?? 'Nouveauté').trim(),
      status: String(form.get('status') ?? 'Disponible').trim(),
      image,
      gallery,
      description: String(form.get('description') ?? '').trim() || null,
      details: Array.isArray(details) ? details.filter((pair) => Array.isArray(pair) && pair[0]) : [],
      equipment: Array.isArray(equipment) ? equipment.filter((group) => group && typeof group === 'object' && group.category) : [],
    }

    const { data, error } = await supabaseAdmin.from('vehicles').insert(row).select('id').single()

    if (error) {
      console.error('Admin vehicle insert failed:', error.message)
      return NextResponse.json({ error: 'L’enregistrement a échoué.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch (error) {
    console.error('Admin vehicle route error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Une erreur est survenue.' }, { status: 500 })
  }
}
