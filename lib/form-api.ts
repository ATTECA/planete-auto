import { NextResponse } from 'next/server'
import nodemailer, { type SendMailOptions } from 'nodemailer'
import { createLead } from '@/lib/leads'

export const GARAGE_PHONE = '04 67 82 54 12'

/** An error whose message is safe and useful to show to the visitor as is. */
export class FormError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json()
    if (body && typeof body === 'object') return body as Record<string, unknown>
  } catch {}
  throw new FormError('Le formulaire envoyé est illisible. Rechargez la page et réessayez.')
}

export async function readFormDataBody(request: Request): Promise<FormData> {
  try {
    return await request.formData()
  } catch {
    throw new FormError('Le formulaire envoyé est illisible. Rechargez la page et réessayez.')
  }
}

/** Lists every missing field by name, e.g. "Merci de renseigner : votre nom, votre téléphone." */
export function requireFields(fields: Record<string, string | null | undefined>) {
  const missing = Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([label]) => label)
  if (missing.length > 0) {
    throw new FormError(`Merci de renseigner : ${missing.join(', ')}.`)
  }
}

export function requireValidEmail(email: string) {
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    throw new FormError(`L’adresse e-mail « ${email} » n’est pas valide. Vérifiez-la (exemple : prenom.nom@gmail.com).`)
  }
}

type MailOptions = Omit<SendMailOptions, 'from' | 'to'>

/** Sends the notification e-mail to the garage, turning any failure into a message the visitor can act on. */
export async function sendFormEmail(options: MailOptions) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.error('Form email: missing SMTP_HOST, SMTP_USER or SMTP_PASSWORD')
    throw new FormError(
      `Le formulaire est temporairement indisponible. Appelez-nous au ${GARAGE_PHONE}, nous traiterons votre demande directement.`,
      503,
    )
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  })

  try {
    await transporter.sendMail({
      ...options,
      from: process.env.SMTP_FROM ?? SMTP_USER,
      to: process.env.CONTACT_RECIPIENT ?? 'communication@att-eca.com',
    })
  } catch (error) {
    console.error('Form email: sendMail failed:', error)
    throw new FormError(
      `Votre demande n’a pas pu nous être transmise : notre service d’envoi d’e-mails ne répond pas. Réessayez dans quelques minutes ou appelez-nous au ${GARAGE_PHONE}.`,
      502,
    )
  }
}

/**
 * Saves the request for the admin panel. The e-mail has already reached the garage at
 * this point, so a database hiccup is logged rather than reported as a failed send
 * (which would make the visitor resend and the garage get duplicate e-mails).
 */
export async function saveLeadSafely(input: Parameters<typeof createLead>[0]) {
  try {
    await createLead(input)
  } catch (error) {
    console.error('Form lead: createLead failed (e-mail was sent):', error)
  }
}

export function formErrorResponse(error: unknown, context: string) {
  if (error instanceof FormError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  console.error(`${context}:`, error)
  return NextResponse.json(
    { error: `Une erreur inattendue s’est produite de notre côté. Réessayez ou appelez-nous au ${GARAGE_PHONE}.` },
    { status: 500 },
  )
}
