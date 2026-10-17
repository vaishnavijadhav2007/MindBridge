import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  AssessmentType, 
  QuestionnaireDefinition, 
  AssessmentRecord, 
  SeverityLevel 
} from '../types/assessment';
import { DbScreeningAssessment } from '../types/database';

const LOCAL_STORAGE_KEY = 'mindbridge_screening_assessments_v1';

// ─── Validated Questionnaires Definitions ──────────────────────────────────────

export const QUESTIONNAIRES: Record<AssessmentType, QuestionnaireDefinition> = {
  'PHQ-9': {
    type: 'PHQ-9',
    title: 'PHQ-9 Depression Screening',
    badge: 'Depression & Mood',
    shortDescription: 'Validated 9-item scale evaluating mood, interest, sleep, and emotional vitality over the past two weeks.',
    estimatedMinutes: 3,
    disclaimer: 'This is a self-assessment screening tool, not a clinical diagnosis. It helps reflect on recent experiences and guide supportive discussions.',
    scaleOptions: [
      { label: 'Not at all', score: 0 },
      { label: 'Several days', score: 1 },
      { label: 'More than half the days', score: 2 },
      { label: 'Nearly every day', score: 3 },
    ],
    questions: [
      { id: 'phq-1', prompt: 'Little interest or pleasure in doing things' },
      { id: 'phq-2', prompt: 'Feeling down, depressed, or hopeless' },
      { id: 'phq-3', prompt: 'Trouble falling or staying asleep, or sleeping too much' },
      { id: 'phq-4', prompt: 'Feeling tired or having little energy' },
      { id: 'phq-5', prompt: 'Poor appetite or overeating' },
      { id: 'phq-6', prompt: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
      { id: 'phq-7', prompt: 'Trouble concentrating on things, such as reading or watching television' },
      { id: 'phq-8', prompt: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual' },
      { id: 'phq-9', prompt: 'Thoughts that you would be better off dead, or of hurting yourself in some way' },
    ],
    interpretScore: (score: number) => {
      if (score <= 4) {
        return {
          band: '0–4',
          label: 'Minimal or No Symptoms',
          description: 'Your responses indicate minimal or no depressive symptoms over the past two weeks. Your emotional baseline is steady.',
          colorClass: 'text-[#56664F] bg-[#E9EFE7] border-[#829675]',
          level: 'minimal',
        };
      }
      if (score <= 9) {
        return {
          band: '5–9',
          label: 'Mild Symptoms',
          description: 'Mild symptoms noted. Small daily routines, mindful movement, and emotional check-ins can provide steady relief.',
          colorClass: 'text-[#829675] bg-[#F2F6F0] border-[#A3B597]',
          level: 'mild',
        };
      }
      if (score <= 14) {
        return {
          band: '10–14',
          label: 'Moderate Symptoms',
          description: 'Moderate depressive symptoms. Evidence-based coping tools, talking with loved ones, and professional counseling can be very helpful.',
          colorClass: 'text-[#A67C5A] bg-[#FAF3ED] border-[#C59B7E]',
          level: 'moderate',
        };
      }
      if (score <= 19) {
        return {
          band: '15–19',
          label: 'Moderately Severe Symptoms',
          description: 'Moderately severe symptoms reported. We strongly encourage speaking with a licensed psychologist or healthcare provider.',
          colorClass: 'text-[#B85D43] bg-[#FCF0EC] border-[#D9826C]',
          level: 'moderately-severe',
        };
      }
      return {
        band: '20–27',
        label: 'Severe Symptoms',
        description: 'Significant distress reported. Please reach out to a trusted professional or a supportive crisis helpline for caring assistance.',
        colorClass: 'text-[#9C3825] bg-[#FDECE8] border-[#B85D43]',
        level: 'severe',
      };
    },
    checkCrisisRisk: (answers: Record<string, number>, totalScore: number) => {
      // Question 9 ("Thoughts of self-harm / suicide") is critical safety check
      const q9 = answers['phq-9'] ?? 0;
      return q9 > 0 || totalScore >= 15;
    },
  },

  'GAD-7': {
    type: 'GAD-7',
    title: 'GAD-7 Anxiety Screening',
    badge: 'Anxiety & Worry',
    shortDescription: 'Validated 7-item scale measuring generalized worry, tension, restlessness, and nervousness over the past two weeks.',
    estimatedMinutes: 2,
    disclaimer: 'This screening tool helps you observe anxiety patterns. It is purely self-reflective and does not constitute a clinical diagnosis.',
    scaleOptions: [
      { label: 'Not at all', score: 0 },
      { label: 'Several days', score: 1 },
      { label: 'More than half the days', score: 2 },
      { label: 'Nearly every day', score: 3 },
    ],
    questions: [
      { id: 'gad-1', prompt: 'Feeling nervous, anxious, or on edge' },
      { id: 'gad-2', prompt: 'Not being able to stop or control worrying' },
      { id: 'gad-3', prompt: 'Worrying too much about different things' },
      { id: 'gad-4', prompt: 'Trouble relaxing' },
      { id: 'gad-5', prompt: 'Being so restless that it is hard to sit still' },
      { id: 'gad-6', prompt: 'Becoming easily annoyed or irritable' },
      { id: 'gad-7', prompt: 'Feeling afraid, as if something awful might happen' },
    ],
    interpretScore: (score: number) => {
      if (score <= 4) {
        return {
          band: '0–4',
          label: 'Minimal Anxiety',
          description: 'Minimal anxiety symptoms reported. Your autonomic nervous system appears relatively settled and at ease.',
          colorClass: 'text-[#56664F] bg-[#E9EFE7] border-[#829675]',
          level: 'minimal',
        };
      }
      if (score <= 9) {
        return {
          band: '5–9',
          label: 'Mild Anxiety',
          description: 'Mild anxiety. Calming breathing exercises (4-4-4 Box Breathing) and gentle grounding can help de-escalate tension.',
          colorClass: 'text-[#829675] bg-[#F2F6F0] border-[#A3B597]',
          level: 'mild',
        };
      }
      if (score <= 14) {
        return {
          band: '10–14',
          label: 'Moderate Anxiety',
          description: 'Moderate anxiety symptoms. Frequent nervous system resets, setting boundaries on information intake, and counseling are recommended.',
          colorClass: 'text-[#A67C5A] bg-[#FAF3ED] border-[#C59B7E]',
          level: 'moderate',
        };
      }
      return {
        band: '15–21',
        label: 'Severe Anxiety',
        description: 'Elevated anxiety levels. Professional guidance, CBT-oriented coping tools, and speaking with a therapist can provide structured relief.',
        colorClass: 'text-[#B85D43] bg-[#FCF0EC] border-[#D9826C]',
        level: 'severe',
      };
    },
    checkCrisisRisk: (_answers: Record<string, number>, totalScore: number) => {
      return totalScore >= 15;
    },
  },

  'PSS-4': {
    type: 'PSS-4',
    title: 'Perceived Stress Scale (PSS-4)',
    badge: 'Stress & Overwhelm',
    shortDescription: 'Concise 4-item instrument measuring feelings of unpredictability, lack of control, and cognitive overload in the last month.',
    estimatedMinutes: 2,
    disclaimer: 'Measures your subjective perception of daily demands and coping resources. Not a formal psychological disorder diagnosis.',
    scaleOptions: [
      { label: 'Never', score: 0 },
      { label: 'Almost never', score: 1 },
      { label: 'Sometimes', score: 2 },
      { label: 'Fairly often', score: 3 },
      { label: 'Very often', score: 4 },
    ],
    questions: [
      { id: 'pss-1', prompt: 'How often have you felt that you were unable to control the important things in your life?' },
      { id: 'pss-2', prompt: 'How often have you felt confident about your ability to handle your personal problems?', reverseScored: true },
      { id: 'pss-3', prompt: 'How often have you felt that things were going your way?', reverseScored: true },
      { id: 'pss-4', prompt: 'How often have you felt difficulties were piling up so high that you could not overcome them?' },
    ],
    interpretScore: (score: number) => {
      if (score <= 5) {
        return {
          band: '0–5',
          label: 'Low Perceived Stress',
          description: 'You feel a healthy sense of agency and resilience in navigating everyday demands and obstacles.',
          colorClass: 'text-[#56664F] bg-[#E9EFE7] border-[#829675]',
          level: 'minimal',
        };
      }
      if (score <= 10) {
        return {
          band: '6–10',
          label: 'Moderate Perceived Stress',
          description: 'Normal range of everyday stress. Making time for recovery, restful sleep, and leisure helps keep this balanced.',
          colorClass: 'text-[#829675] bg-[#F2F6F0] border-[#A3B597]',
          level: 'mild',
        };
      }
      return {
        band: '11–16',
        label: 'High Perceived Stress',
        description: 'High perceived stress. You may be carrying an unsustainable cognitive load. Consider active pacing and asking for support.',
        colorClass: 'text-[#B85D43] bg-[#FCF0EC] border-[#D9826C]',
        level: 'moderate',
      };
    },
  },

  'WHO-5': {
    type: 'WHO-5',
    title: 'WHO-5 Well-Being Index',
    badge: 'Positive Well-Being',
    shortDescription: 'Validated 5-item index by the World Health Organization evaluating positive psychological well-being and vitality.',
    estimatedMinutes: 2,
    disclaimer: 'The WHO-5 focuses on positive emotional states, cheerfulness, and physical rest over the past 14 days.',
    scaleOptions: [
      { label: 'All of the time', score: 5 },
      { label: 'Most of the time', score: 4 },
      { label: 'More than half the time', score: 3 },
      { label: 'Less than half the time', score: 2 },
      { label: 'Some of the time', score: 1 },
      { label: 'At no time', score: 0 },
    ],
    questions: [
      { id: 'who-1', prompt: 'I have felt cheerful and in good spirits' },
      { id: 'who-2', prompt: 'I have felt calm and relaxed' },
      { id: 'who-3', prompt: 'I have felt active and vigorous' },
      { id: 'who-4', prompt: 'I woke up feeling fresh and rested' },
      { id: 'who-5', prompt: 'My daily life has been filled with things that interest me' },
    ],
    interpretScore: (rawScore: number) => {
      // Raw score 0-25 is multiplied by 4 to get standard percentage (0-100)
      const percentage = Math.min(100, Math.max(0, rawScore * 4));
      if (percentage >= 75) {
        return {
          band: `${percentage}%`,
          label: 'Optimal Well-Being',
          description: 'High vitality, positive emotional resilience, and sound restorative rest.',
          colorClass: 'text-[#56664F] bg-[#E9EFE7] border-[#829675]',
          level: 'minimal',
        };
      }
      if (percentage >= 50) {
        return {
          band: `${percentage}%`,
          label: 'Satisfactory Well-Being',
          description: 'Good general psychological balance, with opportunities for deeper replenishment and joy.',
          colorClass: 'text-[#829675] bg-[#F2F6F0] border-[#A3B597]',
          level: 'mild',
        };
      }
      if (percentage >= 29) {
        return {
          band: `${percentage}%`,
          label: 'Reduced Well-Being',
          description: 'Noticeable reduction in vitality or emotional energy. Prioritizing rest and self-care is strongly encouraged.',
          colorClass: 'text-[#A67C5A] bg-[#FAF3ED] border-[#C59B7E]',
          level: 'moderate',
        };
      }
      return {
        band: `${percentage}%`,
        label: 'Low Well-Being',
        description: 'Score suggests significant depletion or low mood over the past two weeks. Consider discussing how you feel with a professional.',
        colorClass: 'text-[#B85D43] bg-[#FCF0EC] border-[#D9826C]',
        level: 'moderately-severe',
      };
    },
  },
};

// ─── Initial Baseline Sample Assessments ──────────────────────────────────────

export const SAMPLE_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: 'sample-gad-1',
    userId: 'demo-user',
    type: 'GAD-7',
    score: 6,
    maxScore: 21,
    severityLabel: 'Mild Anxiety',
    severityLevel: 'mild',
    answers: { 'gad-1': 1, 'gad-2': 1, 'gad-3': 1, 'gad-4': 1, 'gad-5': 0, 'gad-6': 1, 'gad-7': 1 },
    notes: 'Feeling a little unsettled before upcoming college exams.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-phq-1',
    userId: 'demo-user',
    type: 'PHQ-9',
    score: 5,
    maxScore: 27,
    severityLabel: 'Mild Symptoms',
    severityLevel: 'mild',
    answers: { 'phq-1': 1, 'phq-2': 1, 'phq-3': 1, 'phq-4': 1, 'phq-5': 0, 'phq-6': 1, 'phq-7': 0, 'phq-8': 0, 'phq-9': 0 },
    notes: 'Low energy during the afternoons.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-who-1',
    userId: 'demo-user',
    type: 'WHO-5',
    score: 16, // 16 * 4 = 64%
    maxScore: 25,
    severityLabel: 'Satisfactory Well-Being',
    severityLevel: 'mild',
    answers: { 'who-1': 3, 'who-2': 3, 'who-3': 3, 'who-4': 3, 'who-5': 4 },
    notes: 'Generally okay, enjoying time with family.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isSample: true,
  },
];

