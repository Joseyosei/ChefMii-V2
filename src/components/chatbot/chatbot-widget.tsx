'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, ChefHat } from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export function ChatbotWidget() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content:
                "Hello! I'm ChefMii Assistant 👨‍🍳\n\nI can help you find the perfect chef, plan your event menu, or answer any questions about our services. What can I do for you today?",
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        const text = input.trim()
        if (!text || loading) return

        const userMsg: Message = { role: 'user', content: text }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            })
            const data = await res.json()
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.reply ?? 'Sorry, I could not understand that.' },
            ])
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-brand text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200"
                aria-label="Open chat"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col bg-background">
                    {/* Header */}
                    <div className="gradient-brand px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">ChefMii Assistant</p>
                            <p className="text-white/70 text-xs">Powered by Gemini AI</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                            ? 'gradient-brand text-white rounded-tr-sm'
                                            : 'bg-blue-50 text-blue-900 rounded-tl-sm dark:bg-blue-900/30 dark:text-blue-100'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl rounded-tl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="border-t border-border p-3 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-terracotta placeholder:text-muted-foreground"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="p-2.5 gradient-brand text-white rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
