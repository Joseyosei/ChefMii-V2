'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { MapPin, Phone, MessageCircle, Clock, CheckCircle, Truck, Home, ChefHat } from 'lucide-react'

interface DeliveryStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
  icon: React.ReactNode
  timestamp?: string
}

function TrackingContent() {
  const params = useParams()
  const orderId = params.orderId as string

  const [orderStatus, setOrderStatus] = useState('preparing')
  const [driverLocation, setDriverLocation] = useState({ lat: 51.5074, lng: -0.1278 })
  const [estimatedTime, setEstimatedTime] = useState(12)
  const [showMap, setShowMap] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1))
      // Simulate driver location movement
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const steps: DeliveryStep[] = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Marco accepted your order',
      completed: true,
      current: false,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      timestamp: '5 mins ago',
    },
    {
      id: 'preparing',
      title: 'Preparing',
      description: 'Your food is being prepared',
      completed: true,
      current: orderStatus === 'preparing',
      icon: <ChefHat className="w-6 h-6 text-terracotta" />,
      timestamp: 'Now',
    },
    {
      id: 'ready',
      title: 'Ready for Pickup',
      description: 'Your order is ready',
      completed: false,
      current: false,
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 'picked_up',
      title: 'Picked Up',
      description: 'Driver is on the way',
      completed: false,
      current: false,
      icon: <Truck className="w-6 h-6" />,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order delivered to your address',
      completed: false,
      current: false,
      icon: <Home className="w-6 h-6" />,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Order #{orderId.slice(-4).toUpperCase()}</h1>
            <p className="text-muted-foreground">Your food will arrive in approximately {estimatedTime} minutes</p>
          </div>

          {/* Live Map Section */}
          {showMap && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                {/* Simplified Map Representation */}
                <div className="w-full h-full relative">
                  {/* Map background */}
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {/* Streets */}
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#e5e7eb" strokeWidth="2" />
                    <line x1="0" y1="200" x2="400" y2="200" stroke="#e5e7eb" strokeWidth="2" />
                    <line x1="100" y1="0" x2="100" y2="300" stroke="#e5e7eb" strokeWidth="2" />
                    <line x1="200" y1="0" x2="200" y2="300" stroke="#e5e7eb" strokeWidth="2" />
                    <line x1="300" y1="0" x2="300" y2="300" stroke="#e5e7eb" strokeWidth="2" />

                    {/* Route line */}
                    <polyline
                      points="200,250 250,200 280,150 300,100"
                      stroke="#FF5A36"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />

                    {/* Destination marker */}
                    <circle cx="200" cy="250" r="8" fill="#22c55e" />
                    <circle cx="200" cy="250" r="15" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.5" />

                    {/* Driver marker (animated) */}
                    <g>
                      <circle cx="280" cy="150" r="10" fill="#FF5A36" />
                      <circle cx="280" cy="150" r="18" fill="none" stroke="#FF5A36" strokeWidth="2" opacity="0.3" />
                      <path d="M 280 135 L 285 150 L 280 165 L 275 150 Z" fill="#FF5A36" />
                    </g>

                    {/* Restaurant marker */}
                    <circle cx="300" cy="100" r="8" fill="#3b82f6" />
                    <circle cx="300" cy="100" r="15" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
                  </svg>

                  {/* Map labels */}
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-medium">
                    📍 Live Tracking
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-medium">
                    🗺️ 0.8 mi away
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div className="bg-background border-t border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                    alt="Driver"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">Ahmed Hassan</p>
                    <p className="text-xs text-muted-foreground">🚗 Blue Honda Civic • LJ19 ABC</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center hover:bg-terracotta/90">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="font-bold text-lg mb-6">Order Timeline</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed || step.current
                        ? 'bg-terracotta/20'
                        : 'bg-muted'
                    }`}>
                      {step.icon}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-1 h-12 my-2 ${
                        step.completed ? 'bg-terracotta' : 'bg-muted'
                      }`} />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-2">
                    <h3 className={`font-bold ${step.current ? 'text-terracotta' : ''}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">{step.timestamp}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Delivery Address */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-terracotta" />
                Delivery Address
              </h3>
              <p className="text-sm mb-2">123 Oxford Street</p>
              <p className="text-sm text-muted-foreground">London, W1D 1LL</p>
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Secret Carbonara x2</span>
                  <span>£37.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Truffle Risotto x1</span>
                  <span>£22.00</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£42.53</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors">
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Contact Support
            </button>
            <Link
              href="/order"
              className="flex-1 py-3 bg-terracotta text-white font-medium rounded-xl hover:bg-terracotta/90 transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">⏳</div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}
