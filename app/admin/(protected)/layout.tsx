import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/logout-button'


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div>
            <header>
                <span>Admin</span>
                <LogoutButton />
            </header>
            <main>{children}</main>
        </div>
    )
}