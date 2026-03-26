import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

export interface KidsProfile {
    id: string
    user_id: string
    xp: number
    streak_days: number
    level: number
}

export interface KidLesson {
    id: string
    title: string
    emoji: string
    level: 'Beginner' | 'Medium' | 'Hard'
    xp_reward: number
    is_completed: boolean
    is_unlocked: boolean
}

export interface KidBadge {
    id: string
    emoji: string
    name: string
    is_earned: boolean
}

// Fallback values if nothing exists
const FALLBACK_PROFILE = { id: '', user_id: '', xp: 225, streak_days: 5, level: 3 }
const FALLBACK_LESSONS: KidLesson[] = [
    { id: '1', title: 'Make Fruit Salad', emoji: '🍉', level: 'Beginner', xp_reward: 50, is_unlocked: true, is_completed: true },
    { id: '2', title: 'Easy Pancakes', emoji: '🥞', level: 'Beginner', xp_reward: 75, is_unlocked: true, is_completed: true },
    { id: '3', title: 'Rainbow Veggie Skewers', emoji: '🌈', level: 'Medium', xp_reward: 100, is_unlocked: true, is_completed: false },
    { id: '4', title: 'Mini Pizza Party', emoji: '🍕', level: 'Medium', xp_reward: 125, is_unlocked: false, is_completed: false },
    { id: '5', title: 'Homemade Ice Cream', emoji: '🍦', level: 'Hard', xp_reward: 200, is_unlocked: false, is_completed: false },
]
const FALLBACK_BADGES: KidBadge[] = [
    { id: 'b1', emoji: '⭐', name: 'First Cook', is_earned: true },
    { id: 'b2', emoji: '🥗', name: 'Salad Star', is_earned: true },
    { id: 'b3', emoji: '🥞', name: 'Pancake Pro', is_earned: true },
    { id: 'b4', emoji: '🍕', name: 'Pizza Maker', is_earned: false },
    { id: 'b5', emoji: '🍩', name: 'Baker Badge', is_earned: false },
    { id: 'b6', emoji: '👑', name: 'Master Chef Jr', is_earned: false },
]

export function useKidsDashboardData() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<KidsProfile>(FALLBACK_PROFILE)
    const [lessons] = useState<KidLesson[]>(FALLBACK_LESSONS)
    const [badges] = useState<KidBadge[]>(FALLBACK_BADGES)
    const [loading, setLoading] = useState(true)

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            const supabase = createClient()
            
            // Try fetching kids profile
            const { data: pData, error: pErr } = await supabase
                .from('kids_profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle()

            if (pErr && pErr.code !== '42P01') throw pErr
            
            if (pData) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const profileData = pData as any;
                setProfile({
                    id: profileData.id,
                    user_id: profileData.user_id,
                    xp: profileData.xp || 0,
                    streak_days: profileData.streak_days || 0,
                    level: Math.floor((profileData.xp || 0) / 100) + 1
                })
                
                // Fetch lessons logic (if custom tables exist) goes here
                // ...
                // Fetch badges logic (if custom tables exist) goes here
                // ...
                
            }

        } catch (err) {
            console.error('Error fetching kids dashboard data:', err)
            // Silently fallback to dummy data for kids
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    // Minimal realtime subscription logic
    useEffect(() => {
        if (!user) return
        const supabase = createClient()
        const channel = supabase.channel(`kids-${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'kids_profiles', filter: `user_id=eq.${user.id}` }, fetchAllData)
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [user, fetchAllData])

    return { profile, lessons, badges, loading, refresh: fetchAllData }
}
