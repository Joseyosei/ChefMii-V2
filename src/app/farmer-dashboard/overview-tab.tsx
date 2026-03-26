'use client'

import Link from 'next/link'
import { TrendingUp, Package, ShoppingCart, Star, CheckCircle, Clock, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'
import { fmt, STATUS_STYLE, DEMO_REVENUE, type FarmerProfile, type FarmerOrder } from './types'

const maxRevenue = Math.max(...DEMO_REVENUE.map(r => r.amount))
const thisMonth = DEMO_REVENUE[DEMO_REVENUE.length - 1].amount
const lastMonth = DEMO_REVENUE[DEMO_REVENUE.length - 2].amount
const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)

export function OverviewTab({
    profile, orders, onToggleMarketplace,
}: {
    profile: FarmerProfile
    orders: FarmerOrder[]
    onToggleMarketplace: () => void
}) {
    const pending = orders.filter(o => o.status === 'pending').length
    const thisRev = thisMonth
    const avgRating = profile.rating

    const STATS = [
        { label: 'Revenue This Month', value: fmt(thisRev), sub: `${pct >= 0 ? '+' : ''}${pct}% vs last month`, color: 'text-green-500', icon: TrendingUp },
        { label: 'Active Listings', value: '4', sub: '1 unavailable', color: 'text-terracotta', icon: Package },
        { label: 'Pending Orders', value: String(pending), sub: 'Needs your action', color: 'text-yellow-500', icon: ShoppingCart },
        { label: 'Average Rating', value: `${avgRating}★`, sub: '128 reviews', color: 'text-blue-500', icon: Star },
    ]

    return (
        <div className="space-y-6">
            {/* Marketplace toggle */}
            <div className={`rounded-2xl border p-5 flex items-center justify-between gap-4 flex-wrap transition-colors ${profile.marketplace_live
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'bg-muted border-border'
                }`}>
                <div className="flex items-center gap-3">
                    {profile.marketplace_live
                        ? <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                        : <Clock className="w-6 h-6 text-muted-foreground shrink-0" />}
                    <div>
                        <p className="font-bold text-sm">
                            {profile.marketplace_live ? '🌿 Your produce is LIVE on ChefMii Marketplace' : 'Marketplace listing is OFF'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {profile.marketplace_live ? 'Chefs can discover and order your produce right now' : 'Toggle to make your produce visible to chefs'}
                        </p>
                    </div>
                    {profile.verified && (
                        <span className="hidden sm:flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shrink-0">
                            <CheckCircle className="w-3 h-3" />Verified Farmer
                        </span>
                    )}
                </div>
                <button onClick={onToggleMarketplace} className="shrink-0">
                    {profile.marketplace_live
                        ? <ToggleRight className="w-12 h-7 text-green-600 fill-green-100" />
                        : <ToggleLeft className="w-12 h-7 text-muted-foreground" />}
                </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {STATS.map(({ label, value, sub, color, icon: Icon }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
                            <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                        </div>
                        <p className={`text-2xl sm:text-3xl font-black ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Revenue mini-chart */}
            <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold">Revenue — Last 6 Months</h2>
                    <span className={`text-sm font-bold ${pct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pct >= 0 ? '+' : ''}{pct}% ↑
                    </span>
                </div>
                <div className="flex items-end gap-1.5 sm:gap-2 h-28 sm:h-36">
                    {DEMO_REVENUE.map(r => (
                        <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-muted-foreground hidden sm:block">{fmt(r.amount).replace('£', '£')}</span>
                            <div
                                className="w-full rounded-t-lg bg-gradient-to-t from-green-600 to-emerald-400 hover:opacity-80 transition-opacity cursor-default"
                                style={{ height: `${(r.amount / maxRevenue) * 100}%` }}
                            />
                            <span className="text-[10px] text-muted-foreground">{r.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent orders */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold">Recent Orders</h2>
                    <Link href="#orders" className="text-terracotta text-sm hover:underline flex items-center gap-1">
                        View all <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="divide-y divide-border">
                    {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="px-5 py-3 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                            <div className="w-9 h-9 rounded-xl gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {(o.chef_name ?? 'C').split(' ').slice(1).map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{o.chef_name ?? 'Chef'}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {o.items.map(i => `${i.name} (${i.qty}${i.unit})`).join(' · ')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <p className="font-black text-sm text-green-600">{fmt(o.total_amount)}</p>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
