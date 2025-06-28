/**
 * Admin panel layout wrapper
 * Provides sidebar navigation and authentication protection using Supabase Auth
 * All admin routes must be wrapped with this layout
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Image, 
  Users, 
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// Admin navigation menu items
const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Moodboards', href: '/admin/moodboards', icon: Image },
  { label: 'Models', href: '/admin/models', icon: Users },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  
  // State management
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /**
   * Check authentication status on component mount
   * Uses Supabase Auth session
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          // No session, redirect to home
          router.push('/')
          return
        }

        // Check if user has admin role (you can customize this logic)
        // For now, we'll allow any authenticated user to access admin
        // In production, you might want to check a specific role or permission
        setUser(session.user)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          router.push('/')
        } else {
          setUser(session.user)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  /**
   * Handle user logout
   * Uses Supabase Auth signOut method
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
    } catch (error) {
      console.error('Unexpected logout error:', error)
      toast.error('An unexpected error occurred')
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            {user && (
              <div className="mb-3 text-sm">
                <p className="text-zinc-600">Logged in as</p>
                <p className="font-medium">{user.phone || user.email || 'User'}</p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:ml-80">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user.phone || user.email || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 