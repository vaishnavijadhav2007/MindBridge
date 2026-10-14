// ─── Wellness Plan Types ───────────────────────────────────────────────────

export type WellnessCategory =
  | 'Relaxation'
  | 'Focus'
  | 'Reflection'
  | 'Sleep'
  | 'Breathing'
  | 'Physical';

export type ActivityFeedback = 'helpful' | 'okay' | 'not-for-me';

export type DurationFilter = 'all' | '2min' | '5min' | '10-15min';

export interface WellnessActivity {
  id: string;
  title: string;
  shortDescription: string;    // one sentence
  whyItHelps: string;          // brief rationale
  estimatedDuration: string;   // e.g. "2 minutes"
  durationMinutes: number;     // numeric for filtering
  category: WellnessCategory;
  // Tags used for recommendation matching
  tags: string[];
  // Activity type determines which interactive modal to use
  activityType: 'breathing' | 'grounding' | 'journaling' | 'focus-timer' | 'gratitude' | 'simple';
  // For "simple" type — list of steps shown in modal
  steps?: string[];
  completionPrompt?: string;   // friendly note shown at finish
}

export interface DailyPlanItem {
  activityId: string;
  addedAt: string;   // ISO timestamp
  completed: boolean;
  completedAt?: string;
}

export interface FeedbackRecord {
  activityId: string;
  feedback: ActivityFeedback;
  recordedAt: string;
}
