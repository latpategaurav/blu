/**
 * Detailed Moodboard Page - Matches Figma Design Specifications
 * Comprehensive moodboard view with full booking flow
 * Updated for 30-day challenge structure
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Camera, 
  Users, 
  CreditCard,
  Eye,
  WandSparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { createClient } from '@/lib/supabase/client'
import type { Moodboard, Model } from '@/types/database'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useLoginModal } from '@/lib/hooks/use-login-modal'
import { useMoodboardDetails } from '@/lib/hooks/use-moodboards'
import { MoodboardImage } from '@/components/moodboard-image'
import { ModelImage } from '@/components/model-image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

/**
 * Extended moodboard type with related data
 */
interface MoodboardWithDetails extends Moodboard {
  models?: (Model & { price?: number })[]
  similar?: Moodboard[]
  moodboard_images?: string[]
  relevant_shoots?: Moodboard[]
  // Enhanced fields for 30-day challenge
  day_number?: number
  week_number?: number
  is_main_moodboard?: boolean
  is_similar_moodboard?: boolean
}

/**
 * Comprehensive Moodboard Page Component
 */
export default function DetailedMoodboardPage() {
  const params = useParams()
  const router = useRouter()
  const { onOpen } = useLoginModal()
  
  // State management
  const [selectedModels, setSelectedModels] = useState<number[]>([])
  const [showMarketplace, setShowMarketplace] = useState(false)
  const [marketplaceSearch, setMarketplaceSearch] = useState('')
  const [marketplaceFilters, setMarketplaceFilters] = useState({
    gender: 'all',
    category: 'all',
    priceRange: 'all'
  })
  
  // Use the simple moodboard hook
  const { data, loading, error } = useMoodboardDetails(parseInt(params.id as string))

  // Extract moodboard data from hook response
  const moodboard = data?.moodboard || null
  const models = data?.models || []
  const similar = data?.similar || []

  const toggleModelSelection = (modelId: number) => {
    setSelectedModels(prev => {
      // Only allow one model to be selected
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId)
      } else {
        return [modelId] // Replace any existing selection with the new one
      }
    })
  }

  const handleBooking = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      onOpen()
      return
    }

    if (selectedModels.length === 0) {
      toast.error('Please select at least one model')
      return
    }

    // Check if moodboard is already booked
    if (moodboard?.isBooked) {
      toast.error('This moodboard is already booked')
      return
    }

    toast.success('Proceeding to payment...')
    router.push(`/payment/${moodboard?.id || params.id}`)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </>
    )
  }

  if (error || !moodboard) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Moodboard not found</h1>
            <Button onClick={() => router.push('/calendar')}>
              Back to Calendar
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Helper function to generate placeholder images for sections
  const generatePlaceholderImages = (count: number, category: string) => {
    return Array.from({ length: count }, (_, i) => ({
      url: `/moodboards/${moodboard.coverImageUrl?.split('/').pop() || 'placeholder.jpg'}`,
      alt: `${category} ${i + 1}`
    }))
  }

  // Check if this moodboard can be booked
  const canBookMoodboard = !moodboard.isBooked

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="flex flex-col items-center">
          
          {/* Moodboard Name Section */}
          <div className="flex flex-col justify-center items-center px-8 gap-7 w-full max-w-[1920px] py-8">
            <div className="flex flex-col justify-center items-center gap-7 w-full">
              
              {/* Title */}
              <h1 
                className="text-4xl font-bold text-center mb-8"
                style={{ fontFamily: 'SF Pro Display, sans-serif' }}
              >
                {moodboard.name}
              </h1>

              {/* Booking Status Badge */}
              {!canBookMoodboard && (
                <div className="mb-4">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    {moodboard.clientInitial || 'Booked'}
                  </Badge>
                </div>
              )}

              {/* Main Moodboard Image */}
              <div className="w-full max-w-[1856px] relative" style={{ height: '1046px' }}>
                <MoodboardImage
                  moodboard={moodboard}
                  category="main"
                  alt={`${moodboard.name} main`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Look & Feel Section */}
              <div className="w-full max-w-[1856px] mt-12">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
                  Look & feel
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {generatePlaceholderImages(6, 'look').map((img, index) => (
                    <div key={index} className="relative aspect-[4/5]">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood Shots Section */}
              <div className="w-full max-w-[1856px] mt-12">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
                  Mood shots
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {generatePlaceholderImages(6, 'mood').map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hair & Makeup Section */}
              <div className="w-full max-w-[1856px] mt-12">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
                  Hair & Makeup
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {generatePlaceholderImages(6, 'hair').map((img, index) => (
                    <div key={index} className="relative aspect-[4/5]">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Shoots Section - Only show if this is a main moodboard */}
              {moodboard.is_main_moodboard && similar.length > 0 && (
                <div className="w-full max-w-[1856px] mt-12">
                  <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
                    Similar Shoots
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {similar.slice(0, 2).map((similarMoodboard) => (
                      <Card 
                        key={similarMoodboard.id}
                        className="relative h-[345px] bg-white shadow-lg cursor-pointer overflow-hidden"
                        onClick={() => router.push(`/moodboard/${similarMoodboard.id}`)}
                      >
                        <MoodboardImage
                          moodboard={similarMoodboard}
                          category="main"
                          alt={similarMoodboard.name}
                          className="w-full h-full"
                        />
                        
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50" />
                        
                        {/* Text Content */}
                        <div className="absolute bottom-12 left-7 text-white z-10">
                          <h3 
                            className="text-3xl font-bold mb-3"
                            style={{ fontFamily: 'SF Pro Display, sans-serif' }}
                          >
                            {similarMoodboard.name}
                          </h3>
                          <p 
                            className="text-lg font-medium text-white text-opacity-70"
                            style={{ fontFamily: 'SF Pro, sans-serif' }}
                          >
                            View Board &gt;
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Selection Section - Only show if moodboard can be booked */}
              {canBookMoodboard && (
                <div data-models-section className="w-full max-w-[1856px] mt-12">
                  <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
                    Select Models
                  </h2>
                  
                  {/* Models Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map((model) => (
                      <Card 
                        key={model.id}
                        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
                          selectedModels.includes(model.id) 
                            ? 'ring-2 ring-green-500 shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => toggleModelSelection(model.id)}
                      >
                        {/* Model Image */}
                        <div className="relative aspect-[4/5]">
                          <ModelImage
                            model={model}
                            alt={model.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Model Details */}
                        <div className="p-4">
                          <h3 
                            className="text-xl font-bold mb-2"
                            style={{ fontFamily: 'SF Pro Display, sans-serif' }}
                          >
                            {model.name}
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Height */}
                            <div className="flex flex-col">
                              <span 
                                className="text-sm font-medium text-[#4D4D4D]"
                                style={{ fontFamily: 'SF Pro, sans-serif' }}
                              >
                                Height
                              </span>
                              <span 
                                className="text-base font-medium text-[#151515]"
                                style={{ fontFamily: 'Jost, sans-serif' }}
                              >
                                {model.height}
                              </span>
                            </div>

                            {/* Gender */}
                            <div className="flex flex-col">
                              <span 
                                className="text-sm font-medium text-[#4D4D4D]"
                                style={{ fontFamily: 'SF Pro, sans-serif' }}
                              >
                                Gender
                              </span>
                              <span 
                                className="text-base font-medium text-[#151515]"
                                style={{ fontFamily: 'Jost, sans-serif' }}
                              >
                                F
                              </span>
                            </div>
                          </div>

                          {/* Select Button */}
                          <Button
                            className={`w-full h-11 mt-4 ${
                              selectedModels.includes(model.id) 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-[#151515] hover:bg-gray-800'
                            } text-white flex items-center justify-center gap-2`}
                            style={{ fontFamily: 'SF Pro, sans-serif' }}
                          >
                            <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center">
                              {selectedModels.includes(model.id) && (
                                <div className="w-3 h-3 bg-white" />
                              )}
                            </div>
                            <span className="text-base font-medium">
                              {selectedModels.includes(model.id) ? 'Selected' : 'Select'}
                            </span>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Upgrade Button */}
                  <Button 
                    onClick={() => setShowMarketplace(true)}
                    className="w-full h-12 bg-[#151515] text-white flex items-center justify-center gap-3 hover:bg-gray-800 mt-8"
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ fontFamily: 'SF Pro Display, sans-serif' }}
                    >
                      Upgrade Your Model
                    </span>
                    <WandSparkles className="w-6 h-6" />
                  </Button>
                </div>
              )}

              {/* Others Also Viewed Section */}
              <div className="flex flex-col items-center px-8 gap-7 py-12 w-full max-w-[1856px]">
                
                {/* Heading */}
                <div className="w-full flex items-center">
                  <h2 
                    className="text-3xl font-bold text-[#151515]"
                    style={{ fontFamily: 'SF Pro, sans-serif' }}
                  >
                    Others also viewed
                  </h2>
                </div>

                {/* Relevant Shoots */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {similar?.slice(0, 2).map((relevantMoodboard) => (
                    <Card 
                      key={relevantMoodboard.id}
                      className="relative h-[345px] bg-white shadow-lg cursor-pointer overflow-hidden"
                      onClick={() => router.push(`/moodboard/${relevantMoodboard.id}`)}
                    >
                      <MoodboardImage
                        moodboard={relevantMoodboard}
                        category="main"
                        alt={relevantMoodboard.name}
                        className="w-full h-full"
                      />
                      
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50" />
                      
                      {/* Text Content */}
                      <div className="absolute bottom-12 left-7 text-white z-10">
                        <h3 
                          className="text-3xl font-bold mb-3"
                          style={{ fontFamily: 'SF Pro Display, sans-serif' }}
                        >
                          {relevantMoodboard.name}
                        </h3>
                        <p 
                          className="text-lg font-medium text-white text-opacity-70"
                          style={{ fontFamily: 'SF Pro, sans-serif' }}
                        >
                          View Board &gt;
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Separator Line */}
              <div className="w-full h-0.5 bg-[#DEDEDE]" />

              {/* Booking Summary Section - Only show if moodboard can be booked */}
              {canBookMoodboard && (
                <div className="flex flex-col items-start gap-2 px-8 py-12">
                  <div className="flex flex-col justify-center items-start max-w-[866px] gap-3">
                    
                    {/* Moodboard Title */}
                    <div className="flex flex-col items-start gap-2 w-full">
                      <h2 
                        className="text-4xl font-bold text-[#081116]"
                        style={{ fontFamily: 'SF Pro, sans-serif' }}
                      >
                        {moodboard.name}
                      </h2>
                      <p 
                        className="text-lg font-medium text-[#4D4D4D]"
                        style={{ fontFamily: 'SF Pro, sans-serif' }}
                      >
                        Any additional customization will be considered only after the advanced payment is received.
                      </p>
                    </div>

                    {/* Booking Details */}
                    <div className="flex flex-col justify-center items-start py-4 gap-4 w-full max-w-[840px]">
                      
                      {/* Heading */}
                      <div className="flex justify-between items-center gap-3">
                        <Camera className="w-7 h-7 text-black" />
                        <h3 
                          className="text-2xl font-bold text-[#081116]"
                          style={{ fontFamily: 'SF Pro, sans-serif' }}
                        >
                          Booking Details
                        </h3>
                      </div>

                      {/* Shoot Date */}
                      <div className="flex items-start gap-3 w-full">
                        <Calendar className="w-5 h-5 text-[#4D4D4D]" />
                        <span 
                          className="text-lg font-medium text-[#0D0E12] tracking-wide"
                          style={{ fontFamily: 'SF Pro, sans-serif' }}
                        >
                          Shoots date: {format(new Date(moodboard.date || '2025-07-06'), 'MMMM d, yyyy')}
                        </span>
                      </div>

                      {/* Shoot Title */}
                      <div className="flex flex-col items-start gap-2 w-full">
                        <h4 
                          className="text-lg font-bold text-[#171717]"
                          style={{ fontFamily: 'SF Pro, sans-serif' }}
                        >
                          Fashion Editorial - {moodboard.name}
                        </h4>
                      </div>

                      {/* Model Selection Required */}
                      {selectedModels.length === 0 && (
                        <div className="flex items-center px-8 py-7 gap-2 w-full max-w-[650px] bg-orange-50 border border-orange-200 rounded">
                          <div className="flex flex-col items-start gap-2">
                            <Users className="w-6 h-6 text-[#92400E]" />
                          </div>
                          
                          <div className="flex flex-col items-start gap-2 flex-1">
                            <h5 
                              className="text-lg font-bold text-[#92400E]"
                              style={{ fontFamily: 'SF Pro, sans-serif' }}
                            >
                              Model Selection Required
                            </h5>
                            <p 
                              className="text-lg font-medium text-[#92400E]"
                              style={{ fontFamily: 'SF Pro, sans-serif' }}
                            >
                              Please select your models before proceeding with payment.
                            </p>
                            <button 
                              className="text-lg font-medium text-[#92400E] underline cursor-pointer"
                              style={{ fontFamily: 'SF Pro, sans-serif' }}
                              onClick={() => document.querySelector('[data-models-section]')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                              Select Models Now
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Booking Button */}
                      <Button
                        onClick={handleBooking}
                        disabled={selectedModels.length === 0}
                        className="w-full max-w-[556px] h-12 bg-[#151515] text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* Animated background gradients */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#508FFF] to-white opacity-20 blur-lg" />
                        
                        <span 
                          className="relative z-10 text-lg font-bold"
                          style={{ fontFamily: 'SF Pro Display, sans-serif' }}
                        >
                          Book Slot & Pay Deposit
                        </span>
                      </Button>

                      {/* Terms */}
                      <p 
                        className="text-xs font-normal text-[#081116] max-w-[282px]"
                        style={{ fontFamily: 'SF Pro Display, sans-serif' }}
                      >
                        By proceeding, you agree to our terms and conditions. Deposit is non-refundable within 48 hours of shoot date.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Models Marketplace Modal */}
      <Dialog open={showMarketplace} onOpenChange={setShowMarketplace}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Premium Models Marketplace</DialogTitle>
          </DialogHeader>
          
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search models..."
                value={marketplaceSearch}
                onChange={(e) => setMarketplaceSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={marketplaceFilters.gender} onValueChange={(value) => setMarketplaceFilters(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-2 gap-4">
            {models.map((model) => (
              <Card key={model.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden">
                    <ModelImage
                      model={model}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{model.name}</h3>
                    <p className="text-sm text-gray-600">{model.height}</p>
                  </div>
                  <Button size="sm">Select</Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 