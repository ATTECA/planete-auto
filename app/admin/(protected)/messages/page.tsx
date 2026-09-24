import { getLeads } from '@/lib/leads'
import { Card, CardContent } from '@/components/ui/card'
import LeadCard from '../_leads/lead-card'

export default async function AdminMessagesPage() {
    const leads = await getLeads(['contact', 'offer', 'essai'])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Messages</h1>
                <p className="text-sm text-muted-foreground">
                    Messages du formulaire de contact, offres et demandes d&apos;essai reçues sur les véhicules en
                    stock. Un e-mail vous est aussi envoyé pour chacun.
                </p>
            </div>

            {leads.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        Aucun message pour le moment.
                    </CardContent>
                </Card>
            ) : (
                <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>
            )}
        </div>
    )
}
