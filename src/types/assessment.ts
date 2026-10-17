export type AssessmentType = 'PHQ-9' | 'GAD-7' | 'PSS-4' | 'WHO-5';

export type SeverityLevel = 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';

export interface QuestionnaireOption {
  label: string;
  score: number;
}

export interface QuestionnaireQuestion {
  id: string;
  prompt: string;
  detail?: string;
  reverseScored?: boolean;
}

export interface ScoreInterpretation {
  band: string;
  label: string;
  description: string;
  colorClass: string;
  level: SeverityLevel;
}

export interface QuestionnaireDefinition {
  type: AssessmentType;
  title: string;
  badge: string;
  shortDescription: string;
  estimatedMinutes: number;
  disclaimer: string;
  scaleOptions: QuestionnaireOption[];
  questions: QuestionnaireQuestion[];
  interpretScore: (score: number, answers?: Record<string, number>) => ScoreInterpretation;
  checkCrisisRisk?: (answers: Record<string, number>, totalScore: number) => boolean;
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  type: AssessmentType;
  score: number;
  maxScore: number;
  severityLabel: string;
  severityLevel: SeverityLevel;
  answers: Record<string, number>;
  notes?: string;
  createdAt: string; // ISO date
  isSample?: boolean;
}

export interface WellnessKeyInsight {
  category: string;
  text: string;
  level: 'positive' | 'neutral' | 'attention';
}

export interface WellnessAnalysisReport {
  id: string;
  userId: string;
  summaryText: string;
  keyInsights: WellnessKeyInsight[];
  recommendedActivityIds: string[];
  recommendedTherapistSpecialties: string[];
  crisisFlag: boolean;
  crisisReason?: string;
  modelSource: string; // e.g. "gemini-2.0-flash", "gemini-1.5-flash", "mindbridge-engine"
  createdAt: string;
}

export interface WellnessConsentState {
  hasConsented: boolean;
  allowAiSynthesis: boolean;
  allowAssessmentStorage: boolean;
  consentDate: string | null;
}
