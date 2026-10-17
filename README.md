# MindBridge — Your AI Mental Wellness Companion

MindBridge is a clean, modern, minimal, and calming mental wellness web application built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and backed by **Supabase (PostgreSQL, Supabase Auth, Row Level Security)**.

---

## 🎨 Design System & Theme

* **Primary Background:** Warm Beige (`#F3EBDD`)
* **Secondary Color:** Sage Green (`#829675`)
* **Card Background:** Soft Cream (`#FFFCF6`)
* **Main Text:** Dark Brown (`#403B35`)
* **Secondary Text:** Muted Gray (`#77736B`)
* **Borders:** Light Beige (`#E4DACA`)
* **Typography:** Clean font pairing (`Poppins` and `Inter`)
* **Visual Aesthetic:** Rounded cards (`rounded-2xl`, `rounded-3xl`), generous whitespace, soft shadows, and calm micro-interactions.

---

## 🗄️ Backend Architecture & Supabase Foundation

MindBridge uses Supabase as a secure, privacy-first backend foundation:

* **Authentication:** Supabase Auth (Email/Password registration, verification handling, login, session tokens, secure password reset, protected client routes).
* **Database:** PostgreSQL on Supabase with strict **Row Level Security (RLS)** ensuring users can only read and mutate their own records (`auth.uid() = user_id`).
* **Privacy & Consent First:** 
  * Explicit toggles for storing free-form journal notes and AI Companion conversation history.
  * Ephemeral modes when consent is not provided.
  * One-click JSON data export and GDPR-compliant irreversible account data purge (`delete_user_all_data` RPC).
* **Resilient Offline / Demo Mode:**
  * When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not configured in `.env`, MindBridge automatically runs in local demo mode using localStorage with zero crashes or broken UI.

### Database Tables Schema (`supabase/schema.sql`)

| Table Name | Description | RLS Policy |
| :--- | :--- | :--- |
| `profiles` | User profile, preferred language (English, Marathi, Hindi, Telugu), streaks, and privacy consent preferences | `auth.uid() = id` |
| `mood_checkins` | Daily mood logs (mood, stress level 1-5, sleep quality, contributing factors, optional journal note) | `auth.uid() = user_id` |
| `wellness_plans` | Personalized daily wellness habit plan records | `auth.uid() = user_id` |
| `saved_activities` | User-favorited mindfulness & wellness activities | `auth.uid() = user_id` |
| `activity_feedback` | Rating & reflections on completed exercises | `auth.uid() = user_id` |
| `saved_therapists` | Bookmarked therapist profiles from Pune district | `auth.uid() = user_id` |
| `chat_conversations`| AI Companion conversation sessions with explicit consent flags | `auth.uid() = user_id` |
| `chat_messages` | Consented AI Companion dialogue history | `auth.uid() = user_id` |

---

## 🚀 Supabase Setup Guide

### 1. Create a Supabase Project
1. Visit [supabase.com](https://supabase.com) and create an account or sign in.
2. Click **New project**, choose an organization, project name (e.g. `mindbridge-db`), and database password.
3. Select your closest region (e.g., `ap-south-1` Mumbai for India).

### 2. Apply Database Schema & Policies
1. In the Supabase project dashboard, navigate to the **SQL Editor** on the left menu.
2. Open the file [`supabase/schema.sql`](supabase/schema.sql) from this repository.
3. Paste the entire SQL script into the SQL Editor and click **Run**.
4. This will create all tables, indexes, Row Level Security policies, and the user trigger.

### 3. Configure Environment Variables
1. In Supabase, go to **Project Settings** -> **API**.
2. Copy the **Project URL** and the **anon / public** key.
3. In your project root, create or update `.env` (refer to `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. *Important Security Note:* Only the public `anon` key is exposed in the frontend. Never expose the `service_role` secret key.

---

## 🤖 Feature Highlights

### 1. Dedicated AI Wellness Companion (`/dashboard/companion`)
* Safe, non-judgmental space with empathetic reflections.
* Privacy-first mode: toggle between Ephemeral Mode and Encrypted Saved History.
* Quick action toolkits:
  * **Guided Breathing:** 4-4-4 box breathing visual rhythm.
  * **Grounding Exercise:** 5-4-3-2-1 sensory awareness.
  * **Journal Prompt:** Private reflective writing space.
* Immediate crisis resources banner with direct access to certified helplines.

### 2. Mood Tracker & Mental Wellness Monitor (`/dashboard/mood`)
* Daily check-in tracking emotion, stress score, sleep quality, and contributing factors.
* Trajectory chart with 7-day and 30-day views.
* Synced directly with Supabase `mood_checkins` when authenticated.

### 3. My Wellness Plan (`/dashboard/wellness-plan`)
* Personalized daily mindfulness checklist with progress bar.
* Activity bookmarks and feedback reflection logging.

### 4. Find a Therapist (`/dashboard/therapists`)
* Verified directory covering Pune district (Shivajinagar, Kothrud, Deccan, Viman Nagar, Hinjewadi, Camp, Baner, Wakad, Pimpri).
* Multilingual support for English, Marathi (मराठी), Hindi (हिंदी), and Telugu (తెలుగు).
* Real-time bookmarking synced to database.

### 5. Settings & Privacy Dashboard (`/dashboard/settings`)
* Profile name and language preferences.
* Granular storage consent toggles for journal reflections and chat logs.
* One-click JSON data export.
* GDPR-compliant permanent account data purge.

---

## 🧭 Site Navigation Routes

* `/` — Landing Page (Hero, Features, About, Footer)
* `/login` — Member Sign In, password reset modal, Google setup instructions, 1-Click demo access
* `/signup` — Account registration with email verification state
* `/dashboard` — Protected dashboard overview
* `/dashboard/mood` — Dedicated Mood Tracker & Mental Wellness Monitor
* `/dashboard/companion` — AI Wellness Companion chat & quick actions
* `/dashboard/wellness-plan` — Daily wellness checklist & bookmarks
* `/dashboard/therapists` — Certified therapist directory & consultation demo
* `/dashboard/settings` — Profile, mindful reminders, and data controls

---

## 💻 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

3. Type-check and build production bundle:
   ```bash
   npm run build
   ```
