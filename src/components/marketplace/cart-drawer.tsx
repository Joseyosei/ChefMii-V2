'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'

export function CartDrawer() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()
    const drawerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden' // Prevent bg scrolling
        } else {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, setIsOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="relative w-full max-w-md bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Your Cart</h2>
                            <p className="text-xs text-muted-foreground">{getTotalItems()} items</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-60">
                            <ShoppingBag className="w-16 h-16" />
                            <div>
                                <p className="font-bold text-lg text-foreground mb-1">Your cart is empty</p>
                                <p className="text-sm">Time to discover some artisanal ingredients!</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-4 px-6 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted text-foreground transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-background border border-border rounded-2xl">
                                <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0 relative">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-sm leading-tight text-foreground line-clamp-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-terracotta font-medium mt-1">{item.chef}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-black text-sm">£{item.price.toFixed(2)}</span>
                                        <div className="flex items-center gap-3 bg-muted rounded-lg px-2 py-1 border border-border/50">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-0.5 hover:text-terracotta transition-colors disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-0.5 hover:text-terracotta transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-border bg-background/50 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Subtotal</span>
                            <span className="font-semibold text-sm">£{getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Shipping</span>
                            <span className="text-sm text-green-600 font-semibold">Calculated at checkout</span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-bold text-base">Total</span>
                            <span className="font-black text-2xl text-terracotta">£{getTotalPrice().toFixed(2)}</span>
                        </div>

                        <button className="w-full py-4 gradient-brand text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                            Checkout <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
