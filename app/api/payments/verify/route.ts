import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Verify user authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get booking to verify ownership
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('client_id, deposit_amount, status')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.client_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to booking' },
        { status: 403 }
      )
    }

    // Update payment record
    const { error: paymentUpdateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        payment_date: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id)

    if (paymentUpdateError) {
      console.error('Failed to update payment:', paymentUpdateError)
      return NextResponse.json(
        { error: 'Failed to update payment record' },
        { status: 500 }
      )
    }

    // Update booking status
    const { error: bookingUpdateError } = await supabase
      .from('bookings')
      .update({
        deposit_paid: true,
        amount_paid: booking.deposit_amount,
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    if (bookingUpdateError) {
      console.error('Failed to update booking:', bookingUpdateError)
      return NextResponse.json(
        { error: 'Failed to update booking status' },
        { status: 500 }
      )
    }

    // Create notification for successful payment
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Payment Successful',
        message: 'Your booking deposit has been paid successfully. We will contact you within 24 hours.',
        type: 'payment',
        related_entity_type: 'booking',
        related_entity_id: bookingId,
      })

    // TODO: Send SMS notification via Twilio (implement in webhook)
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      bookingStatus: 'confirmed',
    })

  } catch (error) {
    console.error('Payment verification failed:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 