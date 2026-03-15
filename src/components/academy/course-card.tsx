'use client'

import { Clock, Users, Star, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui'

interface CourseCardProps {
    course: {
        id?: string
        emoji: string
        image?: string
        title: string
        chef: string
        price: string
        hours: number
        students: number
        rating: number
        level: string
        type?: 'self-paced' | 'cohort'
        nextCohort?: string
    }
}

export function CourseCard({ course }: CourseCardProps) {
    const isCohort = course.type === 'cohort'

    return (
        <div className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full border-white/10">
            {/* Thumbnail Header */}
            <div className="relative h-56 overflow-hidden bg-muted">
                {course.image ? (
                    <img 
                        src={course.image} 
                        alt={course.title} 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 gradient-brand opacity-90 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center text-7xl transform group-hover:scale-110 transition-transform duration-700">
                        {course.emoji}
                    </div>
                )}
                {/* Gradient Overlay for text contrast */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className={`${course.level === 'Beginner' ? 'bg-emerald-500' : course.level === 'Intermediate' ? 'bg-amber-500' : 'bg-rose-500'} text-white border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase`}>
                        {course.level}
                    </Badge>
                    {isCohort && (
                        <Badge className="bg-white/90 text-black border-none px-3 py-1 font-bold text-[10px] tracking-widest uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                            Live Cohort
                        </Badge>
                    )}
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-xl mb-1 leading-tight group-hover:text-terracotta transition-colors duration-300">{course.title}</h3>
                        <p className="text-muted-foreground text-sm font-medium">with {course.chef}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80 mb-6">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary/70" />
                        <span>{course.hours}h content</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary/70" />
                        <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-foreground">{course.rating}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black gradient-text-brand">{course.price}</span>
                        {isCohort && (
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">Next: {course.nextCohort}</span>
                        )}
                    </div>
                    
                    <Link 
                        href={`/academy/${course.id || 'demo'}`} 
                        className="p-3 bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-2xl transition-all duration-300 group/btn"
                    >
                        <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
