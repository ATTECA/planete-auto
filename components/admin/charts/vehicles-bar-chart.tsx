'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export type WeekPoint = { label: string; count: number }

export default function VehiclesBarChart({ points }: { points: WeekPoint[] }) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const max = Math.max(1, ...points.map((p) => p.count))

    return (
        <div className="flex flex-col gap-2">
            <div className="flex h-40 gap-2.5">
                {points.map((point, index) => {
                    const heightPct = (point.count / max) * 100
                    const isHovered = hoverIndex === index
                    return (
                        <div
                            key={point.label}
                            className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex((current) => (current === index ? null : current))}
                        >
                            {isHovered && (
                                <div className="pointer-events-none absolute bottom-full mb-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-md">
                                    <div className="font-semibold text-foreground">{point.count} véhicule{point.count > 1 ? 's' : ''}</div>
                                    <div className="text-muted-foreground">{point.label}</div>
                                </div>
                            )}
                            <div
                                className={cn(
                                    'w-full rounded-t-md transition-colors',
                                    isHovered ? 'bg-primary' : 'bg-primary/70',
                                )}
                                style={{ height: `${Math.max(heightPct, point.count > 0 ? 4 : 1)}%` }}
                            />
                        </div>
                    )
                })}
            </div>
            <div className="flex gap-2.5">
                {points.map((point) => (
                    <div key={point.label} className="flex-1 text-center text-[10px] text-muted-foreground">
                        {point.label}
                    </div>
                ))}
            </div>
        </div>
    )
}
