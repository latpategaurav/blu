# 303030 - Mood Board Booking Platform

303030 is a sophisticated mood board booking platform that revolutionizes the modeling industry by connecting clients with models through curated mood boards, offering clarity and transparency in the brand photoshoot process.

## Features

- **5-Day Week View Calendar**: Browse mood boards in an intuitive weekly calendar interface
- **Mood Board Booking**: Book mood boards with selected models and pay 10% upfront
- **Phone Number Authentication**: Secure login with OTP verification
- **Admin Panel**: Complete content management system for moodboards and models
- **Razorpay Integration**: Secure payment processing
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with phone/OTP
- **Payment**: Razorpay
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Hosting**: Vercel

## Getting Started

Follow these steps to get the development environment running.

### Prerequisites

- Node.js (v18 or later)
- pnpm (package manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/303030.git
    cd 303030
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Variables

To run this project, you need to set up your environment variables. Create a file named `.env.local` in the root of your project and add the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Razorpay (for payment processing)
NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET

# Twilio (for SMS/WhatsApp notifications)
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER
```

-   **Supabase:** Get your URL and Anon Key from your Supabase project dashboard under `Project Settings > API`.
-   **Razorpay:** Get your Key ID and Key Secret from your Razorpay dashboard under `Settings > API Keys`.
-   **Twilio:** Get your Account SID, Auth Token, and a phone number from your Twilio console.

### Database Setup

1.  Go to your Supabase project dashboard.
2.  Navigate to the **SQL Editor**.
3.  Copy the entire content of `lib/db/schema.sql` and run it to set up your database tables and policies.

### Running the Development Server

Once the installation and setup are complete, run the following command to start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
blu-303030/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── calendar/          # Calendar view page
│   ├── login/             # Authentication page
│   ├── moodboard/[id]/    # Moodboard detail page
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
│   ├── supabase/         # Supabase client setup
│   └── db/               # Database schema
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Key Features Implementation

### Authentication Flow
- Phone number input with formatting
- OTP generation and verification
- Session management with Supabase Auth

### Booking System
- Browse moodboards in 5-day week view
- Select models for each moodboard
- Fill booking details and requirements
- 10% upfront payment via Razorpay
- Milestone-based payment system

### Admin Panel
- Secure admin authentication
- CRUD operations for moodboards
- CRUD operations for models
- Booking management
- Analytics dashboard

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `models` - Model profiles and details
- `moodboards` - Mood board information
- `bookings` - Booking records
- `payments` - Payment transactions
- `notifications` - SMS/WhatsApp notification logs

## Development Workflow

1. **Database Changes**: Update schema in `lib/db/schema.sql`
2. **Type Safety**: Update types in `types/database.ts`
3. **Components**: Use Shadcn/ui components from `components/ui`
4. **Styling**: Use Tailwind CSS classes
5. **State Management**: Use React hooks and Supabase real-time

## Deployment

The application is optimized for deployment on Vercel:

```bash
pnpm build
```

Ensure all environment variables are set in your Vercel project settings.

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Ensure responsive design
4. Test on multiple devices
5. Update documentation as needed

## License

This project is proprietary software. All rights reserved.
