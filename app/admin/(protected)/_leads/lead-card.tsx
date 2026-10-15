import Image from 'next/image'
import Link from 'next/link'
import LeadStatusButton from '@/components/admin/lead-status-button'
import DeleteLeadButton from '@/components/admin/delete-lead-button'
import { Euro, KeyRound, Mail, Phone, Repeat, Tag, Wrench, type LucideIcon } from 'lucide-react'
import type { Lead } from '@/lib/leads'

export function typeLabel(lead: Lead): string {
    if (lead.type === 'reprise') return lead.details['Type de demande'] || 'Reprise / vente'
    if (lead.type === 'devis') return 'Demande de devis'
    if (lead.type === 'offer') return 'Offre sur un véhicule'
    if (lead.type === 'essai') return "Demande d'essai"
    return 'Message de contact'
}

/**
 * Pill color + icon per request type, so they're easy to tell apart at a glance.
 * Avoids blue, orange and green, which the status button already uses.
 */
export function typeStyle(label: string): { className: string; icon: LucideIcon } {
    if (label === 'Vente directe') return { className: 'bg-fuchsia-100 text-fuchsia-800', icon: Tag }
    if (label === 'Reprise avec achat') return { className: 'bg-indigo-100 text-indigo-800', icon: Repeat }
    if (label === 'Offre sur un véhicule') return { className: 'bg-rose-100 text-rose-800', icon: Euro }
    if (label === 'Demande de devis') return { className: 'bg-violet-100 text-violet-800', icon: Wrench }
    if (label === "Demande d'essai") return { className: 'bg-amber-100 text-amber-800', icon: KeyRound }
    return { className: 'bg-slate-100 text-slate-700', icon: Mail }
}

export default function LeadCard({ lead }: { lead: Lead }) {
    // "Type de demande" is already shown above, no need to repeat it in the details list.
    const otherDetails = Object.entries(lead.details).filter(([label]) => label !== 'Type de demande')
    const label = typeLabel(lead)
    const { className: typeClassName, icon: TypeIcon } = typeStyle(label)
    const coverPhoto = lead.photos[0]
    const extraPhotos = lead.photos.slice(1)

    const factLine = [
        lead.vehicleName ? { label: 'Véhicule', value: lead.vehicleName, href: lead.vehicleId ? `/vehicules/${lead.vehicleId}` : undefined } : null,
        lead.offerAmount ? { label: 'Offre proposée', value: `${lead.offerAmount} €` } : null,
        ...otherDetails.map(([detailLabel, value]) => ({ label: detailLabel, value })),
    ].filter((entry): entry is { label: string; value: string; href?: string } => entry !== null)

    return (
        <article className={`flex gap-6 py-8 ${lead.status === 'Traité' ? 'opacity-50' : ''}`}>
            {coverPhoto && (
                <a
                    href={coverPhoto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative hidden size-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:block"
                >
                    <Image src={coverPhoto} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    {extraPhotos.length > 0 && (
                        <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
                            +{extraPhotos.length}
                        </span>
                    )}
                </a>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${typeClassName}`}>
                            <TypeIcon className="size-3.5" aria-hidden />
                            {label}
                        </span>
                        <h3 className="text-2xl font-semibold leading-tight text-foreground">{lead.name}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <LeadStatusButton id={lead.id} status={lead.status} />
                        <DeleteLeadButton id={lead.id} name={lead.name} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
                            <Phone className="size-3.5 text-muted-foreground" /> {lead.phone}
                        </a>
                    )}
                    {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
                            <Mail className="size-3.5 text-muted-foreground" /> {lead.email}
                        </a>
                    )}
                </div>

                {factLine.length > 0 && (
                    <p className="text-sm leading-relaxed text-foreground">
                        {factLine.map((fact, index) => (
                            <span key={fact.label}>
                                {index > 0 && <span className="mx-2 text-muted-foreground">·</span>}
                                <span className="text-muted-foreground">{fact.label} </span>
                                {fact.href ? (
                                    <Link href={fact.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline!">
                                        {fact.value}
                                    </Link>
                                ) : (
                                    <span className="font-semibold">{fact.value}</span>
                                )}
                            </span>
                        ))}
                    </p>
                )}

                {lead.message && (
                    <p className="border-l-2 border-border pl-3 text-sm italic leading-relaxed text-muted-foreground">
                        “{lead.message}”
                    </p>
                )}

                {lead.photos.length > 0 && (
                    <div className={`flex flex-wrap gap-2 pt-1 ${coverPhoto ? 'sm:hidden' : ''}`}>
                        {lead.photos.map((url) => (
                            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="group">
                                <div className="relative size-20 overflow-hidden rounded-lg bg-muted transition-transform group-hover:scale-105">
                                    <Image src={url} alt="" fill className="object-cover" />
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </article>
    )
}
