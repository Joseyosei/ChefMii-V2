'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, type UserRole } from '@/context/auth-context'
import { ChefHat, Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const { signUp } = useAuth()

    const [role, setRole] = useState<UserRole>('client')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [cuisine, setCuisine] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSignUp = async () => {
        if (!firstName || !email || !password) {
            setError('Please fill in all required fields.')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        setLoading(true); setError(null)
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
        const { error } = await signUp(email, password, fullName, role)
        setLoading(false)

        if (error) { setError(error); return }

        // Some Supabase projects require email confirm – show success screen
        setSuccess(true)
        setTimeout(() => {
            if (role === 'chef') router.replace('/chef-dashboard')
            else if (role === 'business') router.replace('/business-dashboard')
            else router.replace('/user-dashboard')
        }, 2000)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full gradient-brand mx-auto mb-6 flex items-center justify-center">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold mb-3">Account Created!</h1>
                    <p className="text-muted-foreground mb-6">
                        {role === 'chef'
                            ? "Welcome, Chef! Setting up your dashboard…"
                            : "Welcome to ChefMii! Taking you to your dashboard…"}
                    </p>
                    <div className="flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Left dark panel — hidden on mobile */}
            <div className="hidden md:flex flex-1 bg-[#1a1a1a] items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <ChefHat className="w-10 h-10 text-terracotta" />
                        <span className="text-3xl font-bold gradient-text-brand">ChefMii</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">
                        Join the world&apos;s premier private chef marketplace
                    </h2>
                    <div className="space-y-4 mt-8">
                        {[
                            { icon: '👤', title: 'For Clients', desc: 'Book world-class chefs for any event' },
                            { icon: '👨‍🍳', title: 'For Chefs', desc: 'Build your business and reach thousands of clients' },
                            { icon: '🏢', title: 'For Businesses', desc: 'Manage corporate events and team catering at scale' },
                        ].map(item => (
                            <div key={item.title} className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <p className="font-bold text-sm">{item.title}</p>
                                    <p className="text-white/60 text-xs">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 overflow-y-auto">
                <div className="w-full max-w-md py-6">
                    <Link href="/" className="flex items-center gap-2 mb-8 md:hidden">
                        <ChefHat className="w-7 h-7 text-terracotta" />
                        <span className="text-2xl font-bold gradient-text-brand">ChefMii</span>
                    </Link>

                    <h1 className="text-3xl font-serif font-bold mb-2">Create Account</h1>
                    <p className="text-muted-foreground mb-6">Start your ChefMii journey today — it&apos;s free.</p>

                    {/* Role toggle */}
                    <div className="flex rounded-xl border border-border overflow-hidden mb-6">
                        {(['client', 'chef', 'business'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors min-h-[44px] ${role === r ? 'gradient-brand text-white' : 'bg-card text-foreground hover:bg-muted'
                                    }`}
                            >
                                {r === 'client' ? '👤 Client' : r === 'chef' ? '👨‍🍳 Chef' : '🏢 Business'}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">First Name *</label>
                                <input
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    placeholder="John"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Last Name</label>
                                <input
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Email *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta text-sm"
                            />
                        </div>

                        {role === 'chef' && (
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Cuisine Specialty</label>
                                <input
                                    value={cuisine}
                                    onChange={e => setCuisine(e.target.value)}
                                    placeholder="e.g. Italian, Japanese, French"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta text-sm"
                                />
                            </div>
                        )}

                        {role === 'business' && (
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Company Name</label>
                                <input
                                    placeholder="e.g. Apex Enterprises Ltd"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta text-sm"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Password *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta text-sm"
                            />
                        </div>

                        <button
                            id="register-submit"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full min-h-[44px] py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
                                : `Create Account as ${role === 'client' ? 'Client' : role === 'chef' ? 'Chef' : 'Business'} →`
                            }
                        </button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mt-4 mb-6">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-terracotta hover:underline">Terms</Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>.
                    </p>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-terracotta font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
