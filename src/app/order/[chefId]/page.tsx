'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { X, Heart, Share2, Search, ShoppingBag, Plus, Minus } from 'lucide-react'

// Mock chef data
const CHEF_DATA: Record<string, any> = {
  '11111111-1111-1111-1111-111111111111': {
    name: 'Marco Rossi',
    cuisine: 'Italian',
    rating: 4.9,
    reviews: 342,
    distance: '0.8 mi',
    time: '25 mins',
    image: 'https://images.unsplash.com/photo-1577003832033-a0d99e4bed89?w=800&h=400&fit=crop',
    tagline: 'Secret carbonara recipe you need to try',
    badge: '60+ people reordered',
    deliveryFee: 'Free delivery',
    menu: [
      {
        id: '1',
        category: 'Featured',
        items: [
          {
            id: 'item-1',
            name: 'Secret Carbonara',
            description: 'Guanciale, Pecorino Romano, free-range eggs, fresh pasta',
            price: 18.50,
            image: 'https://images.unsplash.com/photo-1612874742237-6526221fcf4f?w=400&h=300&fit=crop',
            badge: '#1 most liked',
            likes: 89,
            reviews: 342,
          },
          {
            id: 'item-2',
            name: 'Truffle Risotto',
            description: 'Carnaroli rice, black truffle, Parmigiano-Reggiano',
            price: 22.00,
            image: 'https://images.unsplash.com/photo-1476124369162-f4978d1a23a0?w=400&h=300&fit=crop',
            likes: 76,
            reviews: 215,
          },
          {
            id: 'item-3',
            name: 'Osso Buco',
            description: 'Braised veal shanks, gremolata, saffron risotto',
            price: 28.00,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            likes: 64,
            reviews: 198,
          },
        ],
      },
      {
        id: '2',
        category: 'Mains',
        items: [
          {
            id: 'item-4',
            name: 'Pappardelle al Cinghiale',
            description: 'Wide ribbon pasta with wild boar ragù',
            price: 20.00,
            image: 'https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=400&h=300&fit=crop',
            likes: 58,
            reviews: 142,
          },
          {
            id: 'item-5',
            name: 'Branzino al Forno',
            description: 'Whole Mediterranean sea bass, lemon, herbs',
            price: 32.00,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            likes: 71,
            reviews: 189,
          },
        ],
      },
      {
        id: '3',
        category: 'Desserts',
        items: [
          {
            id: 'item-6',
            name: 'Tiramisu',
            description: 'House-made ladyfingers, mascarpone, espresso. Serves 2',
            price: 12.00,
            image: 'https://images.unsplash.com/photo-1571115764595-644a262f8a94?w=400&h=300&fit=crop',
            likes: 92,
            reviews: 287,
          },
        ],
      },
    ],
  },
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

function ChefMenuContent() {
  const params = useParams()
  const chefId = params.chefId as string
  const chef = CHEF_DATA[chefId]
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [specialRequest, setSpecialRequest] = useState('')

  if (!chef) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Chef not found</h1>
          <Link href="/order" className="text-terracotta hover:underline">
            Back to Order Hub
          </Link>
        </div>
      </div>
    )
  }

  const addToCart = (item: any) => {
    const existingItem = cart.find(i => i.id === item.id)
    if (existingItem) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      ))
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity, image: item.image }])
    }
    setSelectedItem(null)
    setQuantity(1)
    setSpecialRequest('')
  }

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== itemId))
    } else {
      setCart(cart.map(i => (i.id === itemId ? { ...i, quantity: newQty } : i)))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-32">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 overflow-hidden bg-muted">
          <img
            src={chef.image}
            alt={chef.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Top buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <Link
              href="/order"
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </Link>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chef info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-sm italic mb-2">{chef.tagline}</p>
            <p className="text-xs opacity-80">Generated by ChefMii AI</p>
          </div>
        </div>

        {/* Chef Info Card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 border-b border-border">
          <h1 className="text-4xl font-serif font-bold text-center mb-3">{chef.name}</h1>
          <div className="flex justify-center items-center gap-4 text-sm mb-4">
            <span className="font-bold">⭐ {chef.rating}</span>
            <span className="text-muted-foreground">({chef.reviews} reviews)</span>
            <span className="text-muted-foreground">• {chef.distance}</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              {chef.badge}
            </span>
          </div>

          {/* Delivery info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Delivery</p>
              <p className="font-bold">{chef.time}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Delivery Fee</p>
              <p className="font-bold text-green-600">{chef.deliveryFee}</p>
            </div>
          </div>

          {/* Delivery/Pickup toggle */}
          <div className="flex gap-2 bg-card border border-border rounded-lg p-1">
            <button className="flex-1 px-4 py-2 rounded-md bg-terracotta text-white font-medium">
              Delivery
            </button>
            <button className="flex-1 px-4 py-2 rounded-md text-foreground hover:bg-muted font-medium">
              Pickup
            </button>
          </div>
        </div>

        {/* Menu Tabs */}
        <div className="sticky top-16 bg-background border-b border-border z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-4 overflow-x-auto scrollbar-hide">
            {chef.menu.map(section => (
              <button
                key={section.id}
                className="px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent hover:border-terracotta transition-colors"
              >
                {section.category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {chef.menu.map(section => (
            <div key={section.id} className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-6">{section.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group text-left bg-card border border-border rounded-2xl overflow-hidden hover:border-terracotta hover:shadow-lg transition-all"
                  >
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {item.badge && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {item.badge}
                        </div>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setSelectedItem(item)
                        }}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center hover:bg-terracotta/90 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-lg">£{item.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          👍 {item.likes}% • {item.reviews} reviews
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Item Detail Bottom Sheet */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedItem(null)} />
            <div className="relative w-full bg-background rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />

              <h2 className="text-2xl font-serif font-bold mb-2">{selectedItem.name}</h2>
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>

              {/* Dietary tags */}
              <div className="flex gap-2 mb-6">
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">Vegetarian</span>
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">Gluten-free</span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mb-6 bg-card border border-border rounded-lg p-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Special Request */}
              <textarea
                value={specialRequest}
                onChange={e => setSpecialRequest(e.target.value)}
                placeholder="Add special request (optional)"
                className="w-full px-4 py-3 border border-border rounded-lg mb-6 bg-card focus:outline-none focus:ring-2 focus:ring-terracotta resize-none"
                rows={3}
              />

              {/* Add to Basket Button */}
              <button
                onClick={() => addToCart(selectedItem)}
                className="w-full py-4 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta/90 transition-colors mb-4"
              >
                Add to basket £{(selectedItem.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Basket Button */}
      {cartCount > 0 && (
        <Link
          href="/order/cart"
          className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto z-40 py-4 px-6 bg-terracotta text-white font-bold rounded-full flex items-center justify-between hover:bg-terracotta/90 transition-colors shadow-lg"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            View basket • {cartCount} items
          </span>
          <span>£{cartTotal.toFixed(2)}</span>
        </Link>
      )}
    </>
  )
}

export default function ChefMenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    }>
      <ChefMenuContent />
    </Suspense>
  )
}
