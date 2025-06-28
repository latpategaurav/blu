## Project Overview
303030 is a sophisticated mood board booking platform. It revolutionizes the modeling industry by connecting clients with models through curated mood boards, offering clarity and transparency in the brand photoshoot process.

## Core Concept
The platform operates on a mood board-driven booking system where each mood board represents a curated collection of models with specific themes, styles, or requirements. Clients can browse mood boards on a 5 days week view list interface and book mood boards directly through the platform.

## Details
40+ Moodboards
5 models per moodboard, total 200+ models

## Pages

### Home page
- informative video (about 30 days challenge)
- 303030 logo
- CTA: Book a shoot
- 2nd video: (Navigation tutorial)

### About us page
- Our work section (check out our page blustudious.in)
- Appurva Shah (work checkout his page)
- how the idea came to life
- FAQ
- link to Discover page
- accessible from home page

### Discover page
- Previous 303030 page
  - calendar view with prev mood boards & brands

### Model selection page
CTA: Upgrade Model
- filters by gender/identity, aesthetics, skin tone, hair, height, body, sizes, etc
- 2 coloumns of models
- model card with name, image, one liner, body details, etc
- sort by feature
- models have dynamic prices which gets added to the moodboard from backend.

### Login/ Signup page
- Phone number login (OTP)
- Google login
- Apple login

### Shoot Calendar page
- calendar with mood boards & brands
- 5 days week view per page, Toggle between week view/ month view (calendar view)
- Moodboard Card: day (eg. 15 July), moodboard name, 3-4 words, image
- Booked shoots have brand logo on the moodboard card
- Week view: each row has 02 Monday, moodboard title, tags, liner, hovering reveals 2 more mood images.
- clicking on a moodboard card opens the moodboard page

### Moodboard page
note: mobile view only has week view.
note: desktop view has toggle between week view and month view.
- metadata: moodboard name, tags, liner
- Main image
- Look & Feel
- Mood Shots
- Hair & Makeup
- Similar Shoots (2 similar to each moodboard chosen by Admin panel)Not from active Calendar. there will be extra moodboards for "similar" purpose. 
- Select Models (details updated from Admin panel), upgrade model button
- ONLY 1 model can be selected per moodboard.(default is 1, admin can set model count for each moodboard in admin panel)
- payment details (razorpay)
- form you can fill and send to team with payment. number of products, any extra requirements, more instructions, etc.
- 10% payment books the moodboard. 4-5 working days by team to work on the moodboard and reach next milestone, it is milestone based payment. user will be notified about the progress in "profile" page.
- Others also viewed (system generated based on vercel analytics)

### Model Profile page
- Model Details
- More relevant details.
- Add to moodboard button

## Design Style
303030 design is given a minimalist approach with straightforward user experience for brands and lightweight web experience.
Use of abundant whitespaces, giving the elements room to breathe and clutter free user experience. Also featuring tons of non-distracting animations for guiding the user smoothly without clutter.

## Design References
- https://alphamark.design
- https://newbookmodels.com/

## Steps:
1. /components/
2. workshop page with all the components
3. Add styles to components (tailwind)
4. Assemble screens from components
5. Add styles to screens
7. Add animations to components
8. Add animations to screens
9. Add business logic in backend (backend for components)
10. configure database, api routes, auth, etc
11. configure third party services
11. Add analytics, caching, etc
12. Add tests
13. Add documentation (readme, etc)
14. Add deployment
15. Add monitoring
16. Add logging
17. Add error handling

## Figma design into a component list
Atoms: button, input, etc
Molecules: search bar, user avatar badge
Organisms: navbar, cafe card, etc
Templates: page templates
Pages: page components

## Core Features
- Mood board-driven booking system
- 5 days week view list interface (Month view planned for future enhancement)
- Razorpay payment integration
- Rate limiting
- Twilio SMS, Twilio WhatsApp after booking
- Phone number login
- Vercel analytics
- Vercel caching & manual caching
- Login with OTP
- Session management
- Enforce login before accessing moodboards
- Enforce login before accessing admin dashboard
- Premium model booking marketplace

## Core User Flows
- Client can browse mood boards on a week view list interface and book mood boards directly through the platform
- Client can view the mood board and the model's profile
- Client can make 10% upfront payment to book a mood board
- Client can upgrade to premium model booking

## User Roles (SLC Scope)
- Client: The primary user who browses and books moodboards. Can create an account and view their booking history
- Admin: A trusted internal user responsible for managing platform content
- Model: Not a user role in the SLC version. Model profiles are created and managed exclusively by Admins. Models will not have login access initially

## Tech Stack
- Frontend: Next.js, Tailwind CSS
- Backend/Database: Next.js, Supabase
- Payment Integration: Razorpay
- Communication: Twilio SMS, Twilio WhatsApp
- Cloud: Vercel
- UI Framework: Shadcn UI
- TypeScript
- package manager: pnpm
- reactbits: https://reactbits.dev/ for animations
  - Blur Text
  - True Focus
  - Scroll Reveal
  - Rotating Text
  - Scroll Velocity
  - Count Up (total models, moodboards, etc)
  - Click Spark (globally)
  - Star Border
  - Animated List (calendar week view)
  - Fluid Glass (about us page)
  - Lanyard (user profile id with brand logo and moodboard details)
  - Profile Card (user profile id with brand logo and moodboard details)
  - Glass Icons
  - Elastic Slider
  

## NextJS preferences
- Use app router
- Optimise for iMac, MacBook, iOS, Chrome, Safari.
- Tailwind CSS
- Use shadcn/ui components

## Component Structure
Components
ButtonNav
    - The button which isn't styled much. Just a text changes color on hover
Navbar
    - Navbar. collection of ButtonNav and the blu logo
Featured Themes and Shoots
    - Shoots arranged in 4x1 Grid. The title and description expands from underneath the images on hover. it will go back with a delay of 5 seconds after the mouse leaves
Top 1 moodboard
    - First moodboard on "Our Work" section. Pulls up the heading and description on  hovering
Bento Carousel
    - Features 5 moodboards, showing the title and one liner desc near the shoot which is being hovered over
Project
    - individual project card
Date shoot
    - Each day on the shoot calendar for the monthly view
Date shoot row
    - Each day on the shoot calendar in weekly view
Shoots
    - Collection of five **Day shoot row.** Makes the transition between week possible
Similar Shoot
    - Similar shoot after the moodboard
Relevant Shoot
    - Relevant Shoot
Model Select (Moodboard page)
    - Model Selection in moodboard page
Model Button dark
    - Model Button dark
Upgrade btn
    - Upgrade btn
Login sec
    - Login sec
Model Button white
    - Used in pop up selection
Button v2
    - Button without fill but with a stroke
Model card
    - Model card
ProfileBtn
    - Similar to ButtonNav but displays a different animation. Used in the profile page
Notification
    - Shoot card 2
    - Booked shoots
Shoot card 3
    - Previous Shoots

## Main Application Structure: (suggestions)
- /app: Main application directory with route-based organization
  - /auth: Authentication related pages
  - /admin: Admin dashboard/features
  - /discover: Discovery features  
  - /model: Model-related features
  - /moodboard: Moodboard functionality
  - /profile: User profile management
  - /about-us: About page
- Note: Backend API routes will be co-located within the /app directory as per Next.js App Router conventions (e.g., /app/moodboard/api/route.ts)

## Database Schema
- Users:
- Moodboards:
- Models:
- Bookings:
- Payments Ledger:
- Notifications Ledger:
- Settings:

