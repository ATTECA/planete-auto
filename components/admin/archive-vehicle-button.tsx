'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import IconTooltip from '@/components/admin/icon-tooltip'
import { useToast } from '@/components/admin/toast-provider'
import { Archive, ArchiveRestore } from 'lucide-react'
import { setVehicleArchived } from '@/app/admin/(protected)/vehicules/actions'

export default function ArchiveVehicleButton({ id, name, archived }: { id: number; name: string; archived: boolean }) {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleToggle = () => {
        startTransition(async () => {
            try {
                await setVehicleArchived(id, !archived)
                toast(archived ? `« ${name} » est de nouveau en ligne` : `« ${name} » a été archivé`)
            } catch {
                toast("L'archivage a échoué. Réessayez.", { tone: 'error', duration: 5000 })
            }
        })
    }

    return (
        <IconTooltip label={archived ? 'Désarchiver' : 'Archiver'}>
            <Button
                variant="ghost"
                size="icon-sm"
                disabled={isPending}
                onClick={handleToggle}
                className="text-muted-foreground hover:text-foreground"
            >
                {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                <span className="sr-only">{archived ? 'Désarchiver' : 'Archiver'}</span>
            </Button>
        </IconTooltip>
    )
}
