import Link from 'next/link'
import { AlertTriangle, type LucideIcon } from 'lucide-react'

export type AlertItem = {
    key: string
    label: string
    detail: string
    count: number
    href: string
    icon: LucideIcon
}

export default function AlertsPanel({ items }: { items: AlertItem[] }) {
    const active = items.filter((item) => item.count > 0)

    if (active.length === 0) {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <AlertTriangle className="size-5" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-foreground">Tout est en ordre</div>
                    <div className="text-sm text-muted-foreground">Aucune alerte à signaler pour le moment.</div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Alertes</h2>
            <div className="flex flex-col divide-y divide-border">
                {active.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        className="group flex items-center gap-3.5 py-3 first:pt-0 last:pb-0"
                    >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                            <item.icon className="size-4.5" />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <span className="text-sm font-semibold text-foreground">{item.count} {item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.detail}</span>
                        </div>
                        <span className="text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
