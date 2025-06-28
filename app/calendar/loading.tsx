import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Loading() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse mb-2" />
          <div className="h-6 w-80 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Week Navigation Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" disabled>
            <Calendar className="w-4 h-4 mr-2" />
            Month View (Coming Soon)
          </Button>
        </div>

        {/* Week View Skeleton */}
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-6">
                <div className="w-32 flex-shrink-0">
                  <div className="h-8 w-12 bg-gray-200 rounded-md animate-pulse mb-2" />
                  <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <Card key={j} className="animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 