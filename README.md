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

## 🌿 Step 2: Mood Tracker & Mental Wellness Monitor

### 1. Dedicated Mood Tracker Page (`/dashboard/mood`)
* **Header:**
  * Heading: *"Your Mood, Your Journey"*
  * Subtitle: *"Take a moment to understand how you're feeling."*
  * *"Return to Dashboard"* navigation button.
* **Daily Mood Check-in Form:**
  * **5 Selectable Mood Cards:** *Very Low*, *Low*, *Okay*, *Good*, and *Great* with expressive icons and sentiment notes.
  * **Affecting Factor Tags:** *Studies or Work*, *Family*, *Relationships*, *Health*, *Sleep*, *Loneliness*, *Personal Concerns*, *Something Good*, and *Other*.
  * **Stress Scale (1 to 5):** *Level 1 (Calm)* to *Level 5 (Very High)*.
  * **Sleep Quality Selector:** *Very Poor*, *Poor*, *Fair*, *Good*, and *Excellent*.
  * **Journal Note Textarea:** Optional prompt asking *"Would you like to write anything about your day?"*.
  * **Local Storage Persistence:** Entries persist automatically in `localStorage` (`mindbridge_mood_entries_v2`) with transparent privacy disclaimers.
  * **Feedback:** Friendly confirmation banner: *"Check-in complete. Thank you for taking a moment for yourself."*
  * **Edit & Delete Capabilities:** Edit any saved entry via modal or delete with confirmation.

### 2. Mental Wellness Overview
* **Recent Mood:** Displays user's latest recorded state and supportive sentiment.
* **Average Stress:** Calculated dynamically from recorded check-ins on a 1–5 scale.
* **Check-ins Completed:** Real-time tally of recorded reflections.
* **Supportive Note:** *"Mood tracking can help you reflect on patterns over time. It is not a medical diagnosis."*

### 3. Mood History & Visualization
* **Filter Toggle:** Switch seamlessly between *Last 7 Days* and *Last 30 Days*.
* **Responsive Visual Chart:** Clean SVG line & area plot showing emotional trajectory over time. Labeled explicitly as *Demonstration Sample Data* when starting out, transitioning automatically to personal user history upon saving entries.
* **Entry History Cards:** Chronological list showing timestamp, mood badge, stress level, sleep quality, factor tags, journal note, and Edit/Delete buttons.

### 4. Emotional Patterns — Basic Version
* **Section Title:** *"Patterns You May Notice"*
* Evaluates real check-in data to surface gentle observations (e.g. stress correlation on low mood days, sleep correlation on positive days, most frequent factor tag).
* If fewer than 2 entries exist, displays: *"Keep checking in to discover possible patterns over time."*

### 5. Seamless Dashboard Integration
* Sidebar link *"Mood Tracker"* connects directly to `/dashboard/mood`.
* The main dashboard's daily check-in card displays the latest saved mood and includes an *"Open Full Tracker"* button.
* Overview summary cards dynamically reflect changes made in the Mood Tracker without requiring manual page reload.

---

## 🧭 Full Site Routes

* `/` — Landing Page (Hero, Features, About, Footer)
* `/login` — Member Sign In with validation & 1-Click Demo Login
* `/signup` — Registration placeholder
* `/dashboard` — Main Dashboard Overview
* `/dashboard/mood` — Dedicated Mood Tracker & Mental Wellness Monitor
* `/dashboard/companion` — AI Wellness Companion chat preview
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
   Open [http://localhost:3000](http://localhost:3000) or [http://127.0.0.1:3000/dashboard/mood](http://127.0.0.1:3000/dashboard/mood).

3. Build production bundle:
   ```bash
   npm run build
   ```