// ─── Database & Local Storage Helpers ─────────────────────────────────────────

function getStoredLocalAssessments(): AssessmentRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredLocalAssessments(items: AssessmentRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Unable to persist assessments to localStorage', e);
  }
}

/**
 * Fetch all screening assessments for a user (combining Supabase records and local fallback)
 */
export async function fetchUserAssessments(userId: string): Promise<{ data: AssessmentRecord[]; error: string | null }> {
  // If no logged in user or Supabase not configured, use local storage
  if (!isSupabaseConfigured || !userId) {
    const local = getStoredLocalAssessments();
    return { data: local.length > 0 ? local : SAMPLE_ASSESSMENTS, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('screening_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchUserAssessments fallback:', error.message);
      const local = getStoredLocalAssessments();
      return { data: local.length > 0 ? local : SAMPLE_ASSESSMENTS, error: null };
    }

    const mapped: AssessmentRecord[] = (data as DbScreeningAssessment[]).map(row => {
      const def = QUESTIONNAIRES[row.assessment_type];
      const interpretation = def ? def.interpretScore(row.score, row.answers) : { label: row.severity, level: 'mild' as SeverityLevel };
      return {
        id: row.id,
        userId: row.user_id,
        type: row.assessment_type,
        score: row.score,
        maxScore: row.max_score,
        severityLabel: interpretation.label || row.severity,
        severityLevel: interpretation.level,
        answers: row.answers || {},
        notes: row.notes || undefined,
        createdAt: row.created_at,
        isSample: false,
      };
    });

    if (mapped.length === 0) {
      const local = getStoredLocalAssessments();
      return { data: local.length > 0 ? local : SAMPLE_ASSESSMENTS, error: null };
    }

    return { data: mapped, error: null };
  } catch (err: any) {
    const local = getStoredLocalAssessments();
    return { data: local.length > 0 ? local : SAMPLE_ASSESSMENTS, error: null };
  }
}

