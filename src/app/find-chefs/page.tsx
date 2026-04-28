'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { Search, Star, MapPin, SlidersHorizontal, X } from 'lucide-react'

const CUISINES = ['All', 'Italian', 'Japanese', 'French', 'West African', 'Spanish', 'Indian', 'Mexican', 'Pan-African', 'Mediterranean']

const ALL_CHEFS = [
    { id: 'marco-rossi', name: 'Chef Marco Rossi', cuisine: 'Italian', rate: 150, rating: 4.9, reviews: 128, location: 'London, UK', badge: 'Fine Dining', bio: '15 years fine dining experience across Italy and the UK.', photo: '/images/chefs/chef_marco_rossi.png' },
    { id: 'yuki-tanaka', name: 'Chef Yuki Tanaka', cuisine: 'Japanese', rate: 200, rating: 5.0, reviews: 67, location: 'Dubai, UAE', badge: 'Omakase Master', bio: 'Trained at 3-Michelin-star restaurants in Tokyo.', photo: '/images/chefs/chef_yuki_tanaka.png' },
    { id: 'pierre-dubois', name: 'Chef Pierre Dubois', cuisine: 'French', rate: 180, rating: 4.7, reviews: 212, location: 'Paris, France', badge: 'Haute Cuisine', bio: 'Former executive chef at Hôtel de Crillon, Paris.', photo: '/images/chefs/chef_pierre_dubois.png' },
    { id: 'aisha-okafor', name: 'Chef Aisha Okafor', cuisine: 'West African', rate: 80, rating: 4.8, reviews: 94, location: 'Lagos, Nigeria', badge: 'Traditional', bio: 'Bringing authentic West African flavours to private events.', photo: '/images/chefs/chef_aisha_okafor.png' },
    { id: 'sofia-mendez', name: 'Chef Sofía Mendez', cuisine: 'Spanish', rate: 120, rating: 4.9, reviews: 89, location: 'Barcelona, Spain', badge: 'Tapas & Paella', bio: 'Expert in traditional Catalan cuisine and modernist tapas.', photo: '/images/chefs/chef_sofia_mendez.png' },
    { id: 'james-osei', name: 'Chef James Osei', cuisine: 'Pan-African', rate: 70, rating: 4.8, reviews: 156, location: 'Accra, Ghana', badge: 'Events Specialist', bio: 'Creates vibrant Pan-African feasts for weddings and parties.', photo: null },
    { id: 'meera-patel', name: 'Chef Meera Patel', cuisine: 'Indian', rate: 95, rating: 4.9, reviews: 203, location: 'Birmingham, UK', badge: 'Ayurvedic Chef', bio: 'Specialising in Ayurvedic nutrition and South Asian cuisine.', photo: '/images/chefs/chef_meera_patel.png' },
    { id: 'carlos-garcia', name: 'Chef Carlos Garcia', cuisine: 'Mexican', rate: 85, rating: 4.7, reviews: 71, location: 'Mexico City', badge: 'Street Food Expert', bio: 'Elevating traditional Mexican street food to fine dining.', photo: null },
]

