import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

export interface InfluencerCollab {
    id: string
    influencer_id: string
    brand_name: string
    campaign_type: string
    feeAmount: number
    status: 'pending' | 'active' | 'completed' | 'cancelled'
    dueDate: string
    created_at: string
}

export function useInfluencerDashboardData() {
    const { user } = useAuth()
    const [collabs, setCollabs] = useState<InfluencerCollab[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            const supabase = createClient()
            
            // 1. Fetch Collaborations
            const { data: cData, error: cErr } = await supabase
                .from('influencer_collabs')
                .select('*')
                .eq('influencer_id', user.id)
                .order('due_date', { ascending: true })

            // Silently ignore missing table if migrations haven't run or if feature isn't fully DB-backed
            if (cErr && cErr.code !== '42P01') {
                throw cErr
            }

            const formattedCollabs = (cData || []).map((c: Record<string, unknown>) => ({
                id: c.id as string,
                influencer_id: c.influencer_id as string,
                brand_name: (c.brand_name as string) || 'Brand',
                campaign_type: (c.campaign_type as string) || 'Campaign',
                feeAmount: (c.fee_amount as number) || 0,
                status: (c.status as 'pending' | 'active' | 'completed' | 'cancelled') || 'pending',
                dueDate: (c.due_date as string) || (c.created_at as string),
                created_at: c.created_at as string
            })) as InfluencerCollab[]

            setCollabs(formattedCollabs)

        } catch (err) {
            console.error('Error fetching influencer data:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch influencer dashboard data'))
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
            
        const channel = supabase.channel(`influencer-dashboard-${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'influencer_collabs', filter: `influencer_id=eq.${user.id}` }, fetchAllData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, fetchAllData])

    return { collabs, loading, error, refresh: fetchAllData }
}
