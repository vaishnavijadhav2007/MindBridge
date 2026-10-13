import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, CheckCircle2, Target, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { useWellness } from '../../context/WellnessContext';

export const MetricSummaryCards: React.FC = () => {
  const { selectedMood, latestEntry, userProfile, hasUserEntries } = useWellness();

  const getMoodDisplayName = () => {
    if (!selectedMood) return 'Not logged';
    const names = {
      'very-low': 'Very Low',
      'low': 'Low',
      'okay': 'Okay',
      'good': 'Good',
      'great': 'Great'
    };
    return names[selectedMood];
  };

  const getMoodNote = () => {
    if (!selectedMood) return 'Tap above to log';
    const notes = {
      'very-low': 'Gentle self-compassion needed',
      'low': 'Take small, mindful pauses',
      'okay': 'Steady and grounded',
      'good': 'Balanced emotional rhythm',
      'great': 'High vitality and gratitude'
    };
    return notes[selectedMood];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      
      {/* 1. Today's Mood */}
      <Link to="/dashboard/mood" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#829675] rounded-3xl">
        <Card padding="md" hoverEffect className="border-[#E4DACA] bg-[#FFFCF6] relative group h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
              Today's Mood
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] text-[#829675] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Smile className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#403B35] tracking-tight capitalize">
              {getMoodDisplayName()}
            </div>
            <p className="text-xs text-[#77736B]">
              {getMoodNote()}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#77736B]">
            <span>{latestEntry ? `${latestEntry.date}` : 'Tap to record'}</span>
            <span className="text-[#829675] font-medium inline-flex items-center gap-1">
              <span>View Tracker</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Card>
      </Link>

      {/* 2. Self-Care Activities */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] relative group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
            Self-Care Activities
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#FAF3E7] text-[#C59B7E] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-bold text-[#403B35] tracking-tight flex items-baseline gap-1.5">
            <span>{userProfile.completedActivitiesToday}</span>
            <span className="text-sm font-normal text-[#77736B]">/ {userProfile.totalActivitiesGoal} completed</span>
          </div>

          {/* Simple progress bar */}
          <div className="w-full bg-[#EAE1D2] rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-[#829675] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(userProfile.completedActivitiesToday / userProfile.totalActivitiesGoal) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#77736B]">
          <span>Daily target</span>
          <span className="text-[#829675] font-medium">1 activity left</span>
        </div>
      </Card>

      {/* 3. Current Wellness Goal */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FFFCF6] relative group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
            Current Wellness Goal
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] text-[#56664F] flex items-center justify-center">
            <Target className="w-4 h-4 text-[#829675]" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-lg font-semibold text-[#403B35] tracking-tight line-clamp-1">
            {userProfile.currentGoal}
          </div>
          <p className="text-xs text-[#77736B]">
            Streak: <strong className="text-[#56664F] font-semibold">{userProfile.streakDays} days</strong> active
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#77736B]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#829675]" />
            Week 2 Focus
          </span>
          <span className="text-[#829675] font-medium">On Track</span>
        </div>
      </Card>

    </div>
  );
};
