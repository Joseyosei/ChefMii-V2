'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import {
    Heart, MessageCircle, Bookmark, Share2, Volume2, VolumeX,
    Plus, X, ChefHat, Search, Home, Bell, User as UserIcon,
    Send, Loader2, Upload, CheckCircle,
} from 'lucide-react'

/* ── Types ───────────────────────────────────────────────────── */
interface MediaItem {
    id: string
    chef_id: string
    video_url: string
    thumbnail_url: string | null
    title: string
    description: string | null
    cuisine_tags: string[]
    likes: number
    views: number
    bookings_generated: number
    comments_count: number
    created_at: string
    chef?: { full_name: string | null; avatar_url: string | null }
    isLiked?: boolean
    isSaved?: boolean
    score?: number
}

interface Comment {
    id: string
    user_id: string
    content: string
    created_at: string
    user?: { full_name: string | null }
}

/* ── Seed data (shown when DB empty) ────────────────────────── */
const SEED: MediaItem[] = [
    {
        id: 's1', chef_id: 'c1',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&q=80',
        title: 'Perfect Carbonara in 8 Minutes 🍝',
        description: 'The secret is egg temperature — no cream, just technique!',
        cuisine_tags: ['italian', 'pasta', 'london'],
        likes: 18200, views: 234000, bookings_generated: 47, comments_count: 184,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        chef: { full_name: 'Chef Marco Rossi', avatar_url: null },
    },
    {
        id: 's2', chef_id: 'c2',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
        title: 'Omakase Sushi at Home 🍣',
        description: '14 pieces, all fresh from Toyosu Market grade fish',
        cuisine_tags: ['japanese', 'sushi', 'omakase'],
        likes: 44100, views: 612000, bookings_generated: 89, comments_count: 422,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        chef: { full_name: 'Chef Yuki Tanaka', avatar_url: null },
    },
    {
        id: 's3', chef_id: 'c3',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
        title: 'Jollof vs The World 🌍🔥',
        description: 'West African jollof rice that hits different every time',
        cuisine_tags: ['westAfrican', 'jollof', 'lagos'],
        likes: 32000, views: 480000, bookings_generated: 61, comments_count: 890,
        created_at: new Date(Date.now() - 10800000).toISOString(),
        chef: { full_name: 'Chef Aisha Okafor', avatar_url: null },
    },
    {
        id: 's4', chef_id: 'c4',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
        title: 'Paella Masterclass 🥘',
        description: 'Socarrat is the only thing that matters. Here\'s how to nail it.',
        cuisine_tags: ['spanish', 'paella', 'barcelona'],
        likes: 9800, views: 144000, bookings_generated: 22, comments_count: 103,
        created_at: new Date(Date.now() - 21600000).toISOString(),
        chef: { full_name: 'Chef Sofía Mendez', avatar_url: null },
    },
    {
        id: 's5', chef_id: 'c5',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=80',
        title: 'Duck Confit with Orange Jus 🦆',
        description: 'Classic French bistro dish made accessible. No special equipment needed.',
        cuisine_tags: ['french', 'classical', 'paris'],
        likes: 21600, views: 318000, bookings_generated: 38, comments_count: 267,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        chef: { full_name: 'Chef Pierre Dubois', avatar_url: null },
    },
    {
        id: 's6', chef_id: 'c6',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
        title: 'Ayurvedic Thali for Glowing Skin ✨',
        description: 'Nourish from within. 6 dishes, all anti-inflammatory.',
        cuisine_tags: ['indian', 'ayurvedic', 'healthy'],
        likes: 28900, views: 391000, bookings_generated: 55, comments_count: 341,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        chef: { full_name: 'Chef Meera Patel', avatar_url: null },
    },
]

