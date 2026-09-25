'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import IconTooltip from '@/components/admin/icon-tooltip'
import { Copy } from 'lucide-react'
import { duplicateVehicle } from '@/app/admin/(protected)/vehicules/actions'

export default function DuplicateVehicleButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition()

    const handleDuplicate = () => {
        startTransition(() => {
            duplicateVehicle(id)
        })
    }

    return (
        <IconTooltip label="Dupliquer">
            <Button
                variant="ghost"
                size="icon-sm"
                disabled={isPending}
                onClick={handleDuplicate}
                className="text-muted-foreground hover:text-foreground"
            >
                <Copy className="size-4" />
                <span className="sr-only">Dupliquer</span>
            </Button>
        </IconTooltip>
    )
}
