'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react'

const CONVERSATIONS = [
    {
        id: 1,
        name: 'Chef Marco Rossi',
        avatar: '👨‍🍳',
        lastMessage: 'Looking forward to your dinner party next week!',
        timestamp: '2 hours ago',
        unread: 2,
        online: true,
    },
    {
        id: 2,
        name: 'Chef Yuki Tanaka',
        avatar: '🍣',
        lastMessage: 'The omakase menu is ready for your review',
        timestamp: '5 hours ago',
        unread: 0,
        online: true,
    },
    {
        id: 3,
        name: 'Chef Sofia Mendez',
        avatar: '🥘',
        lastMessage: 'Confirmed for Saturday evening',
        timestamp: '1 day ago',
        unread: 0,
        online: false,
    },
]

const MESSAGES = [
    { id: 1, sender: 'chef', text: 'Hi! Thanks for booking me for your event.', time: '10:30 AM' },
    { id: 2, sender: 'user', text: 'Great! Looking forward to it. Do you have any dietary restrictions I should know about?', time: '10:45 AM' },
    { id: 3, sender: 'chef', text: 'I can accommodate most dietary needs. Let me know what your guests prefer!', time: '11:00 AM' },
    { id: 4, sender: 'user', text: 'Perfect. We have 2 vegetarians and 1 vegan guest.', time: '11:15 AM' },
    { id: 5, sender: 'chef', text: 'Looking forward to your dinner party next week!', time: '11:30 AM' },
]

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState(CONVERSATIONS[0])
    const [messageInput, setMessageInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredConversations = CONVERSATIONS.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // Handle message send
            setMessageInput('')
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-serif font-bold mb-8">Messages</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                        {/* Conversations list */}
                        <div className="lg:col-span-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
                            {/* Search */}
                            <div className="p-4 border-b border-border">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Conversations */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`w-full p-4 border-b border-border/50 text-left hover:bg-muted transition-colors ${selectedConversation.id === conv.id ? 'bg-muted' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <span className="text-2xl">{conv.avatar}</span>
                                                {conv.online && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <p className="font-semibold text-sm truncate">{conv.name}</p>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.timestamp}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                                            </div>
                                            {conv.unread > 0 && (
                                                <div className="w-5 h-5 bg-terracotta text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                    {conv.unread}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat area */}
                        <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{selectedConversation.avatar}</span>
                                    <div>
                                        <p className="font-semibold">{selectedConversation.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedConversation.online ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                        <Phone className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                        <Video className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {MESSAGES.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user'
                                                ? 'gradient-brand text-white'
                                                : 'bg-muted text-foreground'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-border">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="flex-1 px-4 py-2 bg-muted rounded-xl text-sm focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 gradient-brand text-white rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
