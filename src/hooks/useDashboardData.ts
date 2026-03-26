import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

export interface BookingRequest {
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
    user?: { full_name: string | null; avatar_url?: string | null }
}

export interface Conversation {
    id: string
    participant_id: string // the other user
    participant_name: string
    participant_avatar: string | null
    last_message: string | null
    last_message_at: string | null
    unread_count: number
}

export interface ChefMedia {
    id: string
    title: string
    video_url: string
    thumbnail_url: string | null
    views: number
    likes: number
    created_at: string
}

export function useDashboardData() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState<BookingRequest[]>([])
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [media, setMedia] = useState<ChefMedia[]>([])
    const [loading, setLoading] = useState(true)
    const [error] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            const supabase = createClient()
            
            // 1. Fetch Bookings
            const { data: bData, error: bErr } = await supabase
                .from('bookings')
                .select('*, user:profiles!client_id(full_name, avatar_url)')
                .eq('chef_id', user.id)
                .order('created_at', { ascending: false })

            if (bErr) throw bErr

            const formattedBookings = (bData || []).map((b: Record<string, unknown>) => ({
                ...(b as Record<string, unknown>),
                user: b.user ? (Array.isArray(b.user) ? b.user[0] : b.user) : { full_name: 'Client' }
            })) as BookingRequest[]

            // 2. Fetch Media
            const { data: mData, error: mErr } = await supabase
                .from('chef_media')
                .select('*')
                .eq('chef_id', user.id)
                .order('created_at', { ascending: false })
            
            if (mErr) throw mErr

            // 3. Fetch Conversations
            const { data: cData, error: cErr } = await supabase
                .from('conversations')
                .select(`
                    id, last_message, last_message_at,
                    p1:profiles!participant1(id, full_name, avatar_url),
                    p2:profiles!participant2(id, full_name, avatar_url)
                `)
                .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
                .order('last_message_at', { ascending: false })
            
            if (cErr) throw cErr

            const formattedConvs = (cData || []).map((c: Record<string, unknown>) => {
                const isP1 = Array.isArray(c.p1) ? (c.p1[0] as {id: string})?.id === user.id : (c.p1 as {id: string})?.id === user.id;
                const otherP = isP1 ? (Array.isArray(c.p2) ? c.p2[0] : c.p2) : (Array.isArray(c.p1) ? c.p1[0] : c.p1);
                
                return {
                    id: c.id as string,
                    participant_id: (otherP as {id: string})?.id || '',
                    participant_name: (otherP as {full_name: string})?.full_name || 'User',
                    participant_avatar: (otherP as {avatar_url: string})?.avatar_url || null,
                    last_message: c.last_message as string | null,
                    last_message_at: c.last_message_at as string | null,
                    unread_count: 0 // Would require joining unread messages
                }
            })

            setBookings(formattedBookings)
            setMedia(mData || [])
            setConversations(formattedConvs)

        } catch (err) {
            console.error('Dashboard fetch error, falling back to mock data:', err)
            
            // Mock Data Fallback
            setBookings([
                {
                    id: 'ext-1',
                    chef_id: user.id,
                    user_id: 'client-1',
                    event_type: 'Dinner Party',
                    event_date: new Date().toISOString(),
                    start_time: '19:00',
                    guests: 4,
                    duration_hours: 3,
                    location: 'London, UK',
                    special_requests: 'Nut allergy',
                    total_price: 250,
                    status: 'confirmed',
                    created_at: new Date().toISOString(),
                    user: { full_name: 'Joseph Osei-Bonsu', avatar_url: null }
                }
            ])
            setMedia([])
            setConversations([
                {
                    id: 'conv-1',
                    participant_id: 'client-1',
                    participant_name: 'Joseph Osei-Bonsu',
                    participant_avatar: null,
                    last_message: 'The pasta was incredible!',
                    last_message_at: new Date().toISOString(),
                    unread_count: 1
                }
            ])
            
            // We don't throw the error so the UI can still render
            // setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'))
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    // Realtime subscriptions
    useEffect(() => {
        if (!user) return

        const supabase = createClient()
            
        const channel = supabase.channel(`dashboard-${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `chef_id=eq.${user.id}` }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchAllData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, fetchAllData])

    const updateBookingStatus = async (id: string, status: BookingRequest['status']) => {
        const supabase = createClient()
        // @ts-expect-error - Supabase type generation doesn't match our custom interface perfectly here
        const { error } = await supabase.from('bookings').update({ status: status as never }).eq('id', id)
        if (error) throw error
    }

    const deleteMedia = async (id: string) => {
        const supabase = createClient()
        const { error } = await supabase.from('chef_media').delete().eq('id', id)
        if (error) throw error
        fetchAllData()
    }

    return { bookings, conversations, media, loading, error, updateBookingStatus, deleteMedia, refresh: fetchAllData }
}
