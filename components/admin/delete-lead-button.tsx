'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteLead } from '@/app/admin/(protected)/_leads/actions'

export default function DeleteLeadButton({ id, name }: { id: number; name: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm(`Supprimer définitivement la demande de "${name}" ? Cette action est irréversible.`)) {
            return
        }
        startTransition(() => {
            deleteLead(id)
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
        >
            <Trash2 className="size-4" />
            <span className="sr-only">Supprimer</span>
        </Button>
    )
}
