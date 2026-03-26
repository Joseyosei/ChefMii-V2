'use client'


// ── Types ─────────────────────────────────────────────────────
export interface FarmerProfile {
    id: string
    user_id: string
    farm_name: string
    location: string | null
    description: string | null
    verified: boolean
    rating: number
    total_orders: number
    marketplace_live: boolean
}

export interface Produce {
    id: string
    farmer_id: string
    name: string
    category: string | null
    price_per_unit: number
    unit: string
    stock_quantity: number
    image_url: string | null
    organic: boolean
    available: boolean
}

export interface FarmerOrder {
    id: string
    farmer_id: string
    chef_id: string | null
    items: OrderItem[]
    total_amount: number
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
    delivery_date: string | null
    delivery_address: string | null
    notes: string | null
    created_at: string
    chef_name?: string
}

export interface OrderItem { name: string; qty: number; unit: string; price: number }

export interface Payout {
    id: string
    amount: number
    status: 'pending' | 'paid'
    period_label: string
    created_at: string
}

// ── Demo seed (shown when DB is empty) ────────────────────────
export const DEMO_PROFILE: FarmerProfile = {
    id: 'demo', user_id: 'demo',
    farm_name: 'Green Valley Organics',
    location: 'Devon, UK',
    description: 'Family-run organic farm supplying premium chefs with seasonal produce since 1998.',
    verified: true, rating: 4.8, total_orders: 142, marketplace_live: true,
}

export const DEMO_PRODUCE: Produce[] = [
    { id: 'p1', farmer_id: 'demo', name: 'Heirloom Tomatoes', category: 'Vegetables', price_per_unit: 4.20, unit: 'kg', stock_quantity: 145, image_url: 'https://images.unsplash.com/photo-1546470427-0d4a3f5f3c3b?w=300&q=70', organic: true, available: true },
    { id: 'p2', farmer_id: 'demo', name: 'Fresh Basil', category: 'Herbs', price_per_unit: 18.00, unit: 'kg', stock_quantity: 22, image_url: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=300&q=70', organic: true, available: true },
    { id: 'p3', farmer_id: 'demo', name: 'Free-Range Eggs', category: 'Dairy & Eggs', price_per_unit: 0.45, unit: 'unit', stock_quantity: 800, image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=70', organic: false, available: true },
    { id: 'p4', farmer_id: 'demo', name: 'Heritage Carrots', category: 'Vegetables', price_per_unit: 2.80, unit: 'kg', stock_quantity: 8, image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&q=70', organic: true, available: true },
    { id: 'p5', farmer_id: 'demo', name: 'Whole Grain Chicken', category: 'Meat', price_per_unit: 12.00, unit: 'kg', stock_quantity: 30, image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&q=70', organic: false, available: false },
]

export const DEMO_ORDERS: FarmerOrder[] = [
    { id: 'o1', farmer_id: 'demo', chef_id: 'c1', items: [{ name: 'Heirloom Tomatoes', qty: 20, unit: 'kg', price: 4.20 }, { name: 'Fresh Basil', qty: 3, unit: 'kg', price: 18.00 }], total_amount: 138.00, status: 'pending', delivery_date: '2026-03-18', delivery_address: '15 Kitchen Lane, London', notes: 'Please pack basil separately', created_at: '2026-03-06T10:00:00Z', chef_name: 'Chef Marco Rossi' },
    { id: 'o2', farmer_id: 'demo', chef_id: 'c2', items: [{ name: 'Heritage Carrots', qty: 15, unit: 'kg', price: 2.80 }, { name: 'Free-Range Eggs', qty: 100, unit: 'unit', price: 0.45 }], total_amount: 87.00, status: 'confirmed', delivery_date: '2026-03-20', delivery_address: '42 Gourmet Ave, Bristol', notes: '', created_at: '2026-03-05T14:00:00Z', chef_name: 'Chef Sofia Mendez' },
    { id: 'o3', farmer_id: 'demo', chef_id: 'c3', items: [{ name: 'Whole Grain Chicken', qty: 10, unit: 'kg', price: 12.00 }], total_amount: 120.00, status: 'delivered', delivery_date: '2026-03-01', delivery_address: '8 Bistro Rd, Bath', notes: 'Excellent quality as always', created_at: '2026-02-28T09:00:00Z', chef_name: 'Chef Pierre Dubois' },
]

export const DEMO_REVENUE = [
    { month: 'Oct', amount: 1840 }, { month: 'Nov', amount: 2210 }, { month: 'Dec', amount: 3450 },
    { month: 'Jan', amount: 2100 }, { month: 'Feb', amount: 2780 }, { month: 'Mar', amount: 1620 },
]

export const DEMO_PAYOUTS: Payout[] = [
    { id: 'py1', amount: 2780, status: 'paid', period_label: 'Feb 2026', created_at: '2026-03-01T00:00:00Z' },
    { id: 'py2', amount: 2100, status: 'paid', period_label: 'Jan 2026', created_at: '2026-02-01T00:00:00Z' },
    { id: 'py3', amount: 3450, status: 'paid', period_label: 'Dec 2025', created_at: '2026-01-01T00:00:00Z' },
    { id: 'py4', amount: 1620, status: 'pending', period_label: 'Mar 2026', created_at: '2026-03-06T00:00:00Z' },
]

// ── Helpers ───────────────────────────────────────────────────
export const fmt = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const STATUS_STYLE: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export const CATEGORIES = ['Vegetables', 'Herbs', 'Fruit', 'Dairy & Eggs', 'Meat', 'Grains', 'Other']
