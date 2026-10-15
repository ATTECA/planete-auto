import { NextResponse } from 'next/server'
import { renderEmailHtml } from '@/lib/email-template'
import { formErrorResponse, readJsonBody, requireFields, requireValidEmail, saveLeadSafely, sendFormEmail } from '@/lib/form-api'

const services = ['Mécanique', 'Carrosserie', 'Pneumatique', 'Pièces de rechange', 'Autre'] as const

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const vehicle = typeof body.vehicle === 'string' ? body.vehicle.trim() : ''
    const plate = typeof body.plate === 'string' ? body.plate.trim().toUpperCase() : ''
    const service = services.find((candidate) => candidate === body.service)
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    requireFields({
      'votre nom': name,
      'votre téléphone': phone,
      'votre véhicule': vehicle,
      'le type de prestation': service,
      'la description de votre besoin': message,
    })
    requireValidEmail(email)

    await sendFormEmail({
      replyTo: email || undefined,
      subject: `Planète Auto — Demande de devis ${service!.toLowerCase()} : ${vehicle}`,
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
          { label: 'Prestation', value: service! },
          { label: 'Véhicule', value: vehicle },
          ...(plate ? [{ label: 'Immatriculation', value: plate }] : []),
          { label: 'Nom', value: name },
          { label: 'Téléphone', value: phone },
          ...(email ? [{ label: 'E-mail', value: email }] : []),
        ],
        message,
      }),
    })

    await saveLeadSafely({
      type: 'devis',
      name,
      email,
      phone,
      vehicleName: vehicle,
      message,
      details: { 'Type de prestation': service!, ...(plate ? { Immatriculation: plate } : {}) },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return formErrorResponse(error, 'Quote form error')
  }
}
