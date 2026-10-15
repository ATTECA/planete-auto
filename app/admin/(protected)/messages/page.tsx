import { getLeads } from '@/lib/leads'
import LeadList from '../_leads/lead-list'

export default async function AdminMessagesPage() {
    const leads = await getLeads(['contact', 'devis', 'offer', 'essai'])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">Messages</h1>
                <p className="text-sm text-muted-foreground">
                    Messages de contact, demandes de devis, offres et demandes d&apos;essai reçus via le site. Un e-mail
                    vous est aussi envoyé pour chacun.
                </p>
            </div>

            <LeadList leads={leads} emptyText="Aucun message pour le moment." />
        </div>
    )
}
