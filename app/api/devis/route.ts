import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createLead } from '@/lib/leads'
import { renderEmailHtml } from '@/lib/email-template'

const services = ['Mécanique', 'Carrosserie', 'Pneumatique', 'Pièces de rechange', 'Autre'] as const

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
    const vehicle = typeof body.vehicle === 'string' ? body.vehicle.trim() : ''
    const plate = typeof body.plate === 'string' ? body.plate.trim().toUpperCase() : ''
    const service = services.find((candidate) => candidate === body.service)
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || !phone || !vehicle || !service || !message) {
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
      subject: `Planète Auto — Demande de devis ${service.toLowerCase()} : ${vehicle}`,
      text: [
        `Type de prestation: ${service}`,
        `Véhicule: ${vehicle}`,
        plate && `Immatriculation: ${plate}`,
        `Nom: ${name}`,
        `Téléphone: ${phone}`,
        email && `E-mail: ${email}`,
        '',
        `Description:\n${message}`,
      ].filter(Boolean).join('\n'),
      html: renderEmailHtml({
        heading: `Demande de devis — ${vehicle}`,
        subheading: 'Nouvelle demande via le formulaire de devis atelier',
        rows: [
          { label: 'Prestation', value: service },
          { label: 'Véhicule', value: vehicle },
          ...(plate ? [{ label: 'Immatriculation', value: plate }] : []),
          { label: 'Nom', value: name },
          { label: 'Téléphone', value: phone },
          ...(email ? [{ label: 'E-mail', value: email }] : []),
        ],
        message,
      }),
    })

    await createLead({
      type: 'devis',
      name,
      email,
      phone,
      vehicleName: vehicle,
      message,
      details: { 'Type de prestation': service, ...(plate ? { Immatriculation: plate } : {}) },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Quote form error:', error)
    return NextResponse.json({ error: 'L’envoi a échoué. Veuillez réessayer ou nous appeler.' }, { status: 500 })
  }
}
