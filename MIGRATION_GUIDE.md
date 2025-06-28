# Database Migration Guide

This guide will help you add the missing fields to your Supabase database.

## Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `lib/db/migration.sql`
4. Click **Run** to execute the migration

## Option 2: Command Line (If you have service role key)

1. Make sure you have the following environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the migration script:
   ```bash
   pnpm migrate
   ```

## Option 3: Manual SQL Execution

If the above options don't work, you can run these SQL statements one by one in the Supabase SQL Editor:

### Add fields to moodboards table:
```sql
ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS liner TEXT;

ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS date DATE;

ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS model_count INTEGER DEFAULT 1;

ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS is_booked BOOLEAN DEFAULT false;

ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS look_feel_images TEXT[];

ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS mood_shots TEXT[];

ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS hair_makeup_images TEXT[];
```

### Add fields to models table:
```sql
ALTER TABLE models 
ADD COLUMN IF NOT EXISTS one_liner TEXT;

ALTER TABLE models 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
```

### Update existing records:
```sql
UPDATE moodboards 
SET model_count = 1 
WHERE model_count IS NULL;

UPDATE moodboards 
SET is_booked = false 
WHERE is_booked IS NULL;
```

## Verification

After running the migration, you can verify it worked by:

1. Going to **Table Editor** in your Supabase dashboard
2. Checking that the `moodboards` and `models` tables have the new columns
3. Running your application to ensure no more type errors

## Troubleshooting

### If you get permission errors:
- Make sure you're using the **service role key** (not the anon key)
- Check that your RLS policies allow the operations

### If columns already exist:
- The `IF NOT EXISTS` clause will prevent errors if columns already exist
- You can safely run the migration multiple times

### If you need to rollback:
- You can drop columns using `ALTER TABLE table_name DROP COLUMN column_name;`
- Be careful as this will lose data

## Next Steps

After the migration:
1. Restart your development server: `pnpm dev`
2. Test the application to ensure everything works
3. Consider adding some sample data through the admin panel at `/admin` 