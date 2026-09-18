import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutButton from '@/components/admin/logout-button'
import SidebarNav from '@/components/admin/sidebar-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="flex h-screen overflow-hidden bg-muted">
            <aside className="flex w-64 flex-col justify-between border-r border-border bg-card">
                <div>
                    <div className="flex items-center gap-2.5 border-b border-border px-5 py-5">
                        <Image src="/planete-auto-logo.png" alt="" width={1248} height={1046} className="h-6 w-auto" />
                        <span className="text-xl font-semibold text-foreground">Planète Auto</span>
                    </div>
                    <div className="p-3">
                        <SidebarNav />
                    </div>
                </div>
                <div className="border-t border-border p-3">
                    <LogoutButton />
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    )
}
