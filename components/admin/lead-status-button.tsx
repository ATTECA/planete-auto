'use client'

import { useTransition } from 'react'
import { setLeadStatus } from '@/app/admin/(protected)/_leads/actions'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads'

export default function LeadStatusButton({ id, status }: { id: number; status: LeadStatus }) {
    const [isPending, startTransition] = useTransition()

    const handleChange = (next: LeadStatus) => {
        startTransition(() => {
            setLeadStatus(id, next)
        })
    }

    return (
        <select
            value={status}
            disabled={isPending}
            onChange={(e) => handleChange(e.target.value as LeadStatus)}
            className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
        >
            {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    )
}
