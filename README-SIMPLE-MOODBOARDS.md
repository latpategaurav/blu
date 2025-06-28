# Simple Moodboard System

A straightforward, JSON-based moodboard system with smart caching. No complex database operations, just fast access to your moodboard data.

## 🎯 Simple Approach

- **📁 JSON Files**: Store all data in simple JSON files
- **🖼️ Public Images**: Images served directly from `/public/moodboards/`
- **⚡ Smart Caching**: 15-minute in-memory cache for fast access
- **🔌 Clean APIs**: Simple REST endpoints for data access

## 📂 File Structure

```
/data/
├── moodboards.json          # All moodboard data
└── models.json              # All model data

/public/moodboards/
├── 1_Sunny/
│   ├── main.jpg             # Main image
│   ├── look-feel/           # Additional images
│   └── mood-shots/
└── 2_WhispersOfSpring/
    └── main.jpg

/lib/data/
└── moodboard-cache.ts       # Simple caching system

/app/api/moodboards/
├── calendar/route.ts        # Calendar data
├── discover/route.ts        # Discover with filters
├── search/route.ts          # Search functionality
├── all/route.ts             # All moodboards (admin)
└── [id]/route.ts            # Individual moodboard
```

## 🚀 Quick Start

### 1. Your Data Structure (Enhanced)

Your existing `moodboards.json` works as-is. The system automatically adds:

```json
{
  "id": 1,
  "name": "Sunny",
  "description": "A bright concept...",
  "date": "2025-07-01",
  "coverImageUrl": "/moodboards/1_Sunny.png",
  "modelIds": [1, 2, 3],
  "themeTags": ["bright", "summer"],
  "isBooked": false,
  "recommended": [10, 24],
  
  // Auto-calculated fields
  "day_number": 1,
  "week_number": 1,
  "status": "published",
  "booking_price": 50000
}
```

### 2. Simple Image Organization

```
/public/moodboards/
├── 1_Sunny/main.jpg          # Use existing images
├── 2_WhispersOfSpring/main.jpg
└── default.jpg               # Fallback image
```

### 3. Use in Your Components

```tsx
import { useCalendarMoodboards } from '@/lib/hooks/use-moodboards'
import { MoodboardCard } from '@/components/moodboard-image'

function CalendarView() {
  const { data: moodboards, loading } = useCalendarMoodboards(6)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {moodboards.map(moodboard => (
        <MoodboardCard 
          key={moodboard.id} 
          moodboard={moodboard}
          onClick={() => router.push(`/moodboard/${moodboard.id}`)}
        />
      ))}
    </div>
  )
}
```

## 📊 Available Hooks

```tsx
// Calendar view (weekly layout)
const { data, loading, error } = useCalendarMoodboards(6)

// Discover view (with filtering)
const { data, loading, hasMore, loadMore } = useDiscoverMoodboards(20, ['retro', 'vintage'])

// Individual moodboard with models and similar moodboards
const { data, loading, error } = useMoodboardDetails(1)

// Search functionality
const { data, loading, error } = useSearchMoodboards('sunny')

// All moodboards (admin)
const { data, loading, error } = useAllMoodboards()
```

## 🔧 API Endpoints

```typescript
// Get calendar moodboards
GET /api/moodboards/calendar?weeks=6

// Get discover moodboards with filters
GET /api/moodboards/discover?limit=20&offset=0&tags=retro,vintage

// Get moodboard details
GET /api/moodboards/1

// Search moodboards
GET /api/moodboards/search?q=sunny

// Get all moodboards (admin)
GET /api/moodboards/all
```

## 🖼️ Image Component

```tsx
import { MoodboardImage } from '@/components/moodboard-image'

// Main moodboard image
<MoodboardImage 
  moodboard={moodboard}
  category="main"
  className="w-full h-64"
  priority
/>

// Additional images
<MoodboardImage 
  moodboard={moodboard}
  category="look-feel"
  index={0}
  className="w-32 h-24"
/>
```

## ⚡ Caching Strategy

- **15-minute in-memory cache** for all data
- **HTTP cache headers** for browser/CDN caching
- **Automatic cache busting** when data changes
- **Cache stats** for monitoring

