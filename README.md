# MindBridge — Your Mental Wellness Companion

MindBridge is a clean, modern, minimal, and calming mental wellness frontend web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🎨 Design System & Theme

* **Primary Background:** Warm Beige (`#F3EBDD`)
* **Secondary Color:** Sage Green (`#829675`)
* **Card Background:** Soft Cream (`#FFFCF6`)
* **Main Text:** Dark Brown (`#403B35`)
* **Secondary Text:** Muted Gray (`#77736B`)
* **Borders:** Light Beige (`#E4DACA`)
* **Typography:** Clean font pairing with Google Fonts (`Poppins` and `Inter`)
* **Visual Aesthetic:** Rounded cards (`rounded-2xl`, `rounded-3xl`), generous whitespace, soft shadows, and calm micro-interactions.

---

## 🤖 Step 3: AI Wellness Companion Frontend

### 1. Dedicated AI Companion Page (`/dashboard/companion`)
* **Header & Disclaimer:**
  * Heading: *"A Safe Space to Talk"*
  * Subtitle: *"Share what's on your mind. Let's explore it together."*
  * Status label: *"Mental Wellness Companion"* with gentle pulse indicator.
  * Direct *"Return to Dashboard"* navigation button.
  * Clear, compassionate disclaimer:
    > *"I'm an AI wellness companion, not a therapist or a medical professional. I can offer general information and coping strategies, but I cannot diagnose mental health conditions."*
* **Chat Interface:**
  * Welcome message from MindBridge companion:
    > *"Hi! I'm your MindBridge companion. You can talk to me about stress, studies, sleep, emotions, or anything affecting your well-being. What would you like to explore today?"*
  * Scrollable conversation area with distinct message styling for user and AI.
  * Typing indicator with animated dots (*"MindBridge is reflecting..."*).
  * Timestamps on every message.
  * Bottom input bar with auto-resizing, enter-to-send support, and disabled state while responses generate.
  * Top session controls: *"New Chat"* and *"Clear Chat"* (with modal confirmation).
* **Suggested Questions:**
  * *"I'm feeling stressed about my studies."*
  * *"How can I manage anxiety?"*
  * *"I've been having trouble sleeping."*
  * *"I feel overwhelmed and don't know where to start."*
  * *"How can I build a healthier daily routine?"*
* **Empathetic Mock Response Engine:**
  * Intelligent recognition of common wellness topics:
    * Academic stress & study deadlines
    * Anxiety, worry, and panic
    * Sleep difficulties & bedtime racing thoughts
    * Low mood & feeling down
    * Motivation & procrastination
    * Relaxation & grounding
    * General daily wellness routines
    * Safety & crisis awareness
* **"Try This" Quick Actions:**
  * **Guided Breathing:** Interactive visual breathing timer with expanding/contracting circle (4-4-4 box breathing) and stop/pause controls.
  * **Grounding Exercise:** Interactive 5-4-3-2-1 sensory awareness activity with step-by-step guidance.
  * **Journal Prompt:** Interactive reflection prompt *"What is one thing that has been on your mind today?"* with private writing area.
* **Mental Health Safety & Crisis Support:**
  * Supportive crisis help panel featuring verified 24/7 contacts:
    * **988 Suicide & Crisis Lifeline** (Call/Text 988)
    * **Crisis Text Line** (Text HOME to 741741)
    * **The Trevor Project** (1-866-488-7386 or text START to 678-678)
    * **International Helplines** (findahelpline.com)
* **Dashboard Integration:**
  * Shortcut card on the Dashboard Overview (`/dashboard`) for quick 1-click access to the AI Companion and common conversation starters.

---

## 🌿 Step 2: Mood Tracker & Mental Wellness Monitor

* Dedicated page at `/dashboard/mood`.
* Daily Mood Check-in with 5 moods, contributing factors, 1–5 stress scale, sleep quality, and journal note.
* `localStorage` persistence with transparent privacy notices.
* Mental Wellness Overview with recent mood, average stress, and check-ins completed.
* Visual SVG mood trajectory chart with 7-day and 30-day filters.
* Recorded check-in history list with Edit and Delete functionality.
* Rule-based emotional pattern observations without AI overcomplication.

---

## 🧭 Site Navigation Routes

* `/` — Landing Page (Hero, Features, About, Footer)
* `/login` — Member Sign In with validation & 1-Click Demo Login
* `/signup` — Account Registration
* `/dashboard` — Main Dashboard Overview (with AI Companion shortcut)
* `/dashboard/mood` — Dedicated Mood Tracker & Mental Wellness Monitor
* `/dashboard/companion` — AI Wellness Companion chat & quick actions
* `/dashboard/wellness-plan` — Daily habit checklist
* `/dashboard/therapists` — Certified therapist directory & consultation demo
* `/dashboard/settings` — Profile, mindful reminders, and privacy controls

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) or [http://127.0.0.1:3000/dashboard/companion](http://127.0.0.1:3000/dashboard/companion).

3. Build production bundle:
   ```bash
   npm run build
   ```
