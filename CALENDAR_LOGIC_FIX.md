# Calendar Logic Fix - 30-Day Challenge Structure

## Issue Summary

The calendar logic had a confusion about which moodboards to show. The system was incorrectly filtering moodboards based on booking status rather than showing ALL moodboards assigned to specific days in the 30-day challenge.

## Business Requirements Clarification

### 30-Day Challenge Structure
- **6 weeks** of **5-day shoots** (Monday-Friday)
- **30 main moodboards** assigned to specific days (1-30)
- **Extra similar moodboards** for recommendations (not tied to specific days)
- **No moodboard repetition** in production
- **Test environment** can reuse images with unique names

### Calendar Display Logic
- Show **ALL main moodboards** assigned to specific days regardless of booking status
- **Booked moodboards** should be visible but marked as "Booked" and non-clickable
- **Available moodboards** should be clickable and lead to booking flow
- **Similar moodboards** are for recommendations only, not shown in calendar

### Moodboard Relationships
- **Main moodboards**: Assigned to specific days (1-30), shown in calendar
- **Similar moodboards**: Extra moodboards for recommendations, shown in moodboard detail pages
- **Booking flow**: Only available for unbooked main moodboards

## Technical Implementation

### 1. Enhanced Data Structure

Updated `MoodboardData` interface in `lib/data/moodboard-cache.ts`:

```typescript
export interface MoodboardData {
  // ... existing fields ...
  
  // Enhanced fields for 30-day challenge
  day_number?: number          // 1-30 for main moodboards assigned to days
  week_number?: number         // 1-6 weeks
  is_main_moodboard?: boolean  // True if assigned to a specific day
  is_similar_moodboard?: boolean // True if used for recommendations only
  linked_moodboard?: number    // ID of main moodboard this is similar to
}
```

### 2. Updated Cache Functions

#### `getMoodboards()`
- Enhanced to automatically assign day numbers (1-30) to first 30 moodboards
- Marks first 30 as `is_main_moodboard: true`
- Marks remaining as `is_similar_moodboard: true`

#### `getCalendarMoodboards()`
- **Fixed**: Now returns only main moodboards assigned to specific days
- **Before**: Filtered by `isPublic` and `status`
- **After**: Filters by `is_main_moodboard`, `isPublic`, and `status`

#### `getSimilarMoodboards()`
- New function to get similar moodboards for a specific main moodboard
- Uses the `recommended` array to find related moodboards

### 3. Updated Calendar Page (`app/calendar/page.tsx`)

#### Key Changes:
- **Enhanced moodboard loading**: Adds day numbers and main/similar flags
- **Updated filtering**: `getMoodboardsForDay()` now filters by `is_main_moodboard`
- **Improved display logic**: Shows all day-assigned moodboards regardless of booking status
- **Better booking status handling**: Clear visual indicators for booked vs available

#### New Features:
- **Week navigation**: Proper week number calculation
- **Booking status indicators**: Visual badges for booked moodboards
- **Click handling**: Only allows clicking on unbooked moodboards

### 4. Updated Moodboard Detail Page (`app/moodboard/[id]/page.tsx`)

#### Key Changes:
- **Booking validation**: Prevents booking of already booked moodboards
- **Conditional sections**: Only shows booking flow for available moodboards
- **Similar moodboards**: Only shows similar section for main moodboards
- **Enhanced type safety**: Proper handling of new moodboard structure

### 5. Updated API Endpoints

#### `app/api/moodboards/calendar/route.ts`
- Returns only main moodboards assigned to specific days
- Updated documentation for 30-day challenge structure

#### `app/api/moodboards/discover/route.ts`
- Added `main_only` filter parameter
- Can show all moodboards or filter to main moodboards only

#### `app/api/moodboards/similar/route.ts` (New)
- New endpoint for getting similar moodboards
- Takes `main_id` parameter to find related moodboards

#### `app/api/moodboards/[id]/route.ts`
- Updated to return moodboard details with proper structure
- Enhanced error handling and validation

### 6. Updated Hooks (`lib/hooks/use-moodboards.ts`)

#### New Hooks:
- `useSimilarMoodboards()`: For fetching similar moodboards
- Enhanced `useMoodboardDetails()`: Handles main vs similar moodboard logic

#### Updated Hooks:
- `useCalendarMoodboards()`: Now returns only main moodboards
- `useDiscoverMoodboards()`: Added filtering options

### 7. Updated Discover Page (`app/discover/page.tsx`)

#### Key Changes:
- **Enhanced filtering**: Added main moodboard filter
- **Better visual indicators**: Shows main vs similar moodboard badges
- **Improved stats**: Shows counts for main vs similar moodboards
- **Enhanced search**: Works with new moodboard structure

## Data Flow Summary

### Calendar View
1. Load all moodboards with enhanced structure
2. Filter to show only `is_main_moodboard: true` moodboards
3. Display by date regardless of booking status
4. Show booking status with visual indicators
5. Allow clicking only on unbooked moodboards

### Moodboard Detail View
1. Load moodboard details
2. If `is_main_moodboard: true`, fetch similar moodboards
3. Show booking flow only if `isBooked: false`
4. Display similar moodboards section only for main moodboards

### Discover View
1. Load all moodboards (main + similar)
2. Apply filters (search, tags, availability, type)
3. Show appropriate badges and indicators
4. Allow clicking on available moodboards

## Testing Considerations

### Calendar Logic
- ✅ Shows all 30 main moodboards assigned to days
- ✅ Displays booked moodboards with proper indicators
- ✅ Only allows clicking on available moodboards
- ✅ Proper week navigation (6 weeks, 5 days each)

### Moodboard Relationships
- ✅ Main moodboards show similar moodboards
- ✅ Similar moodboards don't show in calendar
- ✅ Proper filtering in discover view
- ✅ Correct API responses for different contexts

### Booking Flow
- ✅ Prevents booking of already booked moodboards
- ✅ Shows booking status clearly
- ✅ Proper validation and error handling

## Migration Notes

### For Production
- Ensure moodboards 1-30 are properly assigned to specific days
- Verify `recommended` arrays contain valid moodboard IDs
- Test booking flow with both available and booked moodboards
- Validate calendar navigation across all 6 weeks

### For Testing
- Can reuse images but ensure unique names
- Test with various booking statuses
- Verify similar moodboard relationships work correctly
- Test all filtering options in discover view

## Future Enhancements

1. **Admin Panel**: Add interface to manage main vs similar moodboard assignments
2. **Dynamic Similar Moodboards**: Algorithm-based recommendations
3. **Week-based Navigation**: Direct navigation to specific weeks
4. **Booking Analytics**: Track which moodboards are most popular
5. **Similar Moodboard Management**: Admin tools for managing recommendations 