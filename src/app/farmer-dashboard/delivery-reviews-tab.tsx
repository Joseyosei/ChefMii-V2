'use client'

import { useState } from 'react'
import { Truck, MapPin, Package, Loader2, Star } from 'lucide-react'
import { type FarmerOrder } from './types'

/* ── Deliveries Tab ─────────────────────────────────────────── */
export function DeliveriesTab({ orders, onUpdate }: { orders: FarmerOrder[]; onUpdate: (o: FarmerOrder[]) => void }) {
    const [acting, setActing] = useState<string | null>(null)

    const upcoming = orders
        .filter(o => o.status === 'confirmed' && o.delivery_date)
        .sort((a, b) => new Date(a.delivery_date!).getTime() - new Date(b.delivery_date!).getTime())

    const markDispatched = async (id: string) => {
        setActing(id)
        await new Promise(r => setTimeout(r, 800))
        onUpdate(orders.map(o => o.id === id ? { ...o, status: 'delivered' as const } : o))
        setActing(null)
    }

    // Build a mini calendar heatmap for the current month
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDow = new Date(year, month, 1).getDay()

    const deliveryDates = new Set(
        orders
            .filter(o => o.delivery_date && ['pending', 'confirmed'].includes(o.status))
            .map(o => new Date(o.delivery_date!).getDate())
    )

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    return (
        <div className="space-y-6">
            {/* Mini Calendar */}
            <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="font-bold mb-4">
                    {now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} — Delivery Calendar
                </h2>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {dayNames.map(d => (
                        <div key={d} className="text-[11px] text-muted-foreground font-bold py-1">{d}</div>
                    ))}
                    {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const hasDelivery = deliveryDates.has(day)
                        const isToday = day === now.getDate()
                        return (
                            <div key={day} className={`
                aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition-colors
                ${isToday ? 'gradient-brand text-white shadow-sm' : ''}
                ${hasDelivery && !isToday ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-300' : ''}
                ${!isToday && !hasDelivery ? 'text-foreground/60 hover:bg-muted' : ''}
              `}>
                                {day}
                                {hasDelivery && !isToday && <span className="sr-only">Delivery</span>}
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded gradient-brand inline-block" />Today</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 dark:bg-green-900/40 inline-block ring-1 ring-green-300" />Delivery due</span>
                </div>
            </div>

            {/* Upcoming deliveries list */}
            <div>
                <h2 className="font-bold text-lg mb-4">Upcoming Deliveries</h2>
                {upcoming.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
                        <Truck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No upcoming deliveries</p>
                        <p className="text-sm">Confirmed orders will appear here</p>
                    </div>
                ) : upcoming.map(o => {
                    const dueDate = new Date(o.delivery_date!)
                    const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / 86_400_000)
                    const urgent = daysLeft <= 2

                    return (
                        <div key={o.id} className={`bg-card border rounded-2xl p-4 sm:p-5 mb-3 ${urgent ? 'border-orange-300 dark:border-orange-700' : 'border-border'}`}>
                            {urgent && (
                                <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold mb-2">
                                    ⚠ Due in {daysLeft} day{daysLeft !== 1 ? 's' : ''}!
                                </div>
                            )}
                            <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                                <div className="w-11 h-11 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0">
                                    {(o.chef_name ?? 'C').split(' ').filter(Boolean).slice(1).map(w => w[0]).join('').slice(0, 2) || 'CH'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm">{o.chef_name ?? 'Chef'}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                        <Package className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{o.items.map(i => `${i.name} (${i.qty}${i.unit})`).join(', ')}</span>
                                    </div>
                                    {o.delivery_address && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                            <MapPin className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{o.delivery_address}</span>
                                        </div>
                                    )}
                                    <p className="text-xs font-semibold text-terracotta mt-1">
                                        📅 {dueDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                                <button onClick={() => markDispatched(o.id)} disabled={acting === o.id}
                                    className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-50 shrink-0">
                                    {acting === o.id
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Truck className="w-4 h-4" />}
                                    Mark Dispatched
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ── Reviews Tab ─────────────────────────────────────────────── */
const DEMO_REVIEWS = [
    { id: 'r1', chef: 'Chef Marco Rossi', rating: 5, text: 'Absolutely incredible produce. The heirloom tomatoes were the best I\'ve ever cooked with. Will be ordering regularly!', date: '2026-03-01', item: 'Heirloom Tomatoes' },
    { id: 'r2', chef: 'Chef Sofia Mendez', rating: 5, text: 'Fresh basil arrived beautifully packaged and bursting with flavour. The heritage carrots were perfect for my stock.', date: '2026-02-22', item: 'Fresh Basil + Carrots' },
    { id: 'r3', chef: 'Chef Pierre Dubois', rating: 4, text: 'Good quality chicken, slightly late on delivery. Will order again — just wanted better communication on the ETA.', date: '2026-02-15', item: 'Whole Grain Chicken' },
    { id: 'r4', chef: 'Chef Yuki Tanaka', rating: 5, text: 'The eggs are exceptional. My guests always notice the difference with free-range eggs from this farm.', date: '2026-02-08', item: 'Free-Range Eggs' },
]

export function ReviewsTab() {
    const avg = (DEMO_REVIEWS.reduce((s, r) => s + r.rating, 0) / DEMO_REVIEWS.length).toFixed(1)
    const counts = [5, 4, 3, 2, 1].map(n => ({ n, count: DEMO_REVIEWS.filter(r => r.rating === n).length }))

    return (
        <div className="space-y-6">
            {/* Rating summary */}
            <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
                    <div className="text-center shrink-0">
                        <p className="text-6xl font-black text-yellow-500">{avg}</p>
                        <div className="flex justify-center gap-0.5 my-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`w-4 h-4 ${parseFloat(avg) >= i ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{DEMO_REVIEWS.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {counts.map(({ n, count }) => (
                            <div key={n} className="flex items-center gap-2 text-xs">
                                <span className="w-3 text-right font-semibold text-muted-foreground">{n}</span>
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
                                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full transition-all"
                                        style={{ width: `${DEMO_REVIEWS.length ? (count / DEMO_REVIEWS.length) * 100 : 0}%` }} />
                                </div>
                                <span className="w-4 text-muted-foreground">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="space-y-3">
                {DEMO_REVIEWS.map(r => (
                    <div key={r.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0">
                                {r.chef.split(' ').filter(Boolean).slice(1).map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <p className="font-bold text-sm">{r.chef}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="flex items-center gap-1 my-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${r.rating >= i ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`} />
                                    ))}
                                    <span className="text-xs text-muted-foreground ml-1">· {r.item}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">&quot;{r.text}&quot;</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
