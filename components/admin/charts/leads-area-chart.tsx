'use client'

import { useState } from 'react'

export type DayPoint = { date: string; count: number; label: string }

const WIDTH = 600
const HEIGHT = 180
const PAD_LEFT = 8
const PAD_RIGHT = 8
const PAD_TOP = 12
const PAD_BOTTOM = 8

export default function LeadsAreaChart({ points }: { points: DayPoint[] }) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const max = Math.max(1, ...points.map((p) => p.count))
    const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT
    const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

    const coords = points.map((p, i) => {
        const x = PAD_LEFT + (points.length > 1 ? (i / (points.length - 1)) * innerWidth : innerWidth / 2)
        const fraction = Math.max(p.count / max, p.count > 0 ? 0.04 : 0)
        const y = PAD_TOP + innerHeight - fraction * innerHeight
        return { x, y, ...p }
    })

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')
    const areaPath = `${linePath} L${coords[coords.length - 1]?.x ?? 0},${PAD_TOP + innerHeight} L${coords[0]?.x ?? 0},${PAD_TOP + innerHeight} Z`

    function handleMove(event: React.MouseEvent<SVGRectElement>) {
        const rect = event.currentTarget.getBoundingClientRect()
        const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH
        let closest = 0
        let closestDist = Infinity
        coords.forEach((c, i) => {
            const dist = Math.abs(c.x - relativeX)
            if (dist < closestDist) {
                closestDist = dist
                closest = i
            }
        })
        setHoverIndex(closest)
    }

    const hovered = hoverIndex !== null ? coords[hoverIndex] : null
    const firstLabel = points[0]?.label
    const lastLabel = points[points.length - 1]?.label
    const midLabel = points[Math.floor(points.length / 2)]?.label

    return (
        <div className="flex flex-1 flex-col gap-1">
        <div className="relative flex-1">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--red)" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75, 1].map((f) => (
                    <line
                        key={f}
                        x1={PAD_LEFT}
                        x2={WIDTH - PAD_RIGHT}
                        y1={PAD_TOP + innerHeight * f}
                        y2={PAD_TOP + innerHeight * f}
                        stroke="var(--line)"
                        strokeWidth={1}
                    />
                ))}

                <path d={areaPath} fill="url(#leadsFill)" />
                <path d={linePath} fill="none" stroke="var(--red)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

                {hovered && (
                    <>
                        <line x1={hovered.x} x2={hovered.x} y1={PAD_TOP} y2={PAD_TOP + innerHeight} stroke="var(--red)" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                        <circle cx={hovered.x} cy={hovered.y} r={4} fill="var(--red)" stroke="white" strokeWidth={2} />
                    </>
                )}

                <rect
                    x={0}
                    y={0}
                    width={WIDTH}
                    height={HEIGHT}
                    fill="transparent"
                    onMouseMove={handleMove}
                    onMouseLeave={() => setHoverIndex(null)}
                    style={{ cursor: 'crosshair' }}
                />
            </svg>

            {hovered && (
                <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-md"
                    style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100}%` }}
                >
                    <div className="font-semibold text-foreground">{hovered.count} demande{hovered.count > 1 ? 's' : ''}</div>
                    <div className="text-muted-foreground">{hovered.label}</div>
                </div>
            )}
        </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{firstLabel}</span>
                <span>{midLabel}</span>
                <span>{lastLabel}</span>
            </div>
        </div>
    )
}
