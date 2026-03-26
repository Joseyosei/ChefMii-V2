import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

export interface CorporateEvent {
    id: string
    business_id: string
    name: string
    event_date: string
    guests: number
    budget: number
    status: 'planned' | 'confirmed' | 'completed' | 'cancelled'
    created_at: string
}

export function useBusinessDashboardData() {
    const { user } = useAuth()
    const [events, setEvents] = useState<CorporateEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            const supabase = createClient()
            
            // 1. Fetch Corporate Events
            const { data: eData, error: eErr } = await supabase
                .from('corporate_requests')
                .select('*')
                .eq('business_id', user.id)
                .order('event_date', { ascending: true })

            if (eErr && eErr.code !== '42P01') {
                throw eErr
            }

            // Map database rows to our interface
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedEvents = (eData || []).map((e: any) => ({
                id: e.id,
                business_id: e.business_id,
                name: e.company_name + ' Event', // or fallback if name doesn't exist
                event_date: e.event_date || e.created_at,
                guests: e.guest_count || 50,
                budget: e.budget || 5000,
                status: e.status || 'planned',
                created_at: e.created_at
            })) as CorporateEvent[]

            setEvents(formattedEvents)

        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err : new Error('Failed to fetch business dashboard data'))
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    // Realtime subscriptions
    useEffect(() => {
        if (!user) return

        const supabase = createClient()
            
        const channel = supabase.channel(`business-dashboard-${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'corporate_requests', filter: `business_id=eq.${user.id}` }, fetchAllData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, fetchAllData])

    return { events, loading, error, refresh: fetchAllData }
}
