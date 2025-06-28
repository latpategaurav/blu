/**
 * Simple Moodboard Image Component
 * Handles loading states and fallbacks for /public/moodboards images
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { MoodboardData } from '@/lib/data/moodboard-cache'

interface MoodboardImageProps {
  moodboard: MoodboardData
  category?: 'main' | 'look-feel' | 'mood-shots' | 'hair-makeup'
  index?: number
  alt?: string
  className?: string
  priority?: boolean
}

export function MoodboardImage({
  moodboard,
  category = 'main',
  index = 0,
  alt,
  className = '',
  priority = false
}: MoodboardImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Generate image URL based on category
  function getImageUrl(): string {
    const baseFolder = `/moodboards/${moodboard.id}_${moodboard.name.replace(/[^a-zA-Z0-9]/g, '')}`
    
    switch (category) {
      case 'main':
        return moodboard.coverImageUrl.startsWith('/') 
          ? moodboard.coverImageUrl 
          : `/${moodboard.coverImageUrl}`
      case 'look-feel':
        return `${baseFolder}/look-feel-${index + 1}.jpg`
      case 'mood-shots':
        return `${baseFolder}/mood-${index + 1}.jpg`
      case 'hair-makeup':
        return `${baseFolder}/makeup-${index + 1}.jpg`
      default:
        return moodboard.coverImageUrl
    }
  }

  // Fallback image URL
  const fallbackUrl = error ? '/placeholder.jpg' : getImageUrl()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={fallbackUrl}
        alt={alt || `${moodboard.name} ${category} image`}
        fill
        className={`object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
      />
      
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  )
}

/**
 * Simple moodboard card component
 */
interface MoodboardCardProps {
  moodboard: MoodboardData
  className?: string
  onClick?: () => void
}

export function MoodboardCard({ 
  moodboard, 
  className = '',
  onClick 
}: MoodboardCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative">
        <MoodboardImage
          moodboard={moodboard}
          category="main"
          alt={moodboard.name}
          className="w-full h-full"
        />
        
        {/* Booking overlay */}
        {moodboard.isBooked && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            {moodboard.clientInitial || 'Booked'}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{moodboard.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {moodboard.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {moodboard.themeTags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="text-sm text-gray-500">
          {new Date(moodboard.date).toLocaleDateString()} • {moodboard.modelIds.length} models
        </div>
      </div>
    </div>
  )
} 