'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import {
    TrendingUp, Play, Users, DollarSign, Camera,
    Instagram, Youtube, Share2, Star, LogOut,
    LayoutDashboard, Image, Settings, Bell, Loader2, Plus,
} from 'lucide-react'
import { useInfluencerDashboardData } from '@/hooks/useInfluencerDashboardData'

// Missing active mock variables - removed COLLABS
const VIDEOS = [
    { title: '5-Min Chef Carbonara', platform: 'ChefMii', views: '234K', likes: '18.2K', earned: '£847' },
    { title: 'Omakase at Home Series', platform: 'ChefMii', views: '612K', likes: '44.1K', earned: '£2,340' },
    { title: 'West African Jollof Fire', platform: 'ChefMii', views: '480K', likes: '32K', earned: '£1,890' },
]
const STATS = [
    { label: 'Total Followers', value: '128K', icon: Users, color: 'text-blue-500' },
    { label: 'Monthly Reach', value: '4.2M', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Brand Earnings', value: '£14,800', icon: DollarSign, color: 'text-terracotta' },
    { label: 'Engagement Rate', value: '6.8%', icon: Star, color: 'text-yellow-500' },
]
const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'collabs', label: 'Collabs', icon: DollarSign },
    { id: 'content', label: 'Content', icon: Image },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
]

