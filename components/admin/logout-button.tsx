'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
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
            className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
        >
            <LogOut className="size-4" />
            Se déconnecter
        </Button>
    )
}
