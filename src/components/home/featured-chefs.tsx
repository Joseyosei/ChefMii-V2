'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ArrowRight } from 'lucide-react'

const FEATURED_CHEFS = [
    { id: 'yuki-tanaka', name: 'Chef Yuki Tanaka', cuisine: 'Japanese', rate: 200, rating: 5.0, reviews: 67, location: 'Dubai, UAE', badge: 'Omakase Master', photo: '/images/chefs/chef_yuki_tanaka.png' },
    { id: 'marco-rossi', name: 'Chef Marco Rossi', cuisine: 'Italian', rate: 150, rating: 4.9, reviews: 128, location: 'London, UK', badge: 'Fine Dining', photo: '/images/chefs/chef_marco_rossi.png' },
    { id: 'sofia-mendez', name: 'Chef Sofía Mendez', cuisine: 'Spanish', rate: 120, rating: 4.9, reviews: 89, location: 'Barcelona, Spain', badge: 'Tapas & Paella', photo: '/images/chefs/chef_sofia_mendez.png' },
    { id: 'pierre-dubois', name: 'Chef Pierre Dubois', cuisine: 'French', rate: 180, rating: 4.7, reviews: 212, location: 'Paris, France', badge: 'Haute Cuisine', photo: '/images/chefs/chef_pierre_dubois.png' },
]

export function FeaturedChefs() {
    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-foreground mb-4">
                            Search Top Chefs
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Discover world-class culinary talent available for private booking. From Michelin-trained experts to local legends.
                        </p>
                    </div>
                    <Link href="/find-chefs" className="hidden sm:inline-flex items-center gap-2 font-bold text-[#FF5A36] hover:text-[#E84A2A] transition-colors group px-4 py-2 bg-[#FF5A36]/10 rounded-full">
                        View all chefs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURED_CHEFS.map(chef => (
                        <Link key={chef.id} href={`/book/${chef.id}`} className="group block">
                            <div className="bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-[#FF5A36]/5 hover:-translate-y-1 transition-all duration-300">
                                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-muted">
                                    <Image
                                        src={chef.photo}
                                        alt={chef.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <span className="absolute top-4 right-4 text-xs px-3 py-1.5 bg-black/50 text-white rounded-full font-bold backdrop-blur-md border border-white/10 shadow-sm">
                                        {chef.badge}
                                    </span>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-bold text-white text-xl md:text-2xl mb-1 drop-shadow-md">
                                            {chef.name}
                                        </h3>
                                        <p className="text-white/90 text-sm flex items-center gap-1.5 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" /> {chef.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 flex items-center justify-between border-t border-border/50 bg-card">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold text-foreground">{chef.rating}</span>
                                            <span className="text-muted-foreground text-sm">({chef.reviews})</span>
                                        </div>
                                        <p className="text-sm font-semibold text-muted-foreground">{chef.cuisine} Cuisine</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-xl text-[#FF5A36]">£{chef.rate}</span>
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Per Hour</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/find-chefs" className="sm:hidden mt-8 flex items-center justify-center w-full gap-2 font-bold text-white bg-[#FF5A36] py-4 rounded-2xl">
                    View all chefs <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    )
}
