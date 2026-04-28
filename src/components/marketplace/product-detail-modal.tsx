'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, ShoppingCart, Star, Check, ShieldCheck, Leaf } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/store/cart-store'

interface Product {
    id: string
    name: string
    chef: string
    price: number
    rating: number
    reviews: number
    category: string
    photo: string
    badge: string | null
    description?: string
    details?: string[]
}

interface ProductDetailModalProps {
    product: Product | null
    isOpen: boolean
    onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    const { addItem, items: cartItems, removeItem } = useCartStore()

    if (!product) return null

    const inCart = cartItems.some(i => i.id === product.id)

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                    
                    {/* Left Side: Image */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-muted overflow-hidden">
                        <Image 
                            src={product.photo} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {product.badge && (
                            <span className="absolute top-4 left-4 bg-terracotta text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                {product.badge}
                            </span>
                        )}
                        <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors md:hidden">
                            <X className="w-5 h-5" />
                        </Dialog.Close>
                    </div>

                    {/* Right Side: Details */}
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-terracotta font-bold text-sm uppercase tracking-wider">{product.chef}</p>
                            <Dialog.Close className="hidden md:block p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </Dialog.Close>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-serif font-black mb-4 leading-tight">{product.name}</h2>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex bg-yellow-400/10 px-2 py-1 rounded-lg">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                    />
                                ))}
                            </div>
                            <span className="font-bold text-sm">{product.rating}</span>
                            <span className="text-muted-foreground text-sm">({product.reviews} global reviews)</span>
                        </div>

                        <hr className="border-border mb-6" />

                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl font-black text-foreground">£{product.price.toFixed(2)}</span>
                            <span className="text-muted-foreground text-sm">inc. VAT</span>
                        </div>

                        {product.description && (
                            <div className="mb-8">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">About this item</h3>
                                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {product.details && (
                            <ul className="space-y-3 mb-10">
                                {product.details.map((detail, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Marketplace Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mb-10 p-4 bg-muted/50 rounded-2xl border border-border/50">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
                                <ShieldCheck className="w-4 h-4 text-terracotta" />
                                Quality Guaranteed
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
                                <Leaf className="w-4 h-4 text-green-500" />
                                Sustainable Source
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-card pt-4 border-t border-border mt-auto">
                            {inCart ? (
                                <button 
                                    onClick={() => removeItem(product.id)}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-muted text-muted-foreground font-black text-sm flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all border border-border"
                                >
                                    Remove from Cart
                                </button>
                            ) : (
                                <button 
                                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.photo, chef: product.chef })}
                                    className="flex-1 py-4 px-6 rounded-2xl gradient-brand text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-terracotta/20 hover:opacity-90 active:scale-[0.98] transition-all"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            )}
                            <button className="flex-1 py-4 px-6 rounded-2xl bg-foreground text-background font-black text-sm flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
