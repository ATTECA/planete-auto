import Link from 'next/link'
import { Minus, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatTrend = { delta: number; label: string }

export default function StatCard({
    label,
    value,
    icon: Icon,
    href,
    accent,
    trend,
}: {
    label: string
    value: number
    icon: LucideIcon
    href: string
    accent: string
    trend?: StatTrend
}) {
    return (
        <Link
            href={href}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
            <Icon className={cn('pointer-events-none absolute -bottom-3 -right-3 size-20 opacity-[0.06] transition-transform duration-300 group-hover:scale-110', accent.split(' ')[0])} />

            <div className="flex items-center justify-between">
                <div className={cn('flex size-10 items-center justify-center rounded-xl', accent)}>
                    <Icon className="size-5" />
                </div>
                {trend && <TrendBadge trend={trend} />}
            </div>

            <div>
                <div className="text-3xl font-bold tabular-nums text-foreground">{value}</div>
                <div className="text-sm font-medium text-muted-foreground">{label}</div>
            </div>
        </Link>
    )
}

function TrendBadge({ trend }: { trend: StatTrend }) {
    const isUp = trend.delta > 0
    const isDown = trend.delta < 0
    const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
    const colorClass = isUp
        ? 'bg-green-100 text-green-700'
        : isDown
          ? 'bg-red-100 text-red-700'
          : 'bg-muted text-muted-foreground'

    return (
        <span className={cn('flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold', colorClass)}>
            <Icon className="size-3" />
            {trend.delta > 0 ? `+${trend.delta}` : trend.delta} {trend.label}
        </span>
    )
}
