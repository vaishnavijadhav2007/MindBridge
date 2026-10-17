import React, { useState, useEffect } from 'react';
import { 
  Check, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle,
  Heart
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  AssessmentType, 
  AssessmentRecord, 
  ScoreInterpretation 
} from '../../types/assessment';
import { QUESTIONNAIRES, saveUserAssessment } from '../../services/assessmentService';
import { useAuth } from '../../context/AuthContext';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AssessmentType;
  onComplete: (record: AssessmentRecord) => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  type,
  onComplete,
}) => {
  const { user } = useAuth();
  const definition = QUESTIONNAIRES[type];

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [personalNotes, setPersonalNotes] = useState<string>('');

  // Reset state when opening/changing type
  useEffect(() => {
    if (isOpen) {
      setAnswers({});
      setCurrentStep(0);
      setIsFinished(false);
      setPersonalNotes('');
    }
  }, [isOpen, type]);

  if (!definition) return null;

  const totalQuestions = definition.questions.length;
  const currentQuestion = definition.questions[currentStep];
  const isLastQuestion = currentStep === totalQuestions - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Compute total score
  const calculateTotalScore = (): number => {
    let sum = 0;
    definition.questions.forEach((q) => {
      const val = answers[q.id] ?? 0;
      if (q.reverseScored) {
        sum += (4 - val);
      } else {
        sum += val;
      }
    });
    return sum;
  };

  const handleSelectOption = (score: number) => {
    if (!currentQuestion) return;
    const updated = { ...answers, [currentQuestion.id]: score };
    setAnswers(updated);

    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 180);
    } else {
      setIsFinished(true);
    }
  };

  const score = calculateTotalScore();
  const maxScore = type === 'PHQ-9' ? 27 : type === 'GAD-7' ? 21 : type === 'PSS-4' ? 16 : 25;
  const interpretation: ScoreInterpretation = definition.interpretScore(score, answers);
  const isCrisisTriggered = definition.checkCrisisRisk ? definition.checkCrisisRisk(answers, score) : false;

  const handleSaveAssessment = async () => {
    setIsSaving(true);
    try {
      const { data } = await saveUserAssessment(user?.id || 'guest', {
        type,
        score,
        maxScore,
        severityLabel: interpretation.label,
        severityLevel: interpretation.level,
        answers,
        notes: personalNotes.trim() || undefined,
      });

      if (data) {
        onComplete(data);
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={definition.title}
      maxWidth="lg"
    >
      <div className="space-y-6 text-[#403B35]">

        {/* Advisory non-diagnostic banner */}
        <div className="p-3.5 rounded-2xl bg-[#F3EBDD]/70 border border-[#E4DACA] flex items-start gap-2.5 text-xs text-[#77736B]">
          <ShieldCheck className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
          <span>
            <strong>Self-Assessment Tool:</strong> {definition.disclaimer}
          </span>
        </div>

        {!isFinished ? (
          /* QUESTION IN PROGRESS */
          <div className="space-y-6">
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#77736B]">
                <span className="font-semibold text-[#56664F]">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E4DACA]/60 overflow-hidden">
                <div
                  className="h-full bg-[#829675] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(8, progressPercent)}%` }}
                />
              </div>
            </div>

            {/* Question prompt card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF6] border border-[#E4DACA] shadow-soft-sm space-y-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#829675]">
                {type === 'WHO-5' ? 'Over the past 2 weeks' : type === 'PSS-4' ? 'In the last month' : 'Over the last 2 weeks, how often have you been bothered by'}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#403B35] leading-snug">
                {currentQuestion.prompt}
              </h3>
              {currentQuestion.detail && (
                <p className="text-xs text-[#77736B]">{currentQuestion.detail}</p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Question response options">
              {definition.scaleOptions.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => handleSelectOption(opt.score)}
                    className={`
                      w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200
                      ${isSelected
                        ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F] ring-2 ring-[#829675]/30 shadow-soft-sm'
                        : 'bg-[#FFFCF6] border-[#E4DACA] hover:bg-[#F9F5EC] hover:border-[#829675]/40 text-[#403B35]'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-[#829675] bg-[#829675] text-white' : 'border-[#D9CFBF]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E4DACA]">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-xs"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-xs text-[#77736B]"
                >
                  Save & Exit
                </Button>
                {answers[currentQuestion.id] !== undefined && !isLastQuestion && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentStep((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="text-xs"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* COMPLETION & RESULTS SUMMARY */
          <div className="space-y-6 animate-fade-in">
            
            {/* Score interpretation card */}
            <div className={`p-6 rounded-3xl border ${interpretation.colorClass} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                  Assessment Completed
                </span>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/70 shadow-soft-sm">
                  Score: {type === 'WHO-5' ? `${score * 4}%` : `${score} / ${maxScore}`}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {interpretation.label}
              </h3>
              <p className="text-sm leading-relaxed opacity-95">
                {interpretation.description}
              </p>
            </div>

            {/* Crisis trigger alert if applicable */}
            {isCrisisTriggered && (
              <div className="p-4 rounded-2xl bg-[#FFF8F6] border-2 border-[#E8B4A2] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#8C3A27] font-semibold text-sm">
                  <Heart className="w-4 h-4 text-[#B85D43] fill-[#B85D43]/20" />
                  <span>Caring Support is Available</span>
                </div>
                <p className="text-[#A65B49] leading-relaxed">
                  Your answers reflect meaningful distress or self-harm thoughts. Please consider reaching out right now to <strong>Tele-MANAS (14416)</strong> or <strong>KIRAN (1800-599-0019)</strong> for gentle, free, and completely confidential assistance.
                </p>
              </div>
            )}

            {/* Optional reflection note */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#56664F] uppercase tracking-wider">
                Personal Reflection Note (Optional)
              </label>
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                rows={2}
                placeholder="What was on your mind as you answered these questions? E.g., recent deadlines, sleep patterns..."
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-[#FFFCF6] border border-[#E4DACA] text-[#403B35] focus:outline-none focus:ring-2 focus:ring-[#829675]/40"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E4DACA]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAnswers({});
                  setCurrentStep(0);
                  setIsFinished(false);
                }}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs text-[#77736B]"
              >
                Retake Assessment
              </Button>

              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={handleSaveAssessment}
                leftIcon={<Check className="w-4 h-4" />}
                className="w-full sm:w-auto text-xs"
              >
                Save Results & View Analysis
              </Button>
            </div>

          </div>
        )}

      </div>
    </Modal>
  );
};
