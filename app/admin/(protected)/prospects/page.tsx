import { getLeads, type Lead } from '@/lib/leads'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import LeadStatusButton from '@/components/admin/lead-status-button'
import DeleteLeadButton from '@/components/admin/delete-lead-button'
import { Mail, Phone } from 'lucide-react'

const TYPE_LABELS: Record<Lead['type'], string> = {
    contact: 'Message de contact',
    offer: 'Offre sur un véhicule',
    reprise: 'Reprise / vente',
}

export default async function AdminProspectsPage() {
    const leads = await getLeads()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Prospects</h1>
                <p className="text-sm text-muted-foreground">
                    Demandes reçues via le site (contact, offres, reprises). Un e-mail vous est aussi envoyé pour chacune.
                </p>
            </div>

            {leads.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        Aucune demande pour le moment.
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col gap-4">
                    {leads.map((lead) => (
                        <Card key={lead.id} className={lead.status === 'Traité' ? 'opacity-60' : undefined}>
                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline">{TYPE_LABELS[lead.type]}</Badge>
                                        <Badge>{lead.status}</Badge>
                                    </div>
                                    <p className="text-lg font-semibold">{lead.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(lead.createdAt).toLocaleString('fr-FR')}
                                    </p>
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
                                            <Link href={`/admin/vehicules/${lead.vehicleId}`} className="font-medium underline">
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

                                {Object.keys(lead.details).length > 0 && (
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                        {Object.entries(lead.details).map(([label, value]) => (
                                            <span key={label}>
                                                {label} : {value}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {lead.message && (
                                    <p className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{lead.message}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
