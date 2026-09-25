'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import SidebarNav from '@/components/admin/sidebar-nav'
import LogoutButton from '@/components/admin/logout-button'

const STORAGE_KEY = 'admin-sidebar-collapsed'

export default function AdminShell({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setCollapsed(localStorage.getItem(STORAGE_KEY) === '1')
        setReady(true)
    }, [])

    useEffect(() => {
        if (ready) localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    }, [collapsed, ready])

    return (
        <div
            className="flex bg-muted"
            style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
        >
            <aside
                style={{ height: '100%', overflow: 'hidden' }}
                className={`flex shrink-0 flex-col justify-between border-r border-border bg-card transition-[width] duration-200 ease-in-out ${collapsed ? 'w-19' : 'w-64'
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
            <main
                id="admin-main"
                style={{ flex: '1 1 0%', minHeight: 0, minWidth: 0, overflowY: 'auto' }}
                className="p-8"
            >
                <div className="mx-auto max-w-6xl">{children}</div>
            </main>
        </div>
    )
}
