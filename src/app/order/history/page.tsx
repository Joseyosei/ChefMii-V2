'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Star, MapPin, Clock, RotateCcw, MessageCircle } from 'lucide-react'

interface PastOrder {
  id: string
  chefName: string
  chefImage: string
  items: string[]
  total: number
  date: string
  status: 'delivered' | 'cancelled'
  rating?: number
  review?: string
  deliveryTime: string
}

function OrderHistoryContent() {
  const [orders, setOrders] = useState<PastOrder[]>([
    {
      id: 'order-001',
      chefName: 'Marco Rossi',
      chefImage: 'https://images.unsplash.com/photo-1577003832033-a0d99e4bed89?w=100&h=100&fit=crop',
      items: ['Secret Carbonara x2', 'Truffle Risotto x1'],
      total: 42.53,
      date: '2 days ago',
      status: 'delivered',
      rating: 5,
      review: 'Absolutely delicious! The carbonara was perfect. Will definitely order again.',
      deliveryTime: '28 mins',
    },
    {
      id: 'order-002',
      chefName: 'Yuki Tanaka',
      chefImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop',
      items: ['Omakase Sushi Set x1', 'Ramen Tonkotsu x2'],
      total: 71.50,
      date: '1 week ago',
      status: 'delivered',
      rating: 4,
      review: 'Great quality sushi, very fresh. Ramen was a bit salty but still good.',
      deliveryTime: '32 mins',
    },
    {
      id: 'order-003',
      chefName: 'Sophie Leclerc',
      chefImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
      items: ['Coq au Vin x1', 'Crème Brûlée x2'],
      total: 38.99,
      date: '2 weeks ago',
      status: 'delivered',
      rating: 5,
      review: 'Magnifique! Authentic French cuisine. The crème brûlée was divine.',
      deliveryTime: '35 mins',
    },
    {
      id: 'order-004',
      chefName: 'James Okafor',
      chefImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
      items: ['Lagos Jollof Rice x1', 'Suya Platter x1'],
      total: 32.99,
      date: '3 weeks ago',
      status: 'delivered',
      deliveryTime: '30 mins',
    },
  ])

  const [ratingOrder, setRatingOrder] = useState<string | null>(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [ratingComment, setRatingComment] = useState('')

  const handleSubmitRating = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, rating: ratingScore, review: ratingComment }
        : order
    ))
    setRatingOrder(null)
    setRatingScore(5)
    setRatingComment('')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">View and manage your past orders</p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link
                  href="/order"
                  className="inline-block px-6 py-2 bg-terracotta text-white font-medium rounded-lg hover:bg-terracotta/90 transition-colors"
                >
                  Start Ordering
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-6">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={order.chefImage}
                        alt={order.chefName}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{order.chefName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{order.date}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {order.deliveryTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">£{order.total.toFixed(2)}</p>
                      <button className="text-xs text-terracotta font-medium hover:underline mt-2 flex items-center gap-1 ml-auto">
                        <RotateCcw className="w-3 h-3" /> Reorder
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-background rounded-lg p-3 mb-4 border border-border">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {item}
                      </p>
                    ))}
                  </div>

                  {/* Rating Section */}
                  {order.rating ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < order.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{order.rating} stars</span>
                      </div>
                      {order.review && (
                        <p className="text-sm text-muted-foreground italic">"{order.review}"</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setRatingOrder(order.id)}
                      className="w-full py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors mb-4 flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4" /> Rate this order
                    </button>
                  )}

                  {/* Rating Modal */}
                  {ratingOrder === order.id && (
                    <div className="bg-muted rounded-lg p-4 mb-4 space-y-4">
                      <h4 className="font-bold">Rate your order</h4>

                      {/* Star Rating */}
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setRatingScore(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= ratingScore
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Comment */}
                      <textarea
                        value={ratingComment}
                        onChange={e => setRatingComment(e.target.value)}
                        placeholder="Share your experience (optional)"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-terracotta resize-none text-sm"
                        rows={3}
                      />

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRatingOrder(null)}
                          className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-background transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitRating(order.id)}
                          className="flex-1 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                        >
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Contact Chef
                    </button>
                    <Link
                      href={`/order/tracking/${order.id}`}
                      className="flex-1 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Continue Shopping */}
          {orders.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/order"
                className="inline-block px-8 py-3 bg-terracotta text-white font-medium rounded-xl hover:bg-terracotta/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    }>
      <OrderHistoryContent />
    </Suspense>
  )
}
