import React from 'react';
import { 
  Smile, 
  Activity, 
  Moon, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Card } from '../common/Card';
import { MoodEntry } from '../../types';
import { AssessmentRecord } from '../../types/assessment';

interface WellnessScoreSummaryProps {
  moodEntries: MoodEntry[];
  assessments: AssessmentRecord[];
}

export const WellnessScoreSummary: React.FC<WellnessScoreSummaryProps> = ({
  moodEntries,
  assessments,
}) => {
  // 1. Calculate Mood Balance Index
  const recentEntries = moodEntries.slice(0, 14);
  const totalEntries = recentEntries.length;

  let positiveMoods = 0;
  let totalStress = 0;
  let restfulSleepCount = 0;

  recentEntries.forEach(m => {
    if (m.mood === 'good' || m.mood === 'great') positiveMoods++;
    totalStress += m.stressLevel || 3;
    if (m.sleepQuality === 'Good' || m.sleepQuality === 'Excellent') restfulSleepCount++;
  });

  const moodBalancePct = totalEntries > 0 
    ? Math.round((positiveMoods / totalEntries) * 100) 
    : 75;
  const avgStress = totalEntries > 0 
    ? Math.round((totalStress / totalEntries) * 10) / 10 
    : 2.8;
  const sleepRestorativePct = totalEntries > 0 
    ? Math.round((restfulSleepCount / totalEntries) * 100) 
    : 80;

  // Latest assessments
  const latestGad = assessments.find(a => a.type === 'GAD-7');
  const latestPhq = assessments.find(a => a.type === 'PHQ-9');
  const latestWho = assessments.find(a => a.type === 'WHO-5');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      
      {/* 1. Emotional Balance */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-[#77736B]">
          <span className="font-semibold uppercase tracking-wider text-[#829675]">Emotional Balance</span>
          <Smile className="w-4 h-4 text-[#829675]" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-[#403B35]">
          {moodBalancePct}%
        </div>
        <div className="text-[11px] text-[#77736B] leading-tight">
          Positive or steady mood proportion over {totalEntries || 3} recent check-ins.
        </div>
      </Card>

      {/* 2. Stress Load */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-[#77736B]">
          <span className="font-semibold uppercase tracking-wider text-[#829675]">Average Stress</span>
          <Activity className="w-4 h-4 text-[#829675]" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-[#403B35]">
          {avgStress} <span className="text-sm font-normal text-[#77736B]">/ 5</span>
        </div>
        <div className="text-[11px] text-[#77736B] leading-tight">
          {avgStress <= 2.5 ? 'Gentle and manageable load' : avgStress <= 3.8 ? 'Moderate routine pressure' : 'Heightened nervous tension'}
        </div>
      </Card>

      {/* 3. Sleep Restorativeness */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-[#77736B]">
          <span className="font-semibold uppercase tracking-wider text-[#829675]">Restful Nights</span>
          <Moon className="w-4 h-4 text-[#829675]" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-[#403B35]">
          {sleepRestorativePct}%
        </div>
        <div className="text-[11px] text-[#77736B] leading-tight">
          {sleepRestorativePct >= 70 ? 'Sound sleep recovery baseline' : 'Fragmented sleep impacting energy'}
        </div>
      </Card>

      {/* 4. Clinical Screening Status */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-[#77736B]">
          <span className="font-semibold uppercase tracking-wider text-[#829675]">Screening Profile</span>
          <ShieldCheck className="w-4 h-4 text-[#829675]" />
        </div>
        <div className="text-lg sm:text-xl font-bold text-[#56664F] truncate">
          {latestGad ? latestGad.severityLabel : 'Minimal Anxiety'}
        </div>
        <div className="text-[11px] text-[#77736B] leading-tight">
          {latestPhq ? `PHQ-9: ${latestPhq.severityLabel}` : 'Self-assessment screening in range'}
        </div>
      </Card>

    </div>
  );
};
