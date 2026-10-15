'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import IconTooltip from '@/components/admin/icon-tooltip'
import { useToast } from '@/components/admin/toast-provider'
import { Copy } from 'lucide-react'
import { duplicateVehicle } from '@/app/admin/(protected)/vehicules/actions'

export default function DuplicateVehicleButton({ id, name }: { id: number; name: string }) {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleDuplicate = () => {
        startTransition(async () => {
            try {
                await duplicateVehicle(id)
                toast(`« ${name} » a été dupliqué`)
            } catch {
                toast('La duplication a échoué. Réessayez.', { tone: 'error', duration: 5000 })
            }
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
