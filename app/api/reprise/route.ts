import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { renderEmailHtml } from '@/lib/email-template'
import { createLead } from '@/lib/leads'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

const MAX_PHOTOS = 8
const MAX_PHOTO_SIZE = 8 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const form = await request.formData()

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

    if (!name || !email || !brand || !model) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Veuillez saisir une adresse e-mail valide.' }, { status: 400 })
    }

    const photos = form.getAll('photos').filter((entry): entry is File => entry instanceof File && entry.size > 0)
    if (photos.length > MAX_PHOTOS) {
      return NextResponse.json({ error: `Vous pouvez ajouter au maximum ${MAX_PHOTOS} photos.` }, { status: 400 })
    }
    for (const photo of photos) {
      if (photo.size > MAX_PHOTO_SIZE) {
        return NextResponse.json({ error: 'Chaque photo doit faire moins de 8 Mo.' }, { status: 400 })
      }
    }

    const attachments = await Promise.all(
      photos.map(async (photo, index) => ({
        filename: photo.name || `photo-${index + 1}.jpg`,
        content: Buffer.from(await photo.arrayBuffer()),
        cid: `photo-${index}`,
      }))
    )

    const transporter = nodemailer.createTransport({
      host: requiredEnv('SMTP_HOST'),
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: requiredEnv('SMTP_USER'),
        pass: requiredEnv('SMTP_PASSWORD'),
      },
    })

    const recipient = process.env.CONTACT_RECIPIENT ?? 'communication@att-eca.com'
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: recipient,
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

    await createLead({
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
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Reprise form error:', error)
    return NextResponse.json({ error: 'L’envoi a échoué. Veuillez réessayer ou nous appeler.' }, { status: 500 })
  }
}
