/**
 * Admin Dashboard Page
 * Provides overview of platform statistics and recent activity
 * Entry point for admin panel after authentication
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { 
  Image, 
  Users, 
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Dashboard statistics interface
 * Aggregates key metrics across the platform
 */
interface DashboardStats {
  totalMoodboards: number      // Total moodboards created
  activeMoodboards: number     // Available for booking
  totalModels: number          // Total models in system
  activeModels: number         // Currently active models
  totalBookings: number        // All bookings
  pendingBookings: number      // Awaiting processing
  completedBookings: number    // Successfully completed
  totalRevenue: number         // Total amount collected
}

/**
 * Admin Dashboard Component
 * Displays:
 * - Key metrics in card grid
 * - Recent booking activity
 * - Quick performance stats
 */
export default function AdminDashboard() {
  // Initialize stats with zero values
  const [stats, setStats] = useState<DashboardStats>({
    totalMoodboards: 0,
    activeMoodboards: 0,
    totalModels: 0,
    activeModels: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  /**
   * Fetches all dashboard statistics from Supabase
   * Aggregates data from multiple tables for overview
   */
  const fetchDashboardData = async () => {
    const supabase = createClient()

    // Fetch moodboard statistics
    const { count: totalMoodboards } = await supabase
      .from('moodboards')
      .select('*', { count: 'exact', head: true })

    const { count: activeMoodboards } = await supabase
      .from('moodboards')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_booked', false) // Available for booking

    // Fetch model statistics
    const { count: totalModels } = await supabase
      .from('models')
      .select('*', { count: 'exact', head: true })

    const { count: activeModels } = await supabase
      .from('models')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Fetch booking statistics with revenue calculation
    const { data: bookings } = await supabase
      .from('bookings')
      .select('status, amount_paid')

    // Aggregate booking data
    const bookingStats = bookings?.reduce((acc, booking) => {
      acc.total++
      if (booking.status === 'pending') acc.pending++
      if (booking.status === 'completed') acc.completed++
      acc.revenue += booking.amount_paid || 0
      return acc
    }, { total: 0, pending: 0, completed: 0, revenue: 0 })

    // Fetch recent bookings with related data
    const { data: recent } = await supabase
      .from('bookings')
      .select(`
        *,
        users (name, phone_number, brand_name),
        moodboards (title)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Update state with fetched data
    setStats({
      totalMoodboards: totalMoodboards || 0,
      activeMoodboards: activeMoodboards || 0,
      totalModels: totalModels || 0,
      activeModels: activeModels || 0,
      totalBookings: bookingStats?.total || 0,
      pendingBookings: bookingStats?.pending || 0,
      completedBookings: bookingStats?.completed || 0,
      totalRevenue: bookingStats?.revenue || 0
    })

    setRecentBookings(recent || [])
    setLoading(false)
  }

  // Configuration for stat cards display
  const statCards = [
    {
      title: 'Total Moodboards',
      value: stats.totalMoodboards,
      subtitle: `${stats.activeMoodboards} active`,
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Models',
      value: stats.totalModels,
      subtitle: `${stats.activeModels} active`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      subtitle: `${stats.pendingBookings} pending`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtitle: 'Total collected',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-zinc-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-600 mt-1">Welcome to 303030 Admin Panel</p>
      </div>

      {/* Stats Grid - Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} // Staggered animation
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-600">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className="text-sm text-zinc-500 mt-1">{stat.subtitle}</p>
                    </div>
                    {/* Icon with colored background */}
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-zinc-500">No bookings yet</p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {booking.moodboards?.title || 'Unknown Moodboard'}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {booking.users?.brand_name || booking.users?.name || 'Unknown User'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ₹{booking.amount_paid?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Booking Rate */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm">Booking Rate</span>
              </div>
              <span className="text-sm font-medium">
                {stats.totalMoodboards > 0 
                  ? `${Math.round((stats.totalBookings / stats.totalMoodboards) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            
            {/* Pending Bookings */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Pending Bookings</span>
              </div>
              <span className="text-sm font-medium">{stats.pendingBookings}</span>
            </div>
            
            {/* Completed Bookings */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Completed Bookings</span>
              </div>
              <span className="text-sm font-medium">{stats.completedBookings}</span>
            </div>
            
            {/* Average Booking Value */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Avg. Booking Value</span>
              </div>
              <span className="text-sm font-medium">
                ₹{stats.totalBookings > 0 
                  ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString()
                  : '0'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 