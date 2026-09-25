'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import IconTooltip from '@/components/admin/icon-tooltip'
import { Trash2 } from 'lucide-react'
import { deleteVehicle } from '@/app/admin/(protected)/vehicules/actions'

export default function DeleteVehicleButton({ id, name }: { id: number; name: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm(`Supprimer définitivement "${name}" ? Cette action est irréversible.`)) {
            return
        }
        startTransition(() => {
            deleteVehicle(id)
        })
    }

    return (
        <IconTooltip label="Supprimer">
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
        </IconTooltip>
    )
}
