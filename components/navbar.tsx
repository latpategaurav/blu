/**
 * Global navigation bar component for 303030
 * Matches Figma design with text logo and specific styling
 */

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLoginModal } from '@/lib/hooks/use-login-modal'
import { createClient } from '@/lib/supabase/client'
import { UserAvatar } from '@/components/ui/avatar'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Image from 'next/image'

// Navigation items for the main menu
const navItems = [
  { label: 'Shoot Calendar', href: '/calendar' },
  { label: 'Discover', href: '/discover' },
  { label: 'About Us', href: '/about-us' },
]

interface NavbarProps {
  className?: string
}

export function Navbar({ className = '' }: NavbarProps) {
  const router = useRouter()
  const { onOpen } = useLoginModal()
  const supabase = createClient()
  
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Check authentication status on component mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
        toast.error('Failed to logout. Please try again.')
        return
      }

      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Unexpected logout error:', error)
      toast.error('An unexpected error occurred')
    }
  }

  /**
   * Handle navigation item click
   */
  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`w-full h-[220px] bg-white flex items-center justify-between border-b border-gray-100 ${className}`}
      style={{ 
        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Left section - Logo */}
      <div className="flex items-center justify-start pl-8 w-1/2 h-full">
        <Link href="/" className="flex items-center">
          <Image 
            src="/30logo.png"
            alt="303030"
            width={206}
            height={69}
            className="hover:opacity-80 transition-opacity"
            priority
          />
        </Link>
      </div>

      {/* Right section - Navigation */}
      <div className="flex items-center justify-end pr-8 w-1/2 h-full">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-[#081116] text-[36px] leading-[43px] font-normal hover:opacity-70 transition-opacity"
                style={{ fontFamily: 'SF Pro, sans-serif' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center ml-8">
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <UserAvatar 
                  phoneNumber={user.phone || undefined}
                  email={user.email || undefined}
                  size="md"
                />
                <button
                  onClick={handleLogout}
                  className="text-[#081116] text-[36px] leading-[43px] font-normal hover:opacity-70 transition-opacity"
                  style={{ fontFamily: 'SF Pro, sans-serif' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpen}
                className="text-[#081116] text-[36px] leading-[43px] font-normal hover:opacity-70 transition-opacity"
                style={{ fontFamily: 'SF Pro, sans-serif' }}
              >
                Login, Signup
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-[#081116] hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute top-[220px] left-0 right-0 bg-white border-b border-gray-200 md:hidden z-50"
        >
          <div className="px-4 py-3 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-3 py-2 text-[#081116] hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <UserAvatar 
                      phoneNumber={user.phone || undefined}
                      email={user.email || undefined}
                      size="sm"
                    />
                    <span className="text-sm text-[#081116]">
                      {user.phone || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-[#081116] hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpen}
                  className="block w-full text-left px-3 py-2 text-[#081116] hover:bg-gray-50 rounded-md transition-colors"
                >
                  Login, Signup
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
} 