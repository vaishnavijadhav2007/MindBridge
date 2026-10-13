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
