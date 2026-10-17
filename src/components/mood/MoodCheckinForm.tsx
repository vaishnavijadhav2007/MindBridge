import React, { useState } from 'react';
import { 
  Frown, 
  Meh, 
  Smile, 
  Laugh, 
  HeartHandshake, 
  Check, 
  Sparkles, 
  Lock, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MoodType, SleepQuality, MoodOption } from '../../types';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';

export const MoodCheckinForm: React.FC = () => {
  const { addMoodEntry, moodConfirmedMessage, dismissMoodMessage } = useWellness();
  const { user, isConfigured } = useAuth();

  const [currentMood, setCurrentMood] = useState<MoodType | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('Good');
  const [journalNote, setJournalNote] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const moodOptions: MoodOption[] = [
    {
      type: 'very-low',
      label: 'Very Low',
      iconName: 'Frown',
      sentiment: 'Struggling',
      colorClass: 'hover:border-[#C59B7E]',
      description: 'Feeling overwhelmed or exhausted.',
      score: 1,
    },
    {
      type: 'low',
      label: 'Low',
      iconName: 'Meh',
      sentiment: 'A bit heavy',
      colorClass: 'hover:border-[#C59B7E]',
      description: 'Lacking energy or feeling uneasy.',
      score: 2,
    },
    {
      type: 'okay',
      label: 'Okay',
      iconName: 'Smile',
      sentiment: 'Neutral',
      colorClass: 'hover:border-[#A3B597]',
      description: 'Balanced, steady, getting through.',
      score: 3,
    },
    {
      type: 'good',
      label: 'Good',
      iconName: 'Smile',
      sentiment: 'Positive',
      colorClass: 'hover:border-[#829675]',
      description: 'Pleasant, calm, in a nice groove.',
      score: 4,
    },
    {
      type: 'great',
      label: 'Great',
      iconName: 'Laugh',
      sentiment: 'Joyful & Centered',
      colorClass: 'hover:border-[#829675]',
      description: 'Energized, grateful, and peaceful.',
      score: 5,
    }
  ];

  const factorOptions = [
    'Studies or Work',
    'Family',
    'Relationships',
    'Health',
    'Sleep',
    'Loneliness',
    'Personal Concerns',
    'Something Good',
    'Other'
  ];

  const sleepOptions: SleepQuality[] = [
    'Very Poor',
    'Poor',
    'Fair',
    'Good',
    'Excellent'
  ];

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev =>
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const getMoodIcon = (type: MoodType, isSelected: boolean) => {
    const iconClass = `w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 ${
      isSelected ? 'scale-110' : 'group-hover:scale-110'
    }`;
    switch (type) {
      case 'very-low':
        return <Frown className={iconClass} />;
      case 'low':
        return <Meh className={iconClass} />;
      case 'okay':
        return <Smile className={iconClass} />;
      case 'good':
        return <Smile className={iconClass} />;
      case 'great':
        return <Laugh className={iconClass} />;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentMood) {
      setValidationError('Please select how you are feeling today before saving.');
      return;
    }

    setValidationError(null);
    setSaveError(null);
    setIsSubmitting(true);

    try {
      const saved = await addMoodEntry({
        mood: currentMood,
        factors: selectedFactors,
        stressLevel,
        sleepQuality,
        journalNote: journalNote.trim() || undefined,
      });

      if (saved) {
        setIsSavedSuccess(true);
        // Reset optional fields for a fresh session after brief feedback
        setTimeout(() => {
          setSelectedFactors([]);
          setJournalNote('');
        }, 1000);
      } else {
        setSaveError('Unable to save check-in to database. Please check your Supabase connection and tables.');
        setIsSavedSuccess(false);
      }
    } catch (err: any) {
      setSaveError(err.message || 'An unexpected error occurred while saving.');
      setIsSavedSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm relative">
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Mood Selection */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span>Daily Emotional Check-in</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
                How are you feeling today?
              </h2>
              <p className="text-xs sm:text-sm text-[#77736B] mt-0.5">
                Select the emotion that feels closest to your present state of mind.
              </p>
            </div>

            {currentMood && (
              <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
                <Check className="w-3.5 h-3.5 text-[#829675]" />
                Selected: <strong className="capitalize">{currentMood.replace('-', ' ')}</strong>
              </span>
            )}
          </div>

          {/* 5 Mood Option Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4" role="radiogroup" aria-label="Daily Mood Options">
            {moodOptions.map((opt) => {
              const isSelected = currentMood === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setCurrentMood(opt.type);
                    setValidationError(null);
                    setIsSavedSuccess(false);
                  }}
                  className={`
                    group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl
                    border transition-all duration-200 text-center select-none outline-none
                    ${isSelected
                      ? 'bg-[#E9EFE7] border-[#829675] shadow-soft ring-2 ring-[#829675]/30 -translate-y-0.5'
                      : 'bg-[#FFFCF6] border-[#E4DACA] hover:bg-[#F9F5EC] hover:border-[#829675]/40 hover:-translate-y-0.5 shadow-soft-sm'
                    }
                  `}
                >
                  <div className="absolute top-2.5 right-2.5">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#829675] bg-[#829675]' : 'border-[#D9CFBF] bg-transparent'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className={`mb-3 p-2 rounded-2xl transition-colors ${
                    isSelected ? 'text-[#829675]' : 'text-[#77736B] group-hover:text-[#829675]'
                  }`}>
                    {getMoodIcon(opt.type, isSelected)}
                  </div>

                  <span className="text-sm font-semibold tracking-tight text-[#403B35]">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#77736B] mt-0.5">
                    {opt.sentiment}
                  </span>
                </button>
              );
            })}
          </div>

          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Section 2: Follow-up Questions (Active or Expandable) */}
        <div className="pt-6 border-t border-[#F0E8DC] space-y-6">
          
          {/* Factors affecting mood */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-[#403B35]">
                What is affecting your mood today?
              </label>
              <p className="text-xs text-[#77736B]">
                Optional: Select any areas influencing how you are feeling right now.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {factorOptions.map((factor) => {
                const isSelected = selectedFactors.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleFactor(factor)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                      ${isSelected
                        ? 'bg-[#829675] text-[#FFFCF6] border-[#829675] shadow-soft-sm'
                        : 'bg-[#FFFCF6] text-[#77736B] border-[#E4DACA] hover:border-[#829675]/60 hover:text-[#403B35]'
                      }
                    `}
                  >
                    {factor}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stress Level & Sleep Quality Side-by-side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Stress Level Scale 1-5 */}
            <div className="space-y-3 bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-[#E4DACA]">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#403B35]">
                  How would you describe your stress level?
                </label>
                <span className="text-xs font-bold text-[#829675] px-2 py-0.5 bg-[#FFFCF6] rounded-md border border-[#E4DACA]">
                  Level {stressLevel} / 5
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const isSelected = stressLevel === lvl;
                  const labels = ['Calm', 'Mild', 'Moderate', 'High', 'Very High'];
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStressLevel(lvl)}
                      className={`
                        flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-center transition-all
                        ${isSelected
                          ? 'bg-[#829675] text-[#FFFCF6] border-[#829675] shadow-soft-sm font-semibold'
                          : 'bg-[#FFFCF6] text-[#403B35] border-[#E4DACA] hover:border-[#829675]'
                        }
                      `}
                    >
                      <span className="text-sm">{lvl}</span>
                      <span className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? 'text-[#FFFCF6]' : 'text-[#77736B]'}`}>
                        {labels[lvl - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sleep Quality Selector */}
            <div className="space-y-3 bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-[#E4DACA]">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#403B35]">
                  How was your sleep last night?
                </label>
                <span className="text-xs font-bold text-[#829675] px-2 py-0.5 bg-[#FFFCF6] rounded-md border border-[#E4DACA]">
                  {sleepQuality}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1">
                {sleepOptions.map((opt) => {
                  const isSelected = sleepQuality === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSleepQuality(opt)}
                      className={`
                        py-2.5 px-1 rounded-xl border text-xs text-center transition-all truncate
                        ${isSelected
                          ? 'bg-[#829675] text-[#FFFCF6] border-[#829675] shadow-soft-sm font-semibold'
                          : 'bg-[#FFFCF6] text-[#403B35] border-[#E4DACA] hover:border-[#829675]'
                        }
                      `}
                      title={opt}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Optional Reflection Journal Note */}
          <div className="space-y-2 pt-2">
            <label htmlFor="journal-input" className="block text-sm font-semibold text-[#403B35]">
              Would you like to write anything about your day? <span className="text-xs font-normal text-[#77736B]">(Optional)</span>
            </label>
            <textarea
              id="journal-input"
              rows={3}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="A few words on what was on your mind, what helped, or what felt difficult..."
              className="w-full rounded-2xl bg-[#FFFCF6] border border-[#E4DACA] p-3.5 text-sm text-[#403B35] placeholder:text-[#9B968D] focus:border-[#829675] focus:ring-2 focus:ring-[#829675]/20 outline-none transition-all resize-y"
            />
          </div>

        </div>

        {/* Section 3: Privacy Notice & Save Button */}
        <div className="pt-6 border-t border-[#F0E8DC] space-y-4">
          
          {/* Storage Note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F3EBDD] border border-[#E4DACA] text-xs text-[#77736B]">
            <Lock className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isConfigured && user ? (
                <>
                  <strong className="text-[#403B35]">Secure Database Storage:</strong> Your check-in entries are linked to your authenticated MindBridge account ({user.email}) and stored in your Supabase database. Reflections are private to you.
                </>
              ) : (
                <>
                  <strong className="text-[#403B35]">Local Session Mode:</strong> You are exploring MindBridge in demo mode. Check-in entries are stored in your browser session and are not sent to an external database.
                </>
              )}
            </p>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-[#FEF0F0] border border-[#EDBBBB] text-xs text-[#C0392B] flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-xs font-semibold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Database Save Error Message */}
          {saveError && (
            <div className="p-3.5 rounded-xl bg-[#FEF0F0] border border-[#EDBBBB] text-xs text-[#C0392B] flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveError(null)}
                className="text-xs font-semibold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Friendly Success Confirmation Message */}
          {isSavedSuccess && (
            <div className="p-4 rounded-2xl bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#829675] shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-[#403B35]">
                  Check-in complete. Your mood has been saved to your journal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSavedSuccess(false)}
                className="text-xs text-[#829675] font-semibold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 font-semibold"
            >
              {isSubmitting ? 'Saving Check-in…' : 'Save Check-in'}
            </Button>
          </div>

        </div>

      </form>
    </Card>
  );
};
