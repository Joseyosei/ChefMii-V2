# ChefMii Platform - Deployment Guide

## 🚀 Production Deployment to Vercel

ChefMii is a complete full-stack Next.js 14 private chef booking platform. Follow these steps to deploy to Vercel.

### Prerequisites

- GitHub account with access to `Joseyosei/chefmii-v2` repository
- Vercel account (create at https://vercel.com)
- Supabase project (Project ID: `omqsitgbdbtfvpqjvnur`)
- Stripe account (for payment processing)
- Resend account (for email notifications)

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Search for and select `Joseyosei/chefmii-v2`
5. Click "Import"

### Step 2: Configure Environment Variables

In Vercel project settings, add the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://omqsitgbdbtfvpqjvnur.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcXNpdGdiZGJ0ZnZwcWp2bnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0MjAwNzUsImV4cCI6MjAyOTk5NjA3NX0.8YZ5q8_-vW8qJ0-X1K2L3M4N5O6P7Q8R9S0T1U2V3W
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcXNpdGdiZGJ0ZnZwcWp2bnVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDQyMDA3NSwiZXhwIjoyMDI5OTk2MDc1fQ.9Za6b7_-wX9rK1-Y2L3M4N5O6P7Q8R9S0T1U2V3W4X
SUPABASE_JWT_SECRET=super-secret-jwt-token-key-for-chefmii-platform

# Stripe (Production Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_SECRET
STRIPE_CHEF_BOOKING_FEE_PRICE_ID=price_YOUR_PRICE_ID
STRIPE_PLATFORM_FEE_PERCENT=10

# Resend Email
RESEND_API_KEY=re_YOUR_RESEND_KEY
EMAIL_FROM=no-reply@chefmii.com

# Gemini AI (Chatbot)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ChefMii
NEXT_PUBLIC_STORAGE_URL=https://omqsitgbdbtfvpqjvnur.supabase.co/storage/v1/object/public
```

### Step 3: Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → Webhooks
3. Click "Add endpoint"
4. Enter your Vercel URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
6. Copy the webhook secret and add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 4: Deploy

1. In Vercel project settings, click "Deployments"
2. Select the main branch deployment
3. Click "Redeploy" or wait for automatic deployment on push
4. Monitor deployment logs for any errors

### Step 5: Post-Deployment Verification

After deployment, verify the following:

- [ ] Homepage loads with hero section and search
- [ ] Navigation bar displays correctly with all links
- [ ] User registration works (create test account)
- [ ] Login redirects to correct dashboard based on role
- [ ] Find Chefs page loads with filtering
- [ ] Chef profile page displays correctly
- [ ] Booking flow completes (test with Stripe test card)
- [ ] Dark mode toggle works
- [ ] Mobile responsive design verified
- [ ] ChefTV media feed loads
- [ ] Academy courses display
- [ ] Marketplace shows products
- [ ] All dashboards load for different roles

## 📋 Platform Features

### Core Features
- **Chef Discovery**: Advanced search and filtering by cuisine, location, price
- **Booking System**: 4-step booking flow with date/time selection, menu choice, and Stripe payment
- **Real-time Chat**: Direct messaging between clients and chefs
- **Rating & Reviews**: 5-star review system with detailed feedback

### User Roles (6 Types)
1. **Client**: Browse chefs, book events, manage bookings, leave reviews
2. **Chef**: Manage profile, view bookings, upload media, track earnings
3. **Farmer**: List produce, manage orders, track revenue
4. **Influencer**: Referral program, commission tracking, performance metrics
5. **Kids**: Gamified cooking challenges, badges, leaderboard
6. **Business**: Corporate event management, team bookings, bulk discounts

### Premium Features
- **ChefTV**: TikTok-style vertical video feed with algorithm-based ranking
- **Academy**: Video courses with lessons, progress tracking, certificates
- **Marketplace**: Farm-to-table produce marketplace with direct ordering
- **AI Chatbot**: Gemini-powered assistant for platform navigation
- **Dark Mode**: Full dark mode support across entire platform

### Payment Processing
- Stripe integration for secure payments
- Automatic platform fee calculation (10%)
- Chef payout tracking
- Refund handling
- Webhook-based status updates

### Email Notifications
- Booking confirmations
- Payment receipts
- Event reminders
- Review requests
- Referral earnings

## 🔐 Security

- Supabase authentication with email/password and OAuth (Google, Apple)
- Role-based access control (RBAC) via middleware
- Protected API routes with JWT validation
- Secure Stripe webhook verification
- Environment variables for sensitive data
- CORS protection
- SQL injection prevention via Supabase

## 📊 Database Schema

The platform uses Supabase PostgreSQL with the following main tables:
- `profiles`: User accounts with roles
- `chef_profiles`: Chef-specific information
- `bookings`: Booking records with payment tracking
- `messages`: Real-time messaging
- `reviews`: Chef ratings and feedback
- `chef_media`: Video content for ChefTV
- `courses`: Academy courses
- `lessons`: Video lessons within courses
- `produce_listings`: Farmer marketplace items
- `influencer_profiles`: Referral program data
- `kids_profiles`: Gamification data

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Charts**: Recharts
- **Form Validation**: React Hook Form + Zod

## 📱 Responsive Design

The platform is fully responsive across:
- Mobile (375px - 640px)
- Tablet (641px - 1024px)
- Desktop (1025px+)

All components use Tailwind's responsive utilities for optimal display.

## 🎨 Brand Colors

- **Primary Orange**: #E8520A
- **Dark**: #1A1A1A
- **Light Background**: #F5F5F5
- **Fonts**: Roboto (UI) + Libre Caslon Text (headings)
- **Border Radius**: 12px

## 📞 Support

For issues or questions:
1. Check the GitHub repository: https://github.com/Joseyosei/chefmii-v2
2. Review environment variable configuration
3. Check Vercel deployment logs
4. Verify Supabase connection and API keys
5. Test Stripe webhook connectivity

## 🚀 Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind for minimal bundle size
- Supabase real-time subscriptions for live updates
- Caching strategies for API responses

## 📈 Monitoring

Set up monitoring for:
- Vercel deployment health
- Supabase database performance
- Stripe payment success rate
- API response times
- Error tracking and logging

---

**ChefMii** - The World's Premier Private Chef Marketplace 🍳
