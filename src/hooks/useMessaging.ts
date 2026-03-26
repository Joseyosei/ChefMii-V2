'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
}

export interface Conversation {
    id: string
    participant1: string
    participant2: string
    last_message: string | null
    last_message_at: string
    other_user?: {
        id: string
        full_name: string | null
        avatar_url: string | null
        role: string
    }
    unread_count?: number
}

export function useMessaging(conversationId?: string) {
    const { user } = useAuth()
    const supabase = createClient()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

    /* ── Load conversations ───────────────────────────── */
    const loadConversations = useCallback(async () => {
        if (!user) return
        const { data } = await supabase
            .from('conversations')
            .select('*')
            .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
            .order('last_message_at', { ascending: false })

        if (!data) { setLoading(false); return }

        // Enrich with other user profile
        const enriched: Conversation[] = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (data as any[]).map(async (conv: any) => {
                const otherId = conv.participant1 === user.id ? conv.participant2 : conv.participant1
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, role')
                    .eq('id', otherId)
                    .single()

                // Count unread
                const { count } = await supabase
                    .from('messages')
                    .select('id', { count: 'exact', head: true })
                    .eq('conversation_id', conv.id)
                    .eq('is_read', false)
                    .neq('sender_id', user.id)

                return { ...conv, other_user: profile ?? undefined, unread_count: count ?? 0 }
            })
        )
        setConversations(enriched)
        setLoading(false)
    }, [user, supabase])

    /* ── Load messages for one conversation ──────────── */
    const loadMessages = useCallback(async (convId: string) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true })
        setMessages(data ?? [])

        // Mark as read
        if (user) {
            await supabase
                .from('messages')
                // @ts-expect-error Bypass type mismatch
                .update({ is_read: true })
                .eq('conversation_id', convId)
                .neq('sender_id', user.id)
        }
    }, [user, supabase])

    /* ── Realtime subscription ───────────────────────── */
    useEffect(() => {
        if (!conversationId) return

        loadMessages(conversationId)

        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message])
                    // Mark read if from other user
                    if (user && (payload.new as Message).sender_id !== user.id) {
                        // @ts-expect-error Bypass type mismatch
                        supabase.from('messages').update({ is_read: true }).eq('id', (payload.new as Message).id)
                    }
                }
            )
            .subscribe()

        channelRef.current = channel
        return () => { supabase.removeChannel(channel) }
    }, [conversationId, loadMessages, supabase, user])

    /* ── Load conversations on mount ─────────────────── */
    useEffect(() => { loadConversations() }, [loadConversations])

    /* ── Send message ────────────────────────────────── */
    const sendMessage = useCallback(async (convId: string, content: string) => {
        if (!user || !content.trim()) return false
        setSending(true)
        // @ts-expect-error Bypass type mismatch
        const { error } = await supabase.from('messages').insert({
            conversation_id: convId,
            sender_id: user.id,
            content: content.trim(),
        })
        // Update conversation last_message
        if (!error) {
            await supabase
                .from('conversations')
                // @ts-expect-error Bypass type mismatch
                .update({ last_message: content.trim(), last_message_at: new Date().toISOString() })
                .eq('id', convId)
            await loadConversations()
        }
        setSending(false)
        return !error
    }, [user, supabase, loadConversations])

    /* ── Start or get conversation ───────────────────── */
    const getOrCreateConversation = useCallback(async (otherUserId: string): Promise<string | null> => {
        if (!user) return null
        const uid = user.id

        // Check both orderings
        const { data: existingData } = await supabase
            .from('conversations')
            .select('id')
            .or(
                `and(participant1.eq.${uid},participant2.eq.${otherUserId}),and(participant1.eq.${otherUserId},participant2.eq.${uid})`
            )
            .maybeSingle()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existing = existingData as any;

        if (existing) return existing.id

        const { data: createdData } = await supabase
            .from('conversations')
            // @ts-expect-error Bypass type mismatch
            .insert({ participant1: uid, participant2: otherUserId })
            .select('id')
            .single()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const created = createdData as any;

        await loadConversations()
        return created?.id ?? null
    }, [user, supabase, loadConversations])

    return {
        conversations, messages, loading, sending,
        sendMessage, getOrCreateConversation, loadMessages, loadConversations,
    }
}
