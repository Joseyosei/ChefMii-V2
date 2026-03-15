import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

export interface UserBooking {
    id: string
    chef_id: string
    user_id: string
    event_type: string
    event_date: string
    start_time: string
    guests: number
    duration_hours: number
    location: string
    special_requests: string | null
    total_price: number
    status: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled'
    created_at: string
    chef?: {
        full_name: string | null
        avatar_url: string | null
    }
}

export interface AvailableChef {
    id: string
    full_name: string
    avatar_url: string | null
    cuisine: string | null
    hourly_rate: number | null
    specialties: string[] | null
    rating?: number
    reviews?: number
}

export interface UserConversation {
    id: string
    participant_id: string
    participant_name: string
    participant_avatar: string | null
    last_message: string | null
    last_message_at: string | null
    unread_count: number
}

export function useUserDashboardData() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState<UserBooking[]>([])
    const [chefs, setChefs] = useState<AvailableChef[]>([])
    const [conversations, setConversations] = useState<UserConversation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            const supabase = createClient()
            
            // 1. Fetch Bookings
            const { data: bData, error: bErr } = await supabase
                .from('bookings')
                .select('*, chef:profiles!chef_id(full_name, avatar_url)')
                .eq('client_id', user.id) // Assuming client_id is the foreign key for the user
                .order('created_at', { ascending: false })

            if (bErr && bErr.code !== '42703') throw bErr // 42703 is column does not exist, schema uses user_id
            
            // Fallback if schema uses user_id
            let finalBData = bData;
            if (!finalBData) {
                const { data: bDataAlt, error: bErrAlt } = await supabase
                    .from('bookings')
                    .select('*, chef:profiles!chef_id(full_name, avatar_url)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                if (bErrAlt) throw bErrAlt
                finalBData = bDataAlt
            }

            const formattedBookings = (finalBData || []).map((b: Record<string, unknown>) => ({
                ...(b as Record<string, unknown>),
                chef: b.chef ? (Array.isArray(b.chef) ? b.chef[0] : b.chef) : { full_name: 'Unknown Chef' }
            })) as UserBooking[]

            // 2. Fetch Available Chefs
            const { data: cData, error: cErr } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, role')
                .eq('role', 'chef')
            
            if (cErr) throw cErr

            // Try to get specific chef details from chef_profiles
            const { data: detailsData, error: detailsErr } = await supabase
                .from('chef_profiles')
                .select('id, specialties, hourly_rate')
            
            if (detailsErr) throw detailsErr

            const formattedChefs = (cData || []).map((c: Record<string, unknown>) => {
                const details = (detailsData as Array<{id: string, specialties: string[], hourly_rate: number}> | null)?.find(d => d.id === c.id)
                return {
                    id: c.id as string,
                    full_name: (c.full_name as string) || 'Chef',
                    avatar_url: c.avatar_url as string | null,
                    cuisine: details?.specialties?.[0] || 'Various',
                    hourly_rate: details?.hourly_rate || 100,
                    specialties: details?.specialties || [],
                    rating: 4.8, // Mocked until reviews are built
                    reviews: 12  // Mocked until reviews are built
                }
            })

            // 3. Fetch Conversations
            const { data: convData, error: convErr } = await supabase
                .from('conversations')
                .select(`
                    id, last_message, last_message_at,
                    p1:profiles!participant1(id, full_name, avatar_url),
                    p2:profiles!participant2(id, full_name, avatar_url)
                `)
                .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
                .order('last_message_at', { ascending: false })
            
            if (convErr) throw convErr

            const formattedConvs = (convData || []).map((c: Record<string, unknown>) => {
                const isP1 = Array.isArray(c.p1) ? (c.p1[0] as {id: string})?.id === user.id : (c.p1 as {id: string})?.id === user.id;
                const otherP = isP1 ? (Array.isArray(c.p2) ? c.p2[0] : c.p2) : (Array.isArray(c.p1) ? c.p1[0] : c.p1);
                
                return {
                    id: c.id as string,
                    participant_id: (otherP as {id: string})?.id || '',
                    participant_name: (otherP as {full_name: string})?.full_name || 'User',
                    participant_avatar: (otherP as {avatar_url: string})?.avatar_url || null,
                    last_message: c.last_message as string | null,
                    last_message_at: c.last_message_at as string | null,
                    unread_count: 0
                }
            })

            setBookings(formattedBookings)
            setChefs(formattedChefs)
            setConversations(formattedConvs)

        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err : new Error('Failed to fetch user dashboard data'))
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
            
        // Assuming user_id is the fk
        const channel = supabase.channel(`user-dashboard-${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchAllData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, fetchAllData])

    return { bookings, chefs, conversations, loading, error, refresh: fetchAllData }
}
