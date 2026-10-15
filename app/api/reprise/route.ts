import { NextResponse } from 'next/server'
import { renderEmailHtml } from '@/lib/email-template'
import {
  FormError,
  formErrorResponse,
  readFormDataBody,
  requireFields,
  requireValidEmail,
  saveLeadSafely,
  sendFormEmail,
} from '@/lib/form-api'
import { getSupabaseAdmin } from '@/lib/supabase'

const MAX_PHOTOS = 8
const MAX_PHOTO_SIZE = 8 * 1024 * 1024
const PHOTOS_BUCKET = 'vehicles'

/** Best-effort: a storage hiccup shouldn't block the email that already went out. */
async function uploadLeadPhotos(photos: File[]): Promise<string[]> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const urls = await Promise.all(
      photos.map(async (photo) => {
        const ext = photo.name.split('.').pop() || 'jpg'
        const path = `leads/${crypto.randomUUID()}.${ext}`
        const { error } = await supabaseAdmin.storage
          .from(PHOTOS_BUCKET)
          .upload(path, photo, { contentType: photo.type || 'image/jpeg' })
        if (error) throw error
        return supabaseAdmin.storage.from(PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl
      }),
    )
    return urls
  } catch (err) {
    console.error('uploadLeadPhotos failed:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function POST(request: Request) {
  try {
    const form = await readFormDataBody(request)

    const intent = form.get('intent') === 'vente' ? 'Vente directe' : 'Reprise avec achat'
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const brand = String(form.get('brand') ?? '').trim()
    const model = String(form.get('model') ?? '').trim()
    const year = String(form.get('year') ?? '').trim()
    const mileage = String(form.get('mileage') ?? '').trim()
    const gearbox = String(form.get('gearbox') ?? '').trim()
    const fuel = String(form.get('fuel') ?? '').trim()
    const color = String(form.get('color') ?? '').trim()
    const condition = String(form.get('condition') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()

    requireFields({
      'la marque du véhicule': brand,
      'le modèle du véhicule': model,
      'votre nom': name,
      'votre e-mail': email,
      'votre téléphone': phone,
    })
    requireValidEmail(email)

    const photos = form.getAll('photos').filter((entry): entry is File => entry instanceof File && entry.size > 0)
    if (photos.length > MAX_PHOTOS) {
      throw new FormError(`Vous avez ajouté ${photos.length} photos : le maximum est de ${MAX_PHOTOS}. Retirez-en ${photos.length - MAX_PHOTOS}.`)
    }
    for (const photo of photos) {
      if (photo.type && !photo.type.startsWith('image/')) {
        throw new FormError(`Le fichier « ${photo.name} » n’est pas une image. Seules les photos sont acceptées.`)
      }
      if (photo.size > MAX_PHOTO_SIZE) {
        const sizeMb = (photo.size / 1024 / 1024).toFixed(1).replace('.', ',')
        throw new FormError(`La photo « ${photo.name} » fait ${sizeMb} Mo : la limite est de 8 Mo par photo.`)
      }
    }

    const attachments = await Promise.all(
      photos.map(async (photo, index) => ({
        filename: photo.name || `photo-${index + 1}.jpg`,
        content: Buffer.from(await photo.arrayBuffer()),
        cid: `photo-${index}`,
      }))
    )

    await sendFormEmail({
      replyTo: email,
      subject: `Planète Auto — ${intent} : ${brand} ${model}`,
      text: [
        `Type de demande: ${intent}`,
        `Nom: ${name}`,
        `E-mail: ${email}`,
        phone && `Téléphone: ${phone}`,
        `Véhicule: ${brand} ${model}`,
        year && `Année: ${year}`,
        mileage && `Kilométrage: ${mileage} km`,
        gearbox && `Boîte: ${gearbox}`,
        fuel && `Carburant: ${fuel}`,
        color && `Couleur: ${color}`,
        condition && `État: ${condition}`,
        message && `\nMessage:\n${message}`,
      ].filter(Boolean).join('\n'),
      html: renderEmailHtml({
        heading: `${intent} — ${brand} ${model}`,
        subheading: `Nouvelle demande via le site`,
        rows: [
          { label: 'Nom', value: name },
          { label: 'E-mail', value: email },
          ...(phone ? [{ label: 'Téléphone', value: phone }] : []),
          { label: 'Véhicule', value: `${brand} ${model}` },
          ...(year ? [{ label: 'Année', value: year }] : []),
          ...(mileage ? [{ label: 'Kilométrage', value: `${mileage} km` }] : []),
          ...(gearbox ? [{ label: 'Boîte', value: gearbox }] : []),
          ...(fuel ? [{ label: 'Carburant', value: fuel }] : []),
          ...(color ? [{ label: 'Couleur', value: color }] : []),
          ...(condition ? [{ label: 'État', value: condition }] : []),
        ],
        message: message || undefined,
        photoCids: attachments.map((a) => a.cid),
      }),
      attachments,
    })

    const photoUrls = await uploadLeadPhotos(photos)

    await saveLeadSafely({
      type: 'reprise',
      name,
      email,
      phone,
      vehicleName: `${brand} ${model}`.trim(),
      message,
      details: {
        'Type de demande': intent,
        ...(year && { Année: year }),
        ...(mileage && { Kilométrage: mileage }),
        ...(gearbox && { Boîte: gearbox }),
        ...(fuel && { Carburant: fuel }),
        ...(color && { Couleur: color }),
        ...(condition && { État: condition }),
      },
      photos: photoUrls,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return formErrorResponse(error, 'Reprise form error')
  }
}
