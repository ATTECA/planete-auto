'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import IconTooltip from '@/components/admin/icon-tooltip'
import { Archive, ArchiveRestore } from 'lucide-react'
import { setVehicleArchived } from '@/app/admin/(protected)/vehicules/actions'

export default function ArchiveVehicleButton({ id, archived }: { id: number; archived: boolean }) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(() => {
            setVehicleArchived(id, !archived)
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
