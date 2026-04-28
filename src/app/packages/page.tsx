import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Event Packages', description: 'Curated chef packages for every occasion' }

const CATEGORIZED_PACKAGES = [
    {
        category: 'Private Celebrations',
        items: [
            { emoji: '🎂', title: 'Birthday Bash', price: '£400 – £2,000', desc: 'Celebrate in style with a personalised birthday menu curated by your private chef.', includes: ['Custom cake & desserts', 'Cocktail hour canapés', '3-course dinner', 'Chef & waiting staff'] },
            { emoji: '💍', title: 'Wedding Feast', price: '£3,000 – £15,000', desc: 'Your perfect wedding dinner — from intimate celebrations to grand receptions.', includes: ['Bespoke wedding menu', 'Canapés & cocktail reception', 'Multi-course dinner', 'Full front-of-house team'] },
            { emoji: '🥂', title: 'Bridal / Bachelor Party', price: '£700 – £2,500', desc: 'Brunches, cocktail parties, and indulgent dining for unforgettable pre-wedding celebrations.', includes: ['Themed menu design', 'Cocktail & mocktail bar', 'Grazing boards & canapés', 'Private chef experience'] },
            { emoji: '🍼', title: 'Baby Shower Brunch', price: '£500 – £1,500', desc: 'Celebrate new arrivals with beautiful brunch spreads and celebratory cakes.', includes: ['Brunch & afternoon tea', 'Custom baby shower cake', 'Mocktail bar', 'Floral grazing tables'] },
            { emoji: '🎓', title: 'Graduation Dinner', price: '£300 – £1,200', desc: 'Mark the milestone with a memorable private dining experience for graduates and family.', includes: ['3-course celebration menu', 'Welcome drinks', 'Custom graduating desserts', 'Personalised menu cards'] },
        ]
    },
    {
        category: 'Luxury Travel',
        items: [
            { emoji: '🛩️', title: 'Private Jets', price: 'Contact for Quote', desc: 'Discreet, high-end culinary excellence at 30,000 feet. Tailored for discriminating palates.', includes: ['Global sourcing of ingredients', 'Specialized flight-safe menus', 'Discreet on-board service', 'Caviar & champagne service'] },
            { emoji: '🛥️', title: 'Luxury Yachts', price: '£2,000+ per day', desc: 'Summer in the Med or winter in the Caribbean with a dedicated private yacht chef.', includes: ['Fresh seafood focus', 'Deck-side cocktails & BBQ', 'Gourmet provisions management', 'Seamless service on the water'] },
            { emoji: '✈️', title: 'Executive Airlines', price: 'Enterprise Only', desc: 'Premium first-class menu consultancy and private catering for elite airline partners.', includes: ['Menu engineering', 'Crew training', 'High-volume logistics', 'Quality control audits'] },
        ]
    },
    {
        category: 'Pro Sports Teams',
        items: [
            { emoji: '⚽', title: 'Football Clubs', price: 'Season/Match Day', desc: 'Performance-driven nutrition for elite athletes, from training camps to match day dining.', includes: ['Dietician-approved menus', 'Recovery-focused meals', 'Travel catering', 'Youth academy programs'] },
            { emoji: '🏎️', title: 'F1 Race Teams', price: 'Circuit Support', desc: 'High-energy, focused catering for race engineers, mechanics, and drivers on the global circuit.', includes: ['Mobile kitchen setup', '24/7 hospitality', 'Nutrition for focus', 'VIP guest experiences'] },
            { emoji: '🏀', title: 'Basketball Teams', price: 'Tour Packages', desc: 'Fueling giants. Specialized high-calorie, nutrient-dense catering for rigorous tour schedules.', includes: ['Post-game recovery shakes', 'Custom meal prep', 'On-the-road dining', 'Performance snacks'] },
            { emoji: '🏅', title: 'Olympic Athletes', price: 'Camp Support', desc: 'Precision nutrition for the world\'s greatest stage. Specialized diets for peak human performance.', includes: ['Custom macro tracking', 'Supplement integration', 'Mental focus meals', 'Clean-ingredient focus'] },
            { emoji: '🏉', title: 'Rugby Teams', price: 'Match Support', desc: 'Robust, hearty, and highly nutritious menus designed for strength and recovery.', includes: ['High-protein focus', 'Team bonding dinners', 'Halftime nutrition', 'Rehab-specific diets'] },
            { emoji: '🎾', title: 'Tennis Pros', price: 'Tournament Support', desc: 'Light, energy-maintaining meals for high-intensity matches over long tournament weeks.', includes: ['Electrolyte optimization', 'Carb-loading strategies', 'Quick-digestion menus', 'Individualized meal plans'] },
        ]
    },
    {
        category: 'Corporate & Entertainment',
        items: [
            { emoji: '🏢', title: 'Modern Offices', price: 'Daily/Weekly', desc: 'Elevate office culture with gourmet lunches and team-building culinary events.', includes: ['Healthy lunch bowls', 'Executive board lunches', 'Coffee & pastry service', 'Themed Friday mixers'] },
            { emoji: '🎤', title: 'Music Concerts', price: 'Tour Support', desc: 'Catering for the stars and their crews. Consistent, high-quality dining throughout global tours.', includes: ['Green room hospitality', 'Crew meal halls', 'Headliner private chef', 'Late-night reload snacks'] },
            { emoji: '🎪', title: 'Large Festivals', price: 'Event Specific', desc: 'VIP hospitality and artist catering for the world\'s largest outdoor music and arts events.', includes: ['Mass hospitality production', 'Artist backstage dining', 'Luxury camping kits', 'Sponsor activations'] },
            { emoji: '🎡', title: 'Entertainment Centers', price: 'Volume Catering', desc: 'Sophisticated food programs for luxury cinemas, private clubs, and high-end arcades.', includes: ['Interactive food stations', 'Themed event menus', 'High-volume quality control', 'Signature cocktail programs'] },
        ]
    },
    {
        category: 'Exclusive Recommendations',
        items: [
            { emoji: '🧘', title: 'Wellness & Yoga Retreats', price: '£1,500 – £5,000', desc: 'Nutrient-dense, plant-forward menus for mindful gatherings and holistic healing.', includes: ['Vegan & vegetarian focus', 'Anti-inflammatory ingredients', 'Herbal tea station', 'Cooking workshops'] },
            { emoji: '🎬', title: 'Film & TV Production', price: 'Daily Rates', desc: 'High-energy, efficient catering for cast and crew on location. Fueling creativity daily.', includes: ['Craft services', 'Hot location lunches', 'Night shooting snacks', 'Cast-specific diets'] },
            { emoji: '🌙', title: 'Honeymoon Private Dining', price: '£600 – £1,500', desc: 'Ultra-romantic, intimate multi-course experiences for newlyweds in their first home together.', includes: ['Candlelit setup', 'Personalized wine pairing', 'Gift basket from chef', 'Breakfast-in-bed box'] },
            { emoji: '♠️', title: 'High-Stakes Gaming', price: '£300 – £1,000', desc: 'Sophisticated finger foods and brain-boosting snacks for poker or gaming marathons.', includes: ['One-handed eating focus', 'Cold & hot assortments', 'Energy beverage bar', 'Focus-enhancing menu'] },
        ]
    }
]

