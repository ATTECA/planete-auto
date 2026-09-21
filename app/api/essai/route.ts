import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createLead } from '@/lib/leads'
import { renderEmailHtml } from '@/lib/email-template'

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
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : ''
    const preferredTime = typeof body.preferredTime === 'string' ? body.preferredTime.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const vehicleId = typeof body.vehicleId === 'number' ? body.vehicleId : null
    const vehicleName = typeof body.vehicleName === 'string' ? body.vehicleName.trim() : ''

    if (!name || !phone || !preferredDate || !vehicleName) {
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
      subject: `Planète Auto — Demande d'essai : ${vehicleName}`,
      text: [
        `Véhicule: ${vehicleName}`,
        `Date souhaitée: ${preferredDate}`,
        preferredTime && `Créneau: ${preferredTime}`,
        `Nom: ${name}`,
        `Téléphone: ${phone}`,
        email && `E-mail: ${email}`,
        message && `\nMessage:\n${message}`,
      ].filter(Boolean).join('\n'),
      html: renderEmailHtml({
        heading: `Demande d'essai — ${vehicleName}`,
        subheading: 'Nouvelle demande via le site',
        rows: [
          { label: 'Véhicule', value: vehicleName },
          { label: 'Date souhaitée', value: preferredDate },
          ...(preferredTime ? [{ label: 'Créneau', value: preferredTime }] : []),
          { label: 'Nom', value: name },
          { label: 'Téléphone', value: phone },
          ...(email ? [{ label: 'E-mail', value: email }] : []),
        ],
        message: message || undefined,
      }),
    })

    await createLead({
      type: 'essai',
      name,
      email,
      phone,
      vehicleId,
      vehicleName,
      message,
      details: {
        'Date souhaitée': preferredDate,
        ...(preferredTime && { Créneau: preferredTime }),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Test drive form error:', error)
    return NextResponse.json({ error: 'L’envoi a échoué. Veuillez réessayer ou nous appeler.' }, { status: 500 })
  }
}
