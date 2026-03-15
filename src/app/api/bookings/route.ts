import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { calculatePlatformFee } from '@/lib/utils'
import type { ChefProfile, Database } from '@/types/database'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { chefSlug, eventDate, eventTime, durationHours, guestCount, eventType, specialRequests, address } = body

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: chefRaw, error: chefError } = await (supabase as any)
            .from('chef_profiles')
            .select('id, hourly_rate, user_id')
            .eq('slug', chefSlug)
            .single()

        if (chefError || !chefRaw) {
            return NextResponse.json({ error: 'Chef not found' }, { status: 404 })
        }

        const chef = chefRaw as Pick<ChefProfile, 'id' | 'hourly_rate' | 'user_id'>
        const totalAmount = Math.round(chef.hourly_rate * durationHours * 100) // in cents
        const platformFee = calculatePlatformFee(totalAmount, Number(process.env.STRIPE_PLATFORM_FEE_PERCENT) || 10)
        const chefPayout = totalAmount - platformFee

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: { clientId: user.id, chefId: chef.id, eventDate, eventTime },
        })

        const newBooking: BookingInsert = {
            client_id: user.id,
            chef_id: chef.id,
            event_date: eventDate as string,
            event_time: eventTime as string,
            duration_hours: durationHours as number,
            guest_count: guestCount as number,
            event_type: eventType as string,
            special_requests: (specialRequests as string) ?? null,
            total_amount: totalAmount / 100,
            platform_fee: platformFee / 100,
            chef_payout: chefPayout / 100,
            stripe_payment_intent_id: paymentIntent.id,
            status: 'pending',
            address_line1: (address?.line1 as string) ?? null,
            address_city: (address?.city as string) ?? null,
            address_state: (address?.state as string) ?? null,
            address_zip: (address?.zip as string) ?? null,
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: booking, error: bookingError } = await (supabase as any)
            .from('bookings')
            .insert(newBooking)
            .select()
            .single()

        if (bookingError) {
            await stripe.paymentIntents.cancel(paymentIntent.id)
            return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
        }

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            bookingId: booking.id,
        })
    } catch (error) {
        console.error('Booking creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
