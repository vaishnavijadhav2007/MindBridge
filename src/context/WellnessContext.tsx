import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MoodType, MoodEntry, Activity, ActivityLog, UserProfile, SleepQuality } from '../types';
import { WellnessActivity, DailyPlanItem, FeedbackRecord, ActivityFeedback } from '../types/wellness';
import {
  ALL_ACTIVITIES,
  DEFAULT_RECOMMENDATIONS,
  getRecommendedActivities,
} from '../services/wellnessActivities';
import { useAuth } from './AuthContext';
import {
  fetchUserMoodCheckins,
  insertUserMoodCheckin,
  updateUserMoodCheckin,
  deleteUserMoodCheckin,
  exportAllUserData,
  purgeAllUserData,
} from '../services/moodService';
import {
  fetchUserDailyPlan,
  saveUserDailyPlan,
  fetchUserSavedActivities,
  toggleUserSavedActivity,
  fetchUserActivityFeedback,
  saveUserActivityFeedback,
} from '../services/wellnessPlanService';
import {
  fetchUserSavedTherapists,
  toggleUserSavedTherapist,
} from '../services/therapistBookmarkService';

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
  }) => Promise<MoodEntry | null>;
  updateMoodEntry: (id: string, entryData: Partial<MoodEntry>) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  clearAllEntries: () => Promise<void>;
  loadSampleEntries: () => void;
  hasUserEntries: boolean;
  isLoadingDb: boolean;

  // Current active / latest mood
  selectedMood: MoodType | null;
  selectMood: (mood: MoodType) => void;
  latestEntry: MoodEntry | null;
  moodConfirmedMessage: string | null;
  dismissMoodMessage: () => void;

  // Mental wellness calculated overview
  averageStress: number | null;
  completedCheckinsCount: number;

  // User Profile
  userProfile: UserProfile;
  recommendedActivities: Activity[];
  recentActivities: ActivityLog[];
  activeModalActivity: Activity | null;
  openActivityModal: (activity: Activity) => void;
  closeActivityModal: () => void;
  completeActivity: (activityId: string) => void;

  // ── Wellness Plan ──────────────────────────────────────────────
  wellnessRecommendations: WellnessActivity[];
  allWellnessActivities: WellnessActivity[];
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

  // Data Privacy & Export
  exportData: () => Promise<any>;
  purgeData: () => Promise<void>;

  // Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

// ─── Local Storage Keys (Fallback & Demo Mode) ──────────────────────────────
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
    time: '8:45 PM',
    mood: 'good',
    factors: ['Rest & Relaxation', 'Social Life'],
    stressLevel: 2,
    sleepQuality: 'Good',
    journalNote: 'Evening walk with a friend really helped clear my mind.',
    isSample: true,
  },
  {
    id: 'sample-3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '11:15 AM',
    mood: 'low',
    factors: ['Health & Body', 'Sleep'],
    stressLevel: 4,
    sleepQuality: 'Poor',
    journalNote: 'Did not sleep well. Feeling sluggish and overwhelmed.',
    isSample: true,
  },
  {
    id: 'sample-4',
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '9:00 AM',
    mood: 'good',
    factors: ['Personal Time', 'Weather'],
    stressLevel: 2,
    sleepQuality: 'Good',
    journalNote: 'Feeling more centered today. Ready to take things one step at a time.',
    isSample: true,
  },
];

const defaultActivities: Activity[] = [
  {
    id: 'act-1',
    title: '4-4-4 Box Breathing',
    duration: '3 mins',
    category: 'Breathing',
    description: 'Equal ratio breathing to balance the nervous system.',
    steps: ['Inhale slowly for 4 seconds', 'Hold gently for 4 seconds', 'Exhale smoothly for 4 seconds', 'Rest for 4 seconds'],
    tips: 'Rest hands on your lap and drop your shoulders away from your ears.',
  },
  {
    id: 'act-2',
    title: 'Unsent Thought Release',
    duration: '5 mins',
    category: 'Journaling',
    description: 'Write circling thoughts freely to let them go.',
    steps: ['Write without editing or filtering', 'Focus on what feels heavy right now', 'Close when you feel ready'],
    tips: 'This space is strictly private and temporary.',
  },
  {
    id: 'act-3',
    title: 'Gentle Neck & Shoulder Release',
    duration: '4 mins',
    category: 'Physical',
    description: 'Relieve accumulated tension from screen time and study.',
    steps: ['Slowly tilt head to the right shoulder', 'Hold for 3 deep breaths', 'Repeat on the left', 'Roll shoulders back 5 times'],
    tips: 'Move smoothly and never force a stretch.',
  },
];

