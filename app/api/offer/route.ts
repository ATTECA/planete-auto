import { NextResponse } from 'next/server'
import { renderEmailHtml } from '@/lib/email-template'
import { formErrorResponse, readJsonBody, requireFields, requireValidEmail, saveLeadSafely, sendFormEmail } from '@/lib/form-api'

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const offer = typeof body.offer === 'string' ? body.offer.trim() : ''
    const vehicleId = typeof body.vehicleId === 'number' ? body.vehicleId : null
    const vehicleName = typeof body.vehicleName === 'string' ? body.vehicleName.trim() : ''
    const vehiclePrice = typeof body.vehiclePrice === 'string' ? body.vehiclePrice.trim() : ''

    requireFields({
      'votre nom': name,
      'votre téléphone': phone,
      'le montant de votre offre': offer,
      'le véhicule concerné (rechargez la page)': vehicleName,
    })
    requireValidEmail(email)

    await sendFormEmail({
      replyTo: email || undefined,
      subject: `Planète Auto — Offre sur ${vehicleName} : ${offer} €`,
      text: [
        `Véhicule: ${vehicleName} (prix affiché: ${vehiclePrice})`,
        `Offre proposée: ${offer} €`,
        `Nom: ${name}`,
        `Téléphone: ${phone}`,
        email && `E-mail: ${email}`,
      ].filter(Boolean).join('\n'),
      html: renderEmailHtml({
        heading: `Offre sur ${vehicleName}`,
        subheading: 'Nouvelle offre via le site',
        rows: [
          { label: 'Véhicule', value: `${vehicleName} (prix affiché: ${vehiclePrice})` },
          { label: 'Offre proposée', value: `${offer} €` },
          { label: 'Nom', value: name },
          { label: 'Téléphone', value: phone },
          ...(email ? [{ label: 'E-mail', value: email }] : []),
        ],
      }),
    })

    await saveLeadSafely({
      type: 'offer',
      name,
      email,
      phone,
      vehicleId,
      vehicleName,
      offerAmount: offer,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return formErrorResponse(error, 'Offer form error')
  }
}
