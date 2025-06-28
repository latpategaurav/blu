/**
 * Payment page for booking deposits
 * Integrates with Razorpay for secure payment processing
 * Handles the 10% upfront payment flow for mood board bookings
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/navbar'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

// Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

interface BookingDetails {
  id: string
  moodboardTitle: string
  modelName: string
  totalAmount: number
  depositAmount: number
  productCount: number
  bookingDate: string
}

interface CustomerDetails {
  name: string
  email: string
  contact: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  // State management
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')

  // Fetch booking details on mount
  useEffect(() => {
    fetchBookingDetails()
    loadRazorpayScript()
  }, [bookingId])

  /**
   * Load Razorpay script dynamically
   */
  const loadRazorpayScript = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }

  /**
   * Fetch booking and customer details
   */
  const fetchBookingDetails = async () => {
    const supabase = createClient()

    try {
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(name, phone_number, email),
          moodboard:moodboards(title),
          model:models(name)
        `)
        .eq('id', bookingId)
        .single()

      if (error || !bookingData) {
        toast.error('Booking not found')
        router.push('/calendar')
        return
      }

      // Check if already paid
      if (bookingData.deposit_paid) {
        toast.success('This booking has already been paid')
        router.push(`/booking/${bookingId}/confirmation`)
        return
      }

      setBooking({
        id: bookingData.id,
        moodboardTitle: bookingData.moodboard?.title || 'Unknown Moodboard',
        modelName: bookingData.model?.name || 'Unknown Model',
        totalAmount: bookingData.total_amount,
        depositAmount: bookingData.deposit_amount,
        productCount: bookingData.product_count,
        bookingDate: bookingData.booking_date,
      })

      setCustomer({
        name: bookingData.client?.name || 'Customer',
        email: bookingData.client?.email || '',
        contact: bookingData.client?.phone_number || '',
      })

    } catch (error) {
      console.error('Error fetching booking:', error)
      toast.error('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initiate Razorpay payment
   */
  const handlePayment = async () => {
    if (!booking || !customer) return

    setPaymentLoading(true)
    setPaymentStatus('processing')

    try {
      // Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })

      const orderData = await response.json()

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        name: '303030',
        description: `Booking deposit for ${booking.moodboardTitle}`,
        order_id: orderData.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.contact,
        },
        theme: {
          color: '#000000',
        },
        handler: async (response: any) => {
          await verifyPayment(response)
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false)
            setPaymentStatus('pending')
            toast.error('Payment cancelled')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment initiation failed:', error)
      toast.error('Failed to initiate payment')
      setPaymentLoading(false)
      setPaymentStatus('failed')
    }
  }

  /**
   * Verify payment with backend
   */
  const verifyPayment = async (paymentResponse: any) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentResponse,
          bookingId,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setPaymentStatus('success')
        toast.success('Payment successful!')
        
        // Redirect to confirmation page
        setTimeout(() => {
          router.push(`/booking/${bookingId}/confirmation`)
        }, 2000)
      } else {
        throw new Error(result.error || 'Payment verification failed')
      }

    } catch (error) {
      console.error('Payment verification failed:', error)
      setPaymentStatus('failed')
      toast.error('Payment verification failed')
    } finally {
      setPaymentLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading payment details...</p>
          </div>
        </div>
      </>
    )
  }

  if (!booking || !customer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
            <p className="text-zinc-600 mb-4">The booking you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/calendar')}>
              Back to Calendar
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen pt-20 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">{booking.moodboardTitle}</h3>
                    <p className="text-sm text-zinc-600">Model: {booking.modelName}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Product Count</span>
                      <span>{booking.productCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking Date</span>
                      <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>₹{booking.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Deposit (10%)</span>
                      <span>₹{booking.depositAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Pay 10% now to secure your booking. The remaining amount will be collected in milestones as we progress with your shoot.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Details */}
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>{customer.name}</p>
                      <p>{customer.email}</p>
                      <p>{customer.contact}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Amount */}
                  <div className="text-center">
                    <p className="text-sm text-zinc-600 mb-1">Amount to Pay</p>
                    <p className="text-3xl font-bold">₹{booking.depositAmount.toLocaleString()}</p>
                    <p className="text-sm text-zinc-500">Secure payment via Razorpay</p>
                  </div>

                  {/* Payment Status */}
                  {paymentStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">Payment Successful!</p>
                      <p className="text-sm text-green-600">Redirecting to confirmation...</p>
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-red-800 font-medium">Payment Failed</p>
                      <p className="text-sm text-red-600">Please try again</p>
                    </div>
                  )}

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={paymentLoading || paymentStatus === 'success'}
                    className="w-full bg-black text-white hover:bg-zinc-800"
                    size="lg"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Pay ₹{booking.depositAmount.toLocaleString()}
                      </>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="text-center text-xs text-zinc-500">
                    <Shield className="w-4 h-4 mx-auto mb-1" />
                    <p>Your payment is secured by Razorpay's 256-bit SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
} 