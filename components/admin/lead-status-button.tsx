'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Check, RotateCcw } from 'lucide-react'
import { setLeadStatus } from '@/app/admin/(protected)/prospects/actions'
import type { LeadStatus } from '@/lib/leads'

export default function LeadStatusButton({ id, status }: { id: number; status: LeadStatus }) {
    const [isPending, startTransition] = useTransition()
    const isNew = status === 'Nouveau'

    const handleToggle = () => {
        startTransition(() => {
            setLeadStatus(id, isNew ? 'Traité' : 'Nouveau')
        })
    }

    return (
        <Button variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
            {isNew ? (
                <>
                    <Check className="size-4" /> Marquer traité
                </>
            ) : (
                <>
                    <RotateCcw className="size-4" /> Remettre nouveau
                </>
            )}
        </Button>
    )
}