/**
 * Save a new completed screening assessment
 */
export async function saveUserAssessment(
  userId: string,
  record: {
    type: AssessmentType;
    score: number;
    maxScore: number;
    severityLabel: string;
    severityLevel: SeverityLevel;
    answers: Record<string, number>;
    notes?: string;
  }
): Promise<{ data: AssessmentRecord | null; error: string | null }> {
  const newId = 'asmt-' + Date.now();
  const createdAt = new Date().toISOString();

  const newRecord: AssessmentRecord = {
    id: newId,
    userId: userId || 'anonymous',
    type: record.type,
    score: record.score,
    maxScore: record.maxScore,
    severityLabel: record.severityLabel,
    severityLevel: record.severityLevel,
    answers: record.answers,
    notes: record.notes,
    createdAt,
    isSample: false,
  };

  // Always mirror in localStorage for immediate responsiveness and offline resilience
  const existingLocal = getStoredLocalAssessments().filter(item => !item.isSample);
  saveStoredLocalAssessments([newRecord, ...existingLocal]);

  if (!isSupabaseConfigured || !userId) {
    return { data: newRecord, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('screening_assessments')
      .insert({
        user_id: userId,
        assessment_type: record.type,
        score: record.score,
        max_score: record.maxScore,
        severity: record.severityLabel,
        answers: record.answers,
        notes: record.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase save assessment fallback to local:', error.message);
      return { data: newRecord, error: null };
    }

    const savedRow = data as DbScreeningAssessment;
    return {
      data: {
        ...newRecord,
        id: savedRow.id,
        createdAt: savedRow.created_at,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: newRecord, error: null };
  }
}

/**
 * Delete a screening assessment record
 */
export async function deleteUserAssessment(userId: string, assessmentId: string): Promise<boolean> {
  const local = getStoredLocalAssessments().filter(item => item.id !== assessmentId);
  saveStoredLocalAssessments(local);

  if (isSupabaseConfigured && userId && !assessmentId.startsWith('sample-') && !assessmentId.startsWith('asmt-')) {
    try {
      await supabase.from('screening_assessments').delete().eq('id', assessmentId).eq('user_id', userId);
    } catch (e) {
      console.warn('Failed to delete assessment from Supabase:', e);
    }
  }

  return true;
}

/**
 * Purge all assessment records for user
 */
export async function purgeAllAssessments(userId: string): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}

  if (isSupabaseConfigured && userId) {
    try {
      await supabase.from('screening_assessments').delete().eq('user_id', userId);
    } catch (e) {
      console.warn('Failed to purge assessments from Supabase:', e);
    }
  }
}
