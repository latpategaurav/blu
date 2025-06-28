import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        client:profiles!bookings_client_id_fkey(name, phone_number, email),
        moodboard:moodboards(title),
        model:models(name)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify user owns this booking
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== booking.client_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if booking is already paid
    if (booking.deposit_paid) {
      return NextResponse.json(
        { error: 'Booking already paid' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: booking.deposit_amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        booking_id: bookingId,
        client_id: booking.client_id,
        moodboard_title: booking.moodboard?.title || 'Unknown',
        model_name: booking.model?.name || 'Unknown',
      },
    })

    // Save payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        amount: booking.deposit_amount,
        payment_type: 'deposit',
        razorpay_order_id: razorpayOrder.id,
        status: 'pending',
      })

    if (paymentError) {
      console.error('Failed to save payment record:', paymentError)
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      )
    }

    // Return order details for frontend
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: booking.deposit_amount,
      currency: 'INR',
      bookingDetails: {
        id: booking.id,
        moodboardTitle: booking.moodboard?.title,
        modelName: booking.model?.name,
        totalAmount: booking.total_amount,
        depositAmount: booking.deposit_amount,
      },
      customerDetails: {
        name: booking.client?.name || 'Customer',
        email: booking.client?.email || '',
        contact: booking.client?.phone_number || '',
      },
    })

  } catch (error) {
    console.error('Payment order creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
} 