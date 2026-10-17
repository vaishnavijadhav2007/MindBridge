import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MoodEntry, MoodType, SleepQuality } from '../types';
import { DbMoodCheckin } from '../types/database';

/**
 * Maps a database check-in row to the application's MoodEntry interface
 */
export function mapDbCheckinToMoodEntry(row: DbMoodCheckin): MoodEntry {
  const dateObj = new Date(row.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = row.checkin_time || dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return {
    id: row.id,
    timestamp: row.created_at,
    date: formattedDate,
    time: formattedTime,
    mood: row.selected_mood as MoodType,
    factors: row.factors || [],
    stressLevel: row.stress_level,
    sleepQuality: row.sleep_quality as SleepQuality,
    journalNote: row.journal_note || undefined,
    isSample: false,
  };
}

/**
 * Fetch all mood check-ins for the authenticated user from Supabase
 */
export async function fetchUserMoodCheckins(userId: string): Promise<{ data: MoodEntry[]; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('mood_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
        return { data: [], error: 'Table "mood_checkins" does not exist yet in Supabase. Run supabase/schema.sql in your Supabase SQL editor.' };
      }
      return { data: [], error: error.message };
    }

    const mapped = (data as DbMoodCheckin[]).map(mapDbCheckinToMoodEntry);
    return { data: mapped, error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Unable to load mood entries from database.' };
  }
}

/**
 * Save a new mood check-in to Supabase with authenticated user ID
 */
export async function insertUserMoodCheckin(
  userId: string,
  entry: {
    mood: MoodType;
    factors: string[];
    stressLevel: number;
    sleepQuality: SleepQuality;
    journalNote?: string;
  }
): Promise<{ data: MoodEntry | null; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: null, error: 'Database is not connected.' };
  }

  try {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const checkinDate = now.toISOString().split('T')[0];

    const payload = {
      user_id: userId,
      selected_mood: entry.mood,
      stress_level: entry.stressLevel,
      sleep_quality: entry.sleepQuality,
      factors: entry.factors,
      journal_note: entry.journalNote ? entry.journalNote.trim() : null,
      checkin_date: checkinDate,
      checkin_time: formattedTime,
    };

    const { data, error } = await supabase
      .from('mood_checkins')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
        return { data: null, error: 'Database table "mood_checkins" does not exist yet in Supabase. Please run supabase/schema.sql in your Supabase SQL editor.' };
      }
      return { data: null, error: error.message };
    }

    return { data: mapDbCheckinToMoodEntry(data as DbMoodCheckin), error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to save check-in to database.' };
  }
}

/**
 * Update an existing mood check-in
 */
export async function updateUserMoodCheckin(
  userId: string,
  id: string,
  updates: Partial<{
    mood: MoodType;
    factors: string[];
    stressLevel: number;
    sleepQuality: SleepQuality;
    journalNote?: string;
  }>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: 'Database is not connected.' };
  }

  try {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.mood) payload.selected_mood = updates.mood;
    if (updates.factors) payload.factors = updates.factors;
    if (updates.stressLevel !== undefined) payload.stress_level = updates.stressLevel;
    if (updates.sleepQuality) payload.sleep_quality = updates.sleepQuality;
    if (updates.journalNote !== undefined) payload.journal_note = updates.journalNote;

    const { error } = await supabase
      .from('mood_checkins')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to update check-in.' };
  }
}

/**
 * Delete a mood check-in from Supabase
 */
export async function deleteUserMoodCheckin(userId: string, id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('mood_checkins')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete check-in from database.' };
  }
}

/**
 * Export all user wellness data as a structured JSON object
 */
export async function exportAllUserData(userId: string): Promise<{ data: any | null; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: null, error: 'Database is not connected.' };
  }

  try {
    const [profileRes, moodRes, plansRes, savedActRes, feedbackRes, therapistsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('mood_checkins').select('*').eq('user_id', userId),
      supabase.from('wellness_plans').select('*').eq('user_id', userId),
      supabase.from('saved_activities').select('*').eq('user_id', userId),
      supabase.from('activity_feedback').select('*').eq('user_id', userId),
      supabase.from('saved_therapists').select('*').eq('user_id', userId),
    ]);

    const exportBundle = {
      exportedAt: new Date().toISOString(),
      service: 'MindBridge — AI Mental Wellness Companion',
      version: '1.0.0',
      profile: profileRes.data || null,
      moodCheckins: moodRes.data || [],
      wellnessPlans: plansRes.data || [],
      savedActivities: savedActRes.data || [],
      activityFeedback: feedbackRes.data || [],
      savedTherapists: therapistsRes.data || [],
    };

    return { data: exportBundle, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to export user data.' };
  }
}

/**
 * Delete all user data permanently from Supabase
 */
export async function purgeAllUserData(userId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: 'Database is not connected.' };
  }

  try {
    // Try calling RPC if available
    const { error: rpcErr } = await supabase.rpc('delete_user_all_data', { target_user_id: userId });
    if (!rpcErr) return { error: null };

    // Fallback: delete sequentially across tables
    await Promise.all([
      supabase.from('chat_messages').delete().eq('user_id', userId),
      supabase.from('chat_conversations').delete().eq('user_id', userId),
      supabase.from('saved_therapists').delete().eq('user_id', userId),
      supabase.from('activity_feedback').delete().eq('user_id', userId),
      supabase.from('saved_activities').delete().eq('user_id', userId),
      supabase.from('wellness_plans').delete().eq('user_id', userId),
      supabase.from('mood_checkins').delete().eq('user_id', userId),
    ]);

    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to purge user data.' };
  }
}
