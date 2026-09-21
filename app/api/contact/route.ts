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
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs.' }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
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

    await createLead({ type: 'contact', name, email, message })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'L’envoi a échoué. Veuillez réessayer ou nous appeler.' }, { status: 500 })
  }
}
