'use client'

import { Button, Badge, Input } from '@/components/ui'
import { 
    Plus, Search, MoreVertical, Users, 
    Star, LayoutGrid,
    BookOpen, BarChart3,
    Calendar
} from 'lucide-react'
import { useState } from 'react'

// Mock instructor data
const myCourses = [
    {
        id: '1',
        title: 'Modern Italian Pasta Masterclass',
        status: 'published',
        students: 2341,
        rating: 4.9,
        revenue: '£14,230',
        lastUpdated: '2 days ago',
        emoji: '🍝'
    },
    {
        id: '2',
        title: 'Advanced Dough Techniques',
        status: 'draft',
        students: 0,
        rating: 0,
        revenue: '£0',
        lastUpdated: 'Just now',
        emoji: '🍞'
    }
]

export default function ChefAcademyDashboard() {
    const [view, setView] = useState<'grid' | 'list'>('grid')

    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-1">Chef Academy</h1>
                    <p className="text-muted-foreground font-medium">Manage your courses, students, and curriculum.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-2 font-bold h-12">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                    </Button>
                    <Button className="rounded-xl font-bold h-12 gradient-brand border-none px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Course
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: '2,341', icon: Users, trend: '+12%', color: 'text-primary' },
                    { label: 'Course Rating', value: '4.9', icon: Star, trend: '+0.1', color: 'text-amber-500' },
                    { label: 'Total Revenue', value: '£14,230', icon: BarChart3, trend: '+£2.4k', color: 'text-emerald-500' },
                    { label: 'Active Drafts', value: '2', icon: BookOpen, trend: '0', color: 'text-zinc-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-card border-2 border-border/60 p-6 rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl bg-muted/50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.trend}</span>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Courses Management */}
            <div className="bg-card border-2 border-border/60 rounded-[40px] overflow-hidden flex flex-col">
                <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-black italic">My Courses</h2>
                        <div className="flex border border-border rounded-xl overflow-hidden p-1 bg-muted/30">
                            <button 
                                onClick={() => setView('grid')}
                                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setView('list')}
                                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 max-w-md flex items-center gap-3 px-4 py-2 bg-muted/30 border border-border rounded-xl">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input className="bg-transparent border-none p-0 focus-visible:ring-0 text-sm h-8" placeholder="Search your courses..." />
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myCourses.map((course, i) => (
                            <div key={i} className="group relative bg-zinc-50 dark:bg-zinc-900 border-2 border-border/40 rounded-[32px] overflow-hidden hover:border-primary transition-all duration-300">
                                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                                    {course.emoji}
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge 
                                            variant={course.status === 'published' ? 'default' : 'secondary'}
                                            className="uppercase tracking-widest text-[9px] font-black h-5"
                                        >
                                            {course.status}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground ml-auto flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {course.lastUpdated}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-black mb-6 leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                    
                                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="uppercase tracking-tighter text-[9px]">Students</span>
                                            <span className="text-foreground font-black">{course.students.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="uppercase tracking-tighter text-[9px]">Earnings</span>
                                            <span className="text-foreground font-black">{course.revenue}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="uppercase tracking-tighter text-[9px]">Rating</span>
                                            <div className="flex items-center gap-1 text-amber-500 font-black">
                                                <Star className="w-3 h-3 fill-current" />
                                                {course.rating || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-border/50">
                                        <Button className="flex-1 rounded-xl font-bold text-xs h-10 border-none">Edit Course</Button>
                                        <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-2">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
