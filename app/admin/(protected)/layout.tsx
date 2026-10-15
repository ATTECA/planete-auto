import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/admin-shell'
import RealtimeLeadsRefresher from '@/components/admin/realtime-leads-refresher'
import ToastProvider from '@/components/admin/toast-provider'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <ToastProvider>
            <RealtimeLeadsRefresher />
            <AdminShell>{children}</AdminShell>
        </ToastProvider>
    )
}
