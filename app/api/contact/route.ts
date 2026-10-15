import { NextResponse } from 'next/server'
import { renderEmailHtml } from '@/lib/email-template'
import { formErrorResponse, readJsonBody, requireFields, requireValidEmail, saveLeadSafely, sendFormEmail } from '@/lib/form-api'

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    requireFields({ 'votre nom': name, 'votre e-mail': email, 'votre message': message })
    requireValidEmail(email)

    await sendFormEmail({
      replyTo: email,
      subject: `Planète Auto — nouveau message de ${name}`,
      text: `Nom: ${name}\nE-mail: ${email}\n\nMessage:\n${message}`,
      html: renderEmailHtml({
        heading: `Nouveau message de ${name}`,
        subheading: 'Nouveau message via le formulaire de contact',
        rows: [
          { label: 'Nom', value: name },
          { label: 'E-mail', value: email },
        ],
        message,
      }),
    })

    await saveLeadSafely({ type: 'contact', name, email, message })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return formErrorResponse(error, 'Contact form error')
  }
}
