import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MoodEntry } from '../types';
import { 
  AssessmentRecord, 
  WellnessAnalysisReport, 
  WellnessConsentState, 
  WellnessKeyInsight 
} from '../types/assessment';
import { ALL_ACTIVITIES } from './wellnessActivities';
import { DbWellnessAnalysisReport } from '../types/database';

const CONSENT_STORAGE_KEY = 'mindbridge_wellness_consent_v1';
const REPORT_CACHE_KEY    = 'mindbridge_wellness_report_cache_v1';

// ─── User Consent Management ──────────────────────────────────────────────────

export async function fetchWellnessConsent(userId?: string): Promise<WellnessConsentState> {
  // Check local storage first
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        hasConsented: Boolean(parsed.hasConsented),
        allowAiSynthesis: Boolean(parsed.allowAiSynthesis ?? true),
        allowAssessmentStorage: Boolean(parsed.allowAssessmentStorage ?? true),
        consentDate: parsed.consentDate || null,
      };
    }
  } catch (e) {
    console.warn('Failed to read consent from local storage', e);
  }

  // Check Supabase profiles if logged in
  if (isSupabaseConfigured && userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('wellness_analysis_consent, consent_updated_at')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const state: WellnessConsentState = {
          hasConsented: Boolean(data.wellness_analysis_consent),
          allowAiSynthesis: true,
          allowAssessmentStorage: true,
          consentDate: data.consent_updated_at || null,
        };
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
        return state;
      }
    } catch (e) {
      console.warn('Failed to fetch consent from Supabase profile', e);
    }
  }

  return {
    hasConsented: false,
    allowAiSynthesis: false,
    allowAssessmentStorage: false,
    consentDate: null,
  };
}

