'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { Star, MapPin, Clock, Users, ChefHat, Heart, Share2, MessageCircle, ShoppingBag } from 'lucide-react'

// Mock chef data
interface ChefProfile {
    name: string
    cuisine: string
    rate: number
    rating: number
    reviews: number
    location: string
    badge: string
    bio: string
    photo: string
    description: string
    specialties: string[]
    availability: string
    minHours: number
    maxGuests: number
    portfolio: string[]
    reviews_list: Array<{ author: string; rating: number; text: string }>
}

const CHEFS_DATA: Record<string, ChefProfile> = {
    'marco-rossi': {
        name: 'Chef Marco Rossi',
        cuisine: 'Italian',
        rate: 150,
        rating: 4.9,
        reviews: 128,
        location: 'London, UK',
        badge: 'Fine Dining',
        bio: 'Award-winning Italian chef with 15 years experience in Michelin-starred restaurants.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        description: 'I specialize in authentic Italian cuisine with a modern twist. My menus are crafted using the finest ingredients, many imported directly from Italy. I have cooked for celebrities, politicians, and royalty.',
        specialties: ['Italian', 'Mediterranean', 'Fine Dining', 'Pasta', 'Risotto'],
        availability: 'Available weekends and select weekdays',
        minHours: 4,
        maxGuests: 50,
        portfolio: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        ],
        reviews_list: [
            { author: 'Sarah M.', rating: 5, text: 'Absolutely incredible! Marco transformed our dinner party into an unforgettable experience.' },
            { author: 'James P.', rating: 5, text: 'Professional, creative, and delicious. Highly recommend!' },
            { author: 'Emma L.', rating: 4.8, text: 'Amazing food and great communication throughout the process.' },
        ]
    },
    'yuki-tanaka': {
        name: 'Chef Yuki Tanaka',
        cuisine: 'Japanese',
        rate: 200,
        rating: 5.0,
        reviews: 67,
        location: 'Dubai, UAE',
        badge: 'Omakase Master',
        bio: 'Japanese cuisine expert trained in Tokyo. Specialising in omakase and sushi.',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        description: 'Trained at 3-Michelin-star restaurants in Tokyo, I bring authentic Japanese culinary traditions to your table. Specializing in omakase experiences and contemporary Japanese cuisine.',
        specialties: ['Japanese', 'Sushi', 'Omakase', 'Kaiseki', 'Tempura'],
        availability: 'Available year-round',
        minHours: 3,
        maxGuests: 30,
        portfolio: [
            'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
        ],
        reviews_list: [
            { author: 'Michael T.', rating: 5, text: 'Best omakase experience outside of Tokyo!' },
            { author: 'Lisa W.', rating: 5, text: 'Yuki is a true artist. Every dish was perfection.' },
        ]
    },
}

export default function ChefProfilePage() {
    const params = useParams()
    const chefId = params.id as string
    const chef = CHEFS_DATA[chefId]
    const [liked, setLiked] = useState(false)

    if (!chef) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-5xl mb-4">👨‍🍳</p>
                        <h1 className="text-2xl font-bold mb-2">Chef not found</h1>
                        <p className="text-muted-foreground mb-6">The chef profile you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href="/find-chefs" className="px-6 py-2.5 gradient-brand text-white rounded-xl font-semibold hover:opacity-90">
                            Back to Chefs
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
            <main className="min-h-screen">
                {/* Hero section with photo */}
                <div className="relative h-96 bg-muted overflow-hidden">
                    <Image
                        src={chef.photo}
                        alt={chef.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Header with actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 -mt-20 relative z-10">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2">{chef.name}&apos;s Profile</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold">{chef.rating}</span>
                                    <span className="text-muted-foreground">({chef.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />{chef.location}
                                </div>
                                <span className="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-xs font-semibold">
                                    {chef.badge}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLiked(!liked)}
                                className="p-3 border border-border rounded-xl hover:bg-muted transition-colors"
                                aria-label="Like"
                            >
                                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
                            </button>
                            <button className="p-3 border border-border rounded-xl hover:bg-muted transition-colors" aria-label="Share">
                                <Share2 className="w-5 h-5 text-foreground/60" />
                            </button>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column */}
                        <div className="lg:col-span-2">
                            {/* About */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">{chef.description}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                                        <Clock className="w-5 h-5 mx-auto mb-2 text-terracotta" />
                                        <p className="text-xs text-muted-foreground">Min Hours</p>
                                        <p className="font-bold text-lg">{chef.minHours}h</p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                                        <Users className="w-5 h-5 mx-auto mb-2 text-terracotta" />
                                        <p className="text-xs text-muted-foreground">Max Guests</p>
                                        <p className="font-bold text-lg">{chef.maxGuests}</p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                                        <ChefHat className="w-5 h-5 mx-auto mb-2 text-terracotta" />
                                        <p className="text-xs text-muted-foreground">Rate</p>
                                        <p className="font-bold text-lg">£{chef.rate}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Specialties */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">Specialties</h2>
                                <div className="flex flex-wrap gap-2">
                                    {chef.specialties.map((spec) => (
                                        <span key={spec} className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Portfolio */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">Portfolio</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {chef.portfolio.map((image, i) => (
                                        <div key={i} className="relative h-48 rounded-xl overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Portfolio ${i + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reviews */}
                            <section>
                                <h2 className="text-2xl font-serif font-bold mb-4">Reviews</h2>
                                <div className="space-y-4">
                                    {chef.reviews_list.map((review, i) => (
                                        <div key={i} className="bg-card border border-border rounded-xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold">{review.author}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star
                                                            key={j}
                                                            className={`w-4 h-4 ${j < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right sidebar */}
                        <div>
                            <div className="sticky top-20 bg-card border border-border rounded-2xl p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Hourly Rate</p>
                                    <p className="text-4xl font-black text-terracotta">£{chef.rate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Availability</p>
                                    <p className="font-semibold">{chef.availability}</p>
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        href={`/book/${chefId}`}
                                        className="w-full py-3 gradient-brand text-white font-bold rounded-xl text-center hover:opacity-90 transition-opacity block"
                                    >
                                        📅 Book for Event
                                    </Link>
                                    <Link
                                        href={`/order/${chefId}`}
                                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl text-center hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        🍽️ Order Food
                                    </Link>
                                </div>
                                <button className="w-full py-3 border border-border rounded-xl font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Message Chef
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
