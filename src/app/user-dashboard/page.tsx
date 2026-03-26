'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import {
    LayoutDashboard, Calendar, MessageSquare, Star, Settings,
    LogOut, ChefHat, Clock, CheckCircle, XCircle, MapPin,
    Search, Bell, Loader2, Send
} from 'lucide-react'
import { useUserDashboardData, UserBooking, AvailableChef, UserConversation } from '@/hooks/useUserDashboardData'

const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
const STATUS_ICONS: Record<string, React.ElementType> = {
    confirmed: CheckCircle, pending: Clock, completed: CheckCircle, cancelled: XCircle, declined: XCircle
}


/* ── Sub-views ─────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OverviewView({ userName, goTo, bookings }: { userName: string; goTo: (t: string) => void, bookings: UserBooking[] }) {
    const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
    const spent = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + Number(b.total_price), 0)
    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {[
                    { label: 'Total Bookings', value: bookings.length.toString(), color: 'text-terracotta' },
                    { label: 'Upcoming', value: upcoming.length.toString(), color: 'text-green-500' },
                    { label: 'Total Spent', value: `£${spent.toLocaleString()}`, color: 'text-blue-500' },
                    { label: 'Reviews Given', value: '2', color: 'text-yellow-500' },
                ].map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{s.label}</p>
                        <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>
            {/* Upcoming */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-base sm:text-lg">Upcoming Bookings</h2>
                    <button onClick={() => goTo('bookings')} className="text-terracotta text-sm font-medium hover:underline">View all</button>
                </div>
                {upcoming.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                        <ChefHat className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        No upcoming bookings. <button onClick={() => goTo('book')} className="text-terracotta hover:underline">Book a chef!</button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {upcoming.map(b => {
                            const Icon = STATUS_ICONS[b.status] || Clock
                            const chefInitial = b.chef?.full_name ? b.chef.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : 'C'
                            return (
                                <div key={b.id} className="px-4 sm:px-6 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        {b.chef?.avatar_url ? <img src={b.chef.avatar_url} alt="Chef" className="w-full h-full object-cover rounded-xl" /> : chefInitial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{b.chef?.full_name || 'Chef'}</p>
                                        <p className="text-xs text-muted-foreground">{b.event_type} · {new Date(b.event_date).toLocaleDateString()}</p>
                                        <p className="text-xs text-muted-foreground hidden sm:flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{b.location}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-sm">£{b.total_price}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}>
                                            <Icon className="w-3 h-3" />{b.status}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => goTo('book')} className="p-4 gradient-brand text-white rounded-2xl flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <ChefHat className="w-5 h-5 shrink-0" />
                    <span className="font-semibold text-sm">Book a Chef</span>
                </button>
                <button onClick={() => goTo('messages')} className="p-4 bg-card border border-border rounded-2xl flex items-center gap-3 hover:bg-muted transition-colors relative">
                    <MessageSquare className="w-5 h-5 text-terracotta shrink-0" />
                    <span className="font-semibold text-sm">Messages</span>
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full gradient-brand text-white text-xs flex items-center justify-center">3</span>
                </button>
            </div>
        </div>
    )
}

function BookingsView({ bookings }: { bookings: UserBooking[] }) {
    const [filter, setFilter] = useState<string>('all')
    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
    return (
        <div>
            {/* Filter chips — scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 min-h-[40px] rounded-full text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${filter === f ? 'gradient-brand text-white border-transparent' : 'border-border hover:border-terracotta hover:text-terracotta'}`}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>
            <div className="space-y-3">
                {filtered.map(b => {
                    const Icon = STATUS_ICONS[b.status] || Clock
                    const chefInitial = b.chef?.full_name ? b.chef.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : 'C'
                    return (
                        <div key={b.id} className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-10 h-10 rounded-xl gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0">
                                    {b.chef?.avatar_url ? <img src={b.chef.avatar_url} alt="Chef" className="w-full h-full object-cover rounded-xl" /> : chefInitial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <p className="font-bold text-sm">{b.chef?.full_name || 'Chef'}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`}>
                                            <Icon className="w-3 h-3" />{b.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{b.event_type} · {b.guests} guests</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Calendar className="w-3 h-3" />{new Date(b.event_date).toLocaleDateString()} at {b.start_time.slice(0, 5)}
                                    </p>
                                    <p className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />{b.location}
                                    </p>
                                </div>
                                <p className="font-black text-base sm:text-xl shrink-0 text-terracotta">£{b.total_price}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function BookChefView({ chefs }: { chefs: AvailableChef[] }) {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [cuisine, setCuisine] = useState('All')
    const [maxRate, setMaxRate] = useState(500)

    const filtered = chefs.filter(c =>
        (cuisine === 'All' || c.cuisine === cuisine) &&
        (c.hourly_rate || 500) <= maxRate && c.full_name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div>
            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-3 sm:p-4 mb-5 space-y-3">
                <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 min-h-[44px]">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chefs..." className="flex-1 bg-transparent text-sm focus:outline-none" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['All', 'Italian', 'Japanese', 'French', 'West African', 'Spanish', 'Pan-African'].map(c => (
                        <button key={c} onClick={() => setCuisine(c)}
                            className={`px-3 py-1.5 min-h-[36px] rounded-full text-xs font-medium border transition-colors ${cuisine === c ? 'gradient-brand text-white border-transparent' : 'border-border hover:border-terracotta'}`}>
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Max £{maxRate}/hr</span>
                    <input type="range" min="50" max="500" step="25" value={maxRate} onChange={e => setMaxRate(+e.target.value)} className="flex-1 accent-terracotta" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(c => {
                    const initials = c.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                    return (
                        <div key={c.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-11 h-11 rounded-xl gradient-brand text-white font-bold flex items-center justify-center text-sm shrink-0 overflow-hidden">
                                    {c.avatar_url ? <img src={c.avatar_url} alt="" className="w-full h-full object-cover" /> : initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{c.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{c.cuisine}</p>
                                    <div className="flex items-center gap-1 text-xs mt-0.5">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        <span className="font-semibold">{c.rating}</span>
                                        <span className="text-muted-foreground">({c.reviews})</span>
                                    </div>
                                </div>
                                <span className="text-terracotta font-black text-sm shrink-0">£{c.hourly_rate}/hr</span>
                            </div>
                            <button
                                onClick={() => router.push(`/book/${c.id}`)}
                                className="w-full py-2.5 min-h-[44px] gradient-brand text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
                                Book Now
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function MessagesView({ conversations }: { conversations: UserConversation[] }) {
    const [active, setActive] = useState<UserConversation | null>(conversations[0] || null)
    const [reply, setReply] = useState('')
    const { user } = useAuth()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const supabaseClient = typeof window !== 'undefined' ? require('@/lib/supabase/client').createClient() : null

    // For messages of the active conversation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [msgs, setMsgs] = useState<any[]>([])
    const [loadingMsgs, setLoadingMsgs] = useState(false)

    useEffect(() => {
        if (!active || !user || !supabaseClient) return
        
        const fetchMsgs = async () => {
            setLoadingMsgs(true)
            const { data } = await supabaseClient
                .from('messages')
                .select('*')
                .eq('conversation_id', active.id)
                .order('created_at', { ascending: true })
            if (data) setMsgs(data)
            setLoadingMsgs(false)
        }
        
        fetchMsgs()
        
        const channel = supabaseClient.channel(`msgs-${active.id}`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${active.id}` }, (payload: any) => {
                setMsgs(prev => [...prev, payload.new])
            })
            .subscribe()
            
            
        return () => { supabaseClient.removeChannel(channel) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active?.id, user?.id, supabaseClient])

    const send = async () => {
        if (!reply.trim() || !active || !user || !supabaseClient) return
        const msgText = reply
        setReply('')
        
        await supabaseClient.from('messages').insert({
            conversation_id: active.id,
            sender_id: user.id,
            content: msgText
        })
        
        await supabaseClient.from('conversations').update({
            last_message: msgText,
            last_message_at: new Date().toISOString()
        }).eq('id', active.id)
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
                <h3 className="font-bold text-lg mb-2">No Conversations Yet</h3>
                <p className="text-muted-foreground text-sm text-center">You don&apos;t have any active conversations with chefs. Book a chef to start chatting!</p>
            </div>
        )
    }

    if (!active) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-4" style={{ height: 'calc(100vh - 16rem)' }}>
            {/* Thread list */}
            <div className="sm:w-64 bg-card border border-border rounded-2xl overflow-hidden flex flex-col max-h-48 sm:max-h-none">
                <p className="px-4 py-3 font-bold border-b border-border text-sm shrink-0">Chefs</p>
                <div className="overflow-y-auto">
                    {conversations.map(m => {
                        const initials = m.participant_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                        return (
                            <button key={m.id} onClick={() => setActive(m)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors border-b border-border/50 ${active.id === m.id ? 'bg-muted' : ''}`}>
                                <div className="w-9 h-9 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                                    {m.participant_avatar ? <img src={m.participant_avatar} alt="" className="w-full h-full object-cover" /> : initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{m.participant_name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{m.last_message || 'New conversation'}</p>
                                </div>
                                {m.unread_count > 0 && <span className="w-5 h-5 rounded-full gradient-brand text-white text-xs flex items-center justify-center shrink-0">{m.unread_count}</span>}
                            </button>
                        )
                    })}
                </div>
            </div>
            {/* Chat */}
            <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden min-h-0">
                <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                        {active.participant_avatar ? <img src={active.participant_avatar} alt="" className="w-full h-full object-cover" /> : active.participant_name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="font-semibold text-sm">{active.participant_name}</p>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {loadingMsgs ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                        </div>
                    ) : msgs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            No messages yet. Say hello!
                        </div>
                    ) : (
                        msgs.map((m, i) => {
                            const isMe = m.sender_id === user?.id
                            return (
                                <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${isMe ? 'gradient-brand text-white rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                <div className="p-3 border-t border-border flex gap-2 shrink-0">
                    <input value={reply} onChange={e => setReply(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a message…"
                        className="flex-1 bg-muted rounded-xl px-4 py-2.5 min-h-[44px] text-sm focus:outline-none" />
                    <button onClick={send} disabled={!reply.trim()} className="px-4 min-h-[44px] gradient-brand text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function ReviewsView() {
    return (
        <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="text-center">
                    <p className="text-5xl font-black gradient-text-brand">4.5</p>
                    <div className="flex justify-center gap-0.5 my-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />)}</div>
                    <p className="text-xs text-muted-foreground">Your avg rating</p>
                </div>
                <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map(n => (
                        <div key={n} className="flex items-center gap-2 text-sm">
                            <span className="w-3 text-muted-foreground shrink-0">{n}</span>
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                            <div className="flex-1 bg-muted rounded-full h-2">
                                <div className="gradient-brand h-2 rounded-full" style={{ width: n === 5 ? '60%' : n === 4 ? '40%' : '0%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {[
                { chef: 'Chef Pierre Dubois', date: '4 Feb 2026', rating: 5, comment: 'Absolutely incredible 5-course dinner. Pierre exceeded every expectation!', event: 'Dinner Party' },
                { chef: 'Chef Aisha Okafor', date: '17 Jan 2026', rating: 4, comment: 'Excellent food, great energy. A few dishes could have been hotter.', event: 'Corporate Lunch' },
            ].map(r => (
                <div key={r.chef} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2 gap-2">
                        <div>
                            <p className="font-bold text-sm">{r.chef}</p>
                            <p className="text-xs text-muted-foreground">{r.event} · {r.date}</p>
                        </div>
                        <div className="flex gap-0.5 shrink-0">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                </div>
            ))}
        </div>
    )
}

function SettingsView({ profile }: { profile: { full_name: string | null; role: string | null } | null }) {
    const { refreshProfile } = useAuth()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const supabaseClient = typeof window !== 'undefined' ? require('@/lib/supabase/client').createClient() : null
    const [name, setName] = useState(profile?.full_name || '')
    const [phone, setPhone] = useState('')
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        if (supabaseClient) {
            const { data: { user } } = await supabaseClient.auth.getUser()
            if (user) {
                await supabaseClient.from('profiles').update({ full_name: name, phone, updated_at: new Date().toISOString() }).eq('id', user.id)
                await refreshProfile()
            }
        }
        setSaving(false); setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="max-w-xl space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="font-bold text-lg mb-5">Profile Information</h2>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl gradient-brand text-white font-black text-xl flex items-center justify-center shrink-0">
                        {name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
                    </div>
                    <button className="px-4 py-2 min-h-[40px] border border-border rounded-lg text-sm hover:bg-muted transition-colors">Change Photo</button>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Full Name', value: name, set: setName, type: 'text' },
                        { label: 'Phone', value: phone, set: setPhone, type: 'tel' },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                            <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm" />
                        </div>
                    ))}
                </div>
                <button onClick={save} disabled={saving}
                    className="mt-5 px-6 py-2.5 min-h-[44px] gradient-brand text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="font-bold text-base mb-4">Notifications</h2>
                {['Booking confirmations', 'Chef messages', 'Promotional offers', 'Weekly digest'].map(n => (
                    <label key={n} className="flex items-center justify-between py-3 border-b border-border last:border-0 cursor-pointer min-h-[44px]">
                        <span className="text-sm">{n}</span>
                        <div className="w-10 h-6 rounded-full gradient-brand relative cursor-pointer shrink-0">
                            <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                        </div>
                    </label>
                ))}
            </div>
        </div>
    )
}

/* ── Page ─────────────────────────────────────────────── */
export default function UserDashboardPage() {
    const router = useRouter()
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const { bookings, chefs, conversations, loading: dataLoading, error } = useUserDashboardData()
    const [tab, setTab] = useState('overview')
    const [signingOut, setSO] = useState(false)

    const handleSignOut = async () => {
        setSO(true)
        await signOut()
        router.replace('/')
    }

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?'

    const pendingMessages = conversations.reduce((acc, c) => acc + c.unread_count, 0)
    
    const TABS = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'book', label: 'Book', icon: ChefHat },
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: pendingMessages > 0 ? pendingMessages : undefined },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-bold p-6 text-center">
                Error loading dashboard: {error.message}
            </div>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background flex-col">
            {/* Topbar */}
            <div className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-1.5 mr-2 sm:mr-4">
                        <span className="text-lg font-bold gradient-text-brand">ChefMii</span>
                    </Link>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold">
                            {tab === 'overview' ? `Good morning, ${profile?.full_name?.split(' ')[0] || 'there'}! 👋` : TABS.find(t => t.id === tab)?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">Client Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-muted">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta" />
                    </button>
                    <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center cursor-pointer" onClick={() => setTab('settings')}>
                        {initials}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop sidebar */}
                <aside className="hidden md:flex w-56 lg:w-64 border-r border-border bg-card flex-col shrink-0">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-brand text-white font-black text-sm flex items-center justify-center">{initials}</div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{profile?.full_name || user?.email}</p>
                                <p className="text-xs text-muted-foreground">Premium Member</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                        {TABS.map(({ id, label, icon: Icon, badge }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${tab === id ? 'gradient-brand text-white' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}>
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                                {badge && <span className="ml-auto w-5 h-5 rounded-full bg-terracotta text-white text-xs flex items-center justify-center shrink-0">{badge}</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <button onClick={handleSignOut} disabled={signingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                            {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                        {tab === 'overview' && <OverviewView userName={profile?.full_name?.split(' ')[0] || ''} goTo={setTab} bookings={bookings} />}
                        {tab === 'bookings' && <BookingsView bookings={bookings} />}
                        {tab === 'book' && <BookChefView chefs={chefs} />}
                        {tab === 'messages' && <MessagesView conversations={conversations} />}
                        {tab === 'reviews' && <ReviewsView />}
                        {tab === 'settings' && <SettingsView profile={profile} />}
                    </div>
                </main>
            </div>

            {/* Mobile bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border z-50 flex items-stretch safe-bottom">
                {TABS.map(({ id, label, icon: Icon, badge }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors relative ${tab === id ? 'text-terracotta' : 'text-muted-foreground hover:text-foreground'}`}>
                        <div className="relative">
                            <Icon className="w-5 h-5" />
                            {badge && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-terracotta text-white text-[10px] flex items-center justify-center">{badge}</span>}
                        </div>
                        <span className="text-[10px] font-medium">{label}</span>
                        {tab === id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-terracotta" />}
                    </button>
                ))}
            </nav>
        </div>
    )
}