export default function InfluencerDashboardPage() {
    const router = useRouter()
    const { profile, loading: authLoading, signOut } = useAuth()
    const { collabs, loading: dataLoading, error } = useInfluencerDashboardData()
    const [tab, setTab] = useState('overview')
    const [signingOut, setSO] = useState(false)

    const handleSignOut = async () => { setSO(true); await signOut(); router.replace('/') }

    if (authLoading || dataLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-terracotta" /></div>
    if (error) return <div className="min-h-screen flex text-center font-bold text-red-500 items-center justify-center">Error loading dashboard: {error.message}</div>

    const name = profile?.full_name?.split(' ')[0] || 'Influencer'
    const initials = profile?.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'IN'

    return (
        <div className="flex h-screen overflow-hidden bg-background flex-col">
            {/* Topbar */}
            <div className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-lg font-bold gradient-text-brand mr-3">ChefMii</Link>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold">Hey, {name}! 📸</p>
                        <p className="text-xs text-muted-foreground">Creator Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative p-2"><Bell className="w-5 h-5 text-muted-foreground" /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta" /></button>
                    <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center">{initials}</div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden md:flex w-56 lg:w-64 border-r border-border bg-card flex-col shrink-0">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center">{initials}</div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{profile?.full_name || 'Influencer'}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />128K followers
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-3 space-y-0.5">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${tab === id ? 'gradient-brand text-white' : 'text-foreground/70 hover:bg-muted'}`}>
                                <Icon className="w-4 h-4 shrink-0" />{label}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <button onClick={handleSignOut} disabled={signingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm text-red-600 hover:bg-red-50">
                            {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}Sign Out
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto pb-20 md:pb-0 p-4 sm:p-6">
                    <div className="max-w-5xl mx-auto">
                        {tab === 'overview' && (
                            <div className="space-y-6">
                                {/* Platform badges */}
                                <div className="flex gap-3 flex-wrap">
                                    {[{ Icon: Instagram, label: '172K', color: 'bg-pink-500' }, { Icon: Youtube, label: '89K', color: 'bg-red-600' }, { Icon: Play, label: '234K', color: 'bg-black' }, { Icon: Share2, label: 'ChefMii', color: 'bg-terracotta/90' }].map(({ Icon, label, color }) => (
                                        <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm ${color}`}>
                                            <Icon className="w-4 h-4" />{label}
                                        </div>
                                    ))}
                                </div>
                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {STATS.map(({ label, value, icon: Icon, color }) => (
                                        <div key={label} className="bg-card border border-border rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-2"><p className="text-xs text-muted-foreground">{label}</p><Icon className={`w-4 h-4 ${color}`} /></div>
                                            <p className={`text-2xl font-black ${color}`}>{value}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Top videos */}
                                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                        <h2 className="font-bold">Top Performing Content</h2>
                                        <button onClick={() => setTab('content')} className="text-terracotta text-sm hover:underline">View all</button>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {VIDEOS.map(v => (
                                            <div key={v.title} className="px-5 py-3 flex items-center gap-4">
                                                <div className="w-12 h-9 rounded-lg gradient-brand flex items-center justify-center shrink-0"><Play className="w-4 h-4 text-white" /></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{v.title}</p>
                                                    <p className="text-xs text-muted-foreground">{v.platform} · {v.views} views · ❤ {v.likes}</p>
                                                </div>
                                                <p className="font-black text-terracotta shrink-0">{v.earned}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Active collabs preview */}
                                <div className="bg-card border border-border rounded-2xl p-5">
                                    <h2 className="font-bold mb-3">Active Brand Deals</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {collabs.filter(c => c.status === 'active').map(c => (
                                            <div key={c.id} className="border border-border rounded-xl p-3 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0">{c.brand_name[0]}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{c.brand_name}</p>
                                                    <p className="text-xs text-muted-foreground">{c.campaign_type} · Due {new Date(c.dueDate).toLocaleDateString()}</p>
                                                </div>
                                                <p className="font-black text-green-600 text-sm shrink-0">£{c.feeAmount}</p>
                                            </div>
                                        ))}
                                        {collabs.filter(c => c.status === 'active').length === 0 && (
                                            <p className="text-sm text-muted-foreground p-4 text-center col-span-2 border border-dashed border-border rounded-xl">No active deals right now.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {tab === 'collabs' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold text-xl">Brand Collaborations</h2>
                                    <button className="flex items-center gap-1.5 px-4 py-2 min-h-[40px] gradient-brand text-white text-sm font-bold rounded-xl"><Plus className="w-4 h-4" />Pitch a Brand</button>
                                </div>
                                {collabs.length === 0 ? (
                                    <div className="p-8 text-center border border-dashed border-border rounded-2xl text-muted-foreground">
                                        No collaborations found. Time to pitch some brands!
                                    </div>
                                ) : collabs.map(c => (
                                    <div key={c.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl gradient-brand text-white font-bold flex items-center justify-center text-lg shrink-0">{c.brand_name[0]}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <p className="font-bold">{c.brand_name}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{c.campaign_type} · Deadline: {new Date(c.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <p className="font-black text-xl text-green-600">£{c.feeAmount}</p>
                                            <button className="px-4 py-2 min-h-[40px] gradient-brand text-white text-sm font-bold rounded-xl">View Brief</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === 'content' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold text-xl">My Content</h2>
                                    <Link href="/chef-media" className="flex items-center gap-1.5 px-4 py-2 min-h-[40px] gradient-brand text-white text-sm font-bold rounded-xl no-underline"><Camera className="w-4 h-4" />Chef Media Feed</Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {VIDEOS.map(v => (
                                        <div key={v.title} className="bg-card border border-border rounded-2xl overflow-hidden">
                                            <div className="aspect-video gradient-brand flex items-center justify-center"><Play className="w-8 h-8 text-white/50" /></div>
                                            <div className="p-3">
                                                <p className="font-bold text-sm mb-1">{v.title}</p>
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>👁 {v.views}</span><span>❤ {v.likes}</span><span className="text-green-600 font-bold">{v.earned}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === 'reviews' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-xl">Client & Brand Reviews</h2>
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 px-4 py-2 rounded-xl text-yellow-800 font-bold border border-yellow-200">
                                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                        <span>4.9 Average Rating</span>
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { author: 'Global Foods Co.', role: 'Brand Partner', rating: 5, date: 'Oct 12, 2026', text: 'Incredible ROI on the recent pasta campaign. High-quality production and authentic engagement from followers.' },
                                        { author: 'Jessica M.', role: 'Private Event Client', rating: 5, date: 'Sep 28, 2026', text: 'Booked Chef Marco through your promo link and it was the best dining experience we\'ve ever had. Thanks for the recommendation!' },
                                        { author: 'Artisan Kitchen', role: 'Brand Partner', rating: 4, date: 'Aug 15, 2026', text: 'Great content, beautiful videography. Looking forward to future collaborations.' },
                                    ].map((review, i) => (
                                        <div key={i} className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase">{review.author[0]}</div>
                                                    <div>
                                                        <h3 className="font-bold text-foreground leading-none">{review.author}</h3>
                                                        <span className="text-xs text-muted-foreground">{review.role}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {[...Array(5)].map((_, idx) => (
                                                            <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80 leading-relaxed">&quot;{review.text}&quot;</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === 'settings' && (
                            <div className="max-w-xl space-y-5">
                                <div className="bg-card border border-border rounded-2xl p-5">
                                    <h2 className="font-bold text-lg mb-4">Creator Profile</h2>
                                    {[{ l: 'Display Name', v: profile?.full_name || '' }, { l: 'Email', v: 'creator@chefmii.com' }, { l: 'Media Kit URL', v: 'chefmii.com/creators/your-handle' }].map(f => (
                                        <div key={f.l} className="mb-4">
                                            <label className="block text-sm font-semibold mb-1.5">{f.l}</label>
                                            <input defaultValue={f.v} className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                                        </div>
                                    ))}
                                    <button className="px-6 py-2.5 min-h-[44px] gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">Save Profile</button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border z-50 flex safe-bottom">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`flex-1 flex flex-col items-center py-2 gap-0.5 min-h-[56px] transition-colors ${tab === id ? 'text-terracotta' : 'text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" /><span className="text-[10px] font-medium">{label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}
