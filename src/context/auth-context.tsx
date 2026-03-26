'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export type UserRole = 'client' | 'chef' | 'business' | 'admin' | 'kids' | 'influencer' | 'farmer'

export interface Profile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: UserRole
    phone: string | null
}

interface AuthContextType {
    user: User | null
    profile: Profile | null
    session: Session | null
    loading: boolean
    role: UserRole | null
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = useCallback(async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        if (data) setProfile(data as Profile)
    }, [supabase])

    const refreshProfile = useCallback(async () => {
        if (user) await fetchProfile(user.id)
    }, [user, fetchProfile])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false))
            else setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id)
            else setProfile(null)
        })

        return () => subscription.unsubscribe()
    }, [supabase, fetchProfile])

    const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }
        return { error: null }
    }

    const signUp = async (
        email: string, password: string, fullName: string, role: UserRole
    ): Promise<{ error: string | null }> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, role },
            },
        })
        if (error) return { error: error.message }

        // Upsert profile row
        if (data.user) {
            // @ts-expect-error Bypass type mismatch
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email,
                full_name: fullName,
                role,
            })
        }
        return { error: null }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setSession(null)
    }

    return (
        <AuthContext.Provider value={{
            user, profile, session, loading,
            role: profile?.role ?? null,
            signIn, signUp, signOut, refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
    return ctx
}

/** Derive dashboard URL from role */
export function dashboardHref(role: UserRole | null): string {
    if (role === 'chef') return '/chef-dashboard'
    if (role === 'business') return '/business-dashboard'
    if (role === 'influencer') return '/influencer-dashboard'
    if (role === 'farmer') return '/farmer-dashboard'
    if (role === 'kids') return '/kids-dashboard'
    return '/user-dashboard'
}
