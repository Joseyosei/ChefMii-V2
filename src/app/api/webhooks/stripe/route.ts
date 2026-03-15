import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
        console.error('Webhook signature verification failed:', error)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const pi = event.data.object as Stripe.PaymentIntent
            await supabase.from('bookings')
                .update({ status: 'confirmed', updated_at: new Date().toISOString() })
                .eq('stripe_payment_intent_id', pi.id)
            break
        }
        case 'payment_intent.payment_failed': {
            const pi = event.data.object as Stripe.PaymentIntent
            await supabase.from('bookings')
                .update({ status: 'cancelled', updated_at: new Date().toISOString() })
                .eq('stripe_payment_intent_id', pi.id)
            break
        }
        case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge
            if (charge.payment_intent) {
                await supabase.from('bookings')
                    .update({ status: 'refunded', updated_at: new Date().toISOString() })
                    .eq('stripe_payment_intent_id', charge.payment_intent)
            }
            break
        }
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
