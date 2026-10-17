export interface DbProfile {
  id: string; // UUID references auth.users(id)
  display_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  streak_days: number;
  daily_goal: string;
  store_journal_consent: boolean;
  store_chat_consent: boolean;
  wellness_analysis_consent?: boolean;
  consent_updated_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMoodCheckin {
  id: string; // UUID
  user_id: string;
  selected_mood: 'very-low' | 'low' | 'okay' | 'good' | 'great';
  stress_level: number;
  sleep_quality: 'Very Poor' | 'Poor' | 'Fair' | 'Good' | 'Excellent';
  factors: string[];
  journal_note: string | null;
  checkin_date: string; // YYYY-MM-DD
  checkin_time: string | null; // e.g. "9:15 AM"
  created_at: string;
  updated_at: string;
}

export interface DbWellnessPlan {
  id: string;
  user_id: string;
  plan_date: string; // YYYY-MM-DD
  selected_activities: {
    activityId: string;
    completed: boolean;
    completedAt?: string;
    orderIndex?: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface DbSavedActivity {
  id: string;
  user_id: string;
  activity_id: string;
  saved_at: string;
}

export interface DbActivityFeedback {
  id: string;
  user_id: string;
  activity_id: string;
  feedback_choice: 'helpful' | 'okay' | 'not-for-me';
  created_at: string;
}

export interface DbSavedTherapist {
  id: string;
  user_id: string;
  therapist_id: string;
  saved_at: string;
}

export interface DbChatConversation {
  id: string;
  user_id: string;
  title: string;
  consent_to_store: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface DbScreeningAssessment {
  id: string; // UUID
  user_id: string;
  assessment_type: 'PHQ-9' | 'GAD-7' | 'PSS-4' | 'WHO-5';
  score: number;
  max_score: number;
  severity: string;
  answers: Record<string, number>;
  notes: string | null;
  created_at: string;
}

export interface DbWellnessAnalysisReport {
  id: string; // UUID
  user_id: string;
  summary_text: string;
  key_insights: {
    category: string;
    text: string;
    level?: 'positive' | 'neutral' | 'attention';
  }[];
  recommended_activity_ids: string[];
  recommended_therapist_specialties: string[];
  crisis_flag: boolean;
  model_source?: string;
  created_at: string;
}
