'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { Button, Badge } from '@/components/ui'
import { 
    Users, Star, CheckCircle2, Play, 
    ChevronDown, Lock, Globe, Award, ShieldCheck 
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

// Mock data for a single course
const courseData = {
    id: '1',
    title: 'Modern Italian Pasta Masterclass',
    chef: {
        name: 'Chef Marco Rossi',
        title: 'Michelin Starred Chef',
        avatar: '🍝',
        bio: 'Marco has spent 20 years perfecting the art of handmade pasta across Italy.'
    },
    description: 'Learn the secrets of authentic, modern Italian pasta from a Michelin-starred master. This comprehensive course covers everything from flour selection to advanced shaping techniques.',
    price: '£149',
    rating: 4.9,
    reviews: 1243,
    students: 2341,
    duration: '12h 30m',
    lessons: 48,
    level: 'Beginner to Intermediate',
    includes: [
        'Lifetime access to 48 HD lessons',
        'Downloadable recipe guides & PDFs',
        'Access to private student community',
        'Direct Q&A with Chef Marco',
        'Certificate of Completion'
    ],
    curriculum: [
        {
            title: 'Basics & Foundation',
            lessons: [
                { title: 'Introduction to Pasta Artistry', duration: '12:00', isFree: true },
                { title: 'The Science of Flour & Eggs', duration: '25:00', isFree: false },
                { title: 'Mastering the Classic Dough', duration: '45:00', isFree: false }
            ]
        },
        {
            title: 'Classic Shapes',
            lessons: [
                { title: 'Tagliatelle & Pappardelle', duration: '30:00', isFree: false },
                { title: 'The Art of Farfalle', duration: '22:00', isFree: false },
                { title: 'Orrechiette: The Puglian Secret', duration: '35:00', isFree: false }
            ]
        },
        {
            title: 'Filled Pasta Masterclass',
            lessons: [
                { title: 'Traditional Ravioli', duration: '50:00', isFree: false },
                { title: 'Tortellini & Cappelletti Shaping', duration: '55:00', isFree: false },
                { title: 'Modern Colors & Textures', duration: '40:00', isFree: false }
            ]
        }
    ]
}

export default function CourseDetailPage() {
    const [expandedModules, setExpandedModules] = useState<number[]>([0])

    const toggleModule = (index: number) => {
        setExpandedModules(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            
            <main className="flex-1 pt-20">
                {/* Hero / Header Section */}
                <section className="bg-zinc-950 text-white py-16 lg:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80 z-10" />
                    <div className="absolute inset-0 gradient-brand opacity-20 z-0" />
                    
                    <div className="container mx-auto px-4 relative z-20">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge className="bg-primary text-white border-none uppercase tracking-widest text-[10px] py-1 px-3">Bestseller</Badge>
                                <Badge variant="outline" className="text-white border-white/20 uppercase tracking-widest text-[10px] py-1 px-3">Italian Cuisine</Badge>
                            </div>
                            
                            <h1 className="text-4xl lg:text-6xl font-serif font-black mb-6 leading-tight">
                                {courseData.title}
                            </h1>
                            
                            <p className="text-lg lg:text-xl text-zinc-300 mb-8 leading-relaxed max-w-2xl">
                                {courseData.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="text-amber-500">{courseData.rating}</span>
                                    <span className="text-zinc-500 font-medium">({courseData.reviews.toLocaleString()} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-zinc-400" />
                                    <span>{courseData.students.toLocaleString()} students enrolled</span>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <span className="text-zinc-400">Created by <span className="text-white font-bold underline decoration-primary underline-offset-4 cursor-pointer">{courseData.chef.name}</span></span>
                                <div className="flex items-center gap-4 text-zinc-400">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Globe className="w-4 h-4" />
                                        English
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Award className="w-4 h-4" />
                                        Certified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 lg:py-20">
                    <div className="flex flex-col lg:flex-row gap-12 relative">
                        {/* Main Content */}
                        <div className="flex-1 lg:max-w-[calc(100%-420px)]">
                            {/* What you'll learn */}
                            <section className="mb-16 p-8 rounded-3xl border-2 border-border/60 bg-zinc-50 dark:bg-zinc-900/50">
                                <h2 className="text-2xl font-black mb-8">What you&apos;ll learn</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'Master 12 different authentic pasta dough styles',
                                        'Advanced shaping techniques for regional specialties',
                                        'Perfecting sauce pairings for every pasta shape',
                                        'Professional presentation & plating secrets',
                                        'Sourcing the finest Italian ingredients',
                                        'Batch cooking & storage best practices'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium leading-normal">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Curriculum */}
                            <section className="mb-16">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black">Course Curriculum</h2>
                                    <div className="text-sm font-bold text-muted-foreground">
                                        {courseData.lessons} lessons • {courseData.duration} total
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {courseData.curriculum.map((module, i) => (
                                        <div key={i} className="border border-border rounded-2xl overflow-hidden bg-card transition-all duration-300">
                                            <button 
                                                onClick={() => toggleModule(i)}
                                                className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className={`transition-transform duration-300 ${expandedModules.includes(i) ? 'rotate-180' : ''}`}>
                                                        <ChevronDown className="w-5 h-5" />
                                                    </span>
                                                    <div>
                                                        <h3 className="font-bold">{module.title}</h3>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{module.lessons.length} lessons</p>
                                                    </div>
                                                </div>
                                            </button>
                                            
                                            {expandedModules.includes(i) && (
                                                <div className="border-t border-border bg-muted/20">
                                                    {module.lessons.map((lesson, j) => (
                                                        <div key={j} className="flex items-center justify-between p-4 px-6 hover:bg-white dark:hover:bg-zinc-800/50 transition-colors border-b border-border/50 last:border-0 group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                                    {lesson.isFree ? <Play className="w-3.5 h-3.5 fill-current" /> : <Lock className="w-3.5 h-3.5" />}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-semibold truncate">{lesson.title}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{lesson.duration}</p>
                                                                </div>
                                                            </div>
                                                            {lesson.isFree && (
                                                                <button className="text-xs font-bold text-primary underline decoration-2 cursor-pointer">
                                                                    Preview
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Instructor */}
                            <section className="mb-16">
                                <h2 className="text-2xl font-black mb-8">Your Instructor</h2>
                                <div className="flex flex-col sm:flex-row gap-8 items-start">
                                    <div className="w-24 h-24 rounded-3xl gradient-brand text-4xl flex items-center justify-center shrink-0">
                                        {courseData.chef.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{courseData.chef.name}</h3>
                                        <p className="text-terracotta font-bold text-sm mb-4">{courseData.chef.title}</p>
                                        <div className="flex items-center gap-6 mb-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                                            <span>4.9 Instructor Rating</span>
                                            <span>18,234 Reviews</span>
                                            <span>45,120 Students</span>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {courseData.chef.bio}
                                        </p>
                                        <Button variant="outline" className="mt-6 rounded-xl">View Profile</Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar / Enrollment Card (Sticky) */}
                        <aside className="lg:w-[380px] lg:absolute lg:top-0 lg:right-4 z-30">
                            <div className="bg-card border-2 border-border shadow-2xl rounded-[40px] overflow-hidden sticky top-24 transform animate-in slide-in-from-right duration-500">
                                <div className="relative aspect-video bg-zinc-900 flex items-center justify-center text-7xl group cursor-pointer">
                                    <div className="absolute inset-0 gradient-brand opacity-60 group-hover:opacity-40 transition-opacity" />
                                    {courseData.chef.avatar}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-3xl border border-white/40 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                    <p className="absolute bottom-4 text-xs font-black text-white px-4 py-2 bg-black/40 backdrop-blur-md rounded-full tracking-widest uppercase">Preview this course</p>
                                </div>
                                
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-4xl font-black leading-none">{courseData.price}</span>
                                        <span className="text-lg text-muted-foreground line-through opacity-50">£299</span>
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none ml-auto font-black text-[10px]">50% OFF</Badge>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <Link href={`/academy/${courseData.id}/learn`} className="w-full">
                                            <Button className="w-full h-14 rounded-2xl text-lg font-black group shadow-xl hover:shadow-primary/20">
                                                Enroll Now
                                                <ChevronDown className="w-5 h-5 ml-2 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-black border-2">Add to Cart</Button>
                                    </div>

                                    <div className="space-y-5">
                                        <p className="text-sm font-bold text-center">This course includes:</p>
                                        <div className="space-y-3">
                                            {courseData.includes.map((inc, i) => (
                                                <div key={i} className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                                    {inc}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <ShieldCheck className="w-4 h-4" />
                                        30-Day Money-Back Guarantee
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Newsletter / CTA Section (Re-used/Adapted) */}
                <section className="py-24 border-t border-border">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-black mb-4">Master authentic Italian flavours today</h2>
                        <p className="text-muted-foreground mb-8">Join the community of {courseData.students.toLocaleString()} students learning from Marco.</p>
                        <Button className="rounded-2xl h-14 px-12 font-black text-lg">Start Learning Now</Button>
                    </div>
                </section>
            </main>
            
            <Footer />
            <ChatbotWidget />
        </div>
    )
}
