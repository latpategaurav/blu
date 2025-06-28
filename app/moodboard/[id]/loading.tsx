import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Loading() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left side: Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Right side: Booking Form Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-10 w-3/4 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-5 w-1/2 bg-gray-200 rounded-md animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
            
            <Card className="p-6 space-y-4">
              <div className="h-8 w-1/3 bg-gray-200 rounded-md animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-2 animate-pulse space-y-2">
                    <div className="h-16 w-full bg-gray-200 rounded-md" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
                  </div>
                ))}
              </div>
            </Card>

            <Button size="lg" className="w-full h-12 animate-pulse" disabled />
          </div>
        </div>
      </div>
    </div>
  )
} 