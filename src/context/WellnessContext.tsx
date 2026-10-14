import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MoodType, MoodEntry, Activity, ActivityLog, UserProfile, SleepQuality } from '../types';
import { WellnessActivity, DailyPlanItem, FeedbackRecord, ActivityFeedback } from '../types/wellness';
import {
  ALL_ACTIVITIES,
  DEFAULT_RECOMMENDATIONS,
  getRecommendedActivities,
} from '../services/wellnessActivities';

// ─── Context Shape ──────────────────────────────────────────────────────────

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

  // Legacy activity modal (used by Dashboard)
  userProfile: UserProfile;
  recommendedActivities: Activity[];
  recentActivities: ActivityLog[];
  activeModalActivity: Activity | null;
  openActivityModal: (activity: Activity) => void;
  closeActivityModal: () => void;
  completeActivity: (activityId: string) => void;

  // ── Wellness Plan ──────────────────────────────────────────────
  /** Full personalized recommendation list */
  wellnessRecommendations: WellnessActivity[];

  /** All activities in the catalog */
  allWellnessActivities: WellnessActivity[];

  /** Today's daily plan */
  dailyPlan: DailyPlanItem[];
  addToDailyPlan: (activityId: string) => void;
  removeFromDailyPlan: (activityId: string) => void;
  markPlanItemComplete: (activityId: string) => void;
  replacePlanItem: (oldId: string, newId: string) => void;

  /** Saved / bookmarked activities */
  savedActivityIds: Set<string>;
  toggleSaved: (activityId: string) => void;

  /** Per-activity feedback */
  feedbackRecord: Record<string, ActivityFeedback>;
  recordFeedback: (activityId: string, feedback: ActivityFeedback) => void;
  resetPersonalization: () => void;

  /** Active wellness activity modal */
  activeWellnessActivity: WellnessActivity | null;
  openWellnessActivity: (activity: WellnessActivity) => void;
  closeWellnessActivity: () => void;
  completeWellnessActivity: (activityId: string) => void;

  // Saved Therapists (Pune District)
  savedTherapistIds: Set<string>;
  toggleSaveTherapist: (therapistId: string) => void;
  isTherapistSaved: (therapistId: string) => boolean;

  // Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

// ─── Storage Keys ───────────────────────────────────────────────────────────
const STORAGE_KEY          = 'mindbridge_mood_entries_v2';
const SAVED_KEY            = 'mindbridge_saved_activities_v1';
const PLAN_KEY             = 'mindbridge_daily_plan_v1';
const FEEDBACK_KEY         = 'mindbridge_feedback_v1';
const SAVED_THERAPISTS_KEY = 'mindbridge_saved_therapists_v1';

// ─── Sample Mood Data ────────────────────────────────────────────────────────

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
    journalNote: 'Went for a morning walk. Felt calm and grounded.',
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
    journalNote: 'Didn\'t sleep well. Feeling a bit drained.',
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

// Legacy dashboard activities (kept for ActivityModal on dashboard)
const defaultActivities: Activity[] = [
  {
    id: 'activity-breathing',
    title: 'Take a mindful breathing break',
    duration: '2 minutes',
    category: 'Breathing',
    description: 'Inhale calm, exhale tension. A quick 4-4-4 box breathing practice.',
    steps: [
      'Find a comfortable, upright seating position.',
      'Breathe in slowly through your nose for 4 seconds.',
      'Gently hold your breath for 4 seconds.',
      'Release the air through your mouth for 4 seconds.',
      'Repeat this cycle for 5 rounds.',
    ],
    tips: 'Allow your thoughts to pass like clouds.',
  },
  {
    id: 'activity-journaling',
    title: 'Write down your thoughts',
    duration: '5 minutes',
    category: 'Journaling',
    description: 'Release inner clutter onto the page with a gentle prompt-driven reflection.',
    steps: [
      'Set away any distractions.',
      'Reflect: "What felt heavy today, and what do I appreciate?"',
      'Write unedited thoughts without judgment.',
      'Notice how your body feels as you put words to emotions.',
    ],
    tips: 'No one else needs to read this.',
  },
  {
    id: 'activity-stretch',
    title: 'Take a screen break and stretch',
    duration: '5 minutes',
    category: 'Physical',
    description: 'Soften eye strain and release tension in neck, shoulders, and spine.',
    steps: [
      'Look at a distant object for 20 seconds.',
      'Roll your shoulders back and down 5 times.',
      'Tilt your head to each side, holding for 3 breaths.',
      'Stretch arms overhead and take a deep breath.',
    ],
    tips: 'Movement brings oxygen back into the nervous system.',
  },
];

