'use client'

import Link from 'next/link'

const PACKAGES = [
    { slug: 'birthday', emoji: '🎂', title: 'Birthday Bash', price: '£400 – £2,000', desc: 'Personalised chef-curated menus for your special day', features: ['Custom cake display', 'Cocktail reception', 'Live cooking station'] },
    { slug: 'wedding', emoji: '💒', title: 'Wedding Feast', price: '£3,000 – £15,000', desc: 'Unforgettable wedding catering with world-class finesse', features: ['Multi-course tasting menu', 'Dedicated event chef', 'Wine pairing'] },
    { slug: 'bridal', emoji: '💐', title: 'Bridal / Bachelor', price: '£700 – £2,500', desc: 'Relaxed but luxurious catering for pre-wedding events', features: ['Brunch or dinner menus', 'Customisable to group size', 'Dietary options'] },
    { slug: 'funeral', emoji: '🕯️', title: 'Remembrance Catering', price: '£1,000 – £4,000', desc: 'Dignified and warm catering for remembrance gatherings', features: ['Traditional recipes', 'Dietary-sensitive menu', 'Discreet service'] },
    { slug: 'baby-shower', emoji: '👶', title: 'Baby Shower Brunch', price: '£500 – £1,500', desc: 'Delightful brunch menus for this precious milestone', features: ['Brunch & afternoon tea', 'Pretty presentation', 'Allergy-aware'] },
    { slug: 'corporate', emoji: '🏢', title: 'Corporate Events', price: '£2,000 – £20,000', desc: 'Impress clients and colleagues with fine dining at work', features: ['Formal or casual formats', 'Large guest capacity', 'Branded menus'] },
]

export function EventPackages() {
    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block text-xs sm:text-sm font-bold text-terracotta tracking-widest uppercase mb-3">Curated Packages</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
                        Perfect Packages for<br className="hidden sm:block" /> <span className="gradient-text-brand">Every Occasion</span>
                    </h2>
                    <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Professional catering with chef-curated menus tailored to your celebration.
                    </p>
                </div>

                {/* Grid — 1 col mobile, 2 tablet, 3 desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {PACKAGES.map(pkg => (
                        <div
                            key={pkg.slug}
                            className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                        >
                            <div className="text-3xl sm:text-4xl mb-3">{pkg.emoji}</div>
                            <h3 className="text-base sm:text-lg font-bold mb-1 group-hover:text-terracotta transition-colors">{pkg.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">{pkg.desc}</p>
                            <ul className="space-y-1 mb-4 flex-1">
                                {pkg.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-terracotta font-bold text-base sm:text-lg mb-4">{pkg.price} <span className="text-xs text-muted-foreground font-normal">per event</span></p>
                            <Link
                                href={`/register?package=${pkg.slug}`}
                                className="w-full py-2.5 sm:py-3 min-h-[44px] gradient-brand text-white text-sm font-bold rounded-xl text-center hover:opacity-90 transition-opacity flex items-center justify-center"
                            >
                                BOOK NOW →
                            </Link>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-8 sm:mt-12">
                    <Link href="/packages"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] border-2 border-foreground rounded-xl font-bold text-sm sm:text-base hover:bg-foreground hover:text-background transition-all duration-200">
                        View All Packages →
                    </Link>
                </div>
            </div>
        </section>
    )
}
