import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { Check } from 'lucide-react'

export const metadata: Metadata = { title: 'Pricing', description: 'ChefMii pricing plans for clients and chefs' }

const clientPlans = [
    { name: 'Standard', price: 'Free', desc: 'Perfect for occasional dining', features: ['Browse all chefs', 'Message 3 chefs/month', 'Basic event booking', 'Email support'] },
    { name: 'Premium', price: '£29/mo', desc: 'For frequent entertainers', popular: true, features: ['Everything in Standard', 'Unlimited chef messaging', 'Priority bookings', 'Event planning tools', '10% off all bookings', '24/7 support'] },
    { name: 'Concierge', price: '£99/mo', desc: 'Full white-glove service', features: ['Everything in Premium', 'Dedicated event manager', 'VR venue previews', 'Custom menu design', 'Real-time price tracking', 'Corporate invoicing'] },
]

const chefPlans = [
    { name: 'Starter', price: 'Free', desc: 'List your first profile', features: ['Public chef profile', '5 booking leads/month', 'Standard visibility', 'Email support'] },
    { name: 'Professional', price: '£49/mo', desc: 'Grow your business', popular: true, features: ['Unlimited booking leads', 'Priority search placement', 'Analytics dashboard', 'Media portfolio upload', 'ChefMii badge', 'Direct client messaging'] },
]

function PlanCard({ plan }: { plan: typeof clientPlans[0] }) {
    return (
        <div className={`relative flex flex-col bg-card rounded-2xl border p-8 shadow-sm hover:shadow-md transition-all duration-200 ${(plan as { popular?: boolean }).popular ? 'border-terracotta ring-2 ring-terracotta/20' : 'border-border'}`}>
            {(plan as { popular?: boolean }).popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-brand text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                </div>
            )}
            <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
            <div className="text-3xl font-black mb-1 gradient-text-brand">{plan.price}</div>
            <p className="text-muted-foreground text-sm mb-6">{plan.desc}</p>
            <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-terracotta shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-opacity ${(plan as { popular?: boolean }).popular ? 'gradient-brand text-white hover:opacity-90' : 'border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white'}`}>
                Get Started
            </button>
        </div>
    )
}

export default function PricingPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                <div className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Transparent Pricing</span>
                            <h1 className="text-5xl font-serif font-bold mt-3 mb-4">Plans for Everyone</h1>
                            <p className="text-muted-foreground text-lg">Whether you&apos;re planning a dinner or growing a chef business</p>
                        </div>
                        <h2 className="text-2xl font-bold mb-6 text-center">For Clients</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                            {clientPlans.map((p) => <PlanCard key={p.name} plan={p} />)}
                        </div>
                        <h2 className="text-2xl font-bold mb-6 text-center">For Chefs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            {chefPlans.map((p) => <PlanCard key={p.name} plan={p} />)}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
