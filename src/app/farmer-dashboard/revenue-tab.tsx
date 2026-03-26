'use client'

import { useState } from 'react'
import { X, Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import { fmt, STATUS_STYLE, DEMO_REVENUE, DEMO_PAYOUTS, type FarmerOrder } from './types'

const maxRev = Math.max(...DEMO_REVENUE.map(r => r.amount))
const allTime = DEMO_REVENUE.reduce((s, r) => s + r.amount, 0)
const thisMonth = DEMO_REVENUE[DEMO_REVENUE.length - 1].amount
const lastMonth = DEMO_REVENUE[DEMO_REVENUE.length - 2].amount
const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RevenueTab({ orders }: { orders: FarmerOrder[] }) {
    const [payoutOpen, setPayoutOpen] = useState(false)
    const [amount, setAmount] = useState(String(thisMonth))
    const [requesting, setRequesting] = useState(false)
    const [requested, setRequested] = useState(false)

    const topSelling = [
        { name: 'Heirloom Tomatoes', units: '340 kg', revenue: 1428 },
        { name: 'Fresh Basil', units: '88 kg', revenue: 1584 },
        { name: 'Heritage Carrots', units: '180 kg', revenue: 504 },
        { name: 'Free-Range Eggs', units: '2,400 u', revenue: 1080 },
        { name: 'Whole Grain Chicken', units: '60 kg', revenue: 720 },
    ]

    const handlePayout = async () => {
        setRequesting(true)
        await new Promise(r => setTimeout(r, 1500))
        setRequesting(false); setRequested(true)
        setTimeout(() => { setRequested(false); setPayoutOpen(false) }, 2500)
    }

    return (
        <div className="space-y-6">
            {/* Payout modal */}
            {payoutOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-sm">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-lg">Request Payout</h3>
                            <button onClick={() => setPayoutOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                                <p className="text-sm font-semibold text-green-800 dark:text-green-400">Available balance</p>
                                <p className="text-3xl font-black text-green-600">{fmt(thisMonth)}</p>
                                <p className="text-xs text-green-700 dark:text-green-500">March 2026 earnings</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Amount to withdraw</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Bank account</label>
                                <div className="px-4 py-3 rounded-xl border border-border bg-muted text-sm text-muted-foreground">
                                    Barclays •••• 4821 — Direct Debit
                                </div>
                            </div>
                            {requested ? (
                                <div className="py-3 text-center text-green-600 font-bold">✓ Payout requested! Arrives in 2–3 working days.</div>
                            ) : (
                                <button onClick={handlePayout} disabled={requesting}
                                    className="w-full py-3.5 min-h-[52px] bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {requesting ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</> : `Request ${fmt(parseFloat(amount || '0'))}`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 sm:col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">All-Time Revenue</p>
                    <p className="text-3xl font-black text-green-600">{fmt(allTime)}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">This Month</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-terracotta">{fmt(thisMonth)}</p>
                        <span className={`flex items-center text-sm font-bold ${pct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {pct >= 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : <TrendingDown className="w-4 h-4 mr-0.5" />}
                            {pct >= 0 ? '+' : ''}{pct}%
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">vs {fmt(lastMonth)} last month</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pending Payout</p>
                    <p className="text-3xl font-black text-yellow-600">{fmt(thisMonth)}</p>
                    <button onClick={() => setPayoutOpen(true)}
                        className="mt-3 w-full py-2.5 min-h-[40px] bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700">
                        Request Payout →
                    </button>
                </div>
            </div>

            {/* Bar chart */}
            <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="font-bold mb-4">Monthly Revenue</h2>
                <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-44">
                    {DEMO_REVENUE.map(r => (
                        <div key={r.month} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground hidden sm:block font-semibold">{fmt(r.amount).replace('£', '£')}</span>
                            <div className="w-full bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-lg hover:opacity-80 transition-opacity cursor-default"
                                style={{ height: `${(r.amount / maxRev) * 100}%` }} />
                            <span className="text-[10px] text-muted-foreground">{r.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top selling produce */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-bold">Top Selling Produce</h2>
                </div>
                <div className="divide-y divide-border">
                    {topSelling.map((t, i) => (
                        <div key={t.name} className="px-5 py-3 flex items-center gap-4">
                            <span className="w-6 h-6 rounded-full gradient-brand text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.units} sold</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-black text-green-600">{fmt(t.revenue)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payout history */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-bold">Payout History</h2>
                </div>
                <div className="divide-y divide-border">
                    {DEMO_PAYOUTS.map(p => (
                        <div key={p.id} className="px-5 py-3 flex items-center gap-4">
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{p.period_label}</p>
                                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString('en-GB')}</p>
                            </div>
                            <p className="font-black text-lg text-green-600 shrink-0">{fmt(p.amount)}</p>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
