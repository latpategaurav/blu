/**
 * Razorpay utility functions for 303030 payment integration
 * Handles payment verification, formatting, and error handling
 */

import crypto from 'crypto'

export interface RazorpayOrderResponse {
  orderId: string
  amount: number
  currency: string
  bookingDetails: {
    id: string
    moodboardTitle: string
    modelName: string
    totalAmount: number
    depositAmount: number
  }
  customerDetails: {
    name: string
    email: string
    contact: string
  }
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

/**
 * Verify Razorpay payment signature
 * @param orderId - Razorpay order ID
 * @param paymentId - Razorpay payment ID
 * @param signature - Razorpay signature
 * @param secret - Razorpay key secret
 * @returns boolean indicating if signature is valid
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  try {
    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex')

    return expectedSignature === signature
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Verify webhook signature from Razorpay
 * @param body - Raw webhook body
 * @param signature - X-Razorpay-Signature header
 * @param secret - Webhook secret
 * @returns boolean indicating if webhook is authentic
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    return expectedSignature === signature
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

/**
 * Format amount for Razorpay (convert to paise)
 * @param amount - Amount in rupees
 * @returns Amount in paise
 */
export function formatAmountForRazorpay(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Format amount from Razorpay (convert from paise)
 * @param amount - Amount in paise
 * @returns Amount in rupees
 */
export function formatAmountFromRazorpay(amount: number): number {
  return amount / 100
}

/**
 * Generate receipt ID for Razorpay order
 * @param bookingId - Booking ID
 * @returns Formatted receipt ID
 */
export function generateReceiptId(bookingId: string): string {
  return `booking_${bookingId}_${Date.now()}`
}

/**
 * Create Razorpay order options
 * @param orderData - Order data from API
 * @returns Razorpay checkout options
 */
export function createRazorpayOptions(
  orderData: RazorpayOrderResponse,
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onDismiss: () => void
) {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: formatAmountForRazorpay(orderData.amount),
    currency: orderData.currency,
    name: '303030',
    description: `Booking deposit for ${orderData.bookingDetails.moodboardTitle}`,
    order_id: orderData.orderId,
    prefill: {
      name: orderData.customerDetails.name,
      email: orderData.customerDetails.email,
      contact: orderData.customerDetails.contact,
    },
    theme: {
      color: '#000000',
    },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
    },
  }
}

/**
 * Handle payment errors and return user-friendly messages
 * @param error - Error from Razorpay or API
 * @returns User-friendly error message
 */
export function getPaymentErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error
  }

  // Common Razorpay error codes
  const errorMessages: Record<string, string> = {
    'PAYMENT_DECLINED': 'Your payment was declined. Please try with a different payment method.',
    'INSUFFICIENT_FUNDS': 'Insufficient funds in your account. Please try with a different payment method.',
    'INVALID_CARD': 'Invalid card details. Please check and try again.',
    'CARD_EXPIRED': 'Your card has expired. Please use a different card.',
    'NETWORK_ERROR': 'Network error occurred. Please check your connection and try again.',
    'GATEWAY_ERROR': 'Payment gateway error. Please try again in a few minutes.',
    'USER_CANCELLED': 'Payment was cancelled. You can try again anytime.',
  }

  const errorCode = error.code || error.error?.code
  if (errorCode && errorMessages[errorCode]) {
    return errorMessages[errorCode]
  }

  const errorReason = error.reason || error.error?.reason
  if (errorReason && errorMessages[errorReason]) {
    return errorMessages[errorReason]
  }

  // Default error message
  return 'Payment failed. Please try again or contact support if the issue persists.'
}

/**
 * Check if Razorpay script is loaded
 * @returns boolean indicating if Razorpay is available
 */
export function isRazorpayLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined'
}

/**
 * Load Razorpay script dynamically
 * @returns Promise that resolves when script is loaded
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isRazorpayLoaded()) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    
    document.body.appendChild(script)
  })
}

/**
 * Format currency for display
 * @param amount - Amount in rupees
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/**
 * Validate payment amount
 * @param amount - Amount to validate
 * @returns boolean indicating if amount is valid
 */
export function isValidPaymentAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount)
}

/**
 * Get payment method display name
 * @param method - Razorpay payment method
 * @returns User-friendly payment method name
 */
export function getPaymentMethodDisplayName(method: string): string {
  const methodNames: Record<string, string> = {
    'card': 'Credit/Debit Card',
    'netbanking': 'Net Banking',
    'wallet': 'Digital Wallet',
    'upi': 'UPI',
    'emi': 'EMI',
    'paylater': 'Pay Later',
  }

  return methodNames[method] || method
} 