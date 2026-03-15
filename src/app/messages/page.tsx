'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { useMessaging } from '@/hooks/useMessaging'
import { Navbar } from '@/components/layout/navbar'
import {
    Send, Search, ArrowLeft, Loader2, ChefHat, MessageSquare, Wifi
} from 'lucide-react'

function getInitials(name: string | null | undefined) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'now'
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
}

export default function MessagesPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const [activeConvId, setActiveConvId] = useState<string | null>(null)
    const [reply, setReply] = useState('')
    const [search, setSearch] = useState('')
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
    const bottomRef = useRef<HTMLDivElement>(null)

    const {
        conversations, messages, loading, sending,
        sendMessage, loadMessages,
    } = useMessaging(activeConvId ?? undefined)

    // Open a conversation
    const openConv = (convId: string) => {
        setActiveConvId(convId)
        setMobileView('chat')
        loadMessages(convId)
    }

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!activeConvId || !reply.trim()) return
        await sendMessage(activeConvId, reply)
        setReply('')
    }

    const activeConv = conversations.find(c => c.id === activeConvId)
    const filteredConvs = conversations.filter(c =>
        c.other_user?.full_name?.toLowerCase().includes(search.toLowerCase()) ?? true
    )
    const totalUnread = conversations.reduce((s, c) => s + (c.unread_count ?? 0), 0)

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen flex items-center justify-center bg-background p-6">
                    <div className="text-center max-w-md">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                        <h1 className="text-2xl font-bold mb-3">Sign in to see your messages</h1>
                        <Link href="/login?redirectTo=/messages"
                            className="inline-flex items-center justify-center px-8 py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90">
                            Sign In →
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="bg-background" style={{ height: 'calc(100vh - 64px)' }}>
                <div className="max-w-6xl mx-auto h-full flex flex-col sm:flex-row border-x border-border">

                    {/* ── Sidebar: conversation list ───────────────── */}
                    <aside className={`${mobileView === 'chat' ? 'hidden sm:flex' : 'flex'} sm:flex flex-col w-full sm:w-80 lg:w-96 border-r border-border bg-card`}>
                        {/* Header */}
                        <div className="px-4 py-4 border-b border-border">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold">Messages</h1>
                                    {totalUnread > 0 && (
                                        <span className="w-5 h-5 rounded-full gradient-brand text-white text-xs font-bold flex items-center justify-center">
                                            {totalUnread}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
                                    <Wifi className="w-3.5 h-3.5" />Live
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
                                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search conversations…"
                                    className="flex-1 bg-transparent text-sm focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Conversation list */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                                </div>
                            ) : filteredConvs.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                                    <p className="text-sm font-semibold mb-1">No conversations yet</p>
                                    <p className="text-xs text-muted-foreground">
                                        Book a chef to start messaging!
                                    </p>
                                    <Link href="/find-chefs"
                                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 gradient-brand text-white text-xs font-bold rounded-xl">
                                        <ChefHat className="w-3.5 h-3.5" />Find a Chef
                                    </Link>
                                </div>
                            ) : filteredConvs.map(conv => (
                                <button
                                    key={conv.id}
                                    onClick={() => openConv(conv.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-border/50 hover:bg-muted transition-colors text-left ${activeConvId === conv.id ? 'bg-muted' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-11 h-11 rounded-full gradient-brand text-white font-bold text-sm flex items-center justify-center">
                                            {getInitials(conv.other_user?.full_name)}
                                        </div>
                                        {(conv.unread_count ?? 0) > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-terracotta text-white text-[10px] flex items-center justify-center font-bold">
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={`text-sm truncate ${(conv.unread_count ?? 0) > 0 ? 'font-bold' : 'font-semibold'}`}>
                                                {conv.other_user?.full_name ?? 'User'}
                                            </p>
                                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                                {timeAgo(conv.last_message_at)}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${(conv.unread_count ?? 0) > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                            {conv.last_message ?? 'Start the conversation…'}
                                        </p>
                                        <span className="text-[10px] text-terracotta capitalize mt-0.5 inline-block">
                                            {conv.other_user?.role ?? 'user'}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Your profile strip */}
                        <div className="px-4 py-3 border-t border-border bg-card flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {getInitials(profile?.full_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{profile?.full_name ?? user.email}</p>
                                <p className="text-[10px] text-muted-foreground capitalize">{profile?.role}</p>
                            </div>
                        </div>
                    </aside>

                    {/* ── Chat panel ───────────────────────────────── */}
                    <div className={`${mobileView === 'list' ? 'hidden sm:flex' : 'flex'} flex-col flex-1 min-h-0`}>
                        {activeConv ? (
                            <>
                                {/* Chat header */}
                                <div className="h-14 px-4 border-b border-border bg-card flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => setMobileView('list')}
                                        className="sm:hidden p-1 hover:bg-muted rounded-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-9 h-9 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        {getInitials(activeConv.other_user?.full_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{activeConv.other_user?.full_name}</p>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Online
                                        </p>
                                    </div>
                                    {activeConv.other_user?.role === 'chef' && (
                                        <Link
                                            href={`/find-chefs`}
                                            className="px-3 py-1.5 gradient-brand text-white text-xs font-bold rounded-lg hover:opacity-90 shrink-0"
                                        >
                                            Book Chef
                                        </Link>
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.length === 0 && (
                                        <div className="text-center text-muted-foreground text-sm py-8">
                                            <p>Say hello to {activeConv.other_user?.full_name?.split(' ')[0]}! 👋</p>
                                        </div>
                                    )}
                                    {messages.map((msg, i) => {
                                        const isOwn = msg.sender_id === user.id
                                        const prevMsg = messages[i - 1]
                                        const showAvatar = !isOwn && (prevMsg?.sender_id !== msg.sender_id || i === 0)
                                        return (
                                            <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                {!isOwn && showAvatar && (
                                                    <div className="w-7 h-7 rounded-full gradient-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0 mb-0.5">
                                                        {getInitials(activeConv.other_user?.full_name)}
                                                    </div>
                                                )}
                                                {!isOwn && !showAvatar && <div className="w-7 shrink-0" />}
                                                <div className={`max-w-[72%] sm:max-w-[60%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn
                                                            ? 'gradient-brand text-white rounded-br-sm'
                                                            : 'bg-muted text-foreground rounded-bl-sm'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    {i === messages.length - 1 && (
                                                        <span className="text-[10px] text-muted-foreground px-1">
                                                            {timeAgo(msg.created_at)} {isOwn && (msg.is_read ? '✓✓' : '✓')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <div className="px-4 py-3 border-t border-border bg-card shrink-0">
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                            placeholder={`Message ${activeConv.other_user?.full_name?.split(' ')[0]}…`}
                                            className="flex-1 bg-muted rounded-2xl px-4 py-3 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition-all resize-none"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={sending || !reply.trim()}
                                            className="w-11 h-11 gradient-brand text-white rounded-2xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all shrink-0"
                                        >
                                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Empty state */
                            <div className="flex-1 flex items-center justify-center text-center p-8">
                                <div>
                                    <div className="w-20 h-20 rounded-3xl gradient-brand/10 border border-border mx-auto mb-6 flex items-center justify-center">
                                        <MessageSquare className="w-9 h-9 text-terracotta" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">Your Messages</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Select a conversation or{' '}
                                        <Link href="/find-chefs" className="text-terracotta hover:underline">book a chef</Link>{' '}
                                        to start chatting.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
