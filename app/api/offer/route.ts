import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const offer = typeof body.offer === 'string' ? body.offer.trim() : ''
    const vehicleName = typeof body.vehicleName === 'string' ? body.vehicleName.trim() : ''
    const vehiclePrice = typeof body.vehiclePrice === 'string' ? body.vehiclePrice.trim() : ''

    if (!name || !phone || !offer || !vehicleName) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 })
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Veuillez saisir une adresse e-mail valide.' }, { status: 400 })
    }

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
      replyTo: email || undefined,
      subject: `Planète Auto — Offre sur ${vehicleName} : ${offer} €`,
      text: [
        `Véhicule: ${vehicleName} (prix affiché: ${vehiclePrice})`,
        `Offre proposée: ${offer} €`,
        `Nom: ${name}`,
        `Téléphone: ${phone}`,
        email && `E-mail: ${email}`,
      ].filter(Boolean).join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Offer form error:', error)
    return NextResponse.json({ error: 'L’envoi a échoué. Veuillez réessayer ou nous appeler.' }, { status: 500 })
  }
}