export default function PackagesPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pb-20">
                <div className="gradient-brand py-24 px-4 text-center text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                    
                    <div className="relative z-10">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white/70 mb-4 block">World-Class Hospitality</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight">Experience Packages</h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">Bespoke culinary solutions for elite sports, luxury travel, and life&apos;s most precious moments.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="space-y-32">
                        {CATEGORIZED_PACKAGES.map((section) => (
                            <section key={section.category} className="scroll-mt-20">
                                <div className="flex items-center gap-6 mb-12">
                                    <h2 className="text-3xl md:text-4xl font-serif font-black whitespace-nowrap">{section.category}</h2>
                                    <div className="h-px bg-border flex-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {section.items.map((pkg) => (
                                        <div key={pkg.title} className="bg-card rounded-[2rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-terracotta/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col group">
                                            <div className="p-8 pb-4 flex-1">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                                                        {pkg.emoji}
                                                    </div>
                                                    <p className="text-terracotta font-black text-sm uppercase tracking-widest">{pkg.price}</p>
                                                </div>
                                                <h3 className="text-2xl font-black mb-3 group-hover:text-terracotta transition-colors">{pkg.title}</h3>
                                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed font-medium">{pkg.desc}</p>
                                                <div className="space-y-3 mb-6">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Includes</p>
                                                    {pkg.includes.map((item) => (
                                                        <div key={item} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-8 pt-0 mt-auto">
                                                <Link href="/find-chefs" className="block w-full text-center py-4 bg-foreground text-background text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-terracotta hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                                    Inquire Now
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>

                {/* Call to action section */}
                <div className="max-w-5xl mx-auto px-4 mt-20">
                    <div className="bg-foreground text-background rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                        <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 relative z-10">Need a bespoke package?</h2>
                        <p className="text-background/70 text-lg md:text-xl max-w-xl mx-auto mb-10 relative z-10">Our concierge team specializes in tailoring culinary experiences for unique requirements and high-volume events.</p>
                        <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-terracotta text-white font-black uppercase tracking-widest rounded-2xl hover:scale-110 transition-transform relative z-10">
                            Contact Concierge
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}

import { CheckCircle2 } from 'lucide-react'
