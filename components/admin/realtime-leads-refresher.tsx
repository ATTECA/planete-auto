'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/** Silently refreshes the current admin route whenever a lead (message, offre, essai, reprise) is created or its status changes — no manual reload needed. */
export default function RealtimeLeadsRefresher() {
    const router = useRouter()

    useEffect(() => {
        const client = createClient()

        const channel = client
            .channel('leads-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                router.refresh()
            })
            .subscribe()

        return () => {
            client.removeChannel(channel)
        }
    }, [router])

    return null
}
