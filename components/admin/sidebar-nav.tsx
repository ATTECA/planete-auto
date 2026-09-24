'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Car, RefreshCcw, MessageSquare } from 'lucide-react'

const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/vehicules', label: 'Véhicules', icon: Car },
    { href: '/admin/reprises', label: 'Reprises', icon: RefreshCcw },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
    const pathname = usePathname()

    return (
        <nav className="flex flex-col gap-1">
            {links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        title={collapsed ? link.label : undefined}
                        className={
                            (isActive
                                ? 'flex items-center gap-2.5 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary'
                                : 'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground')
                            + (collapsed ? ' justify-center' : '')
                        }
                    >
                        <Icon className="size-4 shrink-0" />
                        {!collapsed && link.label}
                    </Link>
                )
            })}
        </nav>
    )
}
