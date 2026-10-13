import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Frown, 
  Meh, 
  Smile, 
  Laugh, 
  HeartHandshake, 
  Check, 
  Sparkles,
  ArrowRight,
  Clock,
  X
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MoodType, MoodOption } from '../../types';
import { useWellness } from '../../context/WellnessContext';

export const MoodCheckinCard: React.FC = () => {
  const { selectedMood, selectMood, latestEntry, moodConfirmedMessage, dismissMoodMessage } = useWellness();

  const moodOptions: MoodOption[] = [
    {
      type: 'very-low',
      label: 'Very Low',
      iconName: 'Frown',
      sentiment: 'Struggling',
      colorClass: 'hover:border-[#C59B7E] text-[#8C6D53]',
      description: 'Feeling overwhelmed, exhausted, or down.',
      score: 1,
    },
    {
      type: 'low',
      label: 'Low',
      iconName: 'Meh',
      sentiment: 'A bit heavy',
      colorClass: 'hover:border-[#C59B7E] text-[#A67C5A]',
      description: 'Lacking energy or feeling uneasy.',
      score: 2,
    },
    {
      type: 'okay',
      label: 'Okay',
      iconName: 'Smile',
      sentiment: 'Neutral',
      colorClass: 'hover:border-[#A3B597] text-[#77736B]',
      description: 'Balanced, steady, getting through.',
      score: 3,
    },
    {
      type: 'good',
      label: 'Good',
      iconName: 'Smile',
      sentiment: 'Positive',
      colorClass: 'hover:border-[#829675] text-[#829675]',
      description: 'Pleasant, calm, in a nice groove.',
      score: 4,
    },
    {
      type: 'great',
      label: 'Great',
      iconName: 'Laugh',
      sentiment: 'Joyful & Centered',
      colorClass: 'hover:border-[#829675] text-[#56664F]',
      description: 'Energized, grateful, and peaceful.',
      score: 5,
    }
  ];

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

  return (
    <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Daily Emotional Check-in</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
            How are you feeling today?
          </h2>
          <p className="text-xs sm:text-sm text-[#77736B] mt-0.5">
            Take a gentle breath. Select your state or open the complete tracker to record sleep and stress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {latestEntry && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
              <Check className="w-3.5 h-3.5 text-[#829675]" />
              <span>Latest: <strong className="capitalize">{latestEntry.mood.replace('-', ' ')}</strong> ({latestEntry.time})</span>
            </span>
          )}

          <Link to="/dashboard/mood">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5 text-[#829675]" />}
              className="text-xs py-1.5 px-3 border-[#829675]/50 hover:bg-[#829675]/10"
            >
              Open Full Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Mood Option Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4" role="radiogroup" aria-label="Daily Mood Options">
        {moodOptions.map((opt) => {
          const isSelected = selectedMood === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => selectMood(opt.type)}
              className={`
                group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl
                border transition-all duration-200 text-center select-none outline-none
                ${isSelected
                  ? 'bg-[#E9EFE7] border-[#829675] shadow-soft ring-2 ring-[#829675]/30 -translate-y-0.5'
                  : 'bg-[#FFFCF6] border-[#E4DACA] hover:bg-[#F9F5EC] hover:border-[#829675]/40 hover:-translate-y-0.5 shadow-soft-sm'
                }
              `}
            >
              {/* Radio Indicator dot */}
              <div className="absolute top-2.5 right-2.5">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-[#829675] bg-[#829675]' : 'border-[#D9CFBF] bg-transparent'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Icon Container */}
              <div className={`mb-3 p-2 rounded-2xl transition-colors ${
                isSelected ? 'text-[#829675]' : 'text-[#77736B] group-hover:text-[#829675]'
              }`}>
                {getMoodIcon(opt.type, isSelected)}
              </div>

              {/* Label */}
              <span className="text-sm font-semibold tracking-tight text-[#403B35]">
                {opt.label}
              </span>

              {/* Sentiment Micro text */}
              <span className="text-[11px] text-[#77736B] mt-0.5">
                {opt.sentiment}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtle confirmation feedback alert */}
      {moodConfirmedMessage && (
        <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#E9EFE7] border border-[#D7E2D3] flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-[#829675] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#403B35] leading-relaxed">
              {moodConfirmedMessage}
            </p>
          </div>
          <button
            onClick={dismissMoodMessage}
            className="text-[#77736B] hover:text-[#403B35] p-1 rounded-lg"
            aria-label="Dismiss confirmation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer helper note linking to full check-in */}
      <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#77736B]">
        <span>Want to record what affected your day or track sleep quality?</span>
        <Link to="/dashboard/mood" className="text-[#829675] font-semibold hover:underline inline-flex items-center gap-1">
          <span>Log detailed factors & journal note</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </Card>
  );
};
