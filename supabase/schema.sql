-- ==============================================================================
-- MindBridge — AI Mental Wellness Companion
-- Complete PostgreSQL Database Schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- Table: public.profiles
-- User profile linked to Supabase Auth
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'English',
  streak_days INTEGER NOT NULL DEFAULT 1,
  daily_goal TEXT NOT NULL DEFAULT 'Mindful 10 mins daily',
  store_journal_consent BOOLEAN NOT NULL DEFAULT true,
  store_chat_consent BOOLEAN NOT NULL DEFAULT false,
  wellness_analysis_consent BOOLEAN NOT NULL DEFAULT false,
  consent_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile on new user signup in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'English')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- Table: public.mood_checkins
-- Self-reported daily mood entries, sleep quality, stress levels, and journal notes
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mood_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_mood TEXT NOT NULL CHECK (selected_mood IN ('very-low', 'low', 'okay', 'good', 'great')),
  stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
  sleep_quality TEXT NOT NULL CHECK (sleep_quality IN ('Very Poor', 'Poor', 'Fair', 'Good', 'Excellent')),
  factors TEXT[] NOT NULL DEFAULT '{}',
  journal_note TEXT,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checkin_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mood_checkins_user_date 
  ON public.mood_checkins(user_id, checkin_date DESC);

-- RLS: public.mood_checkins
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood checkins"
  ON public.mood_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood checkins"
  ON public.mood_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood checkins"
  ON public.mood_checkins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood checkins"
  ON public.mood_checkins FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.wellness_plans
-- Daily wellness plan and activity completion status
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wellness_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  selected_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_plan_date UNIQUE (user_id, plan_date)
);

CREATE INDEX IF NOT EXISTS idx_wellness_plans_user_date 
  ON public.wellness_plans(user_id, plan_date DESC);

-- RLS: public.wellness_plans
ALTER TABLE public.wellness_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wellness plans"
  ON public.wellness_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness plans"
  ON public.wellness_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness plans"
  ON public.wellness_plans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness plans"
  ON public.wellness_plans FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.saved_activities
-- User bookmarked wellness activities
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_saved_activity UNIQUE (user_id, activity_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_activities_user 
  ON public.saved_activities(user_id);

-- RLS: public.saved_activities
ALTER TABLE public.saved_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved activities"
  ON public.saved_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark activities"
  ON public.saved_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarked activities"
  ON public.saved_activities FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.activity_feedback
-- Per-activity user feedback choices ('helpful', 'okay', 'not-for-me')
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  feedback_choice TEXT NOT NULL CHECK (feedback_choice IN ('helpful', 'okay', 'not-for-me')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_activity_feedback UNIQUE (user_id, activity_id)
);

CREATE INDEX IF NOT EXISTS idx_activity_feedback_user 
  ON public.activity_feedback(user_id);

-- RLS: public.activity_feedback
ALTER TABLE public.activity_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their activity feedback"
  ON public.activity_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record activity feedback"
  ON public.activity_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update activity feedback"
  ON public.activity_feedback FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete activity feedback"
  ON public.activity_feedback FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.saved_therapists
-- User bookmarked therapists (Pune District directory)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_therapists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_saved_therapist UNIQUE (user_id, therapist_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_therapists_user 
  ON public.saved_therapists(user_id);

-- RLS: public.saved_therapists
ALTER TABLE public.saved_therapists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved therapists"
  ON public.saved_therapists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save therapists"
  ON public.saved_therapists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved therapists"
  ON public.saved_therapists FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.chat_conversations
-- User-consented AI Companion chat conversations
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Mindful Exploration',
  consent_to_store BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user 
  ON public.chat_conversations(user_id, created_at DESC);

-- RLS: public.chat_conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their chat conversations"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their chat conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their chat conversations"
  ON public.chat_conversations FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.chat_messages
-- Individual messages stored only when user consent is provided
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation 
  ON public.chat_messages(conversation_id, created_at ASC);

-- RLS: public.chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their chat messages"
  ON public.chat_messages FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.screening_assessments
-- Validated, non-diagnostic screening self-assessments (PHQ-9, GAD-7, PSS-4, WHO-5)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.screening_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('PHQ-9', 'GAD-7', 'PSS-4', 'WHO-5')),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  severity TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_screening_assessments_user_date 
  ON public.screening_assessments(user_id, created_at DESC);

-- RLS: public.screening_assessments
ALTER TABLE public.screening_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments"
  ON public.screening_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own assessments"
  ON public.screening_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments"
  ON public.screening_assessments FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Table: public.wellness_analysis_reports
-- AI-synthesized wellness overview and recommendations
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wellness_analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  key_insights JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_activity_ids TEXT[] NOT NULL DEFAULT '{}',
  recommended_therapist_specialties TEXT[] NOT NULL DEFAULT '{}',
  crisis_flag BOOLEAN NOT NULL DEFAULT false,
  model_source TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_reports_user_date 
  ON public.wellness_analysis_reports(user_id, created_at DESC);

-- RLS: public.wellness_analysis_reports
ALTER TABLE public.wellness_analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wellness reports"
  ON public.wellness_analysis_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness reports"
  ON public.wellness_analysis_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness reports"
  ON public.wellness_analysis_reports FOR DELETE
  USING (auth.uid() = user_id);


-- ==============================================================================
-- Function: delete_user_all_data
-- GDPR / Privacy-first complete account data purge
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.delete_user_all_data(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow users to purge their own data
  IF auth.uid() <> target_user_id THEN
    RAISE EXCEPTION 'Unauthorized data deletion attempt.';
  END IF;

  DELETE FROM public.wellness_analysis_reports WHERE user_id = target_user_id;
  DELETE FROM public.screening_assessments WHERE user_id = target_user_id;
  DELETE FROM public.chat_messages WHERE user_id = target_user_id;
  DELETE FROM public.chat_conversations WHERE user_id = target_user_id;
  DELETE FROM public.saved_therapists WHERE user_id = target_user_id;
  DELETE FROM public.activity_feedback WHERE user_id = target_user_id;
  DELETE FROM public.saved_activities WHERE user_id = target_user_id;
  DELETE FROM public.wellness_plans WHERE user_id = target_user_id;
  DELETE FROM public.mood_checkins WHERE user_id = target_user_id;
  
  -- Reset profile to initial baseline
  UPDATE public.profiles
  SET streak_days = 1,
      daily_goal = 'Mindful 10 mins daily',
      wellness_analysis_consent = false,
      consent_updated_at = NULL,
      updated_at = NOW()
  WHERE id = target_user_id;
END;
$$;
