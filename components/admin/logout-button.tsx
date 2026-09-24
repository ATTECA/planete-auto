'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
        <Button
            variant="ghost"
            onClick={handleLogout}
            title={collapsed ? 'Se déconnecter' : undefined}
            className={`w-full gap-2.5 text-muted-foreground hover:text-foreground ${collapsed ? 'justify-center' : 'justify-start'}`}
        >
            <LogOut className="size-4 shrink-0" />
            {!collapsed && 'Se déconnecter'}
        </Button>
    )
}
