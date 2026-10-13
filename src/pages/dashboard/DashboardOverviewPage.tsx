import React from 'react';
import { Sparkles, Sun, Heart } from 'lucide-react';
import { MoodCheckinCard } from '../../components/dashboard/MoodCheckinCard';
import { MetricSummaryCards } from '../../components/dashboard/MetricSummaryCards';
import { AICompanionShortcutCard } from '../../components/dashboard/AICompanionShortcutCard';
import { RecommendedActivities } from '../../components/dashboard/RecommendedActivities';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { ActivityModal } from '../../components/dashboard/ActivityModal';
import { useWellness } from '../../context/WellnessContext';

export const DashboardOverviewPage: React.FC = () => {
  const { userProfile } = useWellness();

  return (
    <div className="space-y-8 pb-12">
      
      {/* GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
            <Sun className="w-3.5 h-3.5" />
            <span>Today's Horizon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
            Hello, welcome back!
          </h1>
          <p className="text-sm text-[#77736B] mt-1">
            Take a moment for yourself today.
          </p>
        </div>

        {/* Ambient Affirmation Badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-[#FFFCF6] border border-[#E4DACA] rounded-2xl shadow-soft-sm text-xs text-[#403B35]">
          <Heart className="w-4 h-4 text-[#829675] fill-[#829675]/20" />
          <span>Remember to breathe and be gentle with yourself.</span>
        </div>
      </div>

      {/* PROMINENT DAILY MOOD CHECK-IN */}
      <section aria-label="Daily Mood Check-in">
        <MoodCheckinCard />
      </section>

      {/* THREE SUMMARY CARDS */}
      <section aria-label="Wellness Summary Metrics">
        <MetricSummaryCards />
      </section>

      {/* AI COMPANION SHORTCUT */}
      <section aria-label="AI Wellness Companion Shortcut">
        <AICompanionShortcutCard />
      </section>

      {/* RECOMMENDED FOR YOU */}
      <section aria-label="Recommended Wellness Activities">
        <RecommendedActivities />
      </section>

      {/* YOUR RECENT ACTIVITY */}
      <section aria-label="Recent Mood and Activity History">
        <RecentActivityList />
      </section>

      {/* ACTIVITY MODAL */}
      <ActivityModal />

    </div>
  );
};
