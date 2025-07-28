/**
 * Discover Page for 303030
 * Showcases available moodboards and themes
 * Provides inspiration and portfolio for potential clients
 * Updated for 30-day challenge structure
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import moodboardsData from '@/data/moodboards.json'
import ShootCard from '@/components/ui/shoot-card'

// Define the moodboard type based on JSON structure
interface Moodboard {
  id: number
  name: string
  description: string
  date: string
  coverImageUrl: string
  related_images: string[]
  isBooked: boolean
  clientInitial: string | null
  modelIds: number[]
  themeTags: string[]
  isPublic: boolean
  recommended: number[]
  // Enhanced fields for 30-day challenge
  day_number?: number
  week_number?: number
  is_main_moodboard?: boolean
  is_similar_moodboard?: boolean
}

/**
 * Discover Page Component
 * Features:
 * - Grid view of all moodboards
 * - Search functionality
 * - Filter by tags and availability
 * - Animated gallery display
 */
export default function DiscoverPage() {
  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [showMainOnly, setShowMainOnly] = useState(false)

  // Load moodboards with enhanced structure
  useEffect(() => {
    const enhancedMoodboards = moodboardsData.map((moodboard, index) => {
      const dayNumber = index + 1
      const weekNumber = Math.ceil(dayNumber / 5)
      const isMainMoodboard = dayNumber <= 30
      
      return {
        ...moodboard,
        day_number: isMainMoodboard ? dayNumber : undefined,
        week_number: isMainMoodboard ? weekNumber : undefined,
        is_main_moodboard: isMainMoodboard,
        is_similar_moodboard: !isMainMoodboard,
      }
    })
    
    setMoodboards(enhancedMoodboards)
    setLoading(false)
  }, [])

  // Filter moodboards based on search, tags, and availability
  const filteredMoodboards = moodboards.filter(moodboard => {
    // Search filter
    if (searchTerm && !moodboard.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !moodboard.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !moodboard.themeTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false
    }

    // Tag filter
    if (selectedTag !== 'all' && !moodboard.themeTags.includes(selectedTag)) {
      return false
    }

    // Availability filter
    if (showAvailableOnly && moodboard.isBooked) {
      return false
    }

    // Main moodboard filter
    if (showMainOnly && !moodboard.is_main_moodboard) {
      return false
    }

    return true
  })

  // Get unique tags from all moodboards
  const allTags = Array.from(new Set(moodboards.flatMap(mb => mb.themeTags)))

  // Check if moodboard can be clicked
  const canClickMoodboard = (moodboard: Moodboard) => {
    return !moodboard.isBooked
  }

  // Loading skeleton
  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="min-h-screen pt-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-zinc-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-zinc-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen px-6 pb-12 bg-white">
        <div className="w-full">
          {/* Booking Dashboard Header */}
          <div className="mb-12 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              {/* Left side - Title and Description */}
              <div>
                <h1 className="text-4xl font-bold text-black mb-2">Booking Dashboard</h1>
                <p className="text-gray-600">Browse and book your next photo session.</p>
              </div>
              
              {/* Right side - Calendar Navigation */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="font-bold text-black">May 2025</span>
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-black"></div>
                <span className="text-sm text-gray-600">Available Shoot</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500"></div>
                <span className="text-sm text-gray-600">Booked By Other</span>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo */}
            {/* <div className="flex justify-center mb-8">
              <Image
                src="/30logo.png"
                alt="303030 Logo"
                width={300}
                height={120}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div> */}
            
            
          </motion.div>

          {/* Filters and Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Availability Filter */}
            <Select 
              value={showAvailableOnly ? 'available' : 'all'} 
              onValueChange={(value) => setShowAvailableOnly(value === 'available')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moodboards</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Main Moodboard Filter */}
            <Select 
              value={showMainOnly ? 'main' : 'all'} 
              onValueChange={(value) => setShowMainOnly(value === 'main')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Moodboard Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="main">Main Moodboards Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          {/* <p className="text-sm text-zinc-600 mb-8">
            Showing {Math.min(filteredMoodboards.length, 30)} of {moodboards.length} mood boards
          </p> */}

          {/* Moodboards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full"
          >
            {filteredMoodboards.slice(0, 30).map((moodboard, index) => {
              const number = index + 1 < 10 ? `0${index + 1}` : index + 1;
              if (canClickMoodboard(moodboard)) {
                return (
                  <motion.div
                    key={moodboard.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/moodboard/${moodboard.id}`}>
                      <ShootCard
                        imageSrc={moodboard.coverImageUrl}
                        imageAlt={moodboard.name}
                        number={number}
                        title={moodboard.name}
                        subtitle="View shoot details"
                        available={true}
                      />
                    </Link>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={moodboard.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ShootCard
                      imageSrc={moodboard.coverImageUrl}
                      imageAlt={moodboard.name}
                      number={number}
                      title={moodboard.name}
                      subtitle="View shoot details"
                      opacity
                      available={false}
                    />
                  </motion.div>
                );
              }
            })}
          </motion.div>

          {/* Empty State */}
          {filteredMoodboards.length === 0 && !loading && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
              <p className="text-xl text-zinc-600 mb-2">No mood boards found</p>
              <p className="text-sm text-zinc-500">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedTag('all')
                  setShowAvailableOnly(false)
                  setShowMainOnly(false)
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <section className="mt-20 py-16 px-8 bg-black text-white  text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready to Book Your Session?
              </h2>
              <p className="text-xl mb-8 text-zinc-300 max-w-2xl mx-auto">
                Browse our calendar to see available dates and book the perfect mood board for your shoot
              </p>
              
              <Link href="/calendar">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-100">
                  View Calendar
                </Button>
              </Link>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  )
}