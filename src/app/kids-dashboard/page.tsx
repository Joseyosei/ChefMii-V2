'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import {
    ChefHat, Gamepad2, BookOpen, Award,
    Play, Lock, LayoutDashboard, LogOut, Loader2, Bell,
} from 'lucide-react'
import { useKidsDashboardData } from '@/hooks/useKidsDashboardData'

// Removed static LESSONS and BADGES arrays
const TABS = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'badges', label: 'My Badges', icon: Award },
    { id: 'games', label: 'Games', icon: Gamepad2 },
]

export default function KidsDashboardPage() {
    const router = useRouter()
    const { profile, loading: authLoading, signOut } = useAuth()
    const { profile: kidProfile, lessons, badges, loading: dataLoading } = useKidsDashboardData()
    const [tab, setTab] = useState('home')
    const [signingOut, setSO] = useState(false)

    const handleSignOut = async () => { setSO(true); await signOut(); router.replace('/') }

    if (authLoading || dataLoading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>

    const kidName = profile?.full_name?.split(' ')[0] || 'Chef Junior'
    const xp = kidProfile.xp
    const streak = kidProfile.streak_days
    const level = kidProfile.level
    const xpInLevel = xp % 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col">
            {/* Fun header */}
            <div className="gradient-brand px-4 pt-safe-top pb-4 text-white">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ChefHat className="w-6 h-6 text-white" />
                            <span className="font-black text-lg">ChefMii Jr!</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button className="relative p-2"><Bell className="w-5 h-5" /></button>
                            <button onClick={handleSignOut} disabled={signingOut} className="p-2">
                                {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 text-3xl flex items-center justify-center shrink-0">👨‍🍳</div>
                        <div className="flex-1">
                            <p className="font-black text-xl">Hi, {kidName}! 👋</p>
                            <div className="flex items-center gap-3 text-sm text-white/80 flex-wrap">
                                <span>🔥 {streak} day streak!</span>
                                <span>⭐ Level {level} Chef</span>
                                <span>✨ {xp} XP</span>
                            </div>
                        </div>
                    </div>
                    {/* XP bar */}
                    <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                        <div className="gradient-brand h-full rounded-full bg-white transition-all" style={{ width: `${xpInLevel}%`, background: 'rgba(255,255,255,0.9)' }} />
                    </div>
                    <p className="text-xs text-white/70 mt-1">{xpInLevel}/100 XP to Level {level + 1}</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-24">
                {tab === 'home' && (
                    <div className="space-y-5">
                        {/* Today's challenge */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100">
                            <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-2">⚡ Today&apos;s Challenge</p>
                            <div className="flex items-center gap-4">
                                <span className="text-5xl">🌈</span>
                                <div className="flex-1">
                                    <p className="font-black text-base">Rainbow Veggie Skewers</p>
                                    <p className="text-sm text-muted-foreground">Make it colourful! Get +100 XP</p>
                                    <button onClick={() => setTab('lessons')} className="mt-2 px-4 py-2 min-h-[40px] gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">
                                        Start Now! 🚀
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'My Lessons', emoji: '📚', tab: 'lessons', color: 'bg-blue-100 text-blue-700' },
                                { label: 'My Badges', emoji: '🏆', tab: 'badges', color: 'bg-yellow-100 text-yellow-700' },
                                { label: 'Fun Games', emoji: '🎮', tab: 'games', color: 'bg-purple-100 text-purple-700' },
                                { label: 'Get a Chef!', emoji: '👨‍🍳', href: '/find-chefs', color: 'bg-orange-100 text-orange-700' },
                            ].map(a => (
                                <button key={a.label}
                                    onClick={() => { if ('tab' in a) setTab(a.tab!); else router.push(a.href!) }}
                                    className={`p-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-2 min-h-[80px] hover:scale-105 transition-transform ${a.color}`}>
                                    <span className="text-3xl">{a.emoji}</span>
                                    {a.label}
                                </button>
                            ))}
                        </div>

                        {/* Recent badges */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100">
                            <p className="font-black mb-3">Recent Trophies 🏆</p>
                            <div className="flex gap-3">
                                {badges.filter(b => b.is_earned).map(b => (
                                    <div key={b.name} className="flex flex-col items-center gap-1">
                                        <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center text-xl">{b.emoji}</div>
                                        <p className="text-xs font-semibold text-center w-14 leading-tight">{b.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'lessons' && (
                    <div className="space-y-3">
                        <h2 className="font-black text-xl">🍳 Cooking Lessons</h2>
                        {lessons.map(l => (
                            <div key={l.id} className={`bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border ${l.is_completed ? 'border-green-200' : l.is_unlocked ? 'border-orange-100' : 'border-gray-100'}`}>
                                <span className="text-3xl">{l.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-sm ${!l.is_unlocked ? 'text-muted-foreground' : ''}`}>{l.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.level === 'Beginner' ? 'bg-green-100 text-green-700' : l.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{l.level}</span>
                                        <span className="text-xs text-muted-foreground">+{l.xp_reward} XP</span>
                                    </div>
                                </div>
                                <div>
                                    {l.is_completed ? <CheckMark /> : l.is_unlocked ? (
                                        <button className="w-10 h-10 rounded-xl gradient-brand text-white flex items-center justify-center"><Play className="w-4 h-4" /></button>
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><Lock className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'badges' && (
                    <div>
                        <h2 className="font-black text-xl mb-4">🏆 My Badges</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {badges.map(b => (
                                <div key={b.name} className={`bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border text-center ${b.is_earned ? 'border-orange-200' : 'border-gray-100 opacity-40'}`}>
                                    <div className={`w-14 h-14 rounded-2xl ${b.is_earned ? 'gradient-brand text-white' : 'bg-gray-100'} flex items-center justify-center text-2xl`}>{b.emoji}</div>
                                    <p className="text-xs font-bold">{b.name}</p>
                                    {!b.is_earned && <p className="text-xs text-muted-foreground">Locked</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'games' && (
                    <div className="space-y-4">
                        <h2 className="font-black text-xl">🎮 Fun Games</h2>
                        {[
                            { title: 'Ingredient Match', emoji: '🥕', desc: 'Match the ingredients with recipes!', xp: 25 },
                            { title: 'Chef Quiz', emoji: '❓', desc: 'Test your cooking knowledge!', xp: 30 },
                            { title: 'Build-a-Dish', emoji: '🍱', desc: 'Create the perfect meal from random ingredients!', xp: 40 },
                            { title: 'Taste Adventure', emoji: '🌍', desc: 'Travel the world through food!', xp: 50 },
                        ].map(g => (
                            <div key={g.title} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-purple-100">
                                <span className="text-4xl">{g.emoji}</span>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{g.title}</p>
                                    <p className="text-xs text-muted-foreground">{g.desc}</p>
                                    <p className="text-xs text-purple-600 font-semibold mt-0.5">+{g.xp} XP</p>
                                </div>
                                <button className="px-4 py-2 min-h-[40px] bg-purple-500 text-white text-xs font-bold rounded-xl hover:bg-purple-600">Play!</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile bottom tabs */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 z-40 flex safe-bottom">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`flex-1 flex flex-col items-center py-2 gap-0.5 min-h-[56px] transition-colors ${tab === id ? 'text-orange-500' : 'text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold">{label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}

function CheckMark() {
    return <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><span className="text-green-600 font-black text-lg">✓</span></div>
}
