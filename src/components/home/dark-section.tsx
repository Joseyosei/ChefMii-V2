'use client'

import Link from 'next/link'

export function DarkSection() {
    return (
        <section className="bg-[#111111] text-white py-20 sm:py-32 relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-600 rounded-full blur-2xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="inline-block text-xs font-bold text-terracotta tracking-widest uppercase mb-4 sm:mb-6">
                    Premium Experience
                </span>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4 sm:mb-6">
                    <span className="italic text-white/80">Design Your</span><br />
                    <span className="gradient-text-brand">Experience</span>
                </h2>

                <p className="text-sm sm:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
                    From intimate dinners to global summits. Real-time pricing, VR previews, and world-class culinary talent at your fingertips.
                </p>

                {/* Feature chips */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
                    {['Real-time Pricing', 'VR Preview', 'Live Cooking', 'Global Chefs', 'Instant Booking'].map(f => (
                        <span key={f} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-white/70 backdrop-blur-sm">
                            {f}
                        </span>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Link
                        href="/packages"
                        className="w-full sm:w-auto px-8 py-4 min-h-[52px] gradient-brand text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm sm:text-base flex items-center justify-center"
                    >
                        Start Building →
                    </Link>
                    <Link
                        href="/find-chefs"
                        className="w-full sm:w-auto px-8 py-4 min-h-[52px] border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors font-semibold text-sm sm:text-base flex items-center justify-center"
                    >
                        View Chef Showcase
                    </Link>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-20">
                    {[
                        { num: '500+', label: 'Top Chefs' },
                        { num: '50+', label: 'Countries' },
                        { num: '10K+', label: 'Events Hosted' },
                        { num: '4.9★', label: 'Average Rating' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <p className="text-2xl sm:text-4xl font-black text-white">{s.num}</p>
                            <p className="text-xs sm:text-sm text-white/50 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
