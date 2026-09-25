'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/** Silently refreshes the current route's server data whenever a vehicle is added, edited, archived or deleted, on the public site or in the admin — no manual reload needed. */
export default function RealtimeVehiclesRefresher() {
    const router = useRouter()

    useEffect(() => {
        const client = supabase
        if (!client) return

        const channel = client
            .channel('vehicles-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, (payload) => {
                if (process.env.NODE_ENV !== 'production') console.log('[realtime] vehicles change received', payload)
                router.refresh()
            })
            .subscribe((status) => {
                if (process.env.NODE_ENV !== 'production') console.log('[realtime] channel status:', status)
            })

        return () => {
            client.removeChannel(channel)
        }
    }, [router])

    return null
}
