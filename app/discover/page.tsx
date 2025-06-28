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
import { Navbar } from '@/components/navbar'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import moodboardsData from '@/data/moodboards.json'

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
        <Navbar />
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
      <Navbar />
      
      <div className="min-h-screen pt-20 px-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/30logo.png"
                alt="303030 Logo"
                width={300}
                height={120}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">Discover</h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Explore our curated collection of mood boards and find the perfect aesthetic for your next photo session
            </p>
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
          <p className="text-sm text-zinc-600 mb-8">
            Showing {filteredMoodboards.length} of {moodboards.length} mood boards
          </p>

          {/* Moodboards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredMoodboards.map((moodboard, index) => (
              <motion.div
                key={moodboard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {canClickMoodboard(moodboard) ? (
                  <Link href={`/moodboard/${moodboard.id}`}>
                    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Moodboard Image */}
                      <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                        <Image
                          src={moodboard.coverImageUrl}
                          alt={moodboard.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Available indicator */}
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Available
                        </div>
                        
                        {/* Main/Similar indicator */}
                        <div className="absolute top-3 left-3">
                          <Badge variant={moodboard.is_main_moodboard ? "default" : "secondary"} className="text-xs">
                            {moodboard.is_main_moodboard ? "Main" : "Similar"}
                          </Badge>
                        </div>
                        
                        {/* Date Badge */}
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="outline" className="text-xs bg-white/90">
                            {format(new Date(moodboard.date), 'MMM d')}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Moodboard Details */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-zinc-700 transition-colors">
                          {moodboard.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
                          {moodboard.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {moodboard.themeTags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {moodboard.themeTags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{moodboard.themeTags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Model count */}
                        <div className="text-xs text-zinc-500">
                          {moodboard.modelIds.length} models available
                        </div>
                      </div>
                    </Card>
                  </Link>
                ) : (
                  <Card className="group overflow-hidden opacity-75">
                    {/* Moodboard Image */}
                    <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                      <Image
                        src={moodboard.coverImageUrl}
                        alt={moodboard.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Booked indicator */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Booked
                      </div>
                      
                      {/* Main/Similar indicator */}
                      <div className="absolute top-3 left-3">
                        <Badge variant={moodboard.is_main_moodboard ? "default" : "secondary"} className="text-xs">
                          {moodboard.is_main_moodboard ? "Main" : "Similar"}
                        </Badge>
                      </div>
                      
                      {/* Date Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="outline" className="text-xs bg-white/90">
                          {format(new Date(moodboard.date), 'MMM d')}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Moodboard Details */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">
                        {moodboard.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
                        {moodboard.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {moodboard.themeTags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {moodboard.themeTags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{moodboard.themeTags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Model count */}
                      <div className="text-xs text-zinc-500">
                        {moodboard.modelIds.length} models available
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
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
          <section className="mt-20 py-16 px-8 bg-black text-white rounded-xl text-center">
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