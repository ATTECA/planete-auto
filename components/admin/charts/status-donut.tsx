'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export type StatusSlice = { key: string; label: string; value: number; colorClass: string; hex: string }

const SIZE = 160
const STROKE = 22
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function StatusDonut({ slices }: { slices: StatusSlice[] }) {
    const [hovered, setHovered] = useState<string | null>(null)
    const total = slices.reduce((sum, s) => sum + s.value, 0)

    let offset = 0
    const segments = slices
        .filter((s) => s.value > 0)
        .map((slice) => {
            const fraction = total > 0 ? slice.value / total : 0
            const dash = fraction * CIRCUMFERENCE
            const gap = CIRCUMFERENCE - dash
            const segment = { ...slice, dash, gap, offset }
            offset += dash
            return segment
        })

    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
            <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
                    <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
                    {segments.map((segment) => (
                        <circle
                            key={segment.key}
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            fill="none"
                            stroke={segment.hex}
                            strokeWidth={STROKE}
                            strokeDasharray={`${segment.dash} ${segment.gap}`}
                            strokeDashoffset={-segment.offset}
                            strokeLinecap="butt"
                            onMouseEnter={() => setHovered(segment.key)}
                            onMouseLeave={() => setHovered((current) => (current === segment.key ? null : current))}
                            className="cursor-pointer transition-opacity duration-150"
                            style={{ opacity: hovered && hovered !== segment.key ? 0.35 : 1 }}
                        />
                    ))}
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tabular-nums text-foreground">
                        {hovered ? slices.find((s) => s.key === hovered)?.value : total}
                    </span>
                    <span className="text-xs text-muted-foreground">{hovered ? slices.find((s) => s.key === hovered)?.label : 'Total'}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                {slices.map((slice) => (
                    <button
                        type="button"
                        key={slice.key}
                        onMouseEnter={() => setHovered(slice.key)}
                        onMouseLeave={() => setHovered((current) => (current === slice.key ? null : current))}
                        className={cn(
                            'flex items-center gap-2.5 rounded-md px-1.5 py-1 text-left transition-opacity',
                            hovered && hovered !== slice.key && 'opacity-40',
                        )}
                    >
                        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.hex }} />
                        <span className="text-sm font-medium text-foreground">{slice.label}</span>
                        <span className="text-sm tabular-nums text-muted-foreground">{slice.value}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
