'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useDashboardData, BookingRequest, Conversation, ChefMedia } from '@/hooks/useDashboardData'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard, Calendar, MessageSquare, Edit3, Image,
    Settings, LogOut, CheckCircle, XCircle, Clock, Upload,
    DollarSign, TrendingUp, Camera, Bell, Star, Loader2, Trash2, GraduationCap
} from 'lucide-react'
import ChefAcademyDashboard from './academy/page'

// Demo data for tabs not yet fully connected to DB
const EARNINGS = [
    { month: 'Oct', amount: 2100 }, { month: 'Nov', amount: 3400 }, { month: 'Dec', amount: 5200 },
    { month: 'Jan', amount: 2800 }, { month: 'Feb', amount: 3900 }, { month: 'Mar', amount: 4600 },
]
const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests', icon: Calendar, badge: 2 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'profile', label: 'Profile', icon: Edit3 },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
]

const maxEarning = Math.max(...EARNINGS.map(e => e.amount))
const REQ_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-700',
}

/* ── Sub-views ────────────────────────────────────────── */
function OverviewView({ goTo, bookings }: { goTo: (t: string) => void, bookings: BookingRequest[] }) {
    const pending = bookings.filter(r => r.status === 'pending').length

    // Dynamic earnings calculation
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
    const realTotalEarnings = confirmedBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0)

    const currentMonth = new Date().getMonth()
    const thisMonthEarnings = confirmedBookings
        .filter(b => new Date(b.created_at).getMonth() === currentMonth)
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0)
    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {[
                    { label: 'Total Earnings', value: `£${realTotalEarnings.toLocaleString()}`, color: 'text-green-500', icon: DollarSign },
                    { label: 'This Month', value: `£${thisMonthEarnings.toLocaleString()}`, color: 'text-terracotta', icon: TrendingUp },
                    { label: 'New Requests', value: pending.toString(), color: 'text-yellow-500', icon: Clock },
                    { label: 'Avg Rating', value: '4.9★', color: 'text-blue-500', icon: Star },
                ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className={`text-2xl sm:text-3xl font-black ${color}`}>{value}</p>
                    </div>
                ))}
            </div>
            {/* Earnings chart */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-base sm:text-lg">Earnings — Last 6 Months</h2>
                    <span className="text-sm font-bold text-green-500">+18% ↑</span>
                </div>
                <div className="flex items-end gap-2 sm:gap-3 h-32 sm:h-40">
                    {EARNINGS.map(e => (
                        <div key={e.month} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-[10px] sm:text-xs font-bold text-terracotta hidden sm:block">£{(e.amount / 1000).toFixed(1)}k</span>
                            <div className="w-full gradient-brand rounded-t-lg hover:opacity-80 cursor-pointer transition-opacity"
                                style={{ height: `${(e.amount / maxEarning) * 100}%` }} />
                            <span className="text-[10px] sm:text-xs text-muted-foreground">{e.month}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => goTo('requests')} className="p-4 gradient-brand text-white rounded-2xl flex items-center gap-3 hover:opacity-90">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span className="font-semibold text-sm">View Requests</span>
                    {pending > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-white text-terracotta text-xs font-black flex items-center justify-center">{pending}</span>}
                </button>
                <button onClick={() => goTo('media')} className="p-4 bg-card border border-border rounded-2xl flex items-center gap-3 hover:bg-muted transition-colors">
                    <Upload className="w-5 h-5 text-terracotta shrink-0" />
                    <span className="font-semibold text-sm">Upload Media</span>
                </button>
            </div>
        </div>
    )
}

function RequestsView({ bookings, updateStatus }: { bookings: BookingRequest[], updateStatus: (id: string, stat: BookingRequest['status']) => Promise<void> }) {
    const [confirmDecline, setConfirmDecline] = useState<string | null>(null)
    const [processing, setProcessing] = useState<string | null>(null)

    const handleUpdate = async (id: string, s: BookingRequest['status']) => {
        setProcessing(id)
        try {
            await updateStatus(id, s)
            setConfirmDecline(null)
        } catch (err) {
            console.error('Failed to update status', err)
            alert('Failed to update booking status.')
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* Confirmation modal */}
            {confirmDecline && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                        <h3 className="font-bold text-lg mb-2">Decline Booking?</h3>
                        <p className="text-sm text-muted-foreground mb-5">This will notify the client that you&apos;re unavailable.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleUpdate(confirmDecline, 'declined')}
                                disabled={processing === confirmDecline}
                                className="flex-1 py-3 min-h-[44px] bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing === confirmDecline && <Loader2 className="w-4 h-4 animate-spin" />}
                                Decline
                            </button>
                            <button onClick={() => setConfirmDecline(null)} disabled={processing === confirmDecline} className="flex-1 py-3 min-h-[44px] border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {bookings.length === 0 && (
                <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-bold">No booking requests yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">When clients book your services, they will appear here.</p>
                </div>
            )}

            {bookings.map(r => {
                const clientName = r.user?.full_name || 'Client'
                return (
                    <div key={r.id} className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-terracotta/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="w-11 h-11 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                                {clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="font-bold text-sm">{clientName}</p>
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${REQ_STYLES[r.status] || 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">{r.event_type} · {r.event_date} at {r.start_time} · {r.guests} guests · {r.duration_hours} hrs</p>
                                <p className="text-sm font-black text-terracotta mt-0.5 mb-2">£{r.total_price}</p>
                                {r.location && <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="opacity-70">📍</span> {r.location}</p>}
                                {r.special_requests && <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-2 italic border border-border/50">&ldquo;{r.special_requests}&rdquo;</p>}
                            </div>
                            {r.status === 'pending' && (
                                <div className="flex gap-2 shrink-0 sm:flex-col">
                                    <button
                                        onClick={() => handleUpdate(r.id, 'confirmed')}
                                        disabled={!!processing}
                                        className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:w-[110px] gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                                    >
                                        {processing === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" />Accept</>}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDecline(r.id)}
                                        disabled={!!processing}
                                        className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:w-[110px] bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200 dark:border-red-900 text-sm font-bold rounded-xl hover:bg-red-100 disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        <XCircle className="w-4 h-4" />Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MessagesView({ conversations, user }: { conversations: Conversation[], user: any }) {
    const supabase = createClient()
    const [active, setActive] = useState<Conversation | null>(conversations[0] || null)
    const [reply, setReply] = useState('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [msgs, setMsgs] = useState<any[]>([])
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (active) {
            supabase.from('messages').select('*').eq('conversation_id', active.id).order('created_at', { ascending: true })
                .then(({ data }) => setMsgs(data || []))
        }
    }, [active, supabase])

    const send = async () => {
        if (!reply.trim() || !active) return
        setSending(true)
        const msg = { conversation_id: active.id, sender_id: user.id, content: reply.trim() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from('messages').insert(msg as any)
        if (!error) {
            setReply('')
            setMsgs(m => [...m, { ...msg, created_at: new Date().toISOString() }])
        }
        setSending(false)
    }

    if (!conversations.length) {
        return (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-bold">No messages yet</h3>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4" style={{ height: 'calc(100vh - 16rem)' }}>
            <div className="sm:w-60 bg-card border border-border rounded-2xl overflow-hidden flex flex-col max-h-48 sm:max-h-none">
                <p className="px-4 py-3 font-bold border-b border-border text-sm shrink-0">Clients</p>
                <div className="overflow-y-auto">
                    {conversations.map(c => (
                        <button key={c.id} onClick={() => setActive(c)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors border-b border-border/50 ${active?.id === c.id ? 'bg-muted' : ''}`}>
                            <div className="w-9 h-9 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {c.participant_avatar ? <img src={c.participant_avatar} className="w-full h-full rounded-full object-cover" alt="" /> : c.participant_name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{c.participant_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{c.last_message || 'New Match'}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden min-h-0">
                {active && (
                    <>
                        <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
                            <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center">
                                {active.participant_avatar ? <img src={active.participant_avatar} className="w-full h-full rounded-full object-cover" alt="" /> : active.participant_name[0].toUpperCase()}
                            </div>
                            <p className="font-semibold text-sm">{active.participant_name}</p>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {msgs.map((m, i) => {
                                const isMe = m.sender_id === user.id
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${isMe ? 'gradient-brand text-white rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="p-3 border-t border-border flex gap-2 shrink-0">
                            <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Reply to client…" className="flex-1 bg-muted rounded-xl px-4 py-2.5 min-h-[44px] text-sm focus:outline-none" />
                            <button onClick={send} disabled={sending} className="px-4 min-h-[44px] gradient-brand text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">Send</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function ProfileView() {
    const { profile, refreshProfile } = useAuth()
    const [bio, setBio] = useState('Award-winning Italian chef with 15 years experience.')
    const [cuisine, setCuisine] = useState('Italian')
    const [rate, setRate] = useState('150')
    const [avail, setAvail] = useState([false, false, false, false, true, true, true]) // Mon-Sun
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const save = async () => {
        setSaving(true)
        await refreshProfile()
        setSaving(false); setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
        <div className="max-w-2xl space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="font-bold text-lg mb-5">Chef Profile</h2>
                <div className="relative w-20 h-20 mb-6">
                    <div className="w-20 h-20 rounded-2xl gradient-brand text-white font-black text-xl flex items-center justify-center">
                        {profile?.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CH'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-brand text-white flex items-center justify-center shadow-lg">
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm resize-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Cuisine</label>
                            <select value={cuisine} onChange={e => setCuisine(e.target.value)}
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none">
                                {['Italian', 'Japanese', 'French', 'Spanish', 'West African', 'Indian', 'Mexican'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Rate (£/hr)</label>
                            <input type="number" value={rate} onChange={e => setRate(e.target.value)}
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Availability</label>
                        <div className="flex gap-1.5 flex-wrap">
                            {days.map((d, i) => (
                                <button key={d} onClick={() => setAvail(a => { const n = [...a]; n[i] = !n[i]; return n })}
                                    className={`px-3 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-colors ${avail[i] ? 'gradient-brand text-white border-transparent' : 'border-border hover:border-terracotta'}`}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={save} disabled={saving}
                    className="mt-5 px-6 py-2.5 min-h-[44px] gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : saved ? '✓ Saved!' : 'Save Profile'}
                </button>
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MediaView({ media, removeMedia, user }: { media: ChefMedia[], removeMedia: (id: string) => void, user: any }) {
    const supabase = createClient()
    const fileRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    const handleFiles = async (fl: FileList | null) => {
        if (!fl || !fl.length || !user) return
        setUploading(true)
        const file = fl[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage.from('chef-media').upload(filePath, file)
        if (uploadError) {
            alert('Upload failed!')
            setUploading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage.from('chef-media').getPublicUrl(filePath)
        
        await supabase.from('chef_media').insert({
            chef_id: user.id,
            title: file.name,
            video_url: publicUrl,
            thumbnail_url: publicUrl // simple fallback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)

        setUploading(false)
        /* Data will be refetched by Realtime subscription in the hook */
    }

    return (
        <div>
            {/* Drop zone */}
            <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl p-8 sm:p-12 text-center mb-6 hover:border-terracotta transition-colors cursor-pointer group">
                <input ref={fileRef} type="file" multiple={false} accept="video/*,image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-terracotta" />
                </div>
                <p className="font-bold text-lg mb-1">{uploading ? 'Uploading...' : 'Upload TikToks & Reels'}</p>
                <p className="text-sm text-muted-foreground">Post behind-the-scenes vlogs, recipes, or plated dishes.</p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold">MP4, MOV up to 500MB</p>
                {uploading && <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4 text-terracotta" />}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {media.map(m => (
                    <div key={m.id} className="relative rounded-xl overflow-hidden aspect-[9/16] bg-black group">
                        <img src={m.thumbnail_url || ''} alt={m.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 flex justify-between items-end">
                            <div>
                                <p className="text-white text-xs font-semibold leading-tight">{m.title}</p>
                                <div className="flex gap-2 mt-1 text-white/60 text-xs">
                                    <span>👁 {m.views}</span><span>❤ {m.likes}</span>
                                </div>
                            </div>
                            <button onClick={() => removeMedia(m.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingsView() {
    const [saved, setSaved] = useState(false)
    const [payoutOpen, setPayoutOpen] = useState(false)
    return (
        <div className="max-w-xl space-y-5">
            {payoutOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-3">Request Payout</h3>
                        <p className="text-sm text-muted-foreground mb-4">Your pending balance: <span className="font-bold text-green-600">£4,600</span></p>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1.5">Amount (£)</label>
                            <input defaultValue="4600" className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setPayoutOpen(false)} className="flex-1 py-3 min-h-[44px] gradient-brand text-white rounded-xl font-bold text-sm hover:opacity-90">Request Payout</button>
                            <button onClick={() => setPayoutOpen(false)} className="flex-1 py-3 min-h-[44px] border border-border rounded-xl text-sm hover:bg-muted">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="font-bold text-lg mb-5">Account Settings</h2>
                {[{ l: 'Business Name', v: 'Marco Rossi Fine Dining' }, { l: 'Email', v: 'marco@chefmii.com' }].map(f => (
                    <div key={f.l} className="mb-4">
                        <label className="block text-sm font-semibold mb-1.5">{f.l}</label>
                        <input defaultValue={f.v} className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm" />
                    </div>
                ))}
                <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
                    className="px-6 py-2.5 min-h-[44px] gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-base">Payout Settings</h2>
                    <button onClick={() => setPayoutOpen(true)} className="px-4 py-2 min-h-[40px] gradient-brand text-white text-xs font-bold rounded-lg hover:opacity-90">Request Payout</button>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-semibold text-sm text-green-800">Bank account connected</p>
                        <p className="text-xs text-green-700">Barclays •••• 4821 — Payouts every Monday</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Page ────────────────────────────────────────────── */
export default function ChefDashboardPage() {
    const router = useRouter()
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const { bookings, conversations, media, loading: dataLoading, updateBookingStatus, deleteMedia } = useDashboardData()
    const [tab, setTab] = useState('overview')
    const [signingOut, setSO] = useState(false)

    const handleSignOut = async () => { setSO(true); await signOut(); router.replace('/') }

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'CH'

    const pendingRequests = bookings.filter(b => b.status === 'pending').length

    if (authLoading || dataLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-terracotta" /></div>
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background flex-col">
            {/* Topbar */}
            <div className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-lg font-bold gradient-text-brand mr-4">ChefMii</Link>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold">
                            {tab === 'overview' ? `Good morning, ${profile?.full_name?.split(' ')[1] || 'Chef'}! 👨‍🍳` : TABS.find(t => t.id === tab)?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">Chef Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-muted">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-500" />
                    </button>
                    <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center">{initials}</div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop sidebar */}
                <aside className="hidden md:flex w-56 lg:w-64 border-r border-border bg-card flex-col shrink-0">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center">{initials}</div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{profile?.full_name || 'Chef'}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />4.9 · 128 reviews
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                        {TABS.map(({ id, label, icon: Icon, badge }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${tab === id ? 'gradient-brand text-white shadow-md' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}>
                                <Icon className="w-4 h-4 shrink-0" />{label}
                                {id === 'requests' && pendingRequests > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-yellow-500 text-white text-xs font-bold flex items-center justify-center shadow-sm animate-pulse">{pendingRequests}</span>}
                                {id === 'messages' && badge && <span className={`ml-auto w-5 h-5 rounded-full text-white text-xs flex items-center justify-center gradient-brand`}>{badge}</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <button onClick={handleSignOut} disabled={signingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                            {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                        {tab === 'overview' && <OverviewView goTo={setTab} bookings={bookings} />}
                        {tab === 'requests' && <RequestsView bookings={bookings} updateStatus={updateBookingStatus} />}
                        {tab === 'messages' && <MessagesView conversations={conversations} user={user} />}
                        {tab === 'profile' && <ProfileView />}
                        {tab === 'academy' && <ChefAcademyDashboard />}
                        {tab === 'media' && <MediaView media={media} removeMedia={deleteMedia} user={user} />}
                        {tab === 'settings' && <SettingsView />}
                    </div>
                </main>
            </div>

            {/* Mobile bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border z-50 flex">
                {TABS.map(({ id, label, icon: Icon, badge }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px] transition-colors relative ${tab === id ? 'text-terracotta' : 'text-muted-foreground'}`}>
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
