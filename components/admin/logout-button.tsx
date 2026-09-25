'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Se déconnecter' : undefined}
            className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${collapsed ? 'justify-center' : ''
                }`}
        >
            <LogOut className="size-4 shrink-0" />
            {!collapsed && 'Se déconnecter'}
        </button>
    )
}
