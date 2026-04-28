# ChefMii Platform - Complete Overview

## 🎯 Mission

ChefMii is the world's premier private chef booking marketplace. We connect clients with top-tier private chefs for any occasion, anywhere, anytime. From intimate home dinners to presidential banquets, ChefMii brings culinary excellence directly to your table.

## 📊 Platform Architecture

### Frontend (Next.js 14 + React 18)

The platform is built as a full-stack Next.js 14 application with TypeScript for type safety. The frontend uses Tailwind CSS for responsive design and Lucide React for consistent iconography.

**Key Pages:**
- Homepage with hero section and chef discovery
- Find Chefs with advanced filtering and sorting
- Chef profiles with portfolio and reviews
- Booking flow with 4-step process
- User dashboards for 6 different roles
- ChefTV media feed with vertical videos
- Academy for cooking courses
- Marketplace for farm-to-table produce
- Kids Zone with gamified cooking challenges
- Messages for real-time communication

### Backend (Supabase + Next.js API Routes)

The backend leverages Supabase for authentication, database, and real-time features. API routes handle bookings, payments, chat, and profile management.

**Key API Endpoints:**
- `/api/bookings` - Create and manage bookings
- `/api/chat` - Real-time messaging
- `/api/profile` - User profile management
- `/api/webhooks/stripe` - Payment webhook handling

### Database (Supabase PostgreSQL)

The database schema supports all platform features with proper relationships and constraints. Real-time subscriptions enable live updates for messages and bookings.

**Core Tables:**
- profiles (user accounts with roles)
- chef_profiles (chef-specific data)
- bookings (booking records with payment tracking)
- messages (real-time chat)
- reviews (ratings and feedback)
- chef_media (video content)
- courses (academy courses)
- produce_listings (marketplace items)

## 👥 User Roles

### 1. Client Role
Clients browse chefs, book events, manage bookings, and leave reviews. They access the user dashboard to view upcoming events, past bookings, and earnings from referrals.

### 2. Chef Role
Chefs manage their profiles, view bookings, upload media content, and track earnings. The chef dashboard shows booking requests, earnings analytics, and media performance metrics.

### 3. Farmer Role
Farmers list produce items, manage orders from chefs, track revenue, and view delivery reviews. The farmer dashboard includes inventory management and order fulfillment tracking.

### 4. Influencer Role
Influencers earn commissions through referral links. The influencer dashboard tracks referral clicks, commission earnings, and performance metrics for optimization.

### 5. Kids Role
Kids participate in gamified cooking challenges, earn XP points, collect badges, and compete on leaderboards. The kids dashboard is designed with bright colors and emoji icons for engagement.

### 6. Business Role
Business users manage corporate events, team bookings, and bulk discounts. The business dashboard supports multiple team members and event coordination.

## 🎨 Design System

### Brand Identity

