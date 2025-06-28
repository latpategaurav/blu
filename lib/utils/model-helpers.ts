/**
 * Helper functions for model images and data
 * Provides utilities for working with model images in /public/models/
 */

import type { ModelData } from '@/lib/data/moodboard-cache'

/**
 * Generate model image paths with proper fallbacks
 */
export function getModelImagePaths(model: ModelData) {
  const baseFolder = `/models`
  const modelFolder = `${model.id}_${model.name.replace(/[^a-zA-Z0-9]/g, '')}`
  
  return {
    profile: `${baseFolder}/${modelFolder}/profile.jpg`,
    portfolio: [
      `${baseFolder}/${modelFolder}/portfolio-1.jpg`,
      `${baseFolder}/${modelFolder}/portfolio-2.jpg`,
      `${baseFolder}/${modelFolder}/portfolio-3.jpg`
    ],
    fallback: `${baseFolder}/default-model.jpg`
  }
}

/**
 * Create clean folder name for model images
 */
export function createModelFolderName(model: ModelData): string {
  return `${model.id}_${model.name.replace(/[^a-zA-Z0-9]/g, '')}`
}

/**
 * Get model stats formatted for display
 */
export function formatModelStats(model: ModelData) {
  const parts = model.stats?.split(' ') || []
  
  return {
    bust: parts[0] || '-',
    waist: parts[1] || '-',
    hips: parts[2] || '-',
    formatted: model.stats || 'Not specified'
  }
}

/**
 * Format model category for display
 */
export function getModelCategoryBadge(category: string): {
  label: string
  className: string
} {
  const categories: Record<string, { label: string; className: string }> = {
    'NEW FACE': { 
      label: 'NEW FACE', 
      className: 'bg-green-600 text-white' 
    },
    'MODEL CATEGORY': { 
      label: 'EXPERIENCED', 
      className: 'bg-black text-white' 
    },
    'PLUS SIZE': { 
      label: 'PLUS SIZE', 
      className: 'bg-purple-600 text-white' 
    },
    'TIMELESS': { 
      label: 'TIMELESS', 
      className: 'bg-amber-600 text-white' 
    },
    'GENDER FLUID': { 
      label: 'GENDER FLUID', 
      className: 'bg-indigo-600 text-white' 
    }
  }
  
  return categories[category] || { 
    label: category, 
    className: 'bg-gray-600 text-white' 
  }
}

/**
 * Check if model is available for booking
 */
export function isModelAvailable(model: ModelData): boolean {
  return model.status === 'COMING' || model.status === 'COMMING' // Handle typo in data
}

/**
 * Get model location from data
 */
export function getModelLocation(model: ModelData): string {
  return model.location || 'Mumbai'
}

/**
 * Example image folder structure for models:
 * 
 * /public/models/
 * ├── 1_KunalSh/
 * │   ├── profile.jpg
 * │   ├── portfolio-1.jpg
 * │   ├── portfolio-2.jpg
 * │   └── portfolio-3.jpg
 * ├── 2_ArjunNijwan/
 * │   └── profile.jpg
 * └── default-model.jpg
 */ 