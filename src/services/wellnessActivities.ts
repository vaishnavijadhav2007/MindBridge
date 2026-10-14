import { WellnessActivity } from '../types/wellness';
import { MoodType } from '../types';

// ─── Full Activity Catalog ──────────────────────────────────────────────────

export const ALL_ACTIVITIES: WellnessActivity[] = [
  {
    id: 'act-breathing',
    title: 'Mindful Breathing',
    shortDescription: 'A gentle 4-4-4 breathing exercise to calm your nervous system.',
    whyItHelps: 'Slow, rhythmic breathing activates the body\'s rest-and-digest response, helping reduce feelings of stress and anxiety within minutes.',
    estimatedDuration: '2 minutes',
    durationMinutes: 2,
    category: 'Breathing',
    tags: ['anxiety', 'stress', 'overwhelm', 'academic', 'quick'],
    activityType: 'breathing',
    completionPrompt: 'Well done. Even two minutes of mindful breathing can shift your entire state.',
  },
  {
    id: 'act-grounding',
    title: 'Grounding Exercise',
    shortDescription: 'A 5-4-3-2-1 sensory awareness exercise to anchor yourself in the present moment.',
    whyItHelps: 'Grounding techniques interrupt anxious thought spirals by directing attention to immediate sensory experience, which calms the stress response.',
    estimatedDuration: '3 minutes',
    durationMinutes: 3,
    category: 'Relaxation',
    tags: ['anxiety', 'overwhelm', 'panic', 'stress', 'grounding'],
    activityType: 'grounding',
    completionPrompt: 'You are here. You are grounded. That took courage.',
  },
  {
    id: 'act-journaling',
    title: 'Guided Journaling',
    shortDescription: 'Answer a gentle reflective question to release circling thoughts and gain clarity.',
    whyItHelps: 'Writing about emotions externalises inner experiences, helping to organise thoughts and reduce the mental load of unprocessed feelings.',
    estimatedDuration: '5 minutes',
    durationMinutes: 5,
    category: 'Reflection',
    tags: ['low-mood', 'anxiety', 'overwhelm', 'stress', 'family', 'relationships', 'reflection'],
    activityType: 'journaling',
    completionPrompt: 'Thank you for giving your thoughts a voice. That\'s a meaningful act of self-care.',
  },
  {
    id: 'act-focus',
    title: 'Study Focus Session',
    shortDescription: 'A 15-minute focused work timer to help you make a start on one task.',
    whyItHelps: 'Breaking study into timed intervals reduces overwhelm and makes it easier to begin, especially when motivation is low.',
    estimatedDuration: '15 minutes',
    durationMinutes: 15,
    category: 'Focus',
    tags: ['academic', 'stress', 'procrastination', 'focus'],
    activityType: 'focus-timer',
    completionPrompt: 'Excellent focus. One step at a time really does add up.',
  },
  {
    id: 'act-gratitude',
    title: 'Gratitude Reflection',
    shortDescription: 'Gently notice three things — big or small — that you appreciate right now.',
    whyItHelps: 'Gratitude practice has been linked to improved mood and wellbeing by redirecting attention toward positive aspects of daily life.',
    estimatedDuration: '3 minutes',
    durationMinutes: 3,
    category: 'Reflection',
    tags: ['low-mood', 'mood-boost', 'gratitude', 'reflection'],
    activityType: 'gratitude',
    completionPrompt: 'Noticing the good takes practice. You\'re doing beautifully.',
  },
  {
    id: 'act-stretch',
    title: 'Gentle Stretch Break',
    shortDescription: 'Simple neck, shoulder, and back stretches to release tension after sitting.',
    whyItHelps: 'Gentle movement releases muscle tension, improves circulation, and provides a natural mood lift through movement.',
    estimatedDuration: '5 minutes',
    durationMinutes: 5,
    category: 'Physical',
    tags: ['academic', 'stress', 'low-mood', 'energy', 'physical'],
    activityType: 'simple',
    steps: [
      'Stand up or sit tall. Close your eyes for a few seconds and take one deep breath.',
      'Gently roll your shoulders backwards five times, then forward five times.',
      'Tilt your head to the right, bringing your ear toward your shoulder. Hold for 3 slow breaths. Repeat on the left.',
      'Interlace your fingers, stretch your arms above your head, and hold for 5 breaths.',
      'If seated: gently twist to the right, hold for 3 breaths, then twist left.',
      'Finish with one final deep breath. Notice how your body feels right now.',
    ],
    completionPrompt: 'Movement is medicine. Your body thanks you.',
  },
  {
    id: 'act-wind-down',
    title: 'Bedtime Wind-Down',
    shortDescription: 'A calming evening routine to signal to your body that it\'s time to rest.',
    whyItHelps: 'A consistent pre-sleep routine reduces cortisol and prepares the nervous system for quality sleep, even when the mind feels busy.',
    estimatedDuration: '10 minutes',
    durationMinutes: 10,
    category: 'Sleep',
    tags: ['sleep', 'wind-down', 'relaxation', 'bedtime'],
    activityType: 'simple',
    steps: [
      'Dim your lights or switch to a warmer lamp. Put your phone face-down.',
      'Make a warm, caffeine-free drink if you enjoy one — herbal tea or warm water with honey.',
      'Spend 3 minutes writing down any thoughts still circling your mind onto paper — this "offloads" them so your mind can rest.',
      'Do 5 slow diaphragmatic breaths: inhale for 4 counts, exhale for 6 counts.',
      'Lie down in a comfortable position. Do a gentle body scan from feet to head, releasing any tightness you notice.',
      'Allow yourself to drift without pressure. You have given yourself the gift of rest.',
    ],
    completionPrompt: 'Rest is not laziness — it is the foundation of everything else. Sleep well.',
  },
  {
    id: 'act-worry-action',
    title: 'Worry-to-Action Worksheet',
    shortDescription: 'Identify one worry and find one small, manageable step you can take today.',
    whyItHelps: 'Converting vague worries into specific, small actions reduces anxious rumination and restores a sense of agency and control.',
    estimatedDuration: '5 minutes',
    durationMinutes: 5,
    category: 'Reflection',
    tags: ['anxiety', 'overwhelm', 'academic', 'stress', 'family', 'worry'],
    activityType: 'journaling',
    completionPrompt: 'You turned a worry into a step forward. That\'s genuine progress.',
  },
];

