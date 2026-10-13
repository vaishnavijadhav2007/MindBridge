import React, { createContext, useContext, useState, useEffect } from 'react';
import { MoodType, MoodEntry, Activity, ActivityLog, UserProfile, SleepQuality } from '../types';

interface WellnessContextType {
  // Mood entries & operations
  moodEntries: MoodEntry[];
  addMoodEntry: (entryData: {
    mood: MoodType;
    factors: string[];
    stressLevel: number;
    sleepQuality: SleepQuality;
    journalNote?: string;
  }) => MoodEntry;
  updateMoodEntry: (id: string, entryData: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  clearAllEntries: () => void;
  loadSampleEntries: () => void;
  hasUserEntries: boolean;
  
  // Current active / latest mood
  selectedMood: MoodType | null;
  selectMood: (mood: MoodType) => void;
  latestEntry: MoodEntry | null;
  moodConfirmedMessage: string | null;
  dismissMoodMessage: () => void;

  // Mental wellness calculated overview
  averageStress: number | null;
  completedCheckinsCount: number;

  // User & activities
  userProfile: UserProfile;
  recommendedActivities: Activity[];
  recentActivities: ActivityLog[];
  activeModalActivity: Activity | null;
  openActivityModal: (activity: Activity) => void;
  closeActivityModal: () => void;
  completeActivity: (activityId: string) => void;

  // Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'mindbridge_mood_entries_v2';

// 4 realistic sample entries labeled clearly as demonstration data
const initialSampleEntries: MoodEntry[] = [
  {
    id: 'sample-1',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    date: new Date(Date.now() - 3 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '9:30 AM',
    mood: 'okay',
    factors: ['Studies or Work'],
    stressLevel: 3,
    sleepQuality: 'Fair',
    journalNote: 'Busy morning with assignments. Taking a breath before class.',
    isSample: true,
  },
  {
    id: 'sample-2',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    date: new Date(Date.now() - 2 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '8:45 AM',
    mood: 'good',
    factors: ['Health', 'Something Good'],
    stressLevel: 2,
    sleepQuality: 'Good',
    journalNote: 'Went for a morning walk in the park. Felt calm and grounded.',
    isSample: true,
  },
  {
    id: 'sample-3',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    date: new Date(Date.now() - 1 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '3:15 PM',
    mood: 'low',
    factors: ['Sleep', 'Personal Concerns'],
    stressLevel: 4,
    sleepQuality: 'Poor',
    journalNote: 'Didn’t sleep well last night. Feeling a bit drained.',
    isSample: true,
  },
  {
    id: 'sample-4',
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '9:15 AM',
    mood: 'good',
    factors: ['Relationships', 'Something Good'],
    stressLevel: 2,
    sleepQuality: 'Good',
    journalNote: 'Caught up with a close friend over warm tea.',
    isSample: true,
  }
];

const defaultActivities: Activity[] = [
  {
    id: 'activity-breathing',
    title: 'Take a mindful breathing break',
    duration: '2 minutes',
    category: 'Breathing',
    description: 'Inhale calm, exhale tension. A quick 4-4-4 box breathing practice to ground your nervous system.',
    steps: [
      'Find a comfortable, upright seating position with your shoulders relaxed.',
      'Breathe in slowly through your nose for 4 seconds, feeling your chest expand.',
      'Gently hold your breath for 4 peaceful seconds.',
      'Release the air through your mouth for 4 seconds, letting tension dissolve.',
      'Repeat this gentle cycle for 5 rounds.'
    ],
    tips: 'Allow your thoughts to pass like clouds. Just bring attention back to the breath.'
  },
  {
    id: 'activity-journaling',
    title: 'Write down your thoughts',
    duration: '5 minutes',
    category: 'Journaling',
    description: 'Release inner clutter onto the page. A gentle prompt-driven reflection to organize what you are feeling.',
    steps: [
      'Take a sip of water and set away any distractions.',
      'Reflect: "What is one thing that felt heavy today, and what is one small thing I appreciate?"',
      'Jot down unedited thoughts without judging handwriting or grammar.',
      'Notice any patterns in how your body feels as you put words to your emotions.'
    ],
    tips: 'No one else needs to read this. Your paper is a non-judgmental space.'
  },
  {
    id: 'activity-stretch',
    title: 'Take a screen break and stretch',
    duration: '5 minutes',
    category: 'Physical',
    description: 'Soften eye strain and release tension held in your neck, shoulders, and spine after screen time.',
    steps: [
      'Gently look away from your screen at a distant object 20 feet away for 20 seconds.',
      'Roll your shoulders up toward your ears and smoothly slide them back and down 5 times.',
      'Gently tilt your head right, bringing ear toward shoulder. Hold for 3 breaths, then repeat on the left.',
      'Interlace fingers, reach your arms overhead, and take a deep rejuvenating stretch.'
    ],
    tips: 'Movement brings oxygen and vitality back into the nervous system.'
  }
];

const initialRecentLogs: ActivityLog[] = [
  {
    id: 'log-1',
    title: 'Mood check-in: Good',
    type: 'mood',
    timestamp: 'Today, 9:15 AM',
    badge: 'Mood Log',
    detail: 'Checked in feeling calm and balanced.'
  },
  {
    id: 'log-2',
    title: 'Mindful Breathing Break',
    type: 'activity',
    timestamp: 'Today, 9:20 AM',
    badge: 'Completed • 2 min',
    detail: 'Felt immediate release of tension in jaw and shoulders.'
  },
  {
    id: 'log-3',
    title: 'Screen Break & Gentle Stretch',
    type: 'activity',
    timestamp: 'Yesterday, 3:30 PM',
    badge: 'Completed • 5 min',
    detail: 'Refreshed energy before afternoon tasks.'
  }
];

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load stored entries from localStorage, or use initialSampleEntries
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read mood entries from localStorage:', e);
    }
    return initialSampleEntries;
  });

  // Sync entries to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(moodEntries));
    } catch (e) {
      console.warn('Could not save mood entries to localStorage:', e);
    }
  }, [moodEntries]);

  // Determine if there are actual non-sample user entries
  const hasUserEntries = moodEntries.some(e => !e.isSample);
  
  // Relevant entries to calculate metrics (only real user entries if they exist; otherwise sample entries)
  const activeEntries = hasUserEntries
    ? moodEntries.filter(e => !e.isSample)
    : moodEntries;

  const latestEntry = activeEntries.length > 0 ? activeEntries[0] : null;

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    return latestEntry ? latestEntry.mood : 'good';
  });

  // Keep selectedMood aligned with latest entry
  useEffect(() => {
    if (latestEntry) {
      setSelectedMood(latestEntry.mood);
    }
  }, [latestEntry]);

  const [moodConfirmedMessage, setMoodConfirmedMessage] = useState<string | null>(null);
  const [activeModalActivity, setActiveModalActivity] = useState<Activity | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>(initialRecentLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    streakDays: 4,
    currentGoal: 'Mindful 10 mins daily',
    completedActivitiesToday: 2,
    totalActivitiesGoal: 3,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  // Add a new mood entry
  const addMoodEntry = (entryData: {
    mood: MoodType;
    factors: string[];
    stressLevel: number;
    sleepQuality: SleepQuality;
    journalNote?: string;
  }): MoodEntry => {
    const now = new Date();
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: entryData.mood,
      factors: entryData.factors,
      stressLevel: entryData.stressLevel,
      sleepQuality: entryData.sleepQuality,
      journalNote: entryData.journalNote?.trim() || undefined,
      isSample: false,
    };

    setMoodEntries(prev => {
      // If previous entries were only sample data, transition to user's real data
      const cleaned = prev.some(e => !e.isSample) ? prev : [];
      return [newEntry, ...cleaned];
    });

    setSelectedMood(newEntry.mood);

    const moodLabels: Record<MoodType, string> = {
      'very-low': 'Very Low',
      'low': 'Low',
      'okay': 'Okay',
      'good': 'Good',
      'great': 'Great'
    };
    const label = moodLabels[entryData.mood];

    // Confirmation message as requested in prompt:
    // "Check-in complete. Thank you for taking a moment for yourself."
    setMoodConfirmedMessage("Check-in complete. Thank you for taking a moment for yourself.");

    // Prepend to recent activities
    const newLog: ActivityLog = {
      id: `act-mood-${Date.now()}`,
      title: `Mood check-in: ${label}`,
      type: 'mood',
      timestamp: `Today, ${newEntry.time}`,
      badge: 'Recorded in Mood Tracker',
      detail: `Stress: ${entryData.stressLevel}/5 • Sleep: ${entryData.sleepQuality}${entryData.factors.length > 0 ? ` • ${entryData.factors.join(', ')}` : ''}`
    };
    setRecentActivities(prev => [newLog, ...prev.slice(0, 6)]);

    showToast("Check-in complete. Thank you for taking a moment for yourself.");
    return newEntry;
  };

  // Update existing mood entry
  const updateMoodEntry = (id: string, updated: Partial<MoodEntry>) => {
    setMoodEntries(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('Mood check-in updated successfully.');
  };

  // Delete a mood entry
  const deleteMoodEntry = (id: string) => {
    setMoodEntries(prev => {
      const filtered = prev.filter(item => item.id !== id);
      return filtered;
    });
    showToast('Check-in removed from your history.');
  };

  // Clear all entries
  const clearAllEntries = () => {
    setMoodEntries([]);
    setSelectedMood(null);
    showToast('Mood check-in history cleared.');
  };

  // Reload initial demonstration entries
  const loadSampleEntries = () => {
    setMoodEntries(initialSampleEntries);
    setSelectedMood('good');
    showToast('Loaded demonstration entries.');
  };

  // Quick select mood from dashboard
  const selectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    // Add quick mood entry with default baseline stress (2) & sleep ('Good')
    addMoodEntry({
      mood,
      factors: [],
      stressLevel: 2,
      sleepQuality: 'Good',
    });
  };

  const dismissMoodMessage = () => {
    setMoodConfirmedMessage(null);
  };

  const openActivityModal = (activity: Activity) => {
    setActiveModalActivity(activity);
  };

  const closeActivityModal = () => {
    setActiveModalActivity(null);
  };

  const completeActivity = (activityId: string) => {
    const act = defaultActivities.find(a => a.id === activityId);
    if (!act) return;

    setUserProfile(prev => ({
      ...prev,
      completedActivitiesToday: Math.min(prev.totalActivitiesGoal, prev.completedActivitiesToday + 1)
    }));

    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title: act.title,
      type: 'activity',
      timestamp: timeStr,
      badge: `Completed • ${act.duration}`,
      detail: 'Completed self-care session.'
    };

    setRecentActivities(prev => [newLog, ...prev.slice(0, 6)]);
    closeActivityModal();
    showToast(`Great job! Completed "${act.title}"`);
  };

  // Calculate metrics
  const completedCheckinsCount = activeEntries.length;
  const averageStress = activeEntries.length > 0
    ? Number((activeEntries.reduce((acc, curr) => acc + (curr.stressLevel || 3), 0) / activeEntries.length).toFixed(1))
    : null;

  return (
    <WellnessContext.Provider
      value={{
        moodEntries,
        addMoodEntry,
        updateMoodEntry,
        deleteMoodEntry,
        clearAllEntries,
        loadSampleEntries,
        hasUserEntries,
        selectedMood,
        selectMood,
        latestEntry,
        moodConfirmedMessage,
        dismissMoodMessage,
        averageStress,
        completedCheckinsCount,
        userProfile,
        recommendedActivities: defaultActivities,
        recentActivities,
        activeModalActivity,
        openActivityModal,
        closeActivityModal,
        completeActivity,
        toastMessage,
        showToast
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};
