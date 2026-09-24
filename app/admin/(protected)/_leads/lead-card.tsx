import Image from 'next/image'
import Link from 'next/link'
import LeadStatusButton from '@/components/admin/lead-status-button'
import DeleteLeadButton from '@/components/admin/delete-lead-button'
import { Mail, Phone } from 'lucide-react'
import type { Lead } from '@/lib/leads'

function typeLabel(lead: Lead): string {
    if (lead.type === 'reprise') return lead.details['Type de demande'] || 'Reprise / vente'
    if (lead.type === 'offer') return 'Offre sur un véhicule'
    if (lead.type === 'essai') return "Demande d'essai"
    return 'Message de contact'
}

/** Solid, distinct color per request type/intent, so they're easy to tell apart at a glance. */
function typeTextClassName(label: string): string {
    if (label === 'Vente directe') return 'text-blue-600'
    if (label === 'Reprise avec achat') return 'text-purple-600'
    if (label === 'Offre sur un véhicule') return 'text-pink-600'
    if (label === "Demande d'essai") return 'text-teal-600'
    return 'text-gray-600'
}

export default function LeadCard({ lead }: { lead: Lead }) {
    // "Type de demande" is already shown above, no need to repeat it in the details list.
    const otherDetails = Object.entries(lead.details).filter(([label]) => label !== 'Type de demande')
    const label = typeLabel(lead)
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
                        <p className={`text-xs font-bold uppercase tracking-wider ${typeTextClassName(label)}`}>{label}</p>
                        <h3 className="text-2xl font-semibold leading-tight text-foreground">{lead.name}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleString('fr-FR')}</p>
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
