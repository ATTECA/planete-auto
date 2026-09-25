import type { ReactNode } from 'react'

/** Wraps an icon button with a small label that appears instantly on hover, unlike the native `title` tooltip. */
export default function IconTooltip({ label, children }: { label: string; children: ReactNode }) {
    return (
        <span className="group/tooltip relative inline-flex">
            {children}
            <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover/tooltip:opacity-100">
                {label}
            </span>
        </span>
    )
}