export async function saveWellnessConsent(
  userId: string | undefined,
  consent: Partial<WellnessConsentState>
): Promise<WellnessConsentState> {
  const current = await fetchWellnessConsent(userId);
  const updated: WellnessConsentState = {
    ...current,
    ...consent,
    consentDate: consent.hasConsented ? new Date().toISOString() : null,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save consent locally', e);
  }

  if (isSupabaseConfigured && userId) {
    try {
      await supabase
        .from('profiles')
        .update({
          wellness_analysis_consent: updated.hasConsented,
          consent_updated_at: updated.consentDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } catch (e) {
      console.warn('Failed to update consent in Supabase', e);
    }
  }

  return updated;
}

// ─── Local Heuristic Wellness Analysis Generator ──────────────────────────────

export function generateLocalWellnessReport(
  userId: string,
  moodEntries: MoodEntry[],
  assessments: AssessmentRecord[]
): WellnessAnalysisReport {
  // 1. Calculate Mood & Stress Metrics
  const validMoods = moodEntries.slice(0, 14);
  const totalEntries = validMoods.length;
  
  let avgStress = 3;
  let poorSleepCount = 0;
  let lowMoodCount = 0;
  const factorsFrequency: Record<string, number> = {};

  if (totalEntries > 0) {
    const sumStress = validMoods.reduce((acc, m) => acc + (m.stressLevel || 3), 0);
    avgStress = Math.round((sumStress / totalEntries) * 10) / 10;

    validMoods.forEach(m => {
      if (m.sleepQuality === 'Poor' || m.sleepQuality === 'Very Poor') poorSleepCount++;
      if (m.mood === 'low' || m.mood === 'very-low') lowMoodCount++;
      (m.factors || []).forEach(f => {
        factorsFrequency[f] = (factorsFrequency[f] || 0) + 1;
      });
    });
  }

  // Find dominant top factors
  const topFactors = Object.entries(factorsFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([f]) => f);

  // 2. Identify latest assessments
  const latestGad = assessments.find(a => a.type === 'GAD-7');
  const latestPhq = assessments.find(a => a.type === 'PHQ-9');
  const latestPss = assessments.find(a => a.type === 'PSS-4');
  const latestWho = assessments.find(a => a.type === 'WHO-5');

  // 3. Crisis risk determination
  let crisisFlag = false;
  let crisisReason = '';

  if (latestPhq) {
    const q9 = latestPhq.answers['phq-9'] ?? 0;
    if (q9 > 0) {
      crisisFlag = true;
      crisisReason = 'Thoughts of self-harm or despair reported in PHQ-9 Question 9.';
    } else if (latestPhq.score >= 15) {
      crisisFlag = true;
      crisisReason = 'PHQ-9 depression score indicates moderately severe distress.';
    }
  }

  if (!crisisFlag && latestGad && latestGad.score >= 15) {
    crisisFlag = true;
    crisisReason = 'GAD-7 score indicates severe anxiety symptoms.';
  }

  // 4. Determine key insights
  const insights: WellnessKeyInsight[] = [];

  // Sleep insight
  if (poorSleepCount >= 2) {
    insights.push({
      category: 'Sleep & Nervous System',
      text: 'You logged poor sleep across recent check-ins. Fragmented sleep strongly amplifies emotional reactivity and daytime anxiety.',
      level: 'attention',
    });
  } else {
    insights.push({
      category: 'Restorative Baseline',
      text: 'Your reported sleep quality has shown resilience, providing a solid biological foundation for mood stability.',
      level: 'positive',
    });
  }

  // Stress & Demands
  if (avgStress >= 3.5) {
    const factorMention = topFactors.length > 0 ? ` with primary triggers around ${topFactors.join(' and ')}` : '';
    insights.push({
      category: 'Stress Regulation',
      text: `Your average stress level is elevated (${avgStress}/5)${factorMention}. Micro-breaks and physiological sigh breaths can help down-regulate tension.`,
      level: 'attention',
    });
  } else {
    insights.push({
      category: 'Stress Coping',
      text: `Average perceived stress remains within a balanced range (${avgStress}/5). You are managing routine demands effectively.`,
      level: 'positive',
    });
  }

  // Screening insights
  if (latestGad) {
    insights.push({
      category: 'Anxiety Screening',
      text: `GAD-7 assessment indicates ${latestGad.severityLabel} (score ${latestGad.score}/21). Somatic grounding exercises are well-suited for your profile.`,
      level: latestGad.severityLevel === 'minimal' ? 'positive' : latestGad.severityLevel === 'severe' ? 'attention' : 'neutral',
    });
  }

  if (latestPhq) {
    insights.push({
      category: 'Mood Screening',
      text: `PHQ-9 assessment indicates ${latestPhq.severityLabel} (score ${latestPhq.score}/27). Gentle behavioral activation and self-compassion are indicated.`,
      level: latestPhq.severityLevel === 'minimal' ? 'positive' : (latestPhq.severityLevel === 'severe' || latestPhq.severityLevel === 'moderately-severe') ? 'attention' : 'neutral',
    });
  }

  if (latestWho) {
    insights.push({
      category: 'Psychological Vitality',
      text: `WHO-5 Well-Being Index score is ${latestWho.score * 4}%, suggesting ${latestWho.severityLabel.toLowerCase()}.`,
      level: latestWho.score >= 13 ? 'positive' : 'attention',
    });
  }

  // 5. Select recommended activities
  const recActivityIds: string[] = [];
  if (latestGad && latestGad.score >= 8) {
    recActivityIds.push('act-breathing', 'act-grounding');
  } else {
    recActivityIds.push('act-breathing');
  }

  if (poorSleepCount > 0) {
    recActivityIds.push('act-winddown');
  }

  if (lowMoodCount > 0 || (latestPhq && latestPhq.score >= 5)) {
    recActivityIds.push('act-gratitude', 'act-walk');
  } else {
    recActivityIds.push('act-focus', 'act-journaling');
  }

  // Dedup and slice top 4
  const finalActivities = Array.from(new Set(recActivityIds)).slice(0, 4);

  // 6. Recommended Therapist Specialties in Pune
  const therapistSpecialties: string[] = [];
  if (latestGad && latestGad.score >= 8) therapistSpecialties.push('Anxiety and stress');
  if (latestPhq && latestPhq.score >= 8) therapistSpecialties.push('Depression and low mood');
  if (poorSleepCount >= 2) therapistSpecialties.push('Sleep difficulties');
  if (topFactors.some(f => f.toLowerCase().includes('studies') || f.toLowerCase().includes('work'))) {
    therapistSpecialties.push('Academic pressure');
  }
  if (therapistSpecialties.length === 0) {
    therapistSpecialties.push('General emotional well-being', 'Anxiety and stress');
  }

  // 7. Compose supportive narrative synthesis
  const summaryParagraphs = [
    `Over your recent check-ins and assessments, you have shown meaningful self-awareness by tracking your feelings and honoring your emotional state. Your responses reveal an average daily stress level of ${avgStress}/5, ${
      lowMoodCount > 0 ? `with occasional periods of feeling low or overwhelmed` : `with steady emotional balance across your days`
    }.`,
    `${
      poorSleepCount > 0 
        ? 'Rest appears to be an area where your body is asking for extra care. When sleep is interrupted, the amygdala becomes more active, making daily challenges feel significantly heavier. Creating a soothing buffer before bed will directly support your emotional equilibrium.'
        : 'Your restorative patterns provide a steady anchor. Continuing to protect your evening routine will reinforce your emotional energy for the days ahead.'
    }`,
    `Remember that screening questionnaires are gentle mirrors to reflect where you are right now, never rigid labels. Be gentle with your expectations today, try one of the grounding or breathing exercises below, and know that you are not alone on this journey.`,
  ];

  return {
    id: 'report-' + Date.now(),
    userId,
    summaryText: summaryParagraphs.join('\n\n'),
    keyInsights: insights,
    recommendedActivityIds: finalActivities,
    recommendedTherapistSpecialties: therapistSpecialties,
    crisisFlag,
    crisisReason: crisisReason || undefined,
    modelSource: 'mindbridge-clinical-engine',
    createdAt: new Date().toISOString(),
  };
}

// ─── Main Wellness Analysis Generator (Gemini + Fallback) ─────────────────────

export async function fetchOrGenerateWellnessAnalysis(
  userId: string,
  moodEntries: MoodEntry[],
  assessments: AssessmentRecord[],
  forceRegenerate: boolean = false
): Promise<WellnessAnalysisReport> {
  // If not forcing regenerate, check cache first
  if (!forceRegenerate) {
    try {
      const cached = localStorage.getItem(REPORT_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as WellnessAnalysisReport;
        // If cached within 6 hours, return cached
        const ageHours = (Date.now() - new Date(parsed.createdAt).getTime()) / (1000 * 60 * 60);
        if (ageHours < 6) {
          return parsed;
        }
      }
    } catch {}
  }

  // Generate fallback report as base
  const localReport = generateLocalWellnessReport(userId, moodEntries, assessments);

  // If Supabase is configured and user is signed in, try invoking Gemini via Edge Function
  if (isSupabaseConfigured && userId) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (token) {
        const payload = {
          action: 'wellness-analysis',
          moodSummary: {
            recentMoodCount: moodEntries.length,
            averageStress: localReport.keyInsights.find(k => k.category.includes('Stress'))?.text || 'Moderate',
            recentFactors: moodEntries.flatMap(m => m.factors || []).slice(0, 8),
          },
          assessments: assessments.map(a => ({
            type: a.type,
            score: a.score,
            maxScore: a.maxScore,
            severity: a.severityLabel,
          })),
          crisisRisk: localReport.crisisFlag,
        };

        const { data, error } = await supabase.functions.invoke('gemini-chat', {
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!error && data && data.reply) {
          const geminiReport: WellnessAnalysisReport = {
            ...localReport,
            id: 'report-gemini-' + Date.now(),
            summaryText: data.reply.trim(),
            modelSource: data.model || 'gemini-2.0-flash',
            createdAt: new Date().toISOString(),
          };

          localStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(geminiReport));
          return geminiReport;
        }
      }
    } catch (edgeErr) {
      console.warn('Edge Function gemini-chat wellness analysis call failed, using heuristic engine:', edgeErr);
    }
  }

  // Store local report in cache
  try {
    localStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(localReport));
  } catch {}

  return localReport;
}
