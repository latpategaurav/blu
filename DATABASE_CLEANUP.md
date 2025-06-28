# Database Setup Instructions for Supabase Auth Integration

## Overview
Your 303030 application now uses **Supabase Auth** for authentication with Twilio as the SMS provider. This provides a more secure, scalable, and production-ready authentication system.

## Step 1: Clean Up Existing Database (if any)

Run this SQL in your Supabase SQL Editor to clean up any existing tables:

```sql
-- Drop all existing tables (if any)
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS similar_moodboards CASCADE;
DROP TABLE IF EXISTS moodboard_models CASCADE;
DROP TABLE IF EXISTS moodboards CASCADE;
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

## Step 2: Create New Schema

After cleaning up, run the entire content of `lib/db/schema.sql` in your Supabase SQL Editor. This will create:

- **profiles** table (links to Supabase Auth users)
- **models** table (for model management)
- **moodboards** table (for moodboard management)
- **bookings** table (for booking records)
- **payments** table (for payment tracking)
- **notifications** table (for system notifications)
- **settings** table (for app configuration)
- All necessary RLS policies and triggers

## Step 3: Configure Supabase Auth

### Phone Auth Setup
1. Go to your Supabase Dashboard → Authentication → Providers
2. Enable **Phone Auth**
3. Select **Twilio** as the SMS provider
4. Add your Twilio credentials:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`

### RLS Policies
The schema includes comprehensive RLS policies that:
- Allow users to manage their own profiles
- Allow public read access to active models and moodboards
- Restrict admin operations to users with admin role
- Secure all booking and payment data

## Step 4: Test Authentication

### Development Testing
Use the test OTP feature in Supabase:
- Go to Authentication → Settings → Phone Auth
- Enable "Test OTP" for development
- Use the test phone number: `919359992008` with OTP: `123321`

### Production Setup
1. Disable test OTP in production
2. Configure rate limits and CAPTCHA in Supabase Auth settings
3. Ensure compliance with local SMS regulations (especially India's TRAI/DLT)

## Step 5: Verify Setup

After running the schema, verify these tables exist:
```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'models', 'moodboards', 'bookings', 'payments', 'notifications', 'settings');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'models', 'moodboards', 'bookings', 'payments', 'notifications', 'settings');
```

## Key Changes from Previous Version

### ✅ What's New
- **Supabase Auth Integration**: Uses `auth.users` table for authentication
- **Profiles Table**: Stores additional user info linked to `auth.users`
- **Twilio SMS Provider**: Configured through Supabase Auth
- **Automatic Profile Creation**: Profiles are created when users sign up
- **Enhanced RLS**: More granular security policies

### ❌ What's Removed
- Custom `users` table (replaced by `auth.users`)
- Custom OTP verification logic (handled by Supabase Auth)
- Custom session management (handled by Supabase Auth)
- Custom Twilio integration (configured in Supabase Auth)

## Environment Variables

Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Twilio credentials are now managed in Supabase Auth settings, not in your app's environment variables.

## Troubleshooting

### Common Issues
1. **"relation 'profiles' does not exist"**: Run the schema SQL first
2. **RLS policy errors**: Ensure you're authenticated when accessing protected data
3. **OTP not sending**: Check Twilio credentials in Supabase Auth settings
4. **Profile creation fails**: Check RLS policies for the profiles table

### Support
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Phone Auth Guide](https://supabase.com/docs/guides/auth/auth-phone)
- [Twilio Verify Documentation](https://www.twilio.com/docs/verify)

## Next Steps

After completing this setup:
1. Test the authentication flow in your app
2. Create some test data (models, moodboards)
3. Test booking functionality
4. Configure production settings (rate limits, CAPTCHA)
5. Deploy to production

Your authentication system is now production-ready with enterprise-grade security! 🚀 