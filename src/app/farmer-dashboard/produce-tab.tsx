'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { Plus, Edit3, Trash2, AlertTriangle, X, Loader2, Upload } from 'lucide-react'
import { fmt, CATEGORIES, type Produce } from './types'

const CATEGORY_COLORS: Record<string, string> = {
    'Vegetables': 'bg-green-100 text-green-700',
    'Herbs': 'bg-emerald-100 text-emerald-700',
    'Fruit': 'bg-orange-100 text-orange-700',
    'Dairy & Eggs': 'bg-yellow-100 text-yellow-700',
    'Meat': 'bg-red-100 text-red-700',
    'Grains': 'bg-amber-100 text-amber-700',
    'Other': 'bg-gray-100 text-gray-700',
}

function ProduceModal({
    farmerId, item, onClose, onSaved,
}: {
    farmerId: string
    item?: Produce
    onClose: () => void
    onSaved: (p: Produce) => void
}) {
    const { user } = useAuth()
    const fileRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState(item?.name ?? '')
    const [cat, setCat] = useState(item?.category ?? 'Vegetables')
    const [price, setPrice] = useState(String(item?.price_per_unit ?? ''))
    const [unit, setUnit] = useState(item?.unit ?? 'kg')
    const [stock, setStock] = useState(String(item?.stock_quantity ?? ''))
    const [organic, setOrganic] = useState(item?.organic ?? false)
    const [imgUrl, setImgUrl] = useState(item?.image_url ?? '')
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleImageFile = async (file: File) => {
        if (!user) return
        setUploading(true)
        const sb = createClient()
        const path = `produce/${user.id}/${Date.now()}-${file.name}`
        const { data, error } = await sb.storage.from('chef-media').upload(path, file, { upsert: true })
        if (!error && data) {
            const url = sb.storage.from('chef-media').getPublicUrl(data.path).data.publicUrl
            setImgUrl(url)
        }
        setUploading(false)
    }

    const save = async () => {
        if (!name || !price || !stock) return
        setSaving(true)
        const sb = createClient()
        const payload = {
            farmer_id: farmerId,
            name, category: cat,
            price_per_unit: parseFloat(price),
            unit, stock_quantity: parseInt(stock),
            organic, image_url: imgUrl || null, available: true,
        }
        const { data, error } = item?.id && !item.id.startsWith('p')
            // @ts-expect-error Bypass type mismatch
            ? await sb.from('produce_listings').update(payload).eq('id', item.id).select().single()
            // @ts-expect-error Bypass type mismatch
            : await sb.from('produce_listings').insert(payload).select().single()

        if (!error && data) onSaved(data as Produce)
        setSaving(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                    <h2 className="font-bold text-lg">{item ? 'Edit Produce' : '+ Add New Produce'}</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Image */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Photo</label>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="relative w-full h-32 rounded-2xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-terracotta transition-colors group bg-muted"
                        >
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
                            {imgUrl
                                ? <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center justify-center h-full">
                                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-terracotta" /> : <Upload className="w-6 h-6 text-muted-foreground group-hover:text-terracotta transition-colors" />}
                                    <p className="text-xs text-muted-foreground mt-1">{uploading ? 'Uploading…' : 'Tap to upload'}</p>
                                </div>}
                        </div>
                        {imgUrl && !imgUrl.startsWith('http') && (
                            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Or paste image URL"
                                className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none" />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Heirloom Tomatoes"
                            className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Category</label>
                            <select value={cat} onChange={e => setCat(e.target.value)}
                                className="w-full px-3 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none">
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Unit</label>
                            <select value={unit} onChange={e => setUnit(e.target.value)}
                                className="w-full px-3 py-3 min-h-[44px] rounded-xl border border-border bg-background text-sm focus:outline-none">
                                {['kg', 'unit', 'bunch', 'litre', 'box', 'crate'].map(u => <option key={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Price (£/{unit}) *</label>
                            <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Stock ({unit}) *</label>
                            <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)}
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-terracotta text-sm" />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl hover:bg-muted transition-colors">
                        <div
                            onClick={() => setOrganic(o => !o)}
                            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${organic ? 'bg-green-500' : 'bg-border'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${organic ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Certified Organic</p>
                            <p className="text-xs text-muted-foreground">Show organic badge on listing</p>
                        </div>
                    </label>

                    <button onClick={save} disabled={saving || !name || !price || !stock}
                        className="w-full py-3.5 min-h-[52px] gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : item ? 'Save Changes' : 'Add Listing'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export function ProduceTab({
    farmerId, produce, onUpdate,
}: {
    farmerId: string
    produce: Produce[]
    onUpdate: (items: Produce[]) => void
}) {
    const [modal, setModal] = useState<'add' | Produce | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    const toggleAvailable = async (p: Produce) => {
        const sb = createClient()
        const updated = produce.map(x => x.id === p.id ? { ...x, available: !x.available } : x)
        onUpdate(updated)
        if (!p.id.startsWith('p')) {
            // @ts-expect-error Bypass type mismatch
            await sb.from('produce_listings').update({ available: !p.available }).eq('id', p.id)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this listing?')) return
        setDeleting(id)
        const sb = createClient()
        if (!id.startsWith('p')) await sb.from('produce_listings').delete().eq('id', id)
        onUpdate(produce.filter(p => p.id !== id))
        setDeleting(null)
    }

    const handleSaved = (saved: Produce) => {
        const existing = produce.find(p => p.id === saved.id)
        onUpdate(existing ? produce.map(p => p.id === saved.id ? saved : p) : [...produce, saved])
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-xl">My Produce <span className="text-muted-foreground font-normal text-base">({produce.length})</span></h2>
                <button onClick={() => setModal('add')}
                    className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">
                    <Plus className="w-4 h-4" />Add Produce
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {produce.map(p => {
                    const lowStock = p.stock_quantity < 10
                    return (
                        <div key={p.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${!p.available ? 'opacity-60 border-border' : 'border-border hover:shadow-md hover:-translate-y-0.5'}`}>
                            {/* Image */}
                            <div className="relative h-40 bg-muted overflow-hidden">
                                {p.image_url
                                    ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>}
                                {p.organic && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">🌱 Organic</span>
                                )}
                                {!p.available && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="font-bold text-sm leading-tight">{p.name}</h3>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${CATEGORY_COLORS[p.category ?? 'Other'] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {p.category}
                                        </span>
                                    </div>
                                    <p className="font-black text-terracotta text-base shrink-0">{fmt(p.price_per_unit)}<span className="text-xs text-muted-foreground font-normal">/{p.unit}</span></p>
                                </div>

                                {/* Stock */}
                                <div className={`flex items-center gap-1.5 text-xs mb-3 ${lowStock ? 'text-red-600' : 'text-muted-foreground'}`}>
                                    {lowStock && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                                    <span className="font-semibold">{p.stock_quantity} {p.unit} in stock</span>
                                    {lowStock && <span className="text-red-600 font-bold">— Low!</span>}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Available toggle */}
                                    <button onClick={() => toggleAvailable(p)}
                                        className={`flex-1 py-2 min-h-[36px] rounded-xl text-xs font-bold border transition-colors ${p.available ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-muted border-border text-muted-foreground hover:bg-border'}`}>
                                        {p.available ? '● Live' : '○ Off'}
                                    </button>
                                    <button onClick={() => setModal(p)}
                                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
                                        <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                                        {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-red-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {modal && (
                <ProduceModal
                    farmerId={farmerId}
                    item={modal === 'add' ? undefined : modal}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    )
}
