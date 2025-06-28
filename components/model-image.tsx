/**
 * Simple Model Image Component
 * Handles loading states and fallbacks for /public/models images
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ModelData } from '@/lib/data/moodboard-cache'

interface ModelImageProps {
  model: ModelData
  type?: 'profile' | 'portfolio'
  index?: number
  alt?: string
  className?: string
  priority?: boolean
}

export function ModelImage({
  model,
  type = 'profile',
  index = 0,
  alt,
  className = '',
  priority = false
}: ModelImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Generate image URL based on type
  function getImageUrl(): string {
    const baseFolder = `/models`
    const modelFolder = `${model.id}_${model.name.replace(/[^a-zA-Z0-9]/g, '')}`
    
    switch (type) {
      case 'profile':
        // Try to use existing profile image first, then fallback to folder structure
        if (model.images && model.images.length > 0) {
          return model.images[0]
        }
        return `${baseFolder}/${modelFolder}/profile.jpg`
      
      case 'portfolio':
        // Portfolio images from the images array or folder
        if (model.images && model.images[index]) {
          return model.images[index]
        }
        return `${baseFolder}/${modelFolder}/portfolio-${index + 1}.jpg`
      
      default:
        return `${baseFolder}/default-model.jpg`
    }
  }

  const imageUrl = getImageUrl()
  const imageAlt = alt || `${model.name} - ${type} image`

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm text-center p-4">
          <div className="text-2xl mb-2">👤</div>
          <div>Image not available</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
        priority={priority}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

/**
 * Model card component with proper image handling
 */
interface ModelCardProps {
  model: ModelData
  selected?: boolean
  onSelect?: () => void
  className?: string
}

export function ModelCard({ 
  model, 
  selected = false,
  onSelect,
  className = ''
}: ModelCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
        selected ? 'ring-2 ring-black' : ''
      } ${onSelect ? 'cursor-pointer hover:shadow-lg' : ''} ${className}`}
      onClick={onSelect}
    >
      {/* Model Image */}
      <div className="aspect-[3/4] relative">
        <ModelImage
          model={model}
          type="profile"
          alt={model.name}
          className="w-full h-full"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-black px-2 py-1 text-xs text-white">
          {model.modelCategory || 'MODEL'}
        </div>
        
        {/* Availability Badge */}
        {model.status === 'COMING' && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 border border-gray-400 px-2 py-1 text-xs text-white">
            available
          </div>
        )}
      </div>
      
      {/* Model Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
        
        <div className="text-sm text-gray-600 mb-2">
          <p>{model.height} • {model.modelCategory}</p>
          {model.agency && <p className="text-xs">Agency: {model.agency}</p>}
        </div>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {model.bio}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            ₹{model.ratePerDay?.toLocaleString() || '15,000'}/day
          </span>
          
          {model.instagram && (
            <a 
              href={model.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 