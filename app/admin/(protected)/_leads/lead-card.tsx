import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
function typeBadgeClassName(label: string): string {
    if (label === 'Vente directe') return 'border-transparent bg-blue-600 text-white'
    if (label === 'Reprise avec achat') return 'border-transparent bg-purple-600 text-white'
    if (label === 'Offre sur un véhicule') return 'border-transparent bg-pink-600 text-white'
    if (label === "Demande d'essai") return 'border-transparent bg-teal-600 text-white'
    return 'border-transparent bg-gray-600 text-white'
}

export default function LeadCard({ lead }: { lead: Lead }) {
    // "Type de demande" is already shown as the badge above, no need to repeat it in the details list.
    const otherDetails = Object.entries(lead.details).filter(([label]) => label !== 'Type de demande')
    const label = typeLabel(lead)

    return (
        <Card className={lead.status === 'Traité' ? 'opacity-60' : undefined}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={typeBadgeClassName(label)}>
                            {label}
                        </Badge>
                    </div>
                    <p className="text-lg font-semibold">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <LeadStatusButton id={lead.id} status={lead.status} />
                    <DeleteLeadButton id={lead.id} name={lead.name} />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-foreground hover:underline">
                            <Phone className="size-4" /> {lead.phone}
                        </a>
                    )}
                    {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-foreground hover:underline">
                            <Mail className="size-4" /> {lead.email}
                        </a>
                    )}
                </div>

                {lead.vehicleName && (
                    <p className="text-sm">
                        Véhicule :{' '}
                        {lead.vehicleId ? (
                            <Link
                                href={`/vehicules/${lead.vehicleId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium underline!"
                            >
                                {lead.vehicleName}
                            </Link>
                        ) : (
                            <span className="font-medium">{lead.vehicleName}</span>
                        )}
                    </p>
                )}

                {lead.offerAmount && (
                    <p className="text-sm">
                        Offre proposée : <span className="font-medium">{lead.offerAmount} €</span>
                    </p>
                )}

                {otherDetails.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        {otherDetails.map(([label, value]) => (
                            <span key={label}>
                                {label} : {value}
                            </span>
                        ))}
                    </div>
                )}

                {lead.message && <p className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{lead.message}</p>}

                {lead.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {lead.photos.map((url) => (
                            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                                <div className="relative size-20 overflow-hidden rounded-md bg-muted">
                                    <Image src={url} alt="" fill className="object-cover" />
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
