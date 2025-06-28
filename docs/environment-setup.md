# Environment Setup Guide for 303030

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Supabase Configuration
```env
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Supabase service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Razorpay Payment Configuration
```env
# Razorpay Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key_here

# Razorpay Webhook Secret (for payment verification)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Development/Production Mode
```env
# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional: Monitoring & Analytics
```env
# Sentry Error Monitoring (when implemented)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

# Vercel Analytics (auto-detected in Vercel)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id

# Google Analytics (if using)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Setup Instructions

### 1. Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy your project URL and anon key

2. **Configure Authentication**:
   - Go to Authentication → Providers
   - Enable Phone Auth
   - Configure Twilio credentials in SMS provider settings

3. **Run Database Schema**:
   ```bash
   # Copy the entire content of lib/db/schema.sql
   # Paste and run in Supabase SQL Editor
   ```

4. **Set up Row Level Security**:
   - RLS policies are included in the schema
   - Verify policies are active in Database → Policies

### 2. Razorpay Setup

1. **Create Razorpay Account**:
   - Go to [razorpay.com](https://razorpay.com)
   - Create merchant account
   - Complete KYC verification

2. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Key ID and Key Secret
   - Use test keys for development

3. **Configure Webhooks**:
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Select events: `payment.captured`, `payment.failed`

### 3. Development Environment

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Run Development Server**:
   ```bash
   pnpm dev
   ```

3. **Database Connection Test**:
   ```bash
   # Test database connection
   curl -X GET "http://localhost:3000/api/health"
   ```

### 4. Production Environment (Vercel)

1. **Environment Variables in Vercel**:
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add all production environment variables

2. **Domain Configuration**:
   - Add custom domain in Vercel
   - Configure DNS records
   - SSL certificates are automatic

3. **Supabase Production Settings**:
   - Update allowed origins in Supabase
   - Add production URL to auth redirect URLs

## Environment Variable Validation

Add this to your `.env.local` to validate required variables:

```env
# Validation - Remove after confirming setup
VALIDATE_ENV=true
```

## Security Considerations

### Development
- Use test API keys only
- Never commit `.env.local` to Git
- Use strong passwords for Supabase

### Production
- Use production API keys
- Enable rate limiting in Supabase
- Configure proper CORS origins
- Enable database backups

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**:
   ```
   Error: Invalid API key
   ```
   - Verify SUPABASE_URL and ANON_KEY
   - Check for extra spaces in environment variables

2. **Authentication Not Working**:
   - Verify Twilio configuration in Supabase
   - Check phone number format (+91xxxxxxxxxx)
   - Ensure auth redirect URLs are correct

3. **Database Schema Errors**:
   ```
   Error: relation "profiles" does not exist
   ```
   - Run the complete schema from `lib/db/schema.sql`
   - Verify RLS policies are enabled

4. **Payment Integration Issues**:
   - Verify Razorpay keys are correct
   - Check webhook URL configuration
   - Ensure test mode is enabled for development

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Test database connection
pnpm run db:test

# Validate all environment variables
pnpm run env:validate
```

## Production Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database schema deployed to production
- [ ] Supabase auth configured with production URLs
- [ ] Razorpay production keys configured
- [ ] Domain and SSL configured

### Post-deployment
- [ ] Test user registration flow
- [ ] Test booking flow (without payment)
- [ ] Verify admin panel access
- [ ] Check error monitoring is working
- [ ] Validate performance metrics

## Support

If you encounter issues during setup:

1. Check the troubleshooting section above
2. Verify all environment variables are correct
3. Review Supabase logs for database issues
4. Check Vercel deployment logs for build issues

For persistent issues, check:
- Supabase project logs
- Vercel function logs
- Browser developer console for client-side errors 