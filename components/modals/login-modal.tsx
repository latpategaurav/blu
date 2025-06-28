/**
 * Login Modal Component for 303030
 * Uses Supabase Auth with Twilio as SMS provider for phone OTP authentication
 * Handles both signup and login in a single flow
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'libphonenumber-js'
import 'react-phone-number-input/style.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  callbackUrl?: string
}

export function LoginModal({ isOpen, onClose, callbackUrl = '/calendar' }: LoginModalProps) {
  const router = useRouter()
  const supabase = createClient()
  
  // Form state
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('')
  const [otp, setOtp] = useState('')
  const [mode, setMode] = useState<'login' | 'signup' | null>(null) // Track which button was pressed
  
  // Loading states
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  
  // Error state
  const [error, setError] = useState('')

  /**
   * Handle phone number submission and send OTP
   * Uses Supabase Auth signInWithOtp method
   */
  const handlePhoneSubmit = (selectedMode: 'login' | 'signup'): void => {
    setMode(selectedMode)
    if (!phoneNumber || !phoneNumber.trim()) {
      setError('Please enter your phone number')
      return
    }
    
    // Validate phone number using libphonenumber-js
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number')
      return
    }
    
    setError('')
    setSendingOtp(true);
    (async () => {
      try {
        // Use Supabase Auth to send OTP via Twilio
        // Note: Supabase does not distinguish login/signup, but you can show different error messages based on mode
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber
        })
        if (error) {
          // Bug: No feedback for already registered/unregistered numbers
          if (selectedMode === 'signup' && error.message.includes('already registered')) {
            setError('This phone number is already registered. Please login instead.')
          } else if (selectedMode === 'login' && error.message.includes('not found')) {
            setError('No account found for this phone number. Please sign up first.')
          } else {
            setError(error.message || 'Failed to send OTP. Please try again.')
          }
          return
        }
        setStep('otp')
        toast.success('OTP sent to your phone number!')
      } catch (err) {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setSendingOtp(false)
      }
    })();
  }

  /**
   * Handle OTP verification and user authentication
   * Uses Supabase Auth verifyOtp method
   */
  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    if (!phoneNumber) {
      setError('Phone number is required')
      return
    }

    setError('')
    setVerifyingOtp(true)

    try {
      // Use Supabase Auth to verify OTP and authenticate user
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      })

      if (error) {
        console.error('OTP verification error:', error)
        setError(error.message || 'Invalid OTP. Please try again.')
        return
      }

      if (data?.user) {
        // Authentication successful - user is now logged in
        toast.success('Authentication successful!')
        onClose()
        router.push(callbackUrl)
        router.refresh()
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  /**
   * Reset form and go back to phone input step
   */
  const handleBack = () => {
    setStep('phone')
    setOtp('')
    setError('')
  }

  /**
   * Handle modal close and reset form
   */
  const handleClose = () => {
    setStep('phone')
    setPhoneNumber('')
    setOtp('')
    setError('')
    onClose()
  }

  // Add wrapper functions for button clicks to avoid linter error
  const handleLoginClick = () => { void handlePhoneSubmit('login') }
  const handleSignupClick = () => { void handlePhoneSubmit('signup') }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {step === 'phone' ? 'Sign In / Sign Up' : 'Verify OTP'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'phone' ? (
            // Phone number input step
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  onFocus={() => setError('')}
                  className="phone-input"
                  placeholder="Enter phone number"
                />
                <p className="text-xs text-zinc-500">
                  Select your country and enter your phone number
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex space-x-2">
                <Button
                  type="button"
                  onClick={handleLoginClick}
                  disabled={sendingOtp || !phoneNumber?.trim()}
                  className="w-1/2"
                  variant="default"
                >
                  {sendingOtp && mode === 'login' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleSignupClick}
                  disabled={sendingOtp || !phoneNumber?.trim()}
                  className="w-1/2"
                  variant="secondary"
                >
                  {sendingOtp && mode === 'signup' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-zinc-600">
                <p>We'll send a 6-digit code to your phone number</p>
                <p>This will sign you up if you're new, or sign you in if you exist</p>
              </div>
            </div>
          ) : (
            // OTP verification step
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-zinc-600">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-medium">
                  {phoneNumber}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onFocus={() => setError('')}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleOtpSubmit}
                  disabled={verifyingOtp || otp.length !== 6}
                  className="w-full"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={verifyingOtp}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Phone Number
                </Button>
              </div>

              <div className="text-center text-sm text-zinc-600">
                <p>Didn't receive the code?</p>
                <Button
                  variant="link"
                  onClick={() => handlePhoneSubmit(mode || 'login')}
                  disabled={sendingOtp}
                  className="p-0 h-auto text-sm"
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 