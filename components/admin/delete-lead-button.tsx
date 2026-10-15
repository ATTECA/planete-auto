'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/admin/toast-provider'
import { Trash2 } from 'lucide-react'
import { deleteLead } from '@/app/admin/(protected)/_leads/actions'

export default function DeleteLeadButton({ id, name }: { id: number; name: string }) {
    const { scheduleDelete } = useToast()

    const handleDelete = () => {
        scheduleDelete({
            key: `lead-${id}`,
            pendingMessage: `La demande de « ${name} » va être supprimée`,
            doneMessage: `La demande de « ${name} » a été supprimée`,
            run: () => deleteLead(id),
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
        >
            <Trash2 className="size-4" />
            <span className="sr-only">Supprimer</span>
        </Button>
    )
}