const initialRecentLogs: ActivityLog[] = [
  {
    id: 'log-1',
    title: 'Morning Check-in recorded',
    type: 'mood',
    timestamp: 'Today at 9:00 AM',
    badge: 'Good Mood',
    detail: 'Stress: 2/5 • Sleep: Good',
  },
  {
    id: 'log-2',
    title: 'Completed Box Breathing',
    type: 'activity',
    timestamp: 'Yesterday at 3:15 PM',
    badge: '3 mins',
    detail: 'Breathing reset',
  },
  {
    id: 'log-3',
    title: 'Completed Gentle Stretch',
    type: 'activity',
    timestamp: '2 days ago',
    badge: '4 mins',
    detail: 'Physical relaxation',
  },
];

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isConfigured } = useAuth();

  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((prev) => (prev === msg ? null : prev)), 3800);
  }, []);

  // ── Mood Entries State ──────────────────────────────────────────────────────
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

  // ── Derived Mood State ──────────────────────────────────────────────────────
  const hasUserEntries = moodEntries.some((e) => !e.isSample);
  const activeEntries = hasUserEntries ? moodEntries.filter((e) => !e.isSample) : moodEntries;
  const latestEntry = activeEntries.length > 0 ? activeEntries[0] : null;

  // ── Wellness Plan State ─────────────────────────────────────────────────────
  const [dailyPlan, setDailyPlan] = useState<DailyPlanItem[]>(() => {
    try {
      const raw = localStorage.getItem(PLAN_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.date === getTodayString() && Array.isArray(parsed?.items)) {
          return parsed.items;
        }
      }
    } catch { /* ignore */ }
    return DEFAULT_RECOMMENDATIONS.slice(0, 3).map((a) => ({
      activityId: a.id,
      completed: false,
    }));
  });

  const [savedActivityIds, setSavedActivityIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
    return new Set();
  });

  const [feedbackRecord, setFeedbackRecord] = useState<Record<string, ActivityFeedback>>(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_KEY);
      if (raw) return JSON.parse(raw) as Record<string, ActivityFeedback>;
    } catch { /* ignore */ }
    return {};
  });

  const [savedTherapistIds, setSavedTherapistIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SAVED_THERAPISTS_KEY);
      if (raw) return new Set(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
    return new Set();
  });

  // ── User Profile ────────────────────────────────────────────────────────────
  const userProfile: UserProfile = useMemo(() => {
    const fallbackName = user?.email ? user.email.split('@')[0] : 'Sarah Chen';
    return {
      name: profile?.display_name || user?.user_metadata?.name || fallbackName,
      email: user?.email || (user ? '' : 'sarah.chen@example.com'),
      avatar: profile?.avatar_url || undefined,
      streakDays: profile?.streak_days ?? (activeEntries.length > 0 ? 1 : (user ? 0 : 4)),
      currentGoal: profile?.daily_goal || 'Mindful 10 mins daily',
      completedActivitiesToday: dailyPlan.filter((p) => p.completed).length,
      totalActivitiesGoal: dailyPlan.length || 3,
    };
  }, [user, profile, dailyPlan, activeEntries.length]);

  // ── Load Real Data from Supabase when Authenticated or Reset on Logout ─────────
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      // User logged out or unauthenticated: reset state to defaults
      if (!isConfigured) {
        setMoodEntries(initialSampleEntries);
        setSelectedMood('good');
        setRecentActivities(initialRecentLogs);
      }
      return;
    }

    if (!isConfigured) {
      return;
    }

    async function loadCloudData() {
      if (!user) return;
      setIsLoadingDb(true);

      try {
        // 1. Fetch Mood Checkins
        const { data: cloudMoods, error: moodErr } = await fetchUserMoodCheckins(user.id);
        if (isMounted) {
          if (!moodErr) {
            if (cloudMoods.length > 0) {
              setMoodEntries(cloudMoods);
              setSelectedMood(cloudMoods[0].mood);
              // Map real database check-ins into recent activities list
              const moodLogs: ActivityLog[] = cloudMoods.slice(0, 5).map((entry) => ({
                id: `log-${entry.id}`,
                title: `${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1).replace('-', ' ')} Mood Check-in recorded`,
                type: 'mood',
                timestamp: `${entry.date} at ${entry.time}`,
                badge: `${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1).replace('-', ' ')} Mood`,
                detail: `Stress: ${entry.stressLevel}/5 • Sleep: ${entry.sleepQuality}${
                  entry.journalNote ? ` • "${entry.journalNote.slice(0, 30)}..."` : ''
                }`,
              }));
              setRecentActivities(moodLogs);
            } else {
              // New user on database: start with clean slate (no fake demo entries)
              setMoodEntries([]);
              setSelectedMood(null);
              setRecentActivities([]);
            }
          } else {
            showToast(`Database: ${moodErr}`);
          }
        }

        // 2. Fetch Daily Wellness Plan
        const todayStr = getTodayString();
        const { data: cloudPlan, error: planErr } = await fetchUserDailyPlan(user.id, todayStr);
        if (!planErr && cloudPlan && isMounted) {
          setDailyPlan(cloudPlan);
        }

        // 3. Fetch Saved Activities
        const { data: cloudSavedActs } = await fetchUserSavedActivities(user.id);
        if (isMounted && cloudSavedActs) {
          setSavedActivityIds(cloudSavedActs);
        }

        // 4. Fetch Activity Feedback
        const { data: cloudFeedback } = await fetchUserActivityFeedback(user.id);
        if (isMounted && cloudFeedback) {
          setFeedbackRecord(cloudFeedback);
        }

        // 5. Fetch Saved Therapists
        const { data: cloudTherapists } = await fetchUserSavedTherapists(user.id);
        if (isMounted && cloudTherapists) {
          setSavedTherapistIds(cloudTherapists);
        }
      } catch {
        // Handled silently to avoid crashing UI
      } finally {
        if (isMounted) setIsLoadingDb(false);
      }
    }

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, [user, isConfigured, showToast]);

  // Sync to local storage fallback when user is in demo mode
  useEffect(() => {
    if (!isConfigured || !user) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(moodEntries)); } catch { /* ignore */ }
    }
  }, [moodEntries, isConfigured, user]);

  useEffect(() => {
    if (!isConfigured || !user) {
      try {
        localStorage.setItem(
          PLAN_KEY,
          JSON.stringify({ date: getTodayString(), items: dailyPlan })
        );
      } catch { /* ignore */ }
    }
  }, [dailyPlan, isConfigured, user]);

  useEffect(() => {
    if (!isConfigured || !user) {
      try { localStorage.setItem(SAVED_KEY, JSON.stringify([...savedActivityIds])); } catch { /* ignore */ }
    }
  }, [savedActivityIds, isConfigured, user]);

  useEffect(() => {
    if (!isConfigured || !user) {
      try { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackRecord)); } catch { /* ignore */ }
    }
  }, [feedbackRecord, isConfigured, user]);

  useEffect(() => {
    if (!isConfigured || !user) {
      try { localStorage.setItem(SAVED_THERAPISTS_KEY, JSON.stringify([...savedTherapistIds])); } catch { /* ignore */ }
    }
  }, [savedTherapistIds, isConfigured, user]);

  // ── Selected Mood State ─────────────────────────────────────────────────────

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => latestEntry?.mood ?? 'good');
  useEffect(() => {
    if (latestEntry) setSelectedMood(latestEntry.mood);
  }, [latestEntry]);

  const [moodConfirmedMessage, setMoodConfirmedMessage] = useState<string | null>(null);

  // ── Legacy dashboard state ──────────────────────────────────────────────────
  const [activeModalActivity, setActiveModalActivity] = useState<Activity | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>(initialRecentLogs);
  const [activeWellnessActivity, setActiveWellnessActivity] = useState<WellnessActivity | null>(null);

  // ── Personalized Recommendations ───────────────────────────────────────────
  const wellnessRecommendations = useMemo(() => {
    if (!latestEntry) return DEFAULT_RECOMMENDATIONS;
    return getRecommendedActivities({
      mood: latestEntry.mood,
      factors: latestEntry.factors,
      stressLevel: latestEntry.stressLevel,
      feedbackRecord,
    });
  }, [latestEntry, feedbackRecord]);

  // ── Mood Operations (Cloud + Optimistic UI) ─────────────────────────────────

  const addMoodEntry = async (entryData: {
    mood: MoodType;
    factors: string[];
    stressLevel: number;
    sleepQuality: SleepQuality;
    journalNote?: string;
  }): Promise<MoodEntry | null> => {
    const now = new Date();
    const optimisticEntry: MoodEntry = {
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

    // If Supabase is configured and user is authenticated, save to database
    if (isConfigured && user) {
      const { data: dbEntry, error } = await insertUserMoodCheckin(user.id, entryData);
      if (error) {
        showToast(`Save failed: ${error}`);
        return null;
      }
      if (dbEntry) {
        setMoodEntries((prev) => [dbEntry, ...prev.filter((e) => !e.isSample)]);
        setSelectedMood(dbEntry.mood);
        setMoodConfirmedMessage("Today's mood saved securely to your private journal.");
        showToast('Check-in recorded securely in database.');

        // Prepend new mood check-in to recent activities
        const newLog: ActivityLog = {
          id: `log-${dbEntry.id}`,
          title: `${dbEntry.mood.charAt(0).toUpperCase() + dbEntry.mood.slice(1).replace('-', ' ')} Mood Check-in recorded`,
          type: 'mood',
          timestamp: 'Just now',
          badge: `${dbEntry.mood.charAt(0).toUpperCase() + dbEntry.mood.slice(1).replace('-', ' ')} Mood`,
          detail: `Stress: ${dbEntry.stressLevel}/5 • Sleep: ${dbEntry.sleepQuality}${
            dbEntry.journalNote ? ` • "${dbEntry.journalNote.slice(0, 30)}..."` : ''
          }`,
        };
        setRecentActivities((prev) => [newLog, ...prev.filter((l) => l.id !== newLog.id).slice(0, 5)]);

        return dbEntry;
      }
    }

    // Fallback / Demo Mode: save locally
    setMoodEntries((prev) => [optimisticEntry, ...prev.filter((e) => !e.isSample)]);
    setSelectedMood(optimisticEntry.mood);
    setMoodConfirmedMessage("Today's mood recorded.");
    showToast('Check-in recorded.');

    const demoLog: ActivityLog = {
      id: `log-${optimisticEntry.id}`,
      title: `${optimisticEntry.mood.charAt(0).toUpperCase() + optimisticEntry.mood.slice(1).replace('-', ' ')} Mood Check-in recorded`,
      type: 'mood',
      timestamp: 'Just now',
      badge: `${optimisticEntry.mood.charAt(0).toUpperCase() + optimisticEntry.mood.slice(1).replace('-', ' ')} Mood`,
      detail: `Stress: ${optimisticEntry.stressLevel}/5 • Sleep: ${optimisticEntry.sleepQuality}${
        optimisticEntry.journalNote ? ` • "${optimisticEntry.journalNote.slice(0, 30)}..."` : ''
      }`,
    };
    setRecentActivities((prev) => [demoLog, ...prev.filter((l) => l.id !== demoLog.id).slice(0, 5)]);

    return optimisticEntry;
  };

  const updateMoodEntry = async (id: string, entryData: Partial<MoodEntry>): Promise<void> => {
    setMoodEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...entryData } : entry))
    );

    if (isConfigured && user) {
      const { error } = await updateUserMoodCheckin(user.id, id, {
        mood: entryData.mood,
        factors: entryData.factors,
        stressLevel: entryData.stressLevel,
        sleepQuality: entryData.sleepQuality,
        journalNote: entryData.journalNote,
      });
      if (error) {
        showToast(`Failed to update check-in: ${error}`);
      } else {
        showToast('Check-in updated in database.');
      }
    } else {
      showToast('Check-in updated.');
    }
  };

  const deleteMoodEntry = async (id: string): Promise<void> => {
    setMoodEntries((prev) => prev.filter((entry) => entry.id !== id));
    setRecentActivities((prev) => prev.filter((l) => l.id !== `log-${id}`));

    if (isConfigured && user) {
      const { error } = await deleteUserMoodCheckin(user.id, id);
      if (error) {
        showToast(`Failed to delete check-in: ${error}`);
      } else {
        showToast('Entry removed from your database journal.');
      }
    } else {
      showToast('Entry removed.');
    }
  };

  const clearAllEntries = async (): Promise<void> => {
    setMoodEntries([]);
    setSelectedMood(null);

    if (isConfigured && user) {
      for (const entry of moodEntries) {
        if (!entry.isSample) {
          await deleteUserMoodCheckin(user.id, entry.id);
        }
      }
      showToast('All journal check-ins cleared.');
    } else {
      showToast('All check-ins cleared.');
    }
  };

  const loadSampleEntries = () => {
    setMoodEntries(initialSampleEntries);
    showToast('Loaded sample reflection entries.');
  };

  // ── Wellness Plan Operations ────────────────────────────────────────────────

  const addToDailyPlan = (activityId: string) => {
    if (dailyPlan.length >= 5) {
      showToast('Daily plan max reached (5 activities).');
      return;
    }
    if (dailyPlan.some((p) => p.activityId === activityId)) {
      showToast('Activity is already in today’s plan.');
      return;
    }

    const updated = [...dailyPlan, { activityId, addedAt: new Date().toISOString(), completed: false }];
    setDailyPlan(updated);
    showToast('Added to today’s plan.');

    if (isConfigured && user) {
      saveUserDailyPlan(user.id, getTodayString(), updated);
    }
  };

  const removeFromDailyPlan = (activityId: string) => {
    const updated = dailyPlan.filter((p) => p.activityId !== activityId);
    setDailyPlan(updated);
    showToast('Removed from daily plan.');

    if (isConfigured && user) {
      saveUserDailyPlan(user.id, getTodayString(), updated);
    }
  };

  const markPlanItemComplete = (activityId: string) => {
    const updated = dailyPlan.map((p) => {
      if (p.activityId !== activityId) return p;
      const nextCompleted = !p.completed;
      return {
        ...p,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : undefined,
      };
    });
    setDailyPlan(updated);

    const item = updated.find((p) => p.activityId === activityId);
    if (item?.completed) {
      showToast('Activity marked as complete! Well done.');
    }

    if (isConfigured && user) {
      saveUserDailyPlan(user.id, getTodayString(), updated);
    }
  };

  const replacePlanItem = (oldId: string, newId: string) => {
    const updated = dailyPlan.map((p) => (p.activityId === oldId ? { activityId: newId, addedAt: new Date().toISOString(), completed: false } : p));
    setDailyPlan(updated);
    showToast('Replaced activity in your plan.');

    if (isConfigured && user) {
      saveUserDailyPlan(user.id, getTodayString(), updated);
    }
  };

  const toggleSaved = (activityId: string) => {
    const currentlySaved = savedActivityIds.has(activityId);
    setSavedActivityIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) {
        next.delete(activityId);
        showToast('Activity removed from saved.');
      } else {
        next.add(activityId);
        showToast('Activity saved to your private library.');
      }
      return next;
    });

    if (isConfigured && user) {
      toggleUserSavedActivity(user.id, activityId, currentlySaved);
    }
  };

  const recordFeedback = (activityId: string, feedback: ActivityFeedback) => {
    setFeedbackRecord((prev) => ({ ...prev, [activityId]: feedback }));
    showToast('Thank you for your feedback! We will tailor future suggestions.');

    if (isConfigured && user) {
      saveUserActivityFeedback(user.id, activityId, feedback);
    }
  };

  const resetPersonalization = () => {
    setFeedbackRecord({});
    showToast('Reset activity recommendations to default.');
  };

  // ── Saved Therapists Operations ─────────────────────────────────────────────

  const toggleSaveTherapist = (therapistId: string) => {
    const currentlySaved = savedTherapistIds.has(therapistId);
    setSavedTherapistIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) {
        next.delete(therapistId);
        showToast('Removed professional from saved list.');
      } else {
        next.add(therapistId);
        showToast('Saved professional to your private list.');
      }
      return next;
    });

    if (isConfigured && user) {
      toggleUserSavedTherapist(user.id, therapistId, currentlySaved);
    }
  };

  const isTherapistSaved = (therapistId: string) => savedTherapistIds.has(therapistId);

  // ── Data Export & Purge ─────────────────────────────────────────────────────

  const exportData = async () => {
    if (isConfigured && user) {
      const { data, error } = await exportAllUserData(user.id);
      if (error) {
        showToast('Export failed. Please try again.');
        return null;
      }
      return data;
    }
    // Demo export
    return {
      exportedAt: new Date().toISOString(),
      service: 'MindBridge — AI Mental Wellness Companion',
      moodEntries,
      dailyPlan,
      savedActivities: [...savedActivityIds],
      feedbackRecord,
      savedTherapists: [...savedTherapistIds],
    };
  };

  const purgeData = async () => {
    if (isConfigured && user) {
      const { error } = await purgeAllUserData(user.id);
      if (error) {
        showToast('Unable to purge data. Please try again.');
        return;
      }
    }

    setMoodEntries([]);
    setDailyPlan([]);
    setSavedActivityIds(new Set());
    setFeedbackRecord({});
    setSavedTherapistIds(new Set());
    showToast('All personal wellness data has been permanently deleted.');
  };

  // ── Interactive Activity Modal Operations ───────────────────────────────────

  const openWellnessActivity = (activity: WellnessActivity) => setActiveWellnessActivity(activity);
  const closeWellnessActivity = () => setActiveWellnessActivity(null);
  const completeWellnessActivity = (activityId: string) => {
    markPlanItemComplete(activityId);
    setActiveWellnessActivity(null);
  };

  // ── Legacy Modal Operations ─────────────────────────────────────────────────
  const openActivityModal = (activity: Activity) => setActiveModalActivity(activity);
  const closeActivityModal = () => setActiveModalActivity(null);
  const completeActivity = (activityId: string) => {
    const found = defaultActivities.find((a) => a.id === activityId);
    if (found) {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        title: `Completed ${found.title}`,
        type: 'activity',
        timestamp: 'Just now',
        badge: found.duration,
        detail: found.category,
      };
      setRecentActivities((prev) => [newLog, ...prev.slice(0, 5)]);
      showToast(`Completed ${found.title}! Well done.`);
    }
    setActiveModalActivity(null);
  };

  const selectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    addMoodEntry({
      mood,
      factors: [],
      stressLevel: 3,
      sleepQuality: 'Good',
    });
  };
  const dismissMoodMessage = () => setMoodConfirmedMessage(null);

  // ── Calculations ────────────────────────────────────────────────────────────
  const averageStress = useMemo(() => {
    if (activeEntries.length === 0) return null;
    const sum = activeEntries.reduce((acc, curr) => acc + curr.stressLevel, 0);
    return Math.round((sum / activeEntries.length) * 10) / 10;
  }, [activeEntries]);

  const completedCheckinsCount = activeEntries.length;

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
        isLoadingDb,
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
        // Data Privacy
        exportData,
        purgeData,
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
