'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, dashboardHref } from '@/context/auth-context'
import { createClient } from '@/lib/supabase/client'
import {
    Moon, Sun, User, Menu, X, ChefHat,
    LayoutDashboard, LogIn, UserPlus, LogOut, Loader2,
    Leaf, Sparkles, Baby,
} from 'lucide-react'

const NAV_LINKS = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/packages', label: 'Event Packages' },
    { href: '/chef-media', label: 'Chef Media' },
    { href: '/academy', label: 'Academy' },
    { href: '/kids-zone', label: "Kids' Zone" },
]

export function Navbar() {
    const router = useRouter()
    const { user, profile, role, signOut, loading } = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [mobileOpen, setMobileOpen] = useState(false)
    const [userOpen, setUserOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [dark, setDark] = useState(false)
    const [signingOut, setSigningOut] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setUserOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const toggleTheme = () => {
        setDark(d => { const n = !d; document.documentElement.classList.toggle('dark', n); return n })
    }

    const handleSignOut = async () => {
        setSigningOut(true)
        await signOut()
        setUserOpen(false); setMobileOpen(false)
        router.replace('/')
        setSigningOut(false)
    }

    const handleGoogleLogin = async () => {
        const sb = createClient()
        await sb.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
    }

    const handleAppleLogin = async () => {
        const sb = createClient()
        await sb.auth.signInWithOAuth({
            provider: 'apple',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
    }

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : user?.email?.[0]?.toUpperCase() ?? '?'

    const DASHBOARD_LINKS = [
        { href: '/user-dashboard', label: 'Client Dashboard', icon: LayoutDashboard },
        { href: '/chef-dashboard', label: 'Chef Dashboard', icon: ChefHat },
        { href: '/business-dashboard', label: 'Business Dashboard', icon: Sparkles },
        { href: '/influencer-dashboard', label: 'Creator Dashboard', icon: Sparkles },
        { href: '/farmer-dashboard', label: 'Farmer Dashboard', icon: Leaf },
        { href: '/kids-dashboard', label: "Kids' Dashboard", icon: Baby },
    ]

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-border/40 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-background/95 backdrop-blur-md'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <span className="text-2xl sm:text-3xl tracking-tight text-[#FF5A36]" style={{ fontWeight: 500, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            ChefMii
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden xl:flex items-center gap-0.5 flex-1 max-w-3xl">
                        {/* ★ HIGHLIGHTED FIND CHEFS ★ */}
                        <Link
                            href="/find-chefs"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-bold hover:opacity-90 transition-opacity mr-1 shadow-sm"
                        >
                            <ChefHat className="w-4 h-4" />Find Chefs
                        </Link>
                        {NAV_LINKS.map(link => (
                            <Link key={link.href} href={link.href}
                                className="px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors whitespace-nowrap">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Dark mode */}
                        <button onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-muted transition-colors min-w-[40px] min-h-[44px] flex items-center justify-center"
                            aria-label="Toggle theme">
                            {dark ? <Sun className="w-5 h-5 text-foreground/70" /> : <Moon className="w-5 h-5 text-foreground/70" />}
                        </button>

                        {/* Messages link */}
                        <Link href="/messages"
                            className="hidden sm:flex p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] items-center"
                            aria-label="Messages">
                            <svg className="w-5 h-5 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </Link>

                        {/* User dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setUserOpen(!userOpen)}
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted transition-colors gap-2 px-2"
                                aria-label="User menu"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                ) : user ? (
                                    <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center">
                                        {initials}
                                    </div>
                                ) : (
                                    <User className="w-5 h-5 text-foreground/70" />
                                )}
                            </button>

                            {userOpen && (
                                <div className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-border">
                                                <p className="font-bold text-sm truncate">{profile?.full_name || 'User'}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full gradient-brand text-white font-medium capitalize">
                                                    {role || 'client'}
                                                </span>
                                            </div>
                                            <Link href={dashboardHref(role)} onClick={() => setUserOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                                                <LayoutDashboard className="w-4 h-4 text-terracotta" />My Dashboard
                                            </Link>
                                            <Link href="/messages" onClick={() => setUserOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                                                <svg className="w-4 h-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                Messages
                                            </Link>
                                            <div className="border-t border-border my-1" />
                                            <button onClick={handleSignOut} disabled={signingOut}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                                                {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Regular login */}
                                            <Link href="/login" onClick={() => setUserOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted">
                                                <LogIn className="w-4 h-4 text-terracotta" />Log In with Email
                                            </Link>
                                            <Link href="/register" onClick={() => setUserOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted">
                                                <UserPlus className="w-4 h-4 text-terracotta" />Create Account
                                            </Link>

                                            {/* OAuth buttons */}
                                            <div className="px-4 py-2 space-y-2">
                                                <button onClick={handleGoogleLogin}
                                                    className="w-full flex items-center justify-center gap-2 min-h-[40px] border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                                    Continue with Google
                                                </button>
                                                <button onClick={handleAppleLogin}
                                                    className="w-full flex items-center justify-center gap-2 min-h-[40px] bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors">
                                                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                                    Continue with Apple
                                                </button>
                                            </div>

                                            <div className="border-t border-border my-1 mx-2" />
                                            <p className="px-4 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">All Dashboards</p>
                                            {DASHBOARD_LINKS.map(d => (
                                                <Link key={d.href} href={d.href} onClick={() => setUserOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
                                                    <d.icon className="w-3.5 h-3.5 text-terracotta/70" />{d.label}
                                                </Link>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Get Started */}
                        {!user && !loading && (
                            <Link href="/register"
                                className="hidden sm:inline-flex items-center min-h-[44px] px-4 py-2 rounded-lg gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap">
                                Get Started
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="xl:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation"
                        >
                            {mobileOpen ? <X className="w-5 h-5 text-foreground/70" /> : <Menu className="w-5 h-5 text-foreground/70" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="xl:hidden border-t border-border bg-background/98 backdrop-blur-md max-h-[85vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-1">
                        {/* User info */}
                        {user && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl mb-3">
                                <div className="w-9 h-9 rounded-full gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0">{initials}</div>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm truncate">{profile?.full_name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Highlighted Find Chefs on mobile */}
                        <Link href="/find-chefs" onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl gradient-brand text-white font-bold text-sm mb-2">
                            <ChefHat className="w-4 h-4" />Find Chefs
                        </Link>

                        {NAV_LINKS.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                                className="flex items-center px-4 py-3 min-h-[44px] rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-border my-2" />

                        {user ? (
                            <>
                                <Link href={dashboardHref(role)} onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm hover:bg-muted">
                                    <LayoutDashboard className="w-4 h-4 text-terracotta" />My Dashboard
                                </Link>
                                <Link href="/messages" onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm hover:bg-muted">
                                    <svg className="w-4 h-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    Messages
                                </Link>
                                <button onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm text-red-600 hover:bg-red-50">
                                    <LogOut className="w-4 h-4" />Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm hover:bg-muted">
                                    <LogIn className="w-4 h-4 text-terracotta" />Log In
                                </Link>
                                <button onClick={() => { setMobileOpen(false); handleGoogleLogin() }}
                                    className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] border border-border rounded-xl text-sm font-semibold hover:bg-muted">
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Continue with Google
                                </button>
                                <button onClick={() => { setMobileOpen(false); handleAppleLogin() }}
                                    className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] bg-black text-white rounded-xl text-sm font-semibold">
                                    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                    Continue with Apple
                                </button>
                                <Link href="/register" onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center px-4 py-3 min-h-[44px] rounded-xl gradient-brand text-white text-sm font-semibold mt-1">
                                    Get Started Free →
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
