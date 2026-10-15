'use client'

import { useTransition } from 'react'
import { Menu } from '@base-ui/react/menu'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { setLeadStatus } from '@/app/admin/(protected)/_leads/actions'
import { useToast } from '@/components/admin/toast-provider'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads'

/** Solid color per status, so the processing stage is readable at a glance. */
function statusClassName(status: LeadStatus): string {
    if (status === 'Nouveau') return 'bg-blue-600 text-white'
    if (status === 'En cours') return 'bg-orange-400 text-white'
    return 'bg-green-600 text-white'
}

/** Small colored dot matching each status, shown in the dropdown list. */
function statusDotClassName(status: LeadStatus): string {
    if (status === 'Nouveau') return 'bg-blue-600'
    if (status === 'En cours') return 'bg-orange-400'
    return 'bg-green-600'
}

export default function LeadStatusButton({ id, status }: { id: number; status: LeadStatus }) {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleChange = (next: LeadStatus) => {
        if (next === status) return
        startTransition(async () => {
            try {
                await setLeadStatus(id, next)
                toast(`Statut passé à « ${next} »`)
            } catch {
                toast('Le changement de statut a échoué. Réessayez.', { tone: 'error', duration: 5000 })
            }
        })
    }

    return (
        <Menu.Root>
            <Menu.Trigger
                disabled={isPending}
                className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full pl-3.5 pr-2.5 text-sm font-semibold outline-none ring-offset-2 transition-opacity focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${statusClassName(status)}`}
            >
                {status}
                {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <ChevronDown className="size-3.5" />}
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner sideOffset={6} align="end" className="z-50">
                    <Menu.Popup className="min-w-40 rounded-xl font-sans border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                        <Menu.RadioGroup value={status} onValueChange={(value) => handleChange(value as LeadStatus)}>
                            {LEAD_STATUSES.map((value) => (
                                <Menu.RadioItem
                                    key={value}
                                    value={value}
                                    closeOnClick
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none select-none data-highlighted:bg-muted"
                                >
                                    <span className={`size-2 rounded-full ${statusDotClassName(value)}`} />
                                    <span className="flex-1">{value}</span>
                                    <Menu.RadioItemIndicator>
                                        <Check className="size-3.5 text-muted-foreground" />
                                    </Menu.RadioItemIndicator>
                                </Menu.RadioItem>
                            ))}
                        </Menu.RadioGroup>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    )
}
