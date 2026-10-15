'use client'

import { Button } from '@/components/ui/button'
import IconTooltip from '@/components/admin/icon-tooltip'
import { useToast } from '@/components/admin/toast-provider'
import { Trash2 } from 'lucide-react'
import { deleteVehicle } from '@/app/admin/(protected)/vehicules/actions'

export default function DeleteVehicleButton({ id, name }: { id: number; name: string }) {
    const { scheduleDelete } = useToast()

    const handleDelete = () => {
        scheduleDelete({
            key: `vehicle-${id}`,
            pendingMessage: `« ${name} » va être supprimé`,
            doneMessage: `« ${name} » a été supprimé`,
            run: () => deleteVehicle(id),
        })
    }

    return (
        <IconTooltip label="Supprimer">
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive"
            >
                <Trash2 className="size-4" />
                <span className="sr-only">Supprimer</span>
            </Button>
        </IconTooltip>
    )
}
