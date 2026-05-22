# SkyBook Airlines ✈️

A full-stack realtime airline booking platform built with Next.js 16, Supabase, Zustand, and PWA support.

---

# Live Demo

Production URL:

```bash
https://your-vercel-url.vercel.app
```

---

# Features

## Task 1 — Flight Search & Booking Flow

* Flight search with:

  * origin
  * destination
  * departure date
  * passenger count
* Flight results page
* Passenger booking form
* Booking confirmation page
* PNR generation
* Server-side Supabase integration
* Secure booking flow using Supabase RPCs

---

## Task 2 — Interactive Seat Selection

* Realtime aircraft seat map
* Temporary seat locking
* Optimistic seat selection
* Realtime seat updates using Supabase Realtime
* Economy / Business / First class cabin zones
* Mobile-friendly scrollable layout
* Aircraft aisle separation
* Seat status colors:

  * Available
  * Locked
  * Selected
  * Booked
* Auto-expiring locks

---

## Task 3 — Rescheduling & Cancellation

* My Bookings dashboard
* Booking status badges
* Atomic cancellation RPC
* Reschedule booking flow
* Seat release + reassignment
* Database-level cancellation restrictions
* Confirmation dialogs for destructive actions

---

## Task 4 — Zustand Architecture

### useFlightStore

Handles:

* Active flight search query
* Selected flight
* Selected seat
* Current booking step
* Passenger form state

### useUserStore

Handles:

* Supabase auth session token
* Cached bookings
* Store reset lifecycle

### Persist Middleware

Implemented using Zustand persist middleware.

### partialize()

Sensitive data such as:

* passport numbers

are excluded from localStorage persistence.

### Optimistic Updates

Seat selections are applied optimistically before backend confirmation.

### Reset Actions

Store resets occur on:

* logout
* booking cancellation
* booking completion
* rescheduling

---

## Task 5 — Progressive Web App (PWA)

* Installable PWA
* Offline support
* Service worker caching
* Offline fallback page
* Cached booking history
* Mobile install prompt banner
* Lighthouse PWA optimization

### Cache Strategies

* StaleWhileRevalidate → flight search results
* CacheFirst → static assets

---

# Tech Stack

## Frontend

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS
* Zustand

## Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Realtime
* Supabase RPC Functions

## Deployment

* Vercel

---

# Folder Structure

```bash
app/
components/
lib/
store/
supabase/
public/
types/
```

---

# Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

# .env.example

Create:

```bash
.env.example
```

Contents:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repository.git
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```bash
.env.local
```

Add your Supabase credentials.

---

## 4. Run Development Server

```bash
npm run dev
```

---

## 5. Production Build

```bash
npm run build
npm run start
```

---

# Supabase Setup

## Database Tables

The application uses:

* flights
* seats
* bookings
* passengers
* reschedules

---

# Supabase Migrations

All migration SQL files are stored in:

```bash
/supabase/migrations
```

---

# Seed Script

Seed scripts include:

* demo flights
* aircraft seats
* demo bookings
* test user account

---

# Test Credentials

```bash
Email: test@skybook.com
Password: Test123@
```

---

# Realtime Architecture

Supabase Realtime is used for:

* seat availability updates
* live booking synchronization
* collaborative seat locking

---

# RPC Functions

## lock_seat()

Temporarily locks a seat for 15 minutes.

---

## reserve_seat()

Atomically:

* validates availability
* books seat
* generates PNR
* creates booking

---

## cancel_booking()

Atomically:

* validates cancellation window
* cancels booking
* releases seat
* clears locks

---

## reschedule_booking()

Atomically:

* updates booking
* transfers seat
* releases old seat
* calculates fee difference
* stores reschedule history

---

# PWA Support

## Manifest

Includes:

* app name
* standalone display mode
* theme color
* icons (192x192 and 512x512)

---

## Offline Support

Offline fallback page:

```bash
/offline
```

---

# Lighthouse Audit

Target PWA Lighthouse Score:

```bash
90+
```

Add Lighthouse screenshot here:

```bash
README-assets/lighthouse-score.png
```

---

# Deployment

## Vercel Deployment

Deploy using:

urlVercel[https://vercel.com](https://vercel.com)

---

# Production URL

```bash
https://your-production-url.vercel.app
```

---

# Important Notes

* PWA functionality is fully enabled only in production builds.
* Realtime seat updates require Supabase Realtime enabled on the seats table.
* Seat locking is implemented using PostgreSQL RPC functions.
* Passport numbers are intentionally excluded from localStorage persistence for security.

---

# Future Improvements

* Payment gateway integration
* Boarding pass generation
* Email confirmations
* Flight analytics dashboard
* Multi-passenger seat assignment
* Admin flight management panel

---

# Author

Built by Purujeet Kumar.
