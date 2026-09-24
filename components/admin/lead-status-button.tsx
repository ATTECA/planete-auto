'use client'

import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { setLeadStatus } from '@/app/admin/(protected)/_leads/actions'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads'

/** Solid color per status, so the processing stage is readable at a glance. */
function statusClassName(status: LeadStatus): string {
    if (status === 'Nouveau') return 'bg-blue-600 text-white'
    if (status === 'En cours') return 'bg-orange-400 text-white'
    return 'bg-green-600 text-white'
}

export default function LeadStatusButton({ id, status }: { id: number; status: LeadStatus }) {
    const [isPending, startTransition] = useTransition()

    const handleChange = (next: LeadStatus) => {
        startTransition(() => {
            setLeadStatus(id, next)
        })
    }

    return (
        <div className="relative">
            <select
                value={status}
                disabled={isPending}
                onChange={(e) => handleChange(e.target.value as LeadStatus)}
                className={`h-9 cursor-pointer appearance-none rounded-full border-0 py-0 pl-3.5 pr-8 text-sm font-semibold outline-none ring-offset-2 transition-opacity focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${statusClassName(status)}`}
            >
                {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-background text-foreground">
                        {s}
                    </option>
                ))}
            </select>
            {isPending ? (
                <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-white" />
            ) : (
                <svg
                    className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    )
}
