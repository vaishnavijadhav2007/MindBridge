import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbSavedTherapist } from '../types/database';

/**
 * Fetch all saved therapist IDs for the authenticated user from Supabase
 */
export async function fetchUserSavedTherapists(
  userId: string
): Promise<{ data: Set<string>; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: new Set(), error: null };
  }

  try {
    const { data, error } = await supabase
      .from('saved_therapists')
      .select('therapist_id')
      .eq('user_id', userId);

    if (error) {
      return { data: new Set(), error: error.message };
    }

    const set = new Set((data as DbSavedTherapist[]).map((r) => r.therapist_id));
    return { data: set, error: null };
  } catch (err: any) {
    return { data: new Set(), error: err.message || 'Failed to load saved therapists.' };
  }
}

/**
 * Toggle bookmarked therapist in Supabase
 */
export async function toggleUserSavedTherapist(
  userId: string,
  therapistId: string,
  currentlySaved: boolean
): Promise<{ isSaved: boolean; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { isSaved: !currentlySaved, error: 'Database is not connected.' };
  }

  try {
    if (currentlySaved) {
      const { error } = await supabase
        .from('saved_therapists')
        .delete()
        .eq('user_id', userId)
        .eq('therapist_id', therapistId);

      if (error) return { isSaved: true, error: error.message };
      return { isSaved: false, error: null };
    } else {
      const { error } = await supabase
        .from('saved_therapists')
        .insert({ user_id: userId, therapist_id: therapistId });

      if (error) return { isSaved: false, error: error.message };
      return { isSaved: true, error: null };
    }
  } catch (err: any) {
    return { isSaved: currentlySaved, error: err.message || 'Failed to toggle therapist bookmark.' };
  }
}
