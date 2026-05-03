'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { MapPin, Search, Clock, DollarSign, Star, Zap, CheckCircle, Leaf } from 'lucide-react'

const CUISINES = [
  { emoji: '🍝', label: 'Italian', id: 'italian' },
  { emoji: '🍣', label: 'Japanese', id: 'japanese' },
  { emoji: '🌍', label: 'African', id: 'african' },
  { emoji: '🍛', label: 'Indian', id: 'indian' },
  { emoji: '🥐', label: 'French', id: 'french' },
  { emoji: '🔥', label: 'BBQ', id: 'bbq' },
  { emoji: '🥗', label: 'Vegan', id: 'vegan' },
  { emoji: '🌾', label: 'Farm Fresh', id: 'farm' },
]

const FILTERS = [
  { icon: Zap, label: 'Under 30 mins', id: 'fast' },
  { icon: DollarSign, label: 'Under £15', id: 'cheap' },
  { icon: Star, label: 'Top Rated', id: 'rated' },
  { icon: CheckCircle, label: 'Verified', id: 'verified' },
  { icon: Leaf, label: 'Free Delivery', id: 'free' },
]

const TRENDING_CHEFS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Marco Rossi',
    cuisine: 'Italian',
    rating: 4.9,
    reviews: 342,
    distance: '0.8 mi',
    time: '25 mins',
    fee: 'Free delivery',
    badge: 'Most liked',
    image: 'https://images.unsplash.com/photo-1577003832033-a0d99e4bed89?w=400&h=300&fit=crop',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Yuki Tanaka',
    cuisine: 'Japanese',
    rating: 4.8,
    reviews: 298,
    distance: '1.2 mi',
    time: '30 mins',
    fee: '£2.99',
    badge: 'Top rated',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Sophie Leclerc',
    cuisine: 'French',
    rating: 4.7,
    reviews: 215,
    distance: '1.5 mi',
    time: '35 mins',
    fee: '£3.99',
    badge: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'James Okafor',
    cuisine: 'West African',
    rating: 4.9,
    reviews: 287,
    distance: '0.9 mi',
    time: '28 mins',
    fee: 'Free delivery',
    badge: 'Most liked',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
]

const FARMERS = [
  {
    id: 'farmer-1',
    name: 'Green Valley Farm',
    location: 'Hertfordshire',
    badge: 'Organic',
    nextDelivery: 'Tomorrow',
    image: 'https://images.unsplash.com/photo-1488459716781-6f3ee1e28e54?w=400&h=300&fit=crop',
  },
  {
    id: 'farmer-2',
    name: 'Sunny Acres',
    location: 'Surrey',
    badge: 'Organic',
    nextDelivery: 'Tomorrow',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=300&fit=crop',
  },
  {
    id: 'farmer-3',
    name: 'Fresh Harvest Co',
    location: 'Kent',
    badge: 'Certified',
    nextDelivery: 'Today',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
  },
]

function OrderHubContent() {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [deliveryMode, setDeliveryMode] = useState('delivery')
  const [location, setLocation] = useState('London, UK')

  const toggleFilter = (id: string) => {
    setSelectedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-terracotta/10 to-transparent pt-8 pb-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2">Order from Chefs 🍽️</h1>
            <p className="text-muted-foreground text-lg mb-6">Discover top chefs and fresh produce near you</p>

            {/* Location & Delivery Mode */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-terracotta transition-colors">
                <MapPin className="w-5 h-5 text-terracotta flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="Enter delivery address"
                />
              </div>
              <div className="flex gap-2 bg-card border border-border rounded-xl p-1">
                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    deliveryMode === 'delivery'
                      ? 'bg-terracotta text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    deliveryMode === 'pickup'
                      ? 'bg-terracotta text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Pickup
                </button>
              </div>
            </div>

            {/* Cuisine Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CUISINES.map(cuisine => (
                <button
                  key={cuisine.id}
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine.id ? null : cuisine.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all flex-shrink-0 ${
                    selectedCuisine === cuisine.id
                      ? 'bg-terracotta text-white'
                      : 'bg-card border border-border text-foreground hover:border-terracotta'
                  }`}
                >
                  {cuisine.emoji} {cuisine.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTERS.map(filter => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all flex items-center gap-2 flex-shrink-0 ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-terracotta text-white'
                      : 'bg-card border border-border text-foreground hover:border-terracotta'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Trending Chefs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            🔥 Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRENDING_CHEFS.map(chef => (
              <Link
                key={chef.id}
                href={`/order/${chef.id}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-terracotta hover:shadow-lg transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {chef.badge && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {chef.badge}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{chef.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{chef.cuisine}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{chef.rating}</span>
                    <span className="text-xs text-muted-foreground">({chef.reviews})</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>{chef.distance}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {chef.time}
                      </span>
                    </div>
                    <div className="text-green-600 font-medium">{chef.fee}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Farmers Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-border">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            🌾 Order Fresh from Farmers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FARMERS.map(farmer => (
              <Link
                key={farmer.id}
                href={`/order/farmers/${farmer.id}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-terracotta hover:shadow-lg transition-all"
              >
                <div className="relative h-40 overflow-hidden bg-muted">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {farmer.badge}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{farmer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{farmer.location}</p>
                  <div className="text-sm font-medium text-green-600">
                    Next delivery: {farmer.nextDelivery}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Reorder Favorites */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-border">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            ❤️ Reorder Favourites
          </h2>
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-4">No previous orders yet</p>
            <p className="text-sm text-muted-foreground">Place your first order to see favorites here</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    }>
      <OrderHubContent />
    </Suspense>
  )
}