export default function FindChefsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [cuisine, setCuisine] = useState('All')
    const [maxRate, setMaxRate] = useState(500)
    const [minRate, setMinRate] = useState(0)
    const [sort, setSort] = useState<'rating' | 'price-low' | 'price-high'>('rating')
    const [filtersOpen, setFiltersOpen] = useState(false)

    let filtered = ALL_CHEFS.filter(c =>
        (cuisine === 'All' || c.cuisine === cuisine) &&
        c.rate >= minRate && c.rate <= maxRate &&
        (c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.cuisine.toLowerCase().includes(query.toLowerCase()) ||
            c.location.toLowerCase().includes(query.toLowerCase()))
    )
    if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
    if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.rate - b.rate)
    if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.rate - a.rate)

    return (
        <>
            <Navbar />
            <main>
                {/* Search header */}
                <div className="gradient-brand py-10 sm:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3 sm:mb-4">Find Your Perfect Chef</h1>
                        <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-lg">Browse 500+ verified chefs worldwide</p>
                        <div className="flex bg-white rounded-xl overflow-hidden shadow-xl">
                            <div className="flex items-center flex-1 px-4">
                                <Search className="w-5 h-5 text-muted-foreground shrink-0 mr-3" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && router.push(`/find-chefs?q=${encodeURIComponent(query)}`)}
                                    placeholder="Cuisine, chef name, or city…"
                                    className="flex-1 py-3 sm:py-4 text-sm text-foreground bg-transparent focus:outline-none min-h-[44px]"
                                />
                                {query && (
                                    <button onClick={() => setQuery('')} className="p-1 hover:text-foreground text-muted-foreground">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button className="gradient-brand text-white px-5 sm:px-8 min-h-[44px] font-bold text-sm hover:opacity-90 transition-opacity">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Cuisine chips — horizontal scroll on mobile */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                        {CUISINES.map(c => (
                            <button key={c} onClick={() => setCuisine(c)}
                                className={`px-4 py-2 min-h-[40px] rounded-full text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${cuisine === c ? 'gradient-brand text-white border-transparent' : 'border-border hover:border-terracotta hover:text-terracotta bg-card'}`}>
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Sort + filter row */}
                    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                        <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> chefs found</p>
                        <div className="flex gap-2">
                            <button onClick={() => setFiltersOpen(!filtersOpen)}
                                className="flex items-center gap-2 px-4 py-2 min-h-[40px] border border-border rounded-xl text-sm hover:bg-muted transition-colors">
                                <SlidersHorizontal className="w-4 h-4" />Filters
                            </button>
                            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                                className="px-3 py-2 min-h-[40px] border border-border rounded-xl bg-card text-sm focus:outline-none">
                                <option value="rating">Top Rated</option>
                                <option value="price-low">Price: Low</option>
                                <option value="price-high">Price: High</option>
                            </select>
                        </div>
                    </div>

                    {/* Expanded filters panel */}
                    {filtersOpen && (
                        <div className="bg-card border border-border rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Max Rate: £{maxRate}/hr</label>
                                <input type="range" min="50" max="500" step="25" value={maxRate}
                                    onChange={e => setMaxRate(+e.target.value)}
                                    className="w-full accent-terracotta" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>£50</span><span>£500</span></div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Min Rate: £{minRate}/hr</label>
                                <input type="range" min="0" max="400" step="25" value={minRate}
                                    onChange={e => setMinRate(+e.target.value)}
                                    className="w-full accent-terracotta" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>£0</span><span>£400</span></div>
                            </div>
                        </div>
                    )}

                    {/* Chef grid — 1/2/3/4 col */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-5xl mb-4">🍽️</p>
                            <h3 className="font-bold text-xl mb-2">No chefs found</h3>
                            <p className="text-muted-foreground mb-4">Try adjusting your filters or search term.</p>
                            <button onClick={() => { setQuery(''); setCuisine('All'); setMaxRate(500) }}
                                className="px-6 py-2.5 gradient-brand text-white rounded-xl font-semibold text-sm hover:opacity-90">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filtered.map(chef => (
                                <div key={chef.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
                                    {/* Photo */}
                                    <div className="h-40 sm:h-48 relative overflow-hidden bg-muted">
                                        {chef.photo ? (
                                            <Image src={chef.photo} alt={chef.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="h-full gradient-brand flex items-center justify-center">
                                                <span className="text-4xl sm:text-5xl font-black text-white/40">
                                                    {chef.name.split(' ').slice(1).map((w: string) => w[0]).join('')}
                                                </span>
                                            </div>
                                        )}
                                        <span className="absolute top-3 right-3 text-xs px-2 py-1 bg-black/40 text-white rounded-full font-medium backdrop-blur-sm z-10">
                                            {chef.badge}
                                        </span>
                                    </div>
                                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-sm sm:text-base mb-0.5 group-hover:text-terracotta transition-colors">{chef.name}</h3>
                                        <div className="flex items-center gap-1 text-xs mb-1">
                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                            <span className="font-bold">{chef.rating}</span>
                                            <span className="text-muted-foreground">({chef.reviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                            <MapPin className="w-3 h-3" />{chef.location}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{chef.bio}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-terracotta font-black text-base sm:text-lg">£{chef.rate}/hr</span>
                                            <Link href={`/book/${chef.id}`}
                                                className="px-4 py-2 min-h-[40px] gradient-brand text-white text-xs sm:text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center">
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
