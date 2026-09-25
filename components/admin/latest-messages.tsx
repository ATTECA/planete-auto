import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LatestMessageItem = {
    id: number
    name: string
    typeLabel: string
    status: string
    date: string
    href: string
}

export default function LatestMessages({ items }: { items: LatestMessageItem[] }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Derniers messages</h2>
                <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Derniers messages</h2>
            <div className="flex flex-col divide-y divide-border">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="group flex items-center gap-3.5 py-3 first:pt-0 last:pb-0"
                    >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                            <MessageSquare className="size-4.5" />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <span className="text-sm font-semibold text-foreground">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.typeLabel} · {item.date}</span>
                        </div>
                        <span
                            className={cn(
                                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                                item.status === 'Nouveau' && 'bg-orange-100 text-orange-700',
                                item.status === 'En cours' && 'bg-blue-100 text-blue-700',
                                item.status === 'Traité' && 'bg-green-100 text-green-700',
                            )}
                        >
                            {item.status}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
