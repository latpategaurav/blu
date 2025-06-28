-- Migration to add missing fields to existing tables
-- Run this against your Supabase database

-- Add missing fields to moodboards table
ALTER TABLE moodboards 
ADD COLUMN IF NOT EXISTS liner TEXT,
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS model_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_booked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS look_feel_images TEXT[],
ADD COLUMN IF NOT EXISTS mood_shots TEXT[],
ADD COLUMN IF NOT EXISTS hair_makeup_images TEXT[];

-- Add missing fields to models table
ALTER TABLE models 
ADD COLUMN IF NOT EXISTS one_liner TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Update existing records to have default values where needed
UPDATE moodboards 
SET model_count = 1 
WHERE model_count IS NULL;

UPDATE moodboards 
SET is_booked = false 
WHERE is_booked IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN moodboards.liner IS 'Short tagline/liner text';
COMMENT ON COLUMN moodboards.date IS 'Scheduled date for the moodboard';
COMMENT ON COLUMN moodboards.model_count IS 'Number of models in this moodboard';
COMMENT ON COLUMN moodboards.is_booked IS 'Whether moodboard is booked';
COMMENT ON COLUMN moodboards.look_feel_images IS 'Array of look & feel image URLs';
COMMENT ON COLUMN moodboards.mood_shots IS 'Array of mood shot image URLs';
COMMENT ON COLUMN moodboards.hair_makeup_images IS 'Array of hair & makeup image URLs';

COMMENT ON COLUMN models.one_liner IS 'Short tagline/one liner';
COMMENT ON COLUMN models.price IS 'Model price (optional, for UI)'; 