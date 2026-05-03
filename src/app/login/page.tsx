'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth, dashboardHref } from '@/context/auth-context'
import { ChefHat, Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginContent() {
    const router = useRouter()
    const params = useSearchParams()
    const { signIn, user, role } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [forgotSent, setForgotSent] = useState(false)

    // Already logged in → redirect
    useEffect(() => {
        if (user && role) {
            const redirectTo = params.get('redirectTo') || dashboardHref(role)
            router.replace(redirectTo)
        }
    }, [user, role, router, params])

    const handleSignIn = async () => {
        if (!email || !password) { setError('Please fill in all fields.'); return }
        setLoading(true); setError(null)
        const { error } = await signIn(email, password)
        setLoading(false)
        if (error) { setError(error); return }
        const redirectTo = params.get('redirectTo') || dashboardHref(role)
        router.replace(redirectTo)
    }

    const handleForgotPassword = async () => {
        if (!email) { setError('Enter your email first, then click Forgot Password.'); return }
        // Supabase password reset
        const { createClient } = await import('@/lib/supabase/client')
        const sb = createClient()
        await sb.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        setForgotSent(true)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSignIn()
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Left brand panel — hidden on mobile */}
            <div className="hidden md:flex flex-1 gradient-brand items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <ChefHat className="w-10 h-10 text-white" />
                        <span className="text-3xl font-bold">ChefMii</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">
                        Welcome back to the world&apos;s finest chef marketplace
                    </h2>
                    <p className="text-white/80 text-lg">
                        Sign in to manage your bookings, connect with chefs, and enjoy extraordinary dining experiences.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        {['500+ Chefs', '50+ Countries', '4.9★ Rating', '10K+ Events'].map(s => (
                            <div key={s} className="bg-white/10 rounded-xl p-4 font-bold text-sm">{s}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8 md:hidden">
                        <ChefHat className="w-7 h-7 text-terracotta" />
                        <span className="text-2xl font-bold gradient-text-brand">ChefMii</span>
                    </Link>

                    <h1 className="text-3xl font-serif font-bold mb-2">Sign In</h1>
                    <p className="text-muted-foreground mb-8">Welcome back! Please enter your details.</p>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {forgotSent && (
                        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                            Password reset email sent! Check your inbox.
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta pr-12 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <button
                                    onClick={handleForgotPassword}
                                    className="text-xs text-terracotta hover:underline font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            onClick={handleSignIn}
                            disabled={loading}
                            className="w-full min-h-[44px] py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : 'Sign In'}
                        </button>

                        <div className="relative flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">OR</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <button
                            type="button"
                            className="w-full min-h-[44px] py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="font-bold text-blue-600">G</span> Continue with Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-terracotta font-semibold hover:underline">Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
