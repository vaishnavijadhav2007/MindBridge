import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DailyPlanItem, ActivityFeedback } from '../types/wellness';
import { DbWellnessPlan, DbSavedActivity, DbActivityFeedback } from '../types/database';

/**
 * Fetch today's wellness plan from Supabase for the authenticated user
 */
export async function fetchUserDailyPlan(
  userId: string,
  dateString: string // YYYY-MM-DD
): Promise<{ data: DailyPlanItem[] | null; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('wellness_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_date', dateString)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: null };
    }

    const row = data as DbWellnessPlan;
    const items: DailyPlanItem[] = (row.selected_activities || []).map((act: any) => ({
      activityId: act.activityId,
      addedAt: act.addedAt || new Date().toISOString(),
      completed: Boolean(act.completed),
      completedAt: act.completedAt,
    }));

    return { data: items, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to load daily plan.' };
  }
}

/**
 * Save or update today's daily wellness plan to Supabase
 */
export async function saveUserDailyPlan(
  userId: string,
  dateString: string,
  planItems: DailyPlanItem[]
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: 'Database is not connected.' };
  }

  try {
    const payload = {
      user_id: userId,
      plan_date: dateString,
      selected_activities: planItems,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('wellness_plans')
      .upsert(payload, { onConflict: 'user_id,plan_date' });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to persist daily plan.' };
  }
}

/**
 * Fetch all saved / bookmarked activity IDs for the authenticated user
 */
export async function fetchUserSavedActivities(userId: string): Promise<{ data: Set<string>; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: new Set(), error: null };
  }

  try {
    const { data, error } = await supabase
      .from('saved_activities')
      .select('activity_id')
      .eq('user_id', userId);

    if (error) {
      return { data: new Set(), error: error.message };
    }

    const set = new Set((data as DbSavedActivity[]).map((r) => r.activity_id));
    return { data: set, error: null };
  } catch (err: any) {
    return { data: new Set(), error: err.message || 'Failed to load saved activities.' };
  }
}

/**
 * Toggle bookmarked activity in Supabase
 */
export async function toggleUserSavedActivity(
  userId: string,
  activityId: string,
  currentlySaved: boolean
): Promise<{ isSaved: boolean; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { isSaved: !currentlySaved, error: 'Database is not connected.' };
  }

  try {
    if (currentlySaved) {
      const { error } = await supabase
        .from('saved_activities')
        .delete()
        .eq('user_id', userId)
        .eq('activity_id', activityId);

      if (error) return { isSaved: true, error: error.message };
      return { isSaved: false, error: null };
    } else {
      const { error } = await supabase
        .from('saved_activities')
        .insert({ user_id: userId, activity_id: activityId });

      if (error) return { isSaved: false, error: error.message };
      return { isSaved: true, error: null };
    }
  } catch (err: any) {
    return { isSaved: currentlySaved, error: err.message || 'Failed to toggle bookmark.' };
  }
}

/**
 * Fetch all activity feedback records for the authenticated user
 */
export async function fetchUserActivityFeedback(
  userId: string
): Promise<{ data: Record<string, ActivityFeedback>; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: {}, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('activity_feedback')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return { data: {}, error: error.message };
    }

    const record: Record<string, ActivityFeedback> = {};
    (data as DbActivityFeedback[]).forEach((row) => {
      record[row.activity_id] = row.feedback_choice;
    });

    return { data: record, error: null };
  } catch (err: any) {
    return { data: {}, error: err.message || 'Failed to load activity feedback.' };
  }
}

/**
 * Upsert feedback choice for an activity
 */
export async function saveUserActivityFeedback(
  userId: string,
  activityId: string,
  feedback: ActivityFeedback
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('activity_feedback')
      .upsert(
        {
          user_id: userId,
          activity_id: activityId,
          feedback_choice: feedback,
        },
        { onConflict: 'user_id,activity_id' }
      );

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to save feedback.' };
  }
}
