import { Calendar, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Loading() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-3/5 bg-gray-200 rounded-md animate-pulse mb-2" />
          <div className="h-6 w-4/5 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-[200px] bg-gray-200 rounded-md animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Grid View Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="relative aspect-[4/5] bg-gray-200" />
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 