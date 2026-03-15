import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import Link from 'next/link'

export const metadata: Metadata = { title: "Kids' Zone", description: 'Fun cooking for kids — classes, recipes, and videos' }

const kidsClasses = [
    { emoji: '🍕', title: 'Pizza Making Party', age: 'Ages 5–10', price: '£25', day: 'Every Saturday' },
    { emoji: '🧁', title: 'Cupcake Decorating', age: 'Ages 4–8', price: '£20', day: 'Every Sunday' },
    { emoji: '🥪', title: 'Healthy Lunchbox Creations', age: 'Ages 7–12', price: '£30', day: 'Wednesday evenings' },
    { emoji: '🍰', title: 'Baking Basics for Beginners', age: 'Ages 8–14', price: '£35', day: 'Friday evenings' },
]

export default function KidsZonePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                {/* Hero */}
                <div className="py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg, #ffd93d, #ff6b6b)' }}>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                        👶 Kids&apos; Zone
                    </h1>
                    <p className="text-white/90 text-lg max-w-xl mx-auto">
                        Fun, safe, and delicious cooking classes for the little chefs in your family!
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-3">Kids&apos; Cooking Classes</h2>
                        <p className="text-muted-foreground">In-person and virtual classes led by child-friendly certified chefs</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {kidsClasses.map((c) => (
                            <div key={c.title} className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center flex flex-col">
                                <div className="text-5xl mb-4">{c.emoji}</div>
                                <h3 className="font-bold text-base mb-2 leading-snug">{c.title}</h3>
                                <p className="text-xs text-muted-foreground mb-1">{c.age}</p>
                                <p className="text-xs text-muted-foreground mb-3">{c.day}</p>
                                <p className="text-terracotta font-bold text-lg mb-4">{c.price}</p>
                                <Link href="/register" className="mt-auto block py-2.5 gradient-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                                    Book a Spot
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Fun section */}
                    <div className="rounded-2xl p-10 text-center" style={{ background: 'linear-gradient(135deg, #ffd93d22, #ff6b6b22)' }}>
                        <h2 className="text-2xl font-serif font-bold mb-3">🌟 Junior Chef Programme</h2>
                        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                            Our 10-week Junior Chef programme teaches kids aged 6–16 real cooking skills, food safety, and nutrition in a fun, supportive environment.
                        </p>
                        <Link href="/register" className="inline-block px-8 py-3.5 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                            Enrol Your Child
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
