'use client'

import { Button, Badge } from '@/components/ui'
import { 
    Play, ChevronLeft, ChevronRight, 
    Menu, Download,
    Clock, Trophy, Camera, Check
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { VideoPlayer } from '@/components/academy/video-player'

// Mock data for the learning session
const courseData = {
    title: 'Modern Italian Pasta Masterclass',
    currentModule: 'Basics & Foundation',
    currentLesson: {
        title: 'Mastering the Classic Dough',
        duration: '45:00',
        videoUrl: '#',
        description: 'In this lesson, we dive deep into the chemistry of flour and eggs, and the physical technique of kneading that develops the perfect gluten structure for your pasta.'
    },
    curriculum: [
        {
            title: 'Basics & Foundation',
            lessons: [
                { title: 'Introduction to Pasta Artistry', duration: '12:00', isCompleted: true },
                { title: 'The Science of Flour & Eggs', duration: '25:00', isCompleted: true },
                { title: 'Mastering the Classic Dough', duration: '45:00', isCompleted: false, isActive: true }
            ]
        },
        {
            title: 'Classic Shapes',
            lessons: [
                { title: 'Tagliatelle & Pappardelle', duration: '30:00', isCompleted: false },
                { title: 'The Art of Farfalle', duration: '22:00', isCompleted: false },
                { title: 'Orrechiette: The Puglian Secret', duration: '35:00', isCompleted: false }
            ]
        }
    ]
}

export default function LearnPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            {/* Top Bar (Custom for Learning) */}
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/academy" className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="hidden sm:block">
                        <h1 className="text-sm font-black truncate max-w-[200px] lg:max-w-md">{courseData.title}</h1>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-0.5">{courseData.currentModule}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-4 mr-6 px-4 border-r border-border">
                        <div className="text-right">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Your Progress</p>
                            <p className="text-sm font-black text-primary">42% Complete</p>
                        </div>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-[42%] h-full gradient-brand" />
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg border-2">
                        Get Certificate
                    </Button>
                    <button className="p-2 hover:bg-muted rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Video Area */}
                <main className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${sidebarOpen ? 'lg:mr-[400px]' : ''}`}>
                    <div className="bg-zinc-950 p-4 lg:p-8">
                        <VideoPlayer 
                            emoji="🍝"
                            title={courseData.currentLesson.title}
                        />
                    </div>

                    <div className="p-6 lg:p-12 max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <Badge className="mb-3 bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px]">Active Lesson</Badge>
                                <h1 className="text-3xl lg:text-4xl font-black">{courseData.currentLesson.title}</h1>
                            </div>
                            <Button className="rounded-2xl h-12 px-8 font-black gap-2">
                                Complete & Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-lg font-bold mb-4">About this lesson</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {courseData.currentLesson.description}
                                    </p>
                                </section>

                                <section className="p-6 rounded-2xl bg-muted/40 border-2 border-border/50">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4">Lesson Resources</h2>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Flour Ratios Cheatsheet.pdf', type: 'PDF' },
                                            { name: 'Master Dough Recipe.pdf', type: 'PDF' },
                                            { name: 'Suppliers List.xlsx', type: 'XLSX' }
                                        ].map((res, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:border-primary transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                    <span className="text-sm font-semibold">{res.name}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-muted-foreground/60">{res.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="pt-8 border-t border-border">
                                    <h2 className="text-lg font-bold mb-6">Discussion (34)</h2>
                                    <div className="flex gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">JO</div>
                                        <div className="flex-1 space-y-3">
                                            <textarea placeholder="Ask a question or share your progress..." className="w-full bg-muted/30 border-2 border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none" />
                                            <Button size="sm">Post Comment</Button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <aside className="space-y-8">
                                <div className="p-6 rounded-2xl gradient-brand text-white">
                                    <Trophy className="w-8 h-8 mb-4 opacity-50" />
                                    <h3 className="font-bold mb-2">Chef&apos;s Tip</h3>
                                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                                        &quot;Always weigh your ingredients. Volume measurements for flour are famously inaccurate in pasta making.&quot;
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Share results</h3>
                                    <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border hover:border-primary cursor-pointer group transition-all">
                                        <div className="text-center group-hover:scale-105 transition-transform">
                                            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-xs font-bold px-4 text-muted-foreground">Upload your dish photo to get feedback</p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>

                {/* Sidebar Curriculum (Absolute/Sticky) */}
                <aside className={`fixed top-16 right-0 bottom-0 w-full lg:w-[400px] bg-card border-l border-border z-40 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border bg-muted/20">
                            <h3 className="font-black text-lg">Course Curriculum</h3>
                            <p className="text-xs text-muted-foreground font-bold mt-1">42% • 18 / 48 Lessons Completed</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            {courseData.curriculum.map((module, i) => (
                                <div key={i} className="border-b border-border/50">
                                    <div className="p-4 px-6 bg-muted/10 font-black text-[10px] uppercase tracking-widest text-muted-foreground/80">
                                        Module {i + 1}: {module.title}
                                    </div>
                                    <div className="divide-y divide-border/30">
                                        {module.lessons.map((lesson, j) => (
                                            <div key={j} className={`p-4 px-6 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer group ${lesson.isActive ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
                                                <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${lesson.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30'}`}>
                                                    {lesson.isCompleted ? <Check className="w-3 h-3 stroke-[4]" /> : <Play className={`w-2 h-2 fill-current ${lesson.isActive ? 'text-primary' : 'text-transparent group-hover:text-muted-foreground'}`} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-bold leading-snug group-hover:text-primary transition-colors ${lesson.isActive ? 'text-primary' : ''}`}>{lesson.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-black text-muted-foreground/60 tabular-nums">{lesson.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

