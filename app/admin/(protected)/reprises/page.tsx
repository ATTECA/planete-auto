import { getLeads } from '@/lib/leads'
import LeadList from '../_leads/lead-list'

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

            <LeadList leads={leads} emptyText="Aucune demande pour le moment." />
        </div>
    )
}