/* ── Algorithm: score each item ─────────────────────────────── */
function scoreItems(items: MediaItem[]): MediaItem[] {
    const maxLikes = Math.max(...items.map(i => i.likes), 1)
    const maxViews = Math.max(...items.map(i => i.views), 1)
    const maxBookings = Math.max(...items.map(i => i.bookings_generated), 1)
    const now = Date.now()

    return [...items]
        .map(item => {
            const hoursSince = (now - new Date(item.created_at).getTime()) / 3_600_000
            const score =
                (1 / Math.pow(hoursSince + 2, 1.5)) * 0.30 +
                (item.likes / maxLikes) * 0.25 +
                (item.views / maxViews) * 0.20 +
                (item.bookings_generated / maxBookings) * 0.25
            return { ...item, score }
        })
        .sort((a, b) => {
            // Randomise bottom 30%
            if ((a.score ?? 0) < 0.15 && Math.random() > 0.5) return 1
            return (b.score ?? 0) - (a.score ?? 0)
        })
}

/* ── Formatters ──────────────────────────────────────────────── */
function fmt(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
}

/* ── Comments sheet ──────────────────────────────────────────── */
function CommentsSheet({
    item, onClose,
}: { item: MediaItem; onClose: () => void }) {
    const { user } = useAuth()
    const [comments, setComments] = useState<Comment[]>([])
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)

    const load = useCallback(async () => {
        const sb = createClient()
        const { data } = await sb
            .from('media_comments')
            .select('id, user_id, content, created_at, profiles(full_name)')
            .eq('media_id', item.id)
            .order('created_at', { ascending: false })
        if (data) {
            setComments(data.map((c: Record<string, unknown>) => ({
                ...(c as unknown as Comment),
                user: (c.profiles as { full_name: string | null }) ?? { full_name: 'Anonymous' },
            })))
        }
    }, [item.id])

    useEffect(() => { load() }, [load])

    const sendComment = async () => {
        if (!user || !text.trim()) return
        setSending(true)
        const sb = createClient()
        await sb.from('media_comments').insert({
            media_id: item.id,
            user_id: user.id,
            content: text.trim(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        setText('')
        await load()
        setSending(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
            <div className="bg-card rounded-t-3xl border-t border-border max-h-[70vh] flex flex-col"
                onClick={e => e.stopPropagation()}>
                {/* Handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-4" />
                <div className="px-4 pb-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-base">{item.comments_count} comments</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>

                {/* Comment list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Demo comments */}
                    {[
                        { id: 'd1', content: 'Absolutely incredible! Booking this chef for my anniversary 🔥', user: 'Priya S.', time: '2m' },
                        { id: 'd2', content: 'The technique at 2:30 is mind-blowing. Pure mastery 👏', user: 'James W.', time: '15m' },
                        { id: 'd3', content: 'My husband made this last night and I cried it was so good 😭', user: 'Emma T.', time: '1h' },
                    ].map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full gradient-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {c.user.split(' ')[0][0]}
                            </div>
                            <div>
                                <p className="text-xs font-bold">{c.user} <span className="font-normal text-muted-foreground">{c.time} ago</span></p>
                                <p className="text-sm mt-0.5">{c.content}</p>
                            </div>
                        </div>
                    ))}
                    {comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full gradient-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {(c.user?.full_name ?? 'U')[0]}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">{c.user?.full_name ?? 'Anonymous'}</p>
                                <p className="text-sm mt-0.5">{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border flex gap-2">
                    {user ? (
                        <>
                            <input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendComment()}
                                placeholder="Add a comment…"
                                className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
                            />
                            <button onClick={sendComment} disabled={sending || !text.trim()}
                                className="w-10 h-10 gradient-brand text-white rounded-2xl flex items-center justify-center disabled:opacity-40">
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="flex-1 text-center text-sm text-terracotta font-semibold">
                            Sign in to comment →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── Upload Modal ────────────────────────────────────────────── */
function UploadModal({ onClose }: { onClose: () => void }) {
    const { user } = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const addTag = () => {
        const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
        if (t && !tags.includes(t)) setTags(prev => [...prev, t])
        setTagInput('')
    }

    const upload = async () => {
        if (!user || !file || !title) return
        setUploading(true)
        const sb = createClient()
        const path = `${user.id}/${Date.now()}-${file.name}`
        const { data: storageData, error: storageErr } = await sb.storage
            .from('chef-media')
            .upload(path, file, { upsert: false })

        if (storageErr) { alert('Upload failed: ' + storageErr.message); setUploading(false); return }

        const videoUrl = sb.storage.from('chef-media').getPublicUrl(storageData.path).data.publicUrl

        // @ts-expect-error Bypass type mismatch
        await sb.from('chef_media').insert({
            chef_id: user.id,
            video_url: videoUrl,
            title,
            description: desc,
            cuisine_tags: tags,
        })
        setUploading(false)
        setStep(3)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-lg">{step === 3 ? '🎉 Uploaded!' : 'Upload Video'}</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>

                <div className="p-5 space-y-4">
                    {step === 1 && (
                        <>
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-terracotta transition-colors group"
                            >
                                <input ref={fileRef} type="file" accept="video/*" className="hidden"
                                    onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setStep(2) } }} />
                                <Upload className="w-10 h-10 text-muted-foreground group-hover:text-terracotta mx-auto mb-3 transition-colors" />
                                <p className="font-semibold text-sm">Tap to select video</p>
                                <p className="text-xs text-muted-foreground mt-1">MP4, MOV up to 500MB</p>
                            </div>
                        </>
                    )}

                    {step === 2 && file && (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center shrink-0">
                                    <ChefHat className="w-5 h-5 text-terracotta" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1_048_576).toFixed(1)} MB</p>
                                </div>
                                <button onClick={() => { setFile(null); setStep(1) }}>
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Title *</label>
                                <input value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Perfect Carbonara in 10 Minutes 🍝"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Description</label>
                                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
                                    placeholder="Share your story, technique, or recipe tip…"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Cuisine Tags</label>
                                <div className="flex gap-2 flex-wrap mb-2">
                                    {tags.map(t => (
                                        <span key={t} className="px-3 py-1 gradient-brand text-white text-xs rounded-full flex items-center gap-1">
                                            #{t}
                                            <button onClick={() => setTags(prev => prev.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addTag()}
                                        placeholder="Add tag (press Enter)"
                                        className="flex-1 px-4 py-2.5 min-h-[40px] rounded-xl border border-border bg-background text-sm focus:outline-none" />
                                    <button onClick={addTag} className="px-4 py-2 min-h-[40px] gradient-brand text-white text-xs font-bold rounded-xl">Add</button>
                                </div>
                            </div>

                            <button onClick={upload} disabled={uploading || !title}
                                className="w-full py-3.5 min-h-[52px] gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</> : 'Publish Video →'}
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Video Published!</h3>
                            <p className="text-sm text-muted-foreground mb-6">Your video is live on Chef Media 🎉</p>
                            <button onClick={onClose} className="px-8 py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90">
                                View Feed
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── Single Video Card ───────────────────────────────────────── */
function VideoCard({
    item, index, active, muted, onMuteToggle,
}: {
    item: MediaItem; index: number; active: boolean; muted: boolean; onMuteToggle: () => void
}) {
    const { user } = useAuth()
    const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null)
    const [liked, setLiked] = useState(item.isLiked ?? false)
    const [likes, setLikes] = useState(item.likes)
    const [saved, setSaved] = useState(item.isSaved ?? false)
    const [playing, setPlaying] = useState(false)
    const [showHeart, setShowHeart] = useState(false)
    const [comments, setComments] = useState(false)
    const lastTapRef = useRef(0)

    // Autoplay / pause when scrolling
    useEffect(() => {
        const v = videoRef.current
        if (!v) return
        if (active) {
            v.play().catch(() => { })
            setPlaying(true)
        } else {
            v.pause()
            setPlaying(false)
        }
    }, [active])

    // Increment view count once
    useEffect(() => {
        if (active && item.id.startsWith('s')) return // skip seed
        if (!active) return
        const sb = createClient()
        // @ts-expect-error Bypass Supabase strict type mismatch
        sb.from('chef_media').update({ views: item.views + 1 }).eq('id', item.id)
    }, [active, item.id, item.views])

    const togglePlay = () => {
        const v = videoRef.current
        if (!v) return
        if (playing) { v.pause(); setPlaying(false) } else { v.play(); setPlaying(true) }
    }

    const handleTap = () => {
        const now = Date.now()
        const diff = now - lastTapRef.current
        lastTapRef.current = now
        if (diff < 320) {
            // Double tap → like
            handleLike(); setShowHeart(true)
            setTimeout(() => setShowHeart(false), 900)
        } else {
            togglePlay()
        }
    }

    const handleLike = async () => {
        if (!user) { router.push('/login'); return }
        const sb = createClient()
        if (liked) {
            await sb.from('media_likes').delete().match({ user_id: user.id, media_id: item.id })
            setLiked(false); setLikes(l => l - 1)
        } else {
            // @ts-expect-error Bypass type mismatch
            await sb.from('media_likes').upsert({ user_id: user.id, media_id: item.id })
            setLiked(true); setLikes(l => l + 1)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: item.title, url: window.location.href })
        } else {
            await navigator.clipboard.writeText(window.location.href)
            alert('Link copied!')
        }
    }

    const chefInitials = (item.chef?.full_name ?? 'CH').split(' ').slice(-2).map(w => w[0]).join('')

    return (
        <div className="relative w-full snap-start flex-shrink-0" style={{ height: '100dvh' }}>
            {/* Video / Thumbnail */}
            <div className="absolute inset-0 bg-black" onClick={handleTap}>
                <video
                    ref={videoRef}
                    src={item.video_url}
                    poster={item.thumbnail_url ?? undefined}
                    loop
                    playsInline
                    muted={muted}
                    preload={index < 2 ? 'auto' : 'none'}
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Double-tap heart burst */}
            {showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <Heart className="w-28 h-28 text-red-500 fill-red-500 animate-ping opacity-80" />
                </div>
            )}

            {/* Play indicator */}
            {!playing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-b-8 border-l-16 border-t-transparent border-b-transparent border-l-white ml-1" style={{ borderLeftWidth: 20 }} />
                    </div>
                </div>
            )}

            {/* Volume button — top right */}
            <button
                onClick={e => { e.stopPropagation(); onMuteToggle() }}
                className="absolute top-16 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            >
                {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>

            {/* Right action sidebar */}
            <div className="absolute right-3 bottom-28 sm:bottom-32 z-20 flex flex-col items-center gap-5">
                {/* Like */}
                <button onClick={e => { e.stopPropagation(); handleLike() }} className="flex flex-col items-center gap-1">
                    <Heart className={`w-7 h-7 drop-shadow-lg transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
                    <span className="text-white text-xs font-semibold drop-shadow">{fmt(likes)}</span>
                </button>
                {/* Comment */}
                <button onClick={e => { e.stopPropagation(); setComments(true) }} className="flex flex-col items-center gap-1">
                    <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-semibold drop-shadow">{fmt(item.comments_count)}</span>
                </button>
                {/* Save */}
                <button onClick={e => { e.stopPropagation(); setSaved(s => !s) }} className="flex flex-col items-center gap-1">
                    <Bookmark className={`w-7 h-7 drop-shadow-lg ${saved ? 'fill-white text-white' : 'text-white'}`} />
                    <span className="text-white text-xs font-semibold drop-shadow">{saved ? 'Saved' : 'Save'}</span>
                </button>
                {/* Share */}
                <button onClick={e => { e.stopPropagation(); handleShare() }} className="flex flex-col items-center gap-1">
                    <Share2 className="w-7 h-7 text-white drop-shadow-lg" />
                    <span className="text-white text-xs font-semibold drop-shadow">Share</span>
                </button>
                {/* Chef avatar + follow */}
                <div className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-full gradient-brand text-white font-bold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        {chefInitials}
                    </div>
                    <button
                        onClick={e => { e.stopPropagation(); if (!user) router.push('/login') }}
                        className="w-5 h-5 -mt-3 rounded-full gradient-brand text-white flex items-center justify-center shadow-md text-xs font-bold"
                    >
                        +
                    </button>
                </div>
                {/* TikTok style spinning record */}
                <div className="w-12 h-12 mt-4 rounded-full bg-zinc-900 border-[8px] border-zinc-800 flex items-center justify-center shadow-2xl animate-[spin_4s_linear_infinite]">
                    <div className="w-4 h-4 rounded-full gradient-brand"></div>
                </div>
            </div>

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-14 z-20 p-4 pb-6">
                <p className="text-white font-bold text-sm mb-0.5 drop-shadow-lg">{item.chef?.full_name ?? 'Chef'}</p>
                <p className="text-white font-semibold text-base leading-snug mb-1 drop-shadow-lg">{item.title}</p>
                {item.description && (
                    <p className="text-white/80 text-xs leading-relaxed mb-2 drop-shadow line-clamp-2">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                    {item.cuisine_tags.map(tag => (
                        <span key={tag} className="text-white/70 text-xs">#{tag}</span>
                    ))}
                </div>
                {/* Book CTA */}
                <Link
                    href={`/book/${item.chef_id}`}
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 gradient-brand text-white font-bold rounded-2xl text-sm hover:opacity-90 shadow-lg"
                >
                    <ChefHat className="w-4 h-4 shrink-0" />
                    Book This Chef
                </Link>
            </div>

            {/* Comments sheet */}
            {comments && <CommentsSheet item={item} onClose={() => setComments(false)} />}
        </div>
    )
}

/* ── Main Page ───────────────────────────────────────────────── */
const TABS = ['For You', 'Following', 'Trending', 'Near Me']

export default function ChefMediaPage() {
    const { user, profile } = useAuth()
    const [feed, setFeed] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('For You')
    const [activeIdx, setActive] = useState(0)
    const [muted, setMuted] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQ, setSearchQ] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    /* ── Load feed ─────────────────────────────────────────────── */
    useEffect(() => {
        const load = async () => {
            const sb = createClient()
            const { data } = await sb
                .from('chef_media')
                .select('*, profiles(full_name, avatar_url)')
                .order('created_at', { ascending: false })
                .limit(20)

            let items: MediaItem[] = data?.length
                ? data.map((d: Record<string, unknown>) => ({
                    ...(d as unknown as MediaItem),
                    chef: (d.profiles as MediaItem['chef']) ?? undefined,
                }))
                : SEED

            // Enrich with liked/saved status
            if (user && data?.length) {
                const ids = items.map(i => i.id)
                const [{ data: likedRows }, { data: savedRows }] = await Promise.all([
                    sb.from('media_likes').select('media_id').eq('user_id', user.id).in('media_id', ids),
                    sb.from('media_saves').select('media_id').eq('user_id', user.id).in('media_id', ids),
                ])
                const likedSet = new Set(likedRows?.map((r: { media_id: string }) => r.media_id))
                const savedSet = new Set(savedRows?.map((r: { media_id: string }) => r.media_id))
                items = items.map(i => ({ ...i, isLiked: likedSet.has(i.id), isSaved: savedSet.has(i.id) }))
            }

            setFeed(scoreItems(items))
            setLoading(false)
        }
        load()
    }, [user])

    /* ── Intersection observer for active card ──────────────────── */
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const children = Array.from(container.children) as HTMLElement[]

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActive(children.indexOf(entry.target as HTMLElement))
                    }
                })
            },
            { root: container, threshold: 0.6 }
        )
        children.forEach(child => observer.observe(child))
        return () => observer.disconnect()
    }, [feed])

    const displayFeed = searchQ.trim()
        ? feed.filter(i =>
            i.title.toLowerCase().includes(searchQ.toLowerCase()) ||
            i.cuisine_tags.some(t => t.includes(searchQ.toLowerCase())) ||
            (i.chef?.full_name ?? '').toLowerCase().includes(searchQ.toLowerCase())
        )
        : feed

    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex flex-col">
            {/* ── Top UI overlay ────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 z-30 safe-top">
                {/* Back link for desktop */}
                <div className="hidden sm:flex items-center gap-3 px-4 pt-4 pb-2">
                    <Link href="/" className="flex items-center gap-2">
                        <ChefHat className="w-6 h-6 text-white" />
                        <span className="text-xl font-bold text-white">ChefMii</span>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-1 pt-12 sm:pt-2 pb-3 px-4">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${tab === t ? 'text-white border-b-2 border-white' : 'text-white/60 hover:text-white/80'}`}>
                            {t}
                        </button>
                    ))}
                    <button onClick={() => setShowSearch(!showSearch)} className="ml-1 p-1.5 text-white/70 hover:text-white">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Search bar */}
                {showSearch && (
                    <div className="px-4 pb-3">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/20">
                            <Search className="w-4 h-4 text-white/70 shrink-0" />
                            <input
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                                placeholder="Search chefs, cuisine, #tags…"
                                autoFocus
                                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/50 focus:outline-none"
                            />
                            {searchQ && <button onClick={() => setSearchQ('')}><X className="w-4 h-4 text-white/70" /></button>}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Video feed ────────────────────────────────── */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-scroll scrollbar-hide"
                    style={{ scrollSnapType: 'y mandatory' }}
                >
                    {displayFeed.map((item, i) => (
                        <VideoCard
                            key={item.id}
                            item={item}
                            index={i}
                            active={i === activeIdx}
                            muted={muted}
                            onMuteToggle={() => setMuted(m => !m)}
                        />
                    ))}
                    {displayFeed.length === 0 && (
                        <div className="h-full flex items-center justify-center text-white text-center p-8">
                            <div>
                                <p className="text-5xl mb-4">🔍</p>
                                <p className="font-bold text-xl mb-2">No videos found</p>
                                <p className="text-white/60">Try a different search</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Floating upload button (chef only) ─────────── */}
            {profile?.role === 'chef' && (
                <button
                    onClick={() => setShowUpload(true)}
                    className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 w-14 h-14 rounded-2xl gradient-brand text-white flex items-center justify-center shadow-2xl hover:opacity-90 transition-all hover:scale-105"
                >
                    <Plus className="w-7 h-7" />
                </button>
            )}

            {/* ── Mobile bottom nav ─────────────────────────── */}
            <nav className="sm:hidden absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md border-t border-white/10 flex safe-bottom">
                {[
                    { icon: Home, label: 'Home', href: '/' },
                    { icon: Search, label: 'Search', href: '#', action: () => setShowSearch(!showSearch) },
                    { icon: Plus, label: 'Upload', href: '#', action: () => setShowUpload(true), featured: true },
                    { icon: Bell, label: 'Alerts', href: '#' },
                    { icon: UserIcon, label: 'Me', href: user ? '/user-dashboard' : '/login' },
                ].map(({ icon: Icon, label, href, action, featured }: { icon: React.ElementType, label: string, href: string, action?: () => void, featured?: boolean }) => (
                    <button key={label}
                        onClick={() => { if (action) action() }}
                        className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] gap-0.5"
                    >
                        {href !== '#' ? (
                            <Link href={href} className="flex flex-col items-center gap-0.5">
                                {featured ? (
                                    <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                ) : <Icon className="w-5 h-5 text-white/70" />}
                                <span className="text-[10px] text-white/60">{label}</span>
                            </Link>
                        ) : (
                            <>
                                {featured ? (
                                    <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                ) : <Icon className="w-5 h-5 text-white/70" />}
                                <span className="text-[10px] text-white/60">{label}</span>
                            </>
                        )}
                    </button>
                ))}
            </nav>

            {/* ── Modals ─────────────────────────────────────── */}
            {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
        </div>
    )
}
