import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/utils/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    console.log('Razorpay webhook event:', event.event)

    // Create Supabase client with service role
    const supabase = createClient()

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity, supabase)
        break
        
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity, supabase)
        break
        
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity, supabase)
        break
        
      default:
        console.log('Unhandled event type:', event.event)
    }

    return NextResponse.json({ status: 'ok' })

  } catch (error) {
    console.error('Webhook processing failed:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any, supabase: any) {
  try {
    console.log('Processing payment captured:', payment.id)

    // Update payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        payment_date: new Date(payment.created_at * 1000).toISOString(),
        transaction_id: payment.id,
      })
      .eq('razorpay_order_id', payment.order_id)

    if (paymentError) {
      console.error('Failed to update payment from webhook:', paymentError)
      return
    }

    // Get booking ID from payment
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('booking_id')
      .eq('razorpay_order_id', payment.order_id)
      .single()

    if (!paymentRecord) {
      console.error('Payment record not found for order:', payment.order_id)
      return
    }

    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({
        deposit_paid: true,
        amount_paid: payment.amount / 100, // Convert from paise
        status: 'confirmed',
      })
      .eq('id', paymentRecord.booking_id)

    if (bookingError) {
      console.error('Failed to update booking from webhook:', bookingError)
    }

    // Fetch booking and client details for email
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, booking_date, product_count, total_amount, deposit_amount, client:profiles(email, name), moodboard:moodboards(title), model:models(name)')
      .eq('id', paymentRecord.booking_id)
      .single()

    if (booking?.client?.email) {
      const subject = 'Your Space Called Blu Booking is Confirmed!';
      const html = `
        <h2>Booking Confirmed</h2>
        <p>Hi ${booking.client.name || 'there'},</p>
        <p>Your booking is confirmed. Here are your details:</p>
        <ul>
          <li><strong>Moodboard:</strong> ${booking.moodboard?.title || 'N/A'}</li>
          <li><strong>Model:</strong> ${booking.model?.name || 'N/A'}</li>
          <li><strong>Booking Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</li>
          <li><strong>Product Count:</strong> ${booking.product_count}</li>
          <li><strong>Total Amount:</strong> ₹${booking.total_amount?.toLocaleString()}</li>
          <li><strong>Deposit Paid:</strong> ₹${booking.deposit_amount?.toLocaleString()}</li>
        </ul>
        <p>We look forward to seeing you at Space Called Blu!</p>
      `;
      await sendEmail({
        to: booking.client.email,
        subject,
        html,
      });
    }

    // TODO: Send confirmation SMS via Twilio
    // TODO: Send email confirmation
    // TODO: Notify admin team

  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment: any, supabase: any) {
  try {
    console.log('Processing payment failed:', payment.id)

    // Update payment record
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        transaction_id: payment.id,
      })
      .eq('razorpay_order_id', payment.order_id)

    if (error) {
      console.error('Failed to update failed payment:', error)
    }

    // TODO: Send failure notification
    // TODO: Create retry mechanism

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleOrderPaid(order: any, supabase: any) {
  try {
    console.log('Processing order paid:', order.id)

    // Additional confirmation that order is fully paid
    // This is a backup to payment.captured event
    
    const { data: payment } = await supabase
      .from('payments')
      .select('booking_id')
      .eq('razorpay_order_id', order.id)
      .single()

    if (payment) {
      // Ensure booking is marked as confirmed
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', payment.booking_id)
    }

  } catch (error) {
    console.error('Error handling order paid:', error)
  }
} 