// ─── Recommendation Rules ───────────────────────────────────────────────────
// Simple, transparent rules based on self-reported mood and factors.
// These do NOT diagnose or treat any mental health condition.

const MOOD_SCORE: Record<MoodType, number> = {
  'very-low': 1,
  'low': 2,
  'okay': 3,
  'good': 4,
  'great': 5,
};

interface RecommendationContext {
  mood: MoodType | null;
  factors: string[];           // e.g. ["Studies or Work", "Sleep"]
  stressLevel: number | null;  // 1–5
  feedbackRecord: Record<string, 'helpful' | 'okay' | 'not-for-me'>;
}

function scoredTags(factor: string): string[] {
  const f = factor.toLowerCase();
  if (f.includes('stud') || f.includes('work') || f.includes('academic')) return ['academic', 'focus', 'stress'];
  if (f.includes('sleep')) return ['sleep', 'wind-down'];
  if (f.includes('famil') || f.includes('relation')) return ['family', 'relationships', 'reflection'];
  if (f.includes('anxiet') || f.includes('overwh')) return ['anxiety', 'overwhelm'];
  if (f.includes('health')) return ['physical', 'relaxation'];
  return ['reflection'];
}

export function getRecommendedActivities(
  ctx: RecommendationContext
): WellnessActivity[] {
  const { mood, factors, stressLevel, feedbackRecord } = ctx;

  // Exclude "not-for-me" rated activities from recommendations
  const excluded = new Set(
    Object.entries(feedbackRecord)
      .filter(([, v]) => v === 'not-for-me')
      .map(([k]) => k)
  );

  const eligible = ALL_ACTIVITIES.filter(a => !excluded.has(a.id));

  // Determine tag priorities based on mood and factors
  let priorityTags: string[] = [];

  // Factor-based tags
  for (const f of factors) {
    priorityTags.push(...scoredTags(f));
  }

  // Mood-based tags
  if (mood) {
    const score = MOOD_SCORE[mood];
    if (score <= 2) priorityTags.push('low-mood', 'mood-boost', 'grounding');
    if (score <= 3 && (stressLevel ?? 3) >= 3) priorityTags.push('stress', 'anxiety');
    if (score >= 4) priorityTags.push('focus', 'reflection');
  }

  // High stress override: always recommend breathing first
  if ((stressLevel ?? 3) >= 4) {
    priorityTags = ['anxiety', 'stress', 'grounding', ...priorityTags];
  }

  // Score each activity
  const scored = eligible.map(a => {
    const matches = a.tags.filter(t => priorityTags.includes(t)).length;
    // Boost "helpful" rated activities
    const boost = feedbackRecord[a.id] === 'helpful' ? 2 : 0;
    return { activity: a, score: matches + boost };
  });

  // Sort by score desc, then deterministic by id so order is stable
  scored.sort((a, b) => b.score - a.score || a.activity.id.localeCompare(b.activity.id));

  // Return top 6, guaranteed unique
  return scored.slice(0, 6).map(s => s.activity);
}

/** General wellness activities shown when no mood check-in exists */
export const DEFAULT_RECOMMENDATIONS: WellnessActivity[] = [
  ALL_ACTIVITIES.find(a => a.id === 'act-breathing')!,
  ALL_ACTIVITIES.find(a => a.id === 'act-gratitude')!,
  ALL_ACTIVITIES.find(a => a.id === 'act-stretch')!,
  ALL_ACTIVITIES.find(a => a.id === 'act-grounding')!,
  ALL_ACTIVITIES.find(a => a.id === 'act-journaling')!,
  ALL_ACTIVITIES.find(a => a.id === 'act-focus')!,
];
