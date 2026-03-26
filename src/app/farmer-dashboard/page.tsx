'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import {
    LayoutDashboard, Package, ShoppingCart, DollarSign,
    Truck, Star, Settings, LogOut, Bell, Loader2, ChefHat, Save,
} from 'lucide-react'

import { type FarmerProfile } from './types'
import { useFarmerDashboardData } from '@/hooks/useFarmerDashboardData'
import { OverviewTab } from './overview-tab'
import { ProduceTab } from './produce-tab'
import { OrdersTab } from './orders-tab'
import { RevenueTab } from './revenue-tab'
import { DeliveriesTab, ReviewsTab } from './delivery-reviews-tab'

/* ── Settings Tab ─────────────────────────────────────────────── */
function SettingsTab({ profile, onSave }: { profile: FarmerProfile; onSave: (p: Partial<FarmerProfile>) => void }) {
    const [farmName, setFarmName] = useState(profile.farm_name)
    const [location, setLocation] = useState(profile.location ?? '')
    const [desc, setDesc] = useState(profile.description ?? '')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const save = async () => {
        setSaving(true)
        const sb = createClient()
        if (profile.id !== 'demo') {
            // @ts-expect-error Bypass type mismatch
            await sb.from('farmer_profiles').update({ farm_name: farmName, location, description: desc }).eq('id', profile.id)
        }
        onSave({ farm_name: farmName, location, description: desc })
        setSaving(false); setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="max-w-xl space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <h2 className="font-bold text-lg">Farm Profile</h2>
                {[
                    { label: 'Farm Name', value: farmName, fn: setFarmName, ph: 'e.g. Green Valley Organics' },
                    { label: 'Location', value: location, fn: setLocation, ph: 'e.g. Devon, UK' },
                ].map(f => (
                    <div key={f.label}>
                        <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                        <input value={f.value} onChange={e => f.fn(e.target.value)} placeholder={f.ph}
                            className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                    </div>
                ))}
                <div>
                    <label className="block text-sm font-semibold mb-1.5">Description</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Tell chefs about your farm…"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta resize-none" />
                </div>
                <button onClick={save} disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <h2 className="font-bold text-lg">Account</h2>
                <div className="p-4 bg-muted rounded-xl text-sm space-y-1">
                    <p className="font-semibold">Email notifications</p>
                    {['New order received', 'Order accepted by courier', 'Payment processed', 'New review posted'].map(n => (
                        <label key={n} className="flex items-center gap-3 py-1 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-terracotta" />
                            <span className="text-muted-foreground">{n}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-5">
                <h2 className="font-bold text-lg text-red-600 mb-2">Danger Zone</h2>
                <p className="text-sm text-muted-foreground mb-3">Permanently delete your farmer account and all listings.</p>
                <button className="px-4 py-2.5 border border-red-300 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
                    Delete Account
                </button>
            </div>
        </div>
    )
}

/* ── Sidebar nav items ──────────────────────────────────────────── */
const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'produce', label: 'My Produce', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'deliveries', label: 'Deliveries', icon: Truck },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
]

/* ── Main Page ──────────────────────────────────────────────────── */
export default function FarmerDashboardPage() {
    const router = useRouter()
    const { profile: authProfile, loading: authLoading, signOut } = useAuth()
    const { profile: farmerProf, produce, orders, loading: dataLoading, error, updateProfile: setFarmerProf, updateProduce: setProduce, updateOrders: setOrders } = useFarmerDashboardData()

    const [tab, setTab] = useState('overview')
    const [signingOut, setSigningOut] = useState(false)

    const toggleMarketplace = async () => {
        const next = { ...farmerProf, marketplace_live: !farmerProf.marketplace_live }
        setFarmerProf(next)
        const sb = createClient()
        if (farmerProf.id !== 'demo') {
            // @ts-expect-error Bypass type mismatch
            await sb.from('farmer_profiles').update({ marketplace_live: next.marketplace_live }).eq('id', farmerProf.id)
        }
    }

    const handleSignOut = async () => {
        setSigningOut(true)
        await signOut()
        router.replace('/')
    }

    const initials = authProfile?.full_name
        ? authProfile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'FM'

    /* ── Pending badge for mobile tab ─────────── */
    const pendingCount = orders.filter(o => o.status === 'pending').length

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    <p className="text-sm text-muted-foreground">Loading your farm…</p>
                </div>
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
            {/* ── Topbar ───────────────────────────────── */}
            <div className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 mr-2">
                        <ChefHat className="w-5 h-5 text-terracotta" />
                        <span className="font-bold gradient-text-brand hidden sm:block">ChefMii</span>
                    </Link>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold leading-tight">{farmerProf.farm_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>🌾 {farmerProf.location}</span>
                            {farmerProf.verified && <span className="text-green-600 font-semibold">✓ Verified</span>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-muted">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        {pendingCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gradient-brand text-white text-[10px] font-black flex items-center justify-center">{pendingCount}</span>
                        )}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">{initials}</div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* ── Desktop sidebar ──────────────────── */}
                <aside className="hidden md:flex w-56 lg:w-64 border-r border-border bg-card flex-col shrink-0">
                    {/* Farm info */}
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-green-600 text-white text-lg flex items-center justify-center font-bold shrink-0">🌾</div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{farmerProf.farm_name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    {farmerProf.rating} · {farmerProf.total_orders} orders
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors relative ${tab === id ? 'bg-green-600 text-white shadow-sm' : 'text-foreground/70 hover:bg-muted'
                                    }`}>
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                                {id === 'orders' && pendingCount > 0 && (
                                    <span className={`ml-auto w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${tab === id ? 'bg-white/30 text-white' : 'gradient-brand text-white'}`}>
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-3 border-t border-border">
                        <button onClick={handleSignOut} disabled={signingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50">
                            {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* ── Main content ─────────────────────── */}
                <main className="flex-1 overflow-y-auto pb-24 md:pb-0 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                        {tab === 'overview' && <OverviewTab profile={farmerProf} orders={orders} onToggleMarketplace={toggleMarketplace} />}
                        {tab === 'produce' && <ProduceTab farmerId={farmerProf.id} produce={produce} onUpdate={setProduce} />}
                        {tab === 'orders' && <OrdersTab orders={orders} onUpdate={setOrders} />}
                        {tab === 'revenue' && <RevenueTab orders={orders} />}
                        {tab === 'deliveries' && <DeliveriesTab orders={orders} onUpdate={setOrders} />}
                        {tab === 'reviews' && <ReviewsTab />}
                        {tab === 'settings' && <SettingsTab profile={farmerProf} onSave={p => setFarmerProf(f => ({ ...f, ...p }))} />}
                    </div>
                </main>
            </div>

            {/* ── Mobile bottom tabs ───────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border z-50 flex safe-bottom overflow-x-auto">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] gap-0.5 min-w-[56px] relative transition-colors ${tab === id ? 'text-green-600' : 'text-muted-foreground'
                            }`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-[9px] font-medium leading-none">{label}</span>
                        {id === 'orders' && pendingCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gradient-brand text-white text-[9px] font-black flex items-center justify-center">{pendingCount}</span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    )
}
