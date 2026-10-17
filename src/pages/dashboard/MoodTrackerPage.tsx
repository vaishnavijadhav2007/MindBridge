import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { MoodWellnessOverview } from '../../components/mood/MoodWellnessOverview';
import { MoodCheckinForm } from '../../components/mood/MoodCheckinForm';
import { MoodChart } from '../../components/mood/MoodChart';
import { MoodHistoryList } from '../../components/mood/MoodHistoryList';
import { EmotionalPatterns } from '../../components/mood/EmotionalPatterns';

export const MoodTrackerPage: React.FC = () => {
  const [historyRange, setHistoryRange] = useState<'7days' | '30days'>('7days');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header Section as requested */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4DACA]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#829675]">
              Daily Emotional Space
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
            Your Mood, Your Journey
          </h1>
          <p className="text-xs sm:text-sm text-[#77736B] mt-1">
            Take a moment to understand how you're feeling.
          </p>
        </div>

        {/* Button to return to dashboard */}
        <Link to="/dashboard">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4 text-[#829675]" />}
            className="shadow-soft-sm"
          >
            Return to Dashboard
          </Button>
        </Link>
      </div>

      {/* Mental Wellness Overview Cards */}
      <section aria-label="Mental Wellness Overview">
        <MoodWellnessOverview />
      </section>

      {/* Screening & AI Analysis Shortcut Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#E9EFE7] border border-[#D7E2D3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#56664F]">
            <Sparkles className="w-3.5 h-3.5 text-[#829675]" />
            <span>Validated Self-Assessments Available</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#403B35]">
            Want deeper insights into your mood and anxiety?
          </h3>
          <p className="text-xs text-[#687861] leading-relaxed">
            Take a 2-minute screening (PHQ-9, GAD-7, PSS-4, WHO-5) to receive an AI-synthesized wellness report with coping strategies.
          </p>
        </div>

        <Link to="/dashboard/analysis" className="shrink-0">
          <Button
            variant="primary"
            size="sm"
            className="text-xs shadow-soft-sm whitespace-nowrap"
          >
            Explore Wellness Analysis
          </Button>
        </Link>
      </div>

      {/* Daily Mood Check-in Form */}
      <section aria-label="Daily Mood Check-in">
        <MoodCheckinForm />
      </section>

      {/* Mood History Chart */}
      <section aria-label="Mood History Trends">
        <MoodChart
          range={historyRange}
          onRangeChange={setHistoryRange}
        />
      </section>

      {/* Recorded History List */}
      <section aria-label="Recorded Check-ins List">
        <MoodHistoryList range={historyRange} />
      </section>

      {/* Emotional Patterns — Basic Version */}
      <section aria-label="Emotional Patterns">
        <EmotionalPatterns />
      </section>

    </div>
  );
};
