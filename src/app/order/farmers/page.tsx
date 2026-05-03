'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Leaf, MapPin, Star, ShoppingBag } from 'lucide-react'

interface Farmer {
  id: string
  name: string
  location: string
  image: string
  rating: number
  reviews: number
  badge: string
  nextDelivery: string
  distance: string
  minOrder: number
  products: {
    id: string
    name: string
    price: number
    image: string
    quantity: string
    organic: boolean
  }[]
}

function FarmersContent() {
  const [farmers] = useState<Farmer[]>([
    {
      id: 'farmer-1',
      name: 'Green Valley Farm',
      location: 'Hertfordshire',
      image: 'https://images.unsplash.com/photo-1488459716781-6f3ee1e28e54?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 287,
      badge: 'Organic',
      nextDelivery: 'Tomorrow',
      distance: '12 miles',
      minOrder: 20,
      products: [
        {
          id: 'p1',
          name: 'Organic Tomatoes',
          price: 4.99,
          image: 'https://images.unsplash.com/photo-1592841657303-869f86d5c8e0?w=200&h=200&fit=crop',
          quantity: 'per kg',
          organic: true,
        },
        {
          id: 'p2',
          name: 'Fresh Lettuce',
          price: 2.50,
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop',
          quantity: 'per head',
          organic: true,
        },
        {
          id: 'p3',
          name: 'Carrots',
          price: 3.99,
          image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
          quantity: 'per kg',
          organic: true,
        },
        {
          id: 'p4',
          name: 'Potatoes',
          price: 2.99,
          image: 'https://images.unsplash.com/photo-1590080876-3371efffe5b5?w=200&h=200&fit=crop',
          quantity: 'per kg',
          organic: true,
        },
      ],
    },
    {
      id: 'farmer-2',
      name: 'Sunny Acres',
      location: 'Surrey',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 156,
      badge: 'Organic',
      nextDelivery: 'Tomorrow',
      distance: '8 miles',
      minOrder: 15,
      products: [
        {
          id: 'p5',
          name: 'Strawberries',
          price: 5.99,
          image: 'https://images.unsplash.com/photo-1587393855258-e76694f45b20?w=200&h=200&fit=crop',
          quantity: 'per punnet',
          organic: true,
        },
        {
          id: 'p6',
          name: 'Blueberries',
          price: 6.99,
          image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=200&h=200&fit=crop',
          quantity: 'per punnet',
          organic: true,
        },
        {
          id: 'p7',
          name: 'Apples',
          price: 3.50,
          image: 'https://images.unsplash.com/photo-1560806674-104fc7c7c1f0?w=200&h=200&fit=crop',
          quantity: 'per kg',
          organic: true,
        },
        {
          id: 'p8',
          name: 'Pears',
          price: 4.50,
          image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=200&h=200&fit=crop',
          quantity: 'per kg',
          organic: true,
        },
      ],
    },
    {
      id: 'farmer-3',
      name: 'Fresh Harvest Co',
      location: 'Kent',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 203,
      badge: 'Certified',
      nextDelivery: 'Today',
      distance: '15 miles',
      minOrder: 25,
      products: [
        {
          id: 'p9',
          name: 'Broccoli',
          price: 3.99,
          image: 'https://images.unsplash.com/photo-1590080876-3371efffe5b5?w=200&h=200&fit=crop',
          quantity: 'per head',
          organic: true,
        },
        {
          id: 'p10',
          name: 'Cauliflower',
          price: 3.99,
          image: 'https://images.unsplash.com/photo-1590080876-3371efffe5b5?w=200&h=200&fit=crop',
          quantity: 'per head',
          organic: true,
        },
        {
          id: 'p11',
          name: 'Spinach',
          price: 2.99,
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop',
          quantity: 'per bunch',
          organic: true,
        },
        {
          id: 'p12',
          name: 'Kale',
          price: 3.50,
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop',
          quantity: 'per bunch',
          organic: true,
        },
      ],
    },
  ])

  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(farmers[0])
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([])

  const addToCart = (productId: string) => {
    const existing = cart.find(item => item.productId === productId)
    if (existing) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { productId, quantity: 1 }])
    }
  }

  const cartTotal = selectedFarmer
    ? cart.reduce((sum, item) => {
        const product = selectedFarmer.products.find(p => p.id === item.productId)
        return sum + (product?.price || 0) * item.quantity
      }, 0)
    : 0

  if (!selectedFarmer) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Farmer not found</h1>
            <Link href="/order" className="text-terracotta hover:underline">
              Back to Order Hub
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-32">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden bg-muted">
          <img
            src={selectedFarmer.image}
            alt={selectedFarmer.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link
              href="/order"
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 border-b border-border">
          <h1 className="text-3xl font-serif font-bold mb-3">{selectedFarmer.name}</h1>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {selectedFarmer.rating} ({selectedFarmer.reviews})
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {selectedFarmer.distance}
            </span>
            <span className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-green-600" />
              {selectedFarmer.badge}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Next Delivery</p>
              <p className="font-bold">{selectedFarmer.nextDelivery}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Min Order</p>
              <p className="font-bold">£{selectedFarmer.minOrder}</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-2xl font-serif font-bold mb-6">Fresh Produce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {selectedFarmer.products.map(product => (
              <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-terracotta transition-all">
                <div className="relative h-40 overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.organic && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Organic
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.quantity}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">£{product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center hover:bg-terracotta/90 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Basket */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto z-40 py-4 px-6 bg-terracotta text-white font-bold rounded-full flex items-center justify-between hover:bg-terracotta/90 transition-colors shadow-lg">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
          <span>£{cartTotal.toFixed(2)}</span>
        </div>
      )}

      <Footer />
    </>
  )
}

export default function FarmersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    }>
      <FarmersContent />
    </Suspense>
  )
}
