import { getLeads } from '@/lib/leads'
import { Card, CardContent } from '@/components/ui/card'
import LeadCard from '../_leads/lead-card'

export default async function AdminReprisesPage() {
    const leads = await getLeads(['reprise'])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Reprises</h1>
                <p className="text-sm text-muted-foreground">
                    Demandes de vente ou d&apos;échange reçues via le formulaire « Vendre ma voiture ». Un e-mail vous est
                    aussi envoyé pour chacune.
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
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>
            )}
        </div>
    )
}
