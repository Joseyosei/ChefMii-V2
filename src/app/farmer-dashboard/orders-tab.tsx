'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react'
import { fmt, STATUS_STYLE, type FarmerOrder } from './types'

const FILTER_TABS: FarmerOrder['status'][] = ['pending', 'confirmed', 'delivered', 'cancelled']

export function OrdersTab({ orders, onUpdate }: { orders: FarmerOrder[]; onUpdate: (o: FarmerOrder[]) => void }) {
    const [filter, setFilter] = useState<FarmerOrder['status']>('pending')
    const [acting, setActing] = useState<string | null>(null)

    const act = async (id: string, newStatus: FarmerOrder['status']) => {
        setActing(id)
        const sb = createClient()
        // @ts-expect-error Bypass type mismatch
        if (!id.startsWith('o')) await sb.from('farmer_orders').update({ status: newStatus }).eq('id', id)
        onUpdate(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
        setActing(null)
    }

    const visible = orders.filter(o => o.status === filter)

    return (
        <div>
            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
                {FILTER_TABS.map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 capitalize ${filter === s ? 'gradient-brand text-white border-transparent' : 'border-border hover:border-terracotta bg-card'}`}>
                        {s}
                        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${filter === s ? 'bg-white/30 text-white' : 'bg-muted text-muted-foreground'}`}>
                            {orders.filter(o => o.status === s).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {visible.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="text-4xl mb-3">📦</p>
                        <p className="font-semibold">No {filter} orders</p>
                    </div>
                ) : visible.map(o => (
                    <div key={o.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                            {/* Chef avatar */}
                            <div className="w-12 h-12 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0">
                                {(o.chef_name ?? 'C').split(' ').filter(Boolean).slice(1).map(w => w[0]).join('').slice(0, 2) || 'CH'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <p className="font-bold text-sm">{o.chef_name ?? 'Chef'}</p>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                                </div>

                                {/* Items */}
                                <div className="space-y-0.5 mb-2">
                                    {o.items.map((item, i) => (
                                        <p key={i} className="text-xs text-muted-foreground">
                                            · {item.name} — {item.qty} {item.unit} @ {fmt(item.price)}/{item.unit}
                                        </p>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    {o.delivery_date && <span>📅 Deliver by {new Date(o.delivery_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                    {o.delivery_address && <span>📍 {o.delivery_address}</span>}
                                </div>
                                {o.notes && <p className="text-xs italic text-muted-foreground mt-1 bg-muted rounded-lg px-3 py-1.5">&quot;{o.notes}&quot;</p>}
                            </div>

                            {/* Amount + actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <p className="font-black text-xl text-green-600">{fmt(o.total_amount)}</p>
                                <p className="text-xs text-muted-foreground">#{o.id.slice(0, 8).toUpperCase()}</p>

                                {o.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => act(o.id, 'confirmed')} disabled={acting === o.id}
                                            className="flex items-center gap-1.5 px-3 py-2 min-h-[36px] gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-50">
                                            {acting === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}Accept
                                        </button>
                                        <button onClick={() => act(o.id, 'cancelled')} disabled={acting === o.id}
                                            className="flex items-center gap-1.5 px-3 py-2 min-h-[36px] bg-red-100 text-red-700 text-xs font-bold rounded-xl hover:bg-red-200 disabled:opacity-50">
                                            <XCircle className="w-3.5 h-3.5" />Decline
                                        </button>
                                    </div>
                                )}
                                {o.status === 'confirmed' && (
                                    <button onClick={() => act(o.id, 'delivered')} disabled={acting === o.id}
                                        className="flex items-center gap-1.5 px-3 py-2 min-h-[36px] bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50">
                                        {acting === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
