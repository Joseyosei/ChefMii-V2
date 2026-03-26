'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { CourseCard } from '@/components/academy/course-card'
import { Input, Button } from '@/components/ui'
import { Search, Sparkles, ChefHat, GraduationCap, PlayCircle, Trophy } from 'lucide-react'
import { useState } from 'react'

const courses = [
    { id: '1', emoji: '🍝', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', title: 'The Complete Masterclass on Italian Pasta', chef: 'Chef Marco Rossi', price: '£149', hours: 12, students: 2341, rating: 4.9, level: 'Beginner', type: 'cohort', nextCohort: 'Oct 15' },
    { id: '2', emoji: '🍱', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', title: 'The Art of Edomae Sushi & Knife Mastery', chef: 'Chef Yuki Tanaka', price: '£199', hours: 18, students: 189, rating: 5.0, level: 'Intermediate', type: 'cohort', nextCohort: 'Oct 22' },
    { id: '3', emoji: '🥐', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', title: 'French Patisserie & Advanced Baking', chef: 'Chef Pierre Dubois', price: '£59', hours: 10, students: 3012, rating: 4.8, level: 'Beginner', type: 'self-paced' },
    { id: '4', emoji: '🍳', image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=800&q=80', title: 'Secrets of Deep West African Flavours', chef: 'Chef Aisha Okafor', price: '£49', hours: 8, students: 987, rating: 4.9, level: 'Beginner', type: 'self-paced' },
    { id: '5', emoji: '🥘', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80', title: 'Private & Corporate Event Catering at Scale', chef: 'Chef James Osei', price: '£299', hours: 24, students: 654, rating: 4.7, level: 'Advanced', type: 'cohort', nextCohort: 'Nov 02' },
    { id: '6', emoji: '🎂', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&q=80', title: 'Architectural Cake Design & Fondant', chef: 'Chef Sofia Mendez', price: '£89', hours: 14, students: 1243, rating: 4.8, level: 'Intermediate', type: 'self-paced' },
] as const

export default function AcademyPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-[#0A0A0A] text-white">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                    </div>

                    <div className="container relative mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">The Future of Culinary Education</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-serif font-black mb-8 leading-[1.1] tracking-tight">
                            Elevate Your Craft with <br />
                            <span className="gradient-text-brand">World-Class Mentors</span>
                        </h1>
                        
                        <p className="text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Cohort-based experiences and self-paced masterclasses designed to take you from enthusiast to professional.
                        </p>

                        <div className="max-w-xl mx-auto flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                            <div className="flex-1 flex items-center px-4 gap-3">
                                <Search className="w-5 h-5 text-zinc-500" />
                                <Input 
                                    className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-600 h-10" 
                                    placeholder="Search by cuisine, chef or skill..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="gradient-brand border-none h-12 px-8 rounded-xl font-bold">
                                Discover
                            </Button>
                        </div>

                        <div className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {['Italian', 'French', 'Japanese', 'Pastry', 'Fusion', 'Molecular'].map(cat => (
                                <span key={cat} className="text-sm font-bold uppercase tracking-widest">{cat}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Courses Grid */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-serif font-black mb-3">Featured Academy Courses</h2>
                                <p className="text-muted-foreground">Limited enrollment cohorts and on-demand learning paths.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" className="rounded-xl font-bold border-2">All Courses</Button>
                                <Button variant="secondary" className="rounded-xl font-bold bg-primary text-primary-foreground">Live Cohorts</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features / Why Academy */}
                <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { icon: ChefHat, title: 'Learn from Elite Chefs', desc: 'Direct access to Michelin-starred mentors and private celebrity chefs.' },
                                { icon: GraduationCap, title: 'Professional Certification', desc: 'Industry-recognized digital credentials upon course completion.' },
                                { icon: PlayCircle, title: 'Project-Based Learning', desc: 'Build your portfolio with real culinary projects and peer feedback.' },
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter / CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="gradient-brand rounded-[40px] p-8 lg:p-20 text-white text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                            
                            <Trophy className="w-16 h-16 mx-auto mb-8 animate-bounce opacity-80" />
                            <h2 className="text-4xl lg:text-6xl font-serif font-black mb-6">Start Your Culinary Journey</h2>
                            <p className="text-lg lg:text-xl text-white/80 max-w-xl mx-auto mb-10">
                                Join 50,000+ students learning from the world&apos;s best. First lesson is always on us.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button variant="secondary" className="!bg-white !text-[#171717] hover:!bg-zinc-100 h-14 px-10 rounded-2xl font-black text-lg shadow-lg">
                                    Enrol for Free
                                </Button>
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-10 rounded-2xl font-black text-lg backdrop-blur-sm">
                                    View Syllabus
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <ChatbotWidget />
        </div>
    )
}
