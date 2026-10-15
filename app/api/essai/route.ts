import { NextResponse } from 'next/server'
import { renderEmailHtml } from '@/lib/email-template'
import { formErrorResponse, readJsonBody, requireFields, requireValidEmail, saveLeadSafely, sendFormEmail } from '@/lib/form-api'

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : ''
    const preferredTime = typeof body.preferredTime === 'string' ? body.preferredTime.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const vehicleId = typeof body.vehicleId === 'number' ? body.vehicleId : null
    const vehicleName = typeof body.vehicleName === 'string' ? body.vehicleName.trim() : ''

    requireFields({
      'votre nom': name,
      'votre téléphone': phone,
      'la date souhaitée': preferredDate,
      'le véhicule concerné (rechargez la page)': vehicleName,
    })
    requireValidEmail(email)

    await sendFormEmail({
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

    await saveLeadSafely({
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
    return formErrorResponse(error, 'Test drive form error')
  }
}
