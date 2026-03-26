'use client'

import { Play, Pause, Volume2, Settings, Maximize2, SkipBack, SkipForward } from 'lucide-react'
import { useState } from 'react'

interface VideoPlayerProps {
    src?: string
    poster?: string
    title?: string
    emoji?: string
}

export function VideoPlayer({ title, emoji }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    
    const togglePlay = () => setIsPlaying(!isPlaying)

    return (
        <div 
            className="relative aspect-video bg-black rounded-[40px] overflow-hidden group shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Mock Video Content */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <div className="absolute inset-0 gradient-brand opacity-20 group-hover:opacity-10 transition-opacity" />
                <div className="text-9xl transform transition-transform duration-700 group-hover:scale-110">
                    {emoji || '🍝'}
                </div>
                
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                        <button 
                            onClick={togglePlay}
                            className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center transform hover:scale-110 transition-all shadow-2xl group/play"
                        >
                            <Play className="w-10 h-10 text-white fill-current translate-x-1 group-hover/play:text-primary transition-colors" />
                        </button>
                    </div>
                )}
            </div>

            {/* Title Overlay */}
            <div className={`absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 z-20 ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-white font-black text-xl italic">{title || 'Previewing Masterclass'}</h3>
            </div>

            {/* Controls Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 z-20 ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer overflow-hidden group/bar">
                    <div className="absolute h-full gradient-brand w-[42%] transition-all" />
                    <div className="absolute h-full w-full bg-white/20 scale-x-0 group-hover/bar:scale-x-75 origin-left transition-transform" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                        </button>
                        <div className="flex items-center gap-4">
                            <button className="text-white/60 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
                            <button className="text-white/60 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
                        </div>
                        <div className="text-sm font-black text-white tabular-nums tracking-tighter">12:34 / 45:00</div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group/vol">
                            <Volume2 className="w-5 h-5 text-white/60 group-hover/vol:text-white" />
                            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-[80%] h-full bg-white" />
                            </div>
                        </div>
                        <button className="text-white/60 hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
                        <button className="text-white/60 hover:text-white transition-colors"><Maximize2 className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