```typescript
import { getCacheStats, clearCache } from '@/lib/data/moodboard-cache'

// Monitor cache performance
console.log(getCacheStats())

// Clear cache when updating data
clearCache()
```

## 📈 Benefits

✅ **Super Simple**: No complex database setup  
✅ **Fast**: 15-minute caching makes everything instant  
✅ **Direct Image Access**: Images served from `/public` - no cloud complexity  
✅ **Easy to Update**: Just edit JSON files  
✅ **Type Safe**: Full TypeScript support  
✅ **Scalable**: Handles your 30 + 100+ moodboards easily  

## 🛠️ Extending the System

### Add New Fields
Just add to your JSON and update the TypeScript types:

```json
{
  "id": 1,
  "customField": "new value"
}
```

### Add New Image Categories
```tsx
<MoodboardImage 
  moodboard={moodboard}
  category="behind-scenes"  // New category
  className="w-full h-48"
/>
```

### Custom Filtering
```tsx
const { data } = useDiscoverMoodboards(20, ['summer', 'bright'])
```

## 🎨 Example Implementation

```tsx
// Calendar Page
export default function CalendarPage() {
  const { data: moodboards, loading } = useCalendarMoodboards()
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shoot Calendar</h1>
      
      {loading ? (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-48 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {moodboards.map(moodboard => (
            <MoodboardCard 
              key={moodboard.id}
              moodboard={moodboard}
              className="h-48"
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Moodboard Details Page
export default function MoodboardPage({ params }: { params: { id: string } }) {
  const { data, loading } = useMoodboardDetails(parseInt(params.id))
  
  if (loading) return <div>Loading...</div>
  if (!data) return <div>Moodboard not found</div>
  
  const { moodboard, models, similar } = data
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{moodboard.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{moodboard.description}</p>
      
      {/* Main Image */}
      <div className="mb-8">
        <MoodboardImage 
          moodboard={moodboard}
          category="main"
          className="w-full h-96 rounded-lg"
          priority
        />
      </div>
      
      {/* Models */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map(model => (
            <div key={model.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{model.name}</h3>
              <p className="text-sm text-gray-600">{model.height} • {model.modelCategory}</p>
              <p className="text-sm mt-2">{model.bio}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Similar Moodboards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Similar Shoots</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similar.map(similarMoodboard => (
            <MoodboardCard 
              key={similarMoodboard.id}
              moodboard={similarMoodboard}
              className="h-32"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 🚀 Ready to Use

This system is production-ready and gives you:
- Fast, cached access to all moodboard data
- Simple image serving from `/public`
- Clean TypeScript interfaces
- Easy-to-use React hooks
- Flexible API endpoints

Just add your images to `/public/moodboards/` and start using the hooks in your components! 

## 🖼️ Model Images

Models follow the same simple pattern as moodboards - images served directly from `/public/models/`:

### Model Image Structure

```
/public/models/
├── 1_KunalSh/
│   ├── profile.jpg          # Main profile image
│   ├── portfolio-1.jpg      # Portfolio images
│   ├── portfolio-2.jpg
│   └── portfolio-3.jpg
├── 2_ArjunNijwan/
│   └── profile.jpg
└── default-model.jpg        # Fallback image
```

### Model Image Component

```tsx
import { ModelImage, ModelCard } from '@/components/model-image'

// Simple model image
<ModelImage 
  model={model}
  type="profile"
  className="w-full h-64"
/>

// Model card with all details
<ModelCard 
  model={model}
  selected={isSelected}
  onSelect={() => handleSelect(model.id)}
/>
```

### Model Hooks

```tsx
// Get models by category
const { data: newFaces } = useModelsByCategory('NEW FACE')

// Search models
const { data: searchResults } = useSearchModels('Mumbai')

// Get available models for a date
const { data: available } = useAvailableModels('2025-07-06')
```

### Model API Endpoints

```typescript
// Get all models or filter by category
GET /api/models?category=NEW%20FACE

// Search models
GET /api/models/search?q=mumbai

// Response includes enhanced image paths
{
  "id": 1,
  "name": "Kunal Sh",
  "profile_image": "/models/1_KunalSh/profile.jpg",
  "portfolio_folder": "/models/1_KunalSh/",
  // ... other model data
}
``` 