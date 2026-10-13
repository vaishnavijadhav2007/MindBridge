import React from 'react';
import { Compass, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { useWellness } from '../../context/WellnessContext';
import { MoodEntry } from '../../types';

export const EmotionalPatterns: React.FC = () => {
  const { moodEntries, hasUserEntries } = useWellness();

  // Evaluate entries: if user has real entries, inspect those; otherwise sample
  const entries: MoodEntry[] = hasUserEntries
    ? moodEntries.filter(e => !e.isSample)
    : moodEntries;

  // Determine if sufficient data exists (at least 2 entries required)
  const hasSufficientData = entries.length >= 2;

  // Derive simple pattern observations without AI
  const observations: string[] = [];

  if (hasSufficientData) {
    // 1. Stress & Mood Observation
    const lowMoodEntries = entries.filter(e => e.mood === 'very-low' || e.mood === 'low');
    const goodMoodEntries = entries.filter(e => e.mood === 'good' || e.mood === 'great');

    const avgStressLow = lowMoodEntries.length > 0
      ? lowMoodEntries.reduce((acc, curr) => acc + curr.stressLevel, 0) / lowMoodEntries.length
      : null;
    const avgStressGood = goodMoodEntries.length > 0
      ? goodMoodEntries.reduce((acc, curr) => acc + curr.stressLevel, 0) / goodMoodEntries.length
      : null;

    if (avgStressLow !== null && avgStressGood !== null && avgStressLow > avgStressGood) {
      observations.push(
        `You recorded higher stress on days with lower mood (averaging ${avgStressLow.toFixed(1)}/5 compared to ${avgStressGood.toFixed(1)}/5 on positive days).`
      );
    } else if (entries.some(e => e.stressLevel >= 4)) {
      observations.push("You recorded higher stress on some days this week.");
    }

    // 2. Sleep Observation
    const goodSleepGoodMood = goodMoodEntries.filter(
      e => e.sleepQuality === 'Good' || e.sleepQuality === 'Excellent'
    ).length;
    if (goodMoodEntries.length > 0 && goodSleepGoodMood / goodMoodEntries.length >= 0.5) {
      observations.push("You reported better sleep on days when your mood was more positive.");
    }

    // 3. Most frequent contributing factor
    const factorCounts: Record<string, number> = {};
    entries.forEach(e => {
      (e.factors || []).forEach(f => {
        factorCounts[f] = (factorCounts[f] || 0) + 1;
      });
    });

    const sortedFactors = Object.entries(factorCounts).sort((a, b) => b[1] - a[1]);
    if (sortedFactors.length > 0 && sortedFactors[0][1] >= 2) {
      observations.push(
        `"${sortedFactors[0][0]}" appeared frequently as a contributing factor in your check-ins.`
      );
    }

    // Default fallback if fewer than 2 specific correlations fired
    if (observations.length === 0) {
      observations.push("Your check-ins show steady self-awareness across different daily situations.");
    }
  }

  return (
    <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] text-[#829675] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#403B35]">
              Patterns You May Notice
            </h3>
            <p className="text-xs text-[#77736B]">
              Reflective observations derived from your self-reported check-ins.
            </p>
          </div>
        </div>

        {hasSufficientData && (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
            {observations.length} {observations.length === 1 ? 'Observation' : 'Observations'}
          </span>
        )}
      </div>

      {/* Observation content */}
      {!hasSufficientData ? (
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E4DACA] text-center space-y-2">
          <p className="text-xs sm:text-sm font-medium text-[#403B35]">
            Keep checking in to discover possible patterns over time.
          </p>
          <p className="text-xs text-[#77736B]">
            As you log at least 2 to 3 check-ins, MindBridge will highlight gentle recurring correlations between your sleep, stress, and mood.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {observations.map((obs, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E4DACA] flex items-start gap-3"
            >
              <Lightbulb className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#403B35] leading-relaxed">
                {obs}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer on possible patterns */}
      <div className="pt-2 text-[11px] text-[#77736B] leading-relaxed border-t border-[#F0E8DC]">
        <em>Note:</em> These observations are potential trends based purely on your self-reported entries. They are intended for gentle self-reflection and are not clinical or medical diagnoses.
      </div>

    </Card>
  );
};