const initialRecentLogs: ActivityLog[] = [
  {
    id: 'log-1',
    title: 'Mood check-in: Good',
    type: 'mood',
    timestamp: 'Today, 9:15 AM',
    badge: 'Mood Log',
    detail: 'Checked in feeling calm and balanced.',
  },
  {
    id: 'log-2',
    title: 'Mindful Breathing Break',
    type: 'activity',
    timestamp: 'Today, 9:20 AM',
    badge: 'Completed • 2 min',
    detail: 'Felt immediate release of tension in jaw and shoulders.',
  },
  {
    id: 'log-3',
    title: 'Screen Break & Gentle Stretch',
    type: 'activity',
    timestamp: 'Yesterday, 3:30 PM',
    badge: 'Completed • 5 min',
    detail: 'Refreshed energy before afternoon tasks.',
  },
];

// ─── Helper – load today's plan from localStorage ───────────────────────────

function loadTodayPlan(): DailyPlanItem[] {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    if (!raw) return [];
    const { date, items } = JSON.parse(raw) as { date: string; items: DailyPlanItem[] };
    const today = new Date().toDateString();
    if (date === today) return items;
  } catch { /* ignore */ }
  return [];
}

function saveTodayPlan(items: DailyPlanItem[]) {
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify({ date: new Date().toDateString(), items }));
  } catch { /* ignore */ }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // ── Mood Entries ────────────────────────────────────────────────────────────
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return initialSampleEntries;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(moodEntries)); } catch { /* ignore */ }
  }, [moodEntries]);

  const hasUserEntries = moodEntries.some(e => !e.isSample);
  const activeEntries = hasUserEntries ? moodEntries.filter(e => !e.isSample) : moodEntries;
  const latestEntry = activeEntries.length > 0 ? activeEntries[0] : null;

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => latestEntry?.mood ?? 'good');
  useEffect(() => { if (latestEntry) setSelectedMood(latestEntry.mood); }, [latestEntry]);

  const [moodConfirmedMessage, setMoodConfirmedMessage] = useState<string | null>(null);

  // ── Legacy dashboard state ──────────────────────────────────────────────────
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
    setTimeout(() => setToastMessage(prev => prev === msg ? null : prev), 3500);
  };

  // ── Wellness Plan State ─────────────────────────────────────────────────────

  const [savedActivityIds, setSavedActivityIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
    return new Set();
  });

  useEffect(() => {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify([...savedActivityIds])); } catch { /* ignore */ }
  }, [savedActivityIds]);

  const [feedbackRecord, setFeedbackRecord] = useState<Record<string, ActivityFeedback>>(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_KEY);
      if (raw) return JSON.parse(raw) as Record<string, ActivityFeedback>;
    } catch { /* ignore */ }
    return {};
  });

  useEffect(() => {
    try { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackRecord)); } catch { /* ignore */ }
  }, [feedbackRecord]);

  const [dailyPlan, setDailyPlan] = useState<DailyPlanItem[]>(loadTodayPlan);
  useEffect(() => { saveTodayPlan(dailyPlan); }, [dailyPlan]);

  const [activeWellnessActivity, setActiveWellnessActivity] = useState<WellnessActivity | null>(null);

  // ── Saved Therapists (Pune District) ────────────────────────────────────────
  const [savedTherapistIds, setSavedTherapistIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SAVED_THERAPISTS_KEY);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
    return new Set();
  });

  useEffect(() => {
    try { localStorage.setItem(SAVED_THERAPISTS_KEY, JSON.stringify([...savedTherapistIds])); } catch { /* ignore */ }
  }, [savedTherapistIds]);

  const toggleSaveTherapist = (therapistId: string) => {
    setSavedTherapistIds(prev => {
      const next = new Set(prev);
      if (next.has(therapistId)) {
        next.delete(therapistId);
        showToast('Removed professional from saved list.');
      } else {
        next.add(therapistId);
        showToast('Saved professional to your private list.');
      }
      return next;
    });
  };

  const isTherapistSaved = (therapistId: string) => savedTherapistIds.has(therapistId);

  // ── Derived: Personalized Recommendations ──────────────────────────────────
  const wellnessRecommendations = useMemo(() => {
    if (!latestEntry) return DEFAULT_RECOMMENDATIONS;
    return getRecommendedActivities({
      mood: latestEntry.mood,
      factors: latestEntry.factors,
      stressLevel: latestEntry.stressLevel,
      feedbackRecord,
    });
  }, [latestEntry, feedbackRecord]);

  // ── Mood Operations ─────────────────────────────────────────────────────────

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
      const cleaned = prev.some(e => !e.isSample) ? prev : [];
      return [newEntry, ...cleaned];
    });
    setSelectedMood(newEntry.mood);

    const moodLabels: Record<MoodType, string> = {
      'very-low': 'Very Low', 'low': 'Low', 'okay': 'Okay', 'good': 'Good', 'great': 'Great',
    };
    setMoodConfirmedMessage('Check-in complete. Thank you for taking a moment for yourself.');

    const newLog: ActivityLog = {
      id: `act-mood-${Date.now()}`,
      title: `Mood check-in: ${moodLabels[entryData.mood]}`,
      type: 'mood',
      timestamp: `Today, ${newEntry.time}`,
      badge: 'Recorded in Mood Tracker',
      detail: `Stress: ${entryData.stressLevel}/5 • Sleep: ${entryData.sleepQuality}${entryData.factors.length > 0 ? ` • ${entryData.factors.join(', ')}` : ''}`,
    };
    setRecentActivities(prev => [newLog, ...prev.slice(0, 6)]);
    showToast('Check-in complete. Thank you for taking a moment for yourself.');
    return newEntry;
  };

  const updateMoodEntry = (id: string, updated: Partial<MoodEntry>) => {
    setMoodEntries(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
    showToast('Mood check-in updated successfully.');
  };

  const deleteMoodEntry = (id: string) => {
    setMoodEntries(prev => prev.filter(item => item.id !== id));
    showToast('Check-in removed from your history.');
  };

  const clearAllEntries = () => {
    setMoodEntries([]);
    setSelectedMood(null);
    showToast('Mood check-in history cleared.');
  };

  const loadSampleEntries = () => {
    setMoodEntries(initialSampleEntries);
    setSelectedMood('good');
    showToast('Loaded demonstration entries.');
  };

  const selectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    addMoodEntry({ mood, factors: [], stressLevel: 2, sleepQuality: 'Good' });
  };

  const dismissMoodMessage = () => setMoodConfirmedMessage(null);

  // ── Legacy Dashboard Activity Modal ─────────────────────────────────────────

  const openActivityModal = (activity: Activity) => setActiveModalActivity(activity);
  const closeActivityModal = () => setActiveModalActivity(null);

  const completeActivity = (activityId: string) => {
    const act = defaultActivities.find(a => a.id === activityId);
    if (!act) return;
    setUserProfile(prev => ({
      ...prev,
      completedActivitiesToday: Math.min(prev.totalActivitiesGoal, prev.completedActivitiesToday + 1),
    }));
    const timeStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title: act.title,
      type: 'activity',
      timestamp: timeStr,
      badge: `Completed • ${act.duration}`,
      detail: 'Completed self-care session.',
    };
    setRecentActivities(prev => [newLog, ...prev.slice(0, 6)]);
    closeActivityModal();
    showToast(`Great job! Completed "${act.title}"`);
  };

  // ── Wellness Plan Operations ────────────────────────────────────────────────

  const addToDailyPlan = (activityId: string) => {
    if (dailyPlan.some(p => p.activityId === activityId)) {
      showToast('Already in your plan for today.');
      return;
    }
    if (dailyPlan.length >= 3) {
      showToast('Your daily plan already has 3 activities. Remove one first.');
      return;
    }
    setDailyPlan(prev => [...prev, { activityId, addedAt: new Date().toISOString(), completed: false }]);
    const act = ALL_ACTIVITIES.find(a => a.id === activityId);
    showToast(`Added "${act?.title}" to today's plan.`);
  };

  const removeFromDailyPlan = (activityId: string) => {
    setDailyPlan(prev => prev.filter(p => p.activityId !== activityId));
    showToast('Removed from your daily plan.');
  };

  const markPlanItemComplete = (activityId: string) => {
    setDailyPlan(prev =>
      prev.map(p =>
        p.activityId === activityId
          ? { ...p, completed: true, completedAt: new Date().toISOString() }
          : p
      )
    );
    setUserProfile(prev => ({
      ...prev,
      completedActivitiesToday: Math.min(prev.totalActivitiesGoal, prev.completedActivitiesToday + 1),
    }));
    const act = ALL_ACTIVITIES.find(a => a.id === activityId);
    showToast(`Well done! "${act?.title}" marked complete.`);
  };

  const replacePlanItem = (oldId: string, newId: string) => {
    if (dailyPlan.some(p => p.activityId === newId)) {
      showToast('That activity is already in your plan.');
      return;
    }
    setDailyPlan(prev =>
      prev.map(p =>
        p.activityId === oldId
          ? { activityId: newId, addedAt: new Date().toISOString(), completed: false }
          : p
      )
    );
    const act = ALL_ACTIVITIES.find(a => a.id === newId);
    showToast(`Replaced with "${act?.title}".`);
  };

  const toggleSaved = (activityId: string) => {
    setSavedActivityIds(prev => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
        showToast('Removed from saved activities.');
      } else {
        next.add(activityId);
        showToast('Saved for later.');
      }
      return next;
    });
  };

  const recordFeedback = (activityId: string, feedback: ActivityFeedback) => {
    setFeedbackRecord(prev => ({ ...prev, [activityId]: feedback }));
    const msgs: Record<ActivityFeedback, string> = {
      helpful: 'Glad that helped! We\'ll recommend it again.',
      okay: 'Thanks for the feedback.',
      'not-for-me': 'Noted — we\'ll suggest different activities.',
    };
    showToast(msgs[feedback]);
  };

  const resetPersonalization = () => {
    setFeedbackRecord({});
    try { localStorage.removeItem(FEEDBACK_KEY); } catch { /* ignore */ }
    showToast('Personalization preferences reset.');
  };

  const openWellnessActivity = (activity: WellnessActivity) => setActiveWellnessActivity(activity);
  const closeWellnessActivity = () => setActiveWellnessActivity(null);

  const completeWellnessActivity = (activityId: string) => {
    const act = ALL_ACTIVITIES.find(a => a.id === activityId);
    // Mark complete in daily plan if present
    if (dailyPlan.some(p => p.activityId === activityId && !p.completed)) {
      markPlanItemComplete(activityId);
    }
    setUserProfile(prev => ({
      ...prev,
      completedActivitiesToday: Math.min(prev.totalActivitiesGoal + 1, prev.completedActivitiesToday + 1),
    }));
    const timeStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: ActivityLog = {
      id: `wact-${Date.now()}`,
      title: act?.title ?? 'Wellness activity',
      type: 'activity',
      timestamp: timeStr,
      badge: `Completed • ${act?.estimatedDuration ?? ''}`,
      detail: 'Completed from Wellness Plan.',
    };
    setRecentActivities(prev => [newLog, ...prev.slice(0, 6)]);
    closeWellnessActivity();
    // Toast will come from feedback flow — don't double-toast here
  };

  // ── Metrics ─────────────────────────────────────────────────────────────────
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
        // Wellness plan
        wellnessRecommendations,
        allWellnessActivities: ALL_ACTIVITIES,
        dailyPlan,
        addToDailyPlan,
        removeFromDailyPlan,
        markPlanItemComplete,
        replacePlanItem,
        savedActivityIds,
        toggleSaved,
        feedbackRecord,
        recordFeedback,
        resetPersonalization,
        activeWellnessActivity,
        openWellnessActivity,
        closeWellnessActivity,
        completeWellnessActivity,
        // Saved therapists (Pune District)
        savedTherapistIds,
        toggleSaveTherapist,
        isTherapistSaved,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) throw new Error('useWellness must be used within a WellnessProvider');
  return context;
};
