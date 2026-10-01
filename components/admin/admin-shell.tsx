'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SidebarNav, { links } from '@/components/admin/sidebar-nav'
import LogoutButton from '@/components/admin/logout-button'

const STORAGE_KEY = 'admin-sidebar-collapsed'

export default function AdminShell({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [ready, setReady] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setCollapsed(localStorage.getItem(STORAGE_KEY) === '1')
        setReady(true)
    }, [])

    useEffect(() => {
        if (ready) localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    }, [collapsed, ready])

    return (
        <div
            className="flex bg-muted max-[850px]:flex-col"
            style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
        >
            <aside
                style={{ height: '100%', overflow: 'hidden' }}
                className={`flex shrink-0 flex-col justify-between border-r border-border bg-card transition-[width] duration-200 ease-in-out max-[850px]:hidden ${collapsed ? 'w-19' : 'w-64'
                    }`}
            >
                <div>
                    <button
                        type="button"
                        onClick={() => setCollapsed((current) => !current)}
                        title={collapsed ? 'Déplier le menu' : 'Réduire le menu'}
                        className={`flex h-16.25 w-full items-center gap-2.5 border-b border-border transition-colors hover:bg-muted ${collapsed ? 'justify-center px-0' : 'px-5'}`}
                    >
                        <Image src="/planete-auto-logo.png" alt="" width={1248} height={1046} className="h-6 w-auto shrink-0" />
                        {!collapsed && <span className="whitespace-nowrap text-xl font-semibold text-foreground">Planète Auto</span>}
                    </button>
                    <div className="p-3">
                        <SidebarNav collapsed={collapsed} />
                    </div>
                </div>
                <div className="border-t border-border p-3">
                    <LogoutButton collapsed={collapsed} />
                </div>
            </aside>
            {/* Phones: slim top bar instead of the sidebar. */}
            <header className="hidden h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 max-[850px]:flex">
                <Link href="/admin" className="flex items-center gap-2.5">
                    <Image src="/planete-auto-logo.png" alt="" width={1248} height={1046} className="h-6 w-auto shrink-0" />
                    <span className="whitespace-nowrap text-lg font-semibold text-foreground">Planète Auto</span>
                </Link>
                <div className="w-11">
                    <LogoutButton collapsed />
                </div>
            </header>
            <main
                id="admin-main"
                style={{ flex: '1 1 0%', minHeight: 0, minWidth: 0, overflowY: 'auto' }}
                className="bg-background p-8 max-[850px]:p-4"
            >
                <div className="mx-auto max-w-6xl">{children}</div>
            </main>
            {/* Phones: bottom tab bar with the same sections as the sidebar. */}
            <nav className="hidden shrink-0 grid-cols-4 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] max-[850px]:grid" aria-label="Navigation admin">
                {links.map((link) => {
                    const isActive = link.href === '/admin' ? pathname === link.href : pathname.startsWith(link.href)
                    const Icon = link.icon
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            <Icon className="size-5" />
                            {link.label === 'Tableau de bord' ? 'Accueil' : link.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
