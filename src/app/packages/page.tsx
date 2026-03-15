import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Event Packages', description: 'Curated chef packages for every occasion' }

const packages = [
    { emoji: '🎂', title: 'Birthday Bash', price: '£400 – £2,000', desc: 'Celebrate in style with a personalised birthday menu curated by your private chef.', includes: ['Custom cake & desserts', 'Cocktail hour canapés', '3-course dinner', 'Chef & waiting staff'] },
    { emoji: '💍', title: 'Wedding Feast', price: '£3,000 – £15,000', desc: 'Your perfect wedding dinner — from intimate celebrations to grand receptions.', includes: ['Bespoke wedding menu', 'Canapés & cocktail reception', 'Multi-course dinner', 'Full front-of-house team'] },
    { emoji: '🥂', title: 'Bridal / Bachelor Party', price: '£700 – £2,500', desc: 'Brunches, cocktail parties, and indulgent dining for unforgettable pre-wedding celebrations.', includes: ['Themed menu design', 'Cocktail & mocktail bar', 'Grazing boards & canapés', 'Private chef experience'] },
    { emoji: '🕊️', title: 'Funeral / Remembrance', price: '£1,000 – £4,000', desc: 'Thoughtful, dignified catering to honour your loved one with comfort and care.', includes: ['Comfort food menus', 'Tea & coffee service', 'Dietary accommodations', 'Discreet professional team'] },
    { emoji: '🍼', title: 'Baby Shower Brunch', price: '£500 – £1,500', desc: 'Celebrate new arrivals with beautiful brunch spreads and celebratory cakes.', includes: ['Brunch & afternoon tea', 'Custom baby shower cake', 'Mocktail bar', 'Floral grazing tables'] },
    { emoji: '🎓', title: 'Graduation Dinner', price: '£300 – £1,200', desc: 'Mark the milestone with a memorable private dining experience for graduates and family.', includes: ['3-course celebration menu', 'Welcome drinks', 'Custom graduating desserts', 'Personalised menu cards'] },
]

export default function PackagesPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                <div className="gradient-brand py-20 px-4 text-center text-white">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 block">🎉 Events &amp; Celebrations</span>
                    <h1 className="text-5xl font-serif font-bold mb-4">Event Packages</h1>
                    <p className="text-white/80 text-lg max-w-xl mx-auto">Professional chef catering with bespoke menus for every life occasion</p>
                </div>
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <div key={pkg.title} className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden flex flex-col">
                                <div className="p-8 flex-1">
                                    <div className="text-4xl mb-4">{pkg.emoji}</div>
                                    <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                                    <p className="text-terracotta font-bold text-lg mb-3">{pkg.price}</p>
                                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{pkg.desc}</p>
                                    <ul className="space-y-2">
                                        {pkg.includes.map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="px-8 pb-8">
                                    <Link href="/find-chefs" className="block w-full text-center py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider rounded-full hover:bg-terracotta hover:text-white transition-colors duration-200">
                                        BOOK NOW →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
