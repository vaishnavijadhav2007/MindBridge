import React from 'react';
import { Smile, Activity, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { useWellness } from '../../context/WellnessContext';
import { MoodType } from '../../types';

export const MoodWellnessOverview: React.FC = () => {
  const { latestEntry, averageStress, completedCheckinsCount, hasUserEntries } = useWellness();

  const getMoodLabel = (m: MoodType | undefined) => {
    if (!m) return 'No Check-in Yet';
    const labels: Record<MoodType, string> = {
      'very-low': 'Very Low',
      'low': 'Low',
      'okay': 'Okay',
      'good': 'Good',
      'great': 'Great'
    };
    return labels[m];
  };

  const getMoodSentiment = (m: MoodType | undefined) => {
    if (!m) return 'Record your first entry to see insights';
    const sentiments: Record<MoodType, string> = {
      'very-low': 'Gentle self-care recommended today',
      'low': 'Honoring where you are today',
      'okay': 'Steady and grounded state',
      'good': 'Pleasant and balanced rhythm',
      'great': 'Joyful, centered and energized'
    };
    return sentiments[m];
  };

  const getStressDescriptor = (score: number | null) => {
    if (score === null) return 'No stress data recorded yet';
    if (score <= 1.5) return 'Very Low / Calm overall';
    if (score <= 2.5) return 'Mild / Manageable stress';
    if (score <= 3.5) return 'Moderate stress levels';
    if (score <= 4.5) return 'Elevated stress observed';
    return 'High stress reported';
  };

  return (
    <div className="space-y-4">
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        
        {/* 1. Recent Mood */}
        <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
              Recent Mood
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] text-[#829675] flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#403B35] tracking-tight">
              {getMoodLabel(latestEntry?.mood)}
            </div>
            <p className="text-xs text-[#77736B]">
              {getMoodSentiment(latestEntry?.mood)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#77736B]">
            <span>{latestEntry ? `Recorded ${latestEntry.date}` : 'Awaiting check-in'}</span>
            {!hasUserEntries && <span className="text-[#829675] font-medium">Demo Data</span>}
          </div>
        </Card>

        {/* 2. Average Self-Reported Stress */}
        <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
              Average Stress
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E7] text-[#C59B7E] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#403B35] tracking-tight flex items-baseline gap-1.5">
              <span>{averageStress !== null ? `${averageStress}` : '—'}</span>
              <span className="text-sm font-normal text-[#77736B]">/ 5 scale</span>
            </div>
            <p className="text-xs text-[#77736B]">
              {getStressDescriptor(averageStress)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#77736B]">
            <span>Self-reported rating</span>
            <span className="text-[#829675] font-medium">1 (Calm) - 5 (High)</span>
          </div>
        </Card>

        {/* 3. Check-ins Completed */}
        <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
              Check-ins Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] text-[#56664F] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#829675]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#403B35] tracking-tight">
              {completedCheckinsCount} {completedCheckinsCount === 1 ? 'Entry' : 'Entries'}
            </div>
            <p className="text-xs text-[#77736B]">
              {completedCheckinsCount > 0 ? 'Consistent reflection helps notice patterns' : 'Start your first daily reflection today'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#77736B]">
            <span>Local prototype history</span>
            <span className="text-[#829675] font-medium">{hasUserEntries ? 'Personal Data' : 'Demo Samples'}</span>
          </div>
        </Card>

      </div>

      {/* Neutral Supportive Note as explicitly required in prompt */}
      <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#77736B]">
        <Info className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#403B35]">Reflective Note:</strong> Mood tracking can help you reflect on patterns over time. It is not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};
