export type MoodType = 'very-low' | 'low' | 'okay' | 'good' | 'great';

export type SleepQuality = 'Very Poor' | 'Poor' | 'Fair' | 'Good' | 'Excellent';

export interface MoodOption {
  type: MoodType;
  label: string;
  iconName: string;
  sentiment: string;
  colorClass: string;
  description: string;
  score: number; // 1 to 5
}

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string
  date: string;      // Formatted display date, e.g. "Oct 13, 2026"
  time: string;      // Formatted display time, e.g. "9:15 AM"
  mood: MoodType;
  factors: string[]; // e.g. ["Studies or Work", "Sleep"]
  stressLevel: number; // 1 to 5
  sleepQuality: SleepQuality;
  journalNote?: string;
  isSample?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  duration: string;
  category: 'Mindfulness' | 'Journaling' | 'Physical' | 'Breathing';
  description: string;
  steps: string[];
  tips: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  type: 'mood' | 'activity' | 'journal';
  timestamp: string;
  badge: string;
  detail?: string;
}

export interface Therapist {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  experience: string;
  rating: number;
  reviewsCount: number;
  availableSlot: string;
  bio: string;
  location: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  streakDays: number;
  currentGoal: string;
  completedActivitiesToday: number;
  totalActivitiesGoal: number;
}