The platform uses a sophisticated color palette centered around terracotta orange (#E8520A) for primary actions. The dark background (#1A1A1A) provides contrast, while light backgrounds (#F5F5F5) ensure readability.

**Typography:**
- Roboto for UI elements (sans-serif)
- Libre Caslon Text for headings (serif)
- Consistent 12px border radius for all components

### Responsive Design

The platform is fully responsive across all device sizes. Mobile-first approach ensures optimal experience on phones, tablets, and desktops. Tailwind CSS utilities handle responsive breakpoints automatically.

### Dark Mode

Full dark mode support is implemented throughout the platform. Users can toggle between light and dark themes using the navbar button. Theme preference is persisted in browser storage.

## 🔐 Authentication & Security

### Authentication Flow

Users can sign up with email/password or OAuth (Google, Apple). On signup, a profile record is created with the selected role. The system uses Supabase JWT tokens for secure API access.

### Authorization

Role-based access control (RBAC) is enforced via middleware. Unprotected routes redirect unauthenticated users to login. Protected routes verify user roles and redirect to appropriate dashboards.

### API Security

All API routes validate JWT tokens and check user permissions. Stripe webhooks are verified using signature validation. Environment variables store sensitive credentials securely.

## 💳 Payment Processing

### Stripe Integration

The platform integrates Stripe for secure payment processing. Bookings trigger payment intents, and webhooks update booking status based on payment outcomes.

**Payment Flow:**
1. Client selects menu and confirms booking
2. Stripe checkout session is created
3. Client completes payment
4. Webhook confirms payment success
5. Booking status updates to "confirmed"
6. Confirmation email sent to both parties

### Platform Fees

The platform charges a 10% service fee on all bookings. This is calculated automatically and displayed to users before payment.

## 📧 Email Notifications

Resend handles all email communications. Notifications are sent for booking confirmations, payment receipts, event reminders, and review requests.

## 🤖 AI Features

### Gemini Chatbot

The platform includes a floating chatbot powered by Google's Gemini API. The chatbot helps users find chefs, understand pricing, book events, and navigate the platform.

**System Prompt:** "You are ChefMii Assistant. Help users find chefs, understand pricing, book events, and navigate the platform."

## 🎬 ChefTV Media Feed

### Algorithm-Based Ranking

Videos are ranked using a custom algorithm that considers recency, likes, views, and bookings generated. The algorithm prevents content fatigue by deprioritizing old content.

**Ranking Formula:**
```
score = (1/(hours+2)^1.5 * 0.30) + 
        (likes/max * 0.25) + 
        (views/max * 0.20) + 
        (bookings/max * 0.25)
```

### Features

- Vertical video format (TikTok-style)
- Intersection Observer for autoplay/pause
- Like, comment, save, and share functionality
- Chef info overlay with booking CTA
- Real-time view and like counts

## 📚 Academy Features

### Course Structure

Courses are organized by chef and include multiple lessons. Each lesson contains a video, duration, and preview status. Students can track progress and earn certificates.

### Enrollment System

Students enroll in courses and track progress. Completion is recorded with timestamps. Certificates are issued upon 100% completion.

## 🛒 Marketplace Features

### Produce Listings

Farmers list organic and conventional produce with pricing per unit. Inventory is tracked and availability is updated in real-time.

### Shopping Experience

Clients browse produce, add items to cart, and checkout. Orders are confirmed and farmers receive notifications for fulfillment.

## 🎮 Kids Zone Gamification

### XP System

Kids earn XP points by completing cooking challenges. XP accumulates to unlock new levels and badges.

**Levels:** Newbie → Spoon Warrior → Pan Master → Knife Ninja → Junior Chef → Star Chef → Master Chef

### Badge System

Badges are earned for completing challenges and milestones. Each badge has a name, emoji, and description. Kids can view their badge collection.

## 📱 Responsive Components

All components are built with mobile-first design principles. Key components include:

- Navbar with hamburger menu for mobile
- Chef cards with hover effects
- Booking flow with step indicators
- Dashboard layouts with collapsible sidebars
- Video feed with touch-friendly controls
- Forms with mobile-optimized inputs

## 🚀 Performance Optimizations

- Image optimization using Next.js Image component
- Code splitting and lazy loading for routes
- CSS-in-JS with Tailwind for minimal bundle size
- Real-time subscriptions for live updates
- Caching strategies for API responses
- Database query optimization with indexes

## 📊 Analytics & Monitoring

The platform tracks key metrics including booking volume, payment success rate, chef performance, and user engagement. This data informs product decisions and helps optimize the platform.

## 🔄 Real-Time Features

Supabase real-time subscriptions enable live updates for messages and bookings. Users see instant notifications when new messages arrive or booking statuses change.

## 🌍 Internationalization

The platform is ready for internationalization with proper text extraction and translation support. Currently available in English.

## 📈 Scalability

The platform is designed to scale horizontally. Supabase handles database scaling, Vercel manages frontend scaling, and Stripe processes payments reliably at scale.

## 🎯 Future Roadmap

Potential enhancements include video calling integration, subscription plans for recurring bookings, advanced analytics dashboard, and expansion to additional cuisines and regions.

---

**ChefMii** - Hire a Chef for Any Occasion, Anytime, Anywhere 🍳
