import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { FarmerProfile, Produce, FarmerOrder, DEMO_PROFILE, DEMO_ORDERS, DEMO_PRODUCE } from '@/app/farmer-dashboard/types'

export function useFarmerDashboardData() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<FarmerProfile>(DEMO_PROFILE)
    const [produce, setProduce] = useState<Produce[]>([])
    const [orders, setOrders] = useState<FarmerOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            const supabase = createClient()

            // 1. Fetch Farmer Profile
            const { data: fpData, error: fpErr } = await supabase
                .from('farmer_profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle()

            if (fpErr && fpErr.code !== 'PGRST116') {
                throw fpErr
            }

            const currentProfile = fpData as unknown as FarmerProfile

            // If no profile exists, fallback to demo but don't crash
            if (currentProfile) {
                setProfile(currentProfile)

                // 2. Fetch Produce
                const { data: pData, error: pErr } = await supabase
                    .from('produce_listings')
                    .select('*')
                    .eq('farmer_id', currentProfile.id)

                if (pErr) throw pErr
                setProduce((pData || []) as Produce[])

                // 3. Fetch Orders
                const { data: oData, error: oErr } = await supabase
                    .from('farmer_orders')
                    .select('*, profiles!chef_id(full_name)')
                    .eq('farmer_id', currentProfile.id)
                    .order('created_at', { ascending: false })

                if (oErr) throw oErr
                
                const formattedOrders = (oData || []).map((o: Record<string, unknown>) => ({
                    ...(o as Record<string, unknown>),
                    chef_name: (o.profiles as { full_name?: string })?.full_name || 'Chef'
                })) as FarmerOrder[]
                
                setOrders(formattedOrders)
            } else {
                // If demo, load demo data so it's not empty
                setProfile(DEMO_PROFILE)
                setProduce(DEMO_PRODUCE)
                setOrders(DEMO_ORDERS)
            }

        } catch (err) {
            console.error('Error fetching farmer data:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch farmer dashboard data'))
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    // Realtime subscriptions
    useEffect(() => {
        if (!user || profile.id === 'demo') return

        const supabase = createClient()
            
        const channel = supabase.channel(`farmer-dashboard-${profile.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'farmer_profiles', filter: `id=eq.${profile.id}` }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'produce_listings', filter: `farmer_id=eq.${profile.id}` }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'farmer_orders', filter: `farmer_id=eq.${profile.id}` }, fetchAllData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, profile.id, fetchAllData])

    return { profile, produce, orders, loading, error, refresh: fetchAllData, updateProfile: setProfile, updateOrders: setOrders, updateProduce: setProduce }
}